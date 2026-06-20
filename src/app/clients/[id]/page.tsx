import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/app/app-shell";
import {
  disconnectIntegrationAction,
  generateReportAction,
  toggleClientAction,
} from "@/app/actions";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency, formatDate, requireAgency } from "@/lib/app-data";
import { integrationReadiness } from "@/lib/integrations/config";

type ClientPageProps = {
  params: { id: string };
  searchParams: { integration?: string; integrationError?: string };
};

type ReportMetrics = {
  spend?: number;
  revenue?: number;
  leads?: number;
  cpl?: number;
  roas?: number;
};

function parseMetrics(data: string | null): ReportMetrics {
  if (!data) return {};
  try {
    return JSON.parse(data) as ReportMetrics;
  } catch {
    return {};
  }
}

export default async function ClientPage({ params, searchParams }: ClientPageProps) {
  const { session, agency } = await requireAgency();
  const readiness = integrationReadiness();
  const client = await prisma.client.findFirst({
    where: { id: params.id, agencyId: agency.id },
    include: {
      integrations: { orderBy: { createdAt: "desc" } },
      reports: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!client) notFound();

  const lastReport = client.reports[0];
  const metrics = parseMetrics(lastReport?.data ?? null);

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>{client.name}</h1>
          <p>{client.active ? "Cliente ativo" : "Cliente pausado"} em {agency.name}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <form action={toggleClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <button className="button secondary" type="submit">
              {client.active ? "Pausar" : "Reativar"}
            </button>
          </form>
          <Link className="button secondary" href="/dashboard">Voltar</Link>
        </div>
      </div>

      {searchParams.integration ? (
        <div className="notice success">
          Integracao com {searchParams.integration === "google" ? "Google Ads" : "Meta Ads"} concluida.
        </div>
      ) : null}
      {searchParams.integrationError ? (
        <div className="notice error">
          Nao foi possivel concluir a integracao. Confira as credenciais, permissoes e URLs de callback.
        </div>
      ) : null}

      <section className="grid cols-3" style={{ marginBottom: 16 }}>
        <article className="card metric"><span>Investimento</span><strong>{formatCurrency(Number(metrics.spend ?? 0))}</strong></article>
        <article className="card metric"><span>Receita</span><strong>{formatCurrency(Number(metrics.revenue ?? 0))}</strong></article>
        <article className="card metric"><span>ROAS</span><strong>{metrics.roas ?? "-"}</strong></article>
      </section>

      <section className="grid cols-2">
        <article className="card">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Gerar relatorio</h2>
          <form className="form" action={generateReportAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <label>Inicio do periodo<input name="periodStart" type="date" required /></label>
            <label>Fim do periodo<input name="periodEnd" type="date" required /></label>
            <button className="button" type="submit">Gerar relatorio</button>
          </form>
        </article>

        <article className="card">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Conectar plataformas</h2>
          <p className="muted">Autorize o ReportFlow a ler as contas de anuncios deste cliente.</p>
          <div className="integration-actions">
            <a
              className={`button ${readiness.google ? "" : "disabled"}`}
              href={readiness.google ? `/api/integrations/google/start?clientId=${client.id}` : undefined}
              aria-disabled={!readiness.google}
            >
              Conectar Google Ads
            </a>
            <a
              className={`button meta ${readiness.meta ? "" : "disabled"}`}
              href={readiness.meta ? `/api/integrations/meta/start?clientId=${client.id}` : undefined}
              aria-disabled={!readiness.meta}
            >
              Conectar Meta Ads
            </a>
          </div>
          {!readiness.google || !readiness.meta ? (
            <p className="muted" style={{ marginBottom: 0 }}>
              Configure as chaves ausentes no arquivo .env para liberar os botoes.
            </p>
          ) : null}
        </article>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Integracoes</h2>
          {client.integrations.length === 0 ? (
            <p className="muted">Nenhuma integracao conectada.</p>
          ) : (
            <table className="table">
              <tbody>
                {client.integrations.map((integration) => (
                  <tr key={integration.id}>
                    <td><strong>{integration.accountName}</strong><p className="muted">{integration.platform}</p></td>
                    <td>
                      <span className={integration.active ? "status" : "status inactive"}>
                        {integration.active ? "Conectada" : "Inativa"}
                      </span>
                      {integration.active ? (
                        <form action={disconnectIntegrationAction} style={{ marginTop: 8 }}>
                          <input type="hidden" name="integrationId" value={integration.id} />
                          <button className="text-button" type="submit">Desconectar</button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="card">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Historico de relatorios</h2>
          {client.reports.length === 0 ? (
            <p className="muted">Nenhum relatorio gerado ainda.</p>
          ) : (
            <div className="grid">
              {client.reports.map((report) => {
                const data = parseMetrics(report.data);
                return (
                  <div key={report.id} className="card" style={{ background: "#f8fafc" }}>
                    <div className="row-between">
                      <strong>{formatDate(report.periodStart)} - {formatDate(report.periodEnd)}</strong>
                      <span className="status">{report.status}</span>
                    </div>
                    <p className="muted" style={{ marginTop: 8 }}>
                      Leads: {data.leads ?? 0} | CPL: {formatCurrency(Number(data.cpl ?? 0))}
                    </p>
                    <p style={{ marginBottom: 0 }}>{report.aiAnalysis}</p>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>
    </AppShell>
  );
}
