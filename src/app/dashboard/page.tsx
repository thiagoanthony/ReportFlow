import Link from "next/link";
import { AppShell } from "@/app/app-shell";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency, formatDate, requireAgency } from "@/lib/app-data";

type ReportMetrics = {
  spend?: number;
  revenue?: number;
  leads?: number;
};

function parseMetrics(data: string | null): ReportMetrics {
  if (!data) return {};
  try {
    return JSON.parse(data) as ReportMetrics;
  } catch {
    return {};
  }
}

export default async function DashboardPage() {
  const { session, agency } = await requireAgency();
  const clients = await prisma.client.findMany({
    where: { agencyId: agency.id },
    include: {
      integrations: true,
      reports: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const reports = await prisma.report.findMany({
    where: { client: { agencyId: agency.id } },
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const totals = reports.reduce(
    (acc, report) => {
      const data = parseMetrics(report.data);
      acc.spend += Number(data.spend ?? 0);
      acc.revenue += Number(data.revenue ?? 0);
      acc.leads += Number(data.leads ?? 0);
      return acc;
    },
    { spend: 0, revenue: 0, leads: 0 },
  );

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visao geral de clientes, integracoes e relatorios.</p>
        </div>
        <Link className="button" href="/clients/new">Novo cliente</Link>
      </div>

      <section className="grid cols-3" style={{ marginBottom: 16 }}>
        <article className="card metric">
          <span>Clientes ativos</span>
          <strong>{clients.filter((client) => client.active).length}</strong>
        </article>
        <article className="card metric">
          <span>Receita atribuida</span>
          <strong>{formatCurrency(totals.revenue)}</strong>
        </article>
        <article className="card metric">
          <span>Leads medidos</span>
          <strong>{totals.leads}</strong>
        </article>
      </section>

      <section className="grid cols-2">
        <article className="card">
          <div className="row-between" style={{ marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18 }}>Clientes</h2>
              <p className="muted">Contas prontas para gerar relatorios.</p>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="empty">
              <div>
                <p>Nenhum cliente cadastrado.</p>
                <Link className="button" href="/clients/new">Cadastrar primeiro cliente</Link>
              </div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Integracoes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <Link href={`/clients/${client.id}`} style={{ fontWeight: 800, textDecoration: "none" }}>
                        {client.name}
                      </Link>
                      <p className="muted">
                        {client.reports[0] ? `Ultimo relatorio em ${formatDate(client.reports[0].createdAt)}` : "Sem relatorios"}
                      </p>
                    </td>
                    <td>{client.integrations.length}</td>
                    <td><span className={client.active ? "status" : "status inactive"}>{client.active ? "Ativo" : "Pausado"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="card">
          <h2 style={{ margin: 0, fontSize: 18 }}>Relatorios recentes</h2>
          <p className="muted" style={{ marginBottom: 12 }}>Analises prontas para apresentar ao cliente.</p>
          {reports.length === 0 ? (
            <div className="empty"><p>Gere um relatorio dentro da pagina de um cliente.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Periodo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.client.name}</td>
                    <td>{formatDate(report.periodStart)} - {formatDate(report.periodEnd)}</td>
                    <td><span className="status">{report.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </section>
    </AppShell>
  );
}
