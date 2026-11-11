import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { formatDate, formatPeriodDate } from "@/lib/app-data";
import { buildReportPdf } from "@/lib/report-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } };

type StoredMetrics = { spend?: number; leads?: number; cpl?: number };

function parseMetrics(data: string | null): StoredMetrics {
  if (!data) return {};
  try {
    return JSON.parse(data) as StoredMetrics;
  } catch {
    return {};
  }
}

/** "Agência Pulse / Cliente 1" -> "agencia-pulse-cliente-1" (seguro para nome de arquivo). */
function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "cliente"
  );
}

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Só entrega relatórios de clientes da agência do usuário logado.
  const report = await prisma.report.findFirst({
    where: { id: params.id, client: { agency: { userId: user.id } } },
    include: { client: { include: { agency: true } } },
  });
  if (!report) {
    return NextResponse.json({ error: "Relatório não encontrado." }, { status: 404 });
  }

  const metrics = parseMetrics(report.data);

  try {
    const bytes = await buildReportPdf({
      agencyName: report.client.agency.name,
      clientName: report.client.name,
      periodLabel: `${formatPeriodDate(report.periodStart)} a ${formatPeriodDate(report.periodEnd)}`,
      createdLabel: formatDate(report.createdAt),
      spend: Number(metrics.spend ?? 0),
      leads: Number(metrics.leads ?? 0),
      cpl: Number(metrics.cpl ?? 0),
      analysis: report.aiAnalysis,
    });

    const filename = `relatorio-${slugify(report.client.name)}-${report.periodStart
      .toISOString()
      .slice(0, 10)}.pdf`;

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[pdf] Erro ao gerar PDF do relatório:", error);
    return NextResponse.json({ error: "Não foi possível gerar o PDF." }, { status: 500 });
  }
}
