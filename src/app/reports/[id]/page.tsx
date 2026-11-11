import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/app-shell";
import { prisma } from "@/lib/db/prisma";
import {
  formatCurrency,
  formatDate,
  formatPeriodDate,
  reportStatusClass,
  reportStatusLabel,
  requireAgency,
} from "@/lib/app-data";

type ReportPageProps = {
  params: { id: string };
};

type ReportMetrics = {
  spend?: number;
  leads?: number;
  cpl?: number;
};

function parseMetrics(data: string | null): ReportMetrics {
  if (!data) return {};
  try {
    return JSON.parse(data) as ReportMetrics;
  } catch {
    return {};
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { session, agency } = await requireAgency();

  // Só abre relatórios de clientes da própria agência.
  const report = await prisma.report.findFirst({
    where: { id: params.id, client: { agencyId: agency.id } },
    include: { client: true },
  });
  if (!report) notFound();

  const metrics = parseMetrics(report.data);

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Relatório de {report.client.name}</h1>
          <p>
            {formatPeriodDate(report.periodStart)} — {formatPeriodDate(report.periodEnd)} · gerado em{" "}
            {formatDate(report.createdAt)}
          </p>
        </div>
        <div className="table-actions">
          <Link className="button secondary" href={`/clients/${report.client.id}`}>
            ← Voltar ao cliente
          </Link>
          <a className="button" href={`/api/reports/${report.id}/pdf`}>
            Baixar PDF
          </a>
        </div>
      </div>

      <section className="grid cols-3" style={{ marginBottom: 16 }}>
        <article className="card metric">
          <span>Investimento</span>
          <strong>{formatCurrency(Number(metrics.spend ?? 0))}</strong>
        </article>
        <article className="card metric">
          <span>Leads</span>
          <strong>{Number(metrics.leads ?? 0)}</strong>
        </article>
        <article className="card metric">
          <span>Custo por lead</span>
          <strong>{formatCurrency(Number(metrics.cpl ?? 0))}</strong>
        </article>
      </section>

      <article className="card">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Análise</h2>
          <span className={reportStatusClass(report.status)}>{reportStatusLabel(report.status)}</span>
        </div>
        {report.aiAnalysis ? (
          <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{report.aiAnalysis}</p>
        ) : (
          <p className="muted">Este relatório ainda não tem análise.</p>
        )}
      </article>
    </AppShell>
  );
}
