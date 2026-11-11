"use server";

import { ReportStatus } from "@prisma/client";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { requireAgency } from "@/lib/app-data";
import { generateAiAnalysis } from "@/lib/ai";
import { decryptToken, encryptToken } from "@/lib/integrations/security";
import { getGoogleAdsMetrics, refreshGoogleAccessToken } from "@/lib/integrations/google";
import { getMetaAdsMetrics } from "@/lib/integrations/meta";
import { validateReportPeriod } from "@/lib/report-period";
import { getAccessState } from "@/lib/billing";


export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

/** Exclusão de conta pedida em Configurações (LGPD): cancela a assinatura, apaga os dados e encerra a sessão. */
export async function deleteAccountAction(formData: FormData) {
  const { agency } = await requireAgency();

  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "EXCLUIR") {
    redirect("/settings?error=delete");
  }

  // Nunca apagamos a conta deixando uma cobrança rodando: se o cancelamento falhar, paramos aqui.
  let cancelFailed = false;
  if (agency.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
    try {
      await new Stripe(process.env.STRIPE_SECRET_KEY).subscriptions.cancel(agency.stripeSubscriptionId);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "resource_missing") {
        cancelFailed = true;
        console.error("[account] Erro ao cancelar assinatura antes de excluir a conta:", error);
      }
    }
  }
  if (cancelFailed) redirect("/settings?error=delete");

  // Os dados da agência, clientes, integrações e relatórios saem em cascata (onDelete: Cascade).
  await prisma.user.delete({ where: { id: agency.userId } });

  // Sem isso o cookie de sessão continuaria válido e a conta seria recriada no próximo acesso.
  await signOut({ redirectTo: "/?deleted=true" });
}

export async function updateAgencyAction(formData: FormData) {
  const { agency } = await requireAgency();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;

  await prisma.agency.update({ where: { id: agency.id }, data: { name } });
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}

export async function createClientAction(formData: FormData) {
  const { session, agency } = await requireAgency();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;

  const access = getAccessState(agency, { email: session.user.email });
  if (!access.canUse) redirect(`/pricing?reason=${access.reason}`);

  const clientCount = await prisma.client.count({ where: { agencyId: agency.id } });
  if (clientCount >= access.clientLimit) redirect("/clients/new?error=limit");

  const client = await prisma.client.create({
    data: { agencyId: agency.id, name },
  });
  redirect(`/clients/${client.id}`);
}

export async function toggleClientAction(formData: FormData) {
  const { agency } = await requireAgency();
  const id = String(formData.get("id") ?? "");
  const client = await prisma.client.findFirst({ where: { id, agencyId: agency.id } });
  if (!client) return;

  await prisma.client.update({
    where: { id: client.id },
    data: { active: !client.active },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/clients/${client.id}`);
}

export async function disconnectIntegrationAction(formData: FormData) {
  const { agency } = await requireAgency();
  const integrationId = String(formData.get("integrationId") ?? "");
  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, client: { agencyId: agency.id } },
  });
  if (!integration) return;

  await prisma.integration.update({
    where: { id: integration.id },
    data: { active: false, accessToken: "", refreshToken: null, expiresAt: null },
  });
  revalidatePath(`/clients/${integration.clientId}`);
}

export async function generateReportAction(formData: FormData) {
  const { session, agency } = await requireAgency();
  const access = getAccessState(agency, { email: session.user.email });
  if (!access.canUse) redirect(`/pricing?reason=${access.reason}`);

  const clientId = String(formData.get("clientId") ?? "");
  const client = await prisma.client.findFirst({
    where: { id: clientId, agencyId: agency.id },
    include: { integrations: true },
  });
  if (!client) return;

  // Validação no servidor: o formulário também valida, mas nunca confiamos só no cliente.
  const period = validateReportPeriod(
    String(formData.get("periodStart") ?? ""),
    String(formData.get("periodEnd") ?? ""),
  );
  if (!period.ok) {
    redirect(`/clients/${client.id}?reportError=${period.code}#gerar-relatorio`);
  }
  const { start: periodStart, end: periodEnd } = period;

  const activeIntegrations = client.integrations.filter((integration) => integration.active);

  // Sem conta conectada não há dado real: não geramos um relatório zerado.
  if (activeIntegrations.length === 0) {
    redirect(`/clients/${client.id}?reportError=no_integration#gerar-relatorio`);
  }

  let spend = 0;
  let leads = 0;
  let collectionFailed = false;

  for (const integration of activeIntegrations) {
    try {
      let accessToken = decryptToken(integration.accessToken);

      if (integration.platform === "GOOGLE" && integration.refreshToken) {
        try {
          const refreshed = await refreshGoogleAccessToken(decryptToken(integration.refreshToken));
          accessToken = refreshed.access_token!;
          await prisma.integration.update({
            where: { id: integration.id },
            data: {
              accessToken: encryptToken(accessToken),
              expiresAt: refreshed.expires_in
                ? new Date(Date.now() + refreshed.expires_in * 1000)
                : undefined,
            },
          });
        } catch (refreshError) {
          console.error(`[report] Erro ao renovar token do Google para integracao ${integration.id}:`, refreshError);
        }
      }

      const metrics =
        integration.platform === "GOOGLE"
          ? await getGoogleAdsMetrics(accessToken, integration.accountId, periodStart, periodEnd)
          : await getMetaAdsMetrics(accessToken, integration.accountId, periodStart, periodEnd);
      spend += metrics.spend;
      leads += metrics.leads;
    } catch (error) {
      collectionFailed = true;
      console.error(`[report] Erro ao buscar metricas de ${integration.platform}:`, error);
    }
  }

  // Se alguma conta falhou, o relatório sairia com números parciais. Melhor avisar do que entregar errado.
  if (collectionFailed) {
    redirect(`/clients/${client.id}?reportError=fetch_failed#gerar-relatorio`);
  }

  // Só gravamos métricas reais das plataformas. Receita e ROAS dependem do valor de conversão
  // (Google Ads: conversion value; Meta: purchase/value no Pixel) e entram quando isso for integrado.
  const cpl = leads > 0 ? Math.round(spend / leads) : 0;
  const aiAnalysis = await generateAiAnalysis(client.name, periodStart, periodEnd, { spend, leads, cpl });

  await prisma.report.create({
    data: {
      clientId: client.id,
      periodStart,
      periodEnd,
      status: ReportStatus.DONE,
      data: JSON.stringify({ spend, leads, cpl }),
      aiAnalysis,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/clients/${client.id}`);
}










export async function loginWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}





