"use server";

import { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { requireAgency } from "@/lib/app-data";
import { generateAiAnalysis } from "@/lib/ai";
import { decryptToken, encryptToken } from "@/lib/integrations/security";
import { getGoogleAdsMetrics, refreshGoogleAccessToken } from "@/lib/integrations/google";
import { getMetaAdsMetrics } from "@/lib/integrations/meta";


export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
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
  const { agency } = await requireAgency();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;

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
  const { agency } = await requireAgency();
  const clientId = String(formData.get("clientId") ?? "");
  const periodStart = new Date(String(formData.get("periodStart") ?? ""));
  const periodEnd = new Date(String(formData.get("periodEnd") ?? ""));
  const client = await prisma.client.findFirst({
    where: { id: clientId, agencyId: agency.id },
    include: { integrations: true },
  });
  if (!client || Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) return;

  const activeIntegrations = client.integrations.filter((integration) => integration.active);

  let spend = 0;
  let leads = 0;

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
      console.error(`[report] Erro ao buscar metricas de ${integration.platform}:`, error);
    }
  }

  // TODO: revenue e roas ainda sao estimativas (multiplicador fixo de 4.3x).
  // Buscar valor de conversao real requer configurar rastreamento de valor
  // no Google Ads (conversion value) e no Meta Pixel (purchase/value).
  const revenue = spend * 4.3;
  const cpl = leads > 0 ? Math.round(spend / leads) : 0;
  const roas = 4.3;
  const aiAnalysis = await generateAiAnalysis(client.name, periodStart, periodEnd, { spend, leads, cpl });

  await prisma.report.create({
    data: {
      clientId: client.id,
      periodStart,
      periodEnd,
      status: ReportStatus.DONE,
      data: JSON.stringify({ spend, leads, revenue, cpl, roas }),
      aiAnalysis,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/clients/${client.id}`);
}










export async function loginWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}





