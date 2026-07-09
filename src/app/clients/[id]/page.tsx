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
  try { return JSON.parse(data) as ReportMetrics; } catch { return {}; }
}

function MetricCard({ label, value, sub, icon, trend }: {
  label: string; value: string; sub?: string; icon: string; trend?: { value: string; up: boolean };
}) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e8eaed", borderRadius: 12,
      padding: "20px 20px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
        <span style={{ fontSize: 20, color: "#2d6a4f" }}>{icon}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#111", lineHeight: 1 }}>{value}</div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            background: trend.up ? "#d1fae5" : "#fee2e2",
            color: trend.up ? "#065f46" : "#991b1b",
            padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>{trend.value}</span>
          {sub && <span style={{ fontSize: 11, color: "#9ca3af" }}>{sub}</span>}
        </div>
      )}
      {!trend && sub && <span style={{ fontSize: 12, color: "#9ca3af" }}>{sub}</span>}
    </div>
  );
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
  const totalLeads = client.reports.reduce((acc, r) => acc + (parseMetrics(r.data).leads ?? 0), 0);

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, #2d6a4f, #185FA5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {client.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111" }}>{client.name}</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
              {client.active ? "● Cliente ativo" : "○ Cliente pausado"} · {agency.name}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <form action={toggleClientAction}>
            <input type="hidden" name="id" value={client.id} />
            <button className="button secondary" type="submit" style={{ fontSize: 13 }}>
              {client.active ? "Pausar" : "Reativar"}
            </button>
          </form>
          <Link className="button secondary" href="/dashboard" style={{ fontSize: 13 }}>← Voltar</Link>
        </div>
      </div>

      {/* Notices */}
      {searchParams.integration && (
        <div className="notice success" style={{ marginBottom: 16 }}>
          ✓ Integração com {searchParams.integration === "google" ? "Google Ads" : "Meta Ads"} concluída com sucesso.
        </div>
      )}
      {searchParams.integrationError && (
        <div className="notice error" style={{ marginBottom: 16 }}>
          ✗ Não foi possível concluir a integração. Verifique as credenciais e permissões.
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        <MetricCard label="Investimento" value={formatCurrency(Number(metrics.spend ?? 0))} icon="💰" sub="último relatório" />
        <MetricCard label="Receita" value={formatCurrency(Number(metrics.revenue ?? 0))} icon="📈" sub="último relatório" />
        <MetricCard label="ROAS" value={metrics.roas ? `${metrics.roas}x` : "—"} icon="🎯" sub="retorno sobre gasto" />
        <MetricCard label="Leads totais" value={String(totalLeads)} icon="👥" sub={`${client.reports.length} relatórios`} />
        <MetricCard label="CPL médio" value={formatCurrency(Number(metrics.cpl ?? 0))} icon="⚡" sub="custo por lead" />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Gerar relatório */}
        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>Gerar relatório</h2>
          </div>
          <form className="form" action={generateReportAction}>
            <input type="hidden" name="clientId" value={client.id} />
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
              Início do período
              <input name="periodStart" type="date" required style={{ marginTop: 6 }} />
            </label>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
              Fim do período
              <input name="periodEnd" type="date" required style={{ marginTop: 6 }} />
            </label>
            <button className="button" type="submit" style={{ width: "100%", marginTop: 4 }}>
              Gerar relatório com IA
            </button>
          </form>
        </div>

        {/* Conectar plataformas */}
        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>Conectar plataformas</h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
            Autorize o ReportFlow a ler as contas de anúncios deste cliente.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              className={`button ${readiness.google ? "" : "disabled"}`}
              href={readiness.google ? `/api/integrations/google/start?clientId=${client.id}` : undefined}
              style={{ textAlign: "center", fontSize: 13 }}
            >
              <span>🟢</span> Conectar Google Ads
            </a>
            <a
              className={`button meta ${readiness.meta ? "" : "disabled"}`}
              href={readiness.meta ? `/api/integrations/meta/start?clientId=${client.id}` : undefined}
              style={{ textAlign: "center", fontSize: 13 }}
            >
              <span>🔵</span> Conectar Meta Ads
            </a>
          </div>

          {/* Integrações ativas */}
          {client.integrations.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Conectadas
              </p>
              {client.integrations.map((integration) => (
                <div key={integration.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f9f9f9" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{integration.accountName}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{integration.platform}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={integration.active ? "status" : "status inactive"}>
                      {integration.active ? "Ativa" : "Inativa"}
                    </span>
                    {integration.active && (
                      <form action={disconnectIntegrationAction}>
                        <input type="hidden" name="integrationId" value={integration.id} />
                        <button className="text-button" type="submit">Desconectar</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Histórico de relatórios */}
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📋</span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>Histórico de relatórios</h2>
          </div>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{client.reports.length} relatório(s)</span>
        </div>

        {client.reports.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <p style={{ margin: 0, fontSize: 14 }}>Nenhum relatório gerado ainda.</p>
            <p style={{ margin: "4px 0 0", fontSize: 12 }}>Use o formulário acima para gerar o primeiro.</p>
          </div>
        ) : (
          <div>
            {client.reports.map((report, i) => {
              const data = parseMetrics(report.data);
              return (
                <div key={report.id} style={{
                  padding: "16px 20px",
                  borderBottom: i < client.reports.length - 1 ? "1px solid #f5f5f5" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                        {formatDate(report.periodStart)} — {formatDate(report.periodEnd)}
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                        Leads: {data.leads ?? 0} · CPL: {formatCurrency(Number(data.cpl ?? 0))} · ROAS: {data.roas ?? "—"}
                      </div>
                    </div>
                    <span className="status" style={{ fontSize: 11 }}>{report.status}</span>
                  </div>
                  {report.aiAnalysis && (
                    <div style={{
                      background: "#f8fffe", border: "1px solid #d1fae5",
                      borderRadius: 8, padding: "10px 14px",
                      fontSize: 13, color: "#374151", lineHeight: 1.6,
                    }}>
                      {report.aiAnalysis}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
