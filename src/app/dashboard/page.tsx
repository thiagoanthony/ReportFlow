import Link from "next/link";
import { AppShell } from "@/app/app-shell";
import { BillingNotice } from "@/app/billing-notice";
import { prisma } from "@/lib/db/prisma";
import { getAccessState } from "@/lib/billing";
import {
  HOURS_SAVED_PER_REPORT,
  formatDate,
  formatPeriodDate,
  reportStatusClass,
  reportStatusLabel,
  requireAgency,
  startOfCurrentMonth,
} from "@/lib/app-data";

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

  const reportsThisMonth = await prisma.report.count({
    where: { client: { agencyId: agency.id }, createdAt: { gte: startOfCurrentMonth() } },
  });

  const access = getAccessState(agency, { email: session.user.email });
  const activeClients = clients.filter((client) => client.active);
  const clientsWithoutIntegration = activeClients.filter(
    (client) => !client.integrations.some((integration) => integration.active),
  ).length;
  const hoursSaved = reportsThisMonth * HOURS_SAVED_PER_REPORT;

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral de clientes, integrações e relatórios.</p>
        </div>
        <Link className="button" href="/clients/new">Novo cliente</Link>
      </div>

      <BillingNotice access={access} />

      <section className="grid cols-4" style={{ marginBottom: 16 }}>
        <article className="card metric">
          <span>Clientes ativos</span>
          <strong>{activeClients.length}</strong>
        </article>
        <article className="card metric">
          <span>Relatórios no mês</span>
          <strong>{reportsThisMonth}</strong>
        </article>
        <article className="card metric">
          <span>Sem integração</span>
          <strong>{clientsWithoutIntegration}</strong>
          <small className="muted">clientes ativos sem conta conectada</small>
        </article>
        <article className="card metric">
          <span>Horas economizadas</span>
          <strong>{hoursSaved}h</strong>
          <small className="muted">estimativa: {HOURS_SAVED_PER_REPORT}h por relatório no mês</small>
        </article>
      </section>

      <section className="grid cols-2">
        <article className="card">
          <div className="row-between" style={{ marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18 }}>Clientes</h2>
              <p className="muted">Contas prontas para gerar relatórios.</p>
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
                  <th>Integrações</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const activeIntegrations = client.integrations.filter((integration) => integration.active).length;
                  const hasIntegration = activeIntegrations > 0;
                  const statusLabel = !client.active ? "Pausado" : hasIntegration ? "Ativo" : "Sem integração";
                  const statusClass = client.active && hasIntegration ? "status" : "status inactive";

                  return (
                    <tr key={client.id}>
                      <td>
                        <Link href={`/clients/${client.id}`} className="client-name-link">
                          {client.name}
                        </Link>
                        <p className="muted">
                          {client.reports[0]
                            ? `Último relatório em ${formatDate(client.reports[0].createdAt)}`
                            : "Sem relatórios"}
                        </p>
                      </td>
                      <td>{activeIntegrations}</td>
                      <td>
                        <span className={statusClass}>{statusLabel}</span>
                      </td>
                      <td>
                        {hasIntegration ? (
                          <Link className="button small" href={`/clients/${client.id}#gerar-relatorio`}>
                            Gerar relatório
                          </Link>
                        ) : (
                          <Link className="button small secondary" href={`/clients/${client.id}#conectar`}>
                            Conectar conta
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </article>

        <article className="card">
          <h2 style={{ margin: 0, fontSize: 18 }}>Relatórios recentes</h2>
          <p className="muted" style={{ marginBottom: 12 }}>
            Análises prontas para apresentar ao cliente.
          </p>
          {reports.length === 0 ? (
            <div className="empty">
              <p>Gere um relatório dentro da página de um cliente.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Período</th>
                  <th>Criado em</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.client.name}</td>
                    <td>
                      {formatPeriodDate(report.periodStart)} — {formatPeriodDate(report.periodEnd)}
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td>
                      <span className={reportStatusClass(report.status)}>{reportStatusLabel(report.status)}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link className="button small secondary" href={`/reports/${report.id}`}>
                          Abrir
                        </Link>
                        <a className="button small secondary" href={`/api/reports/${report.id}/pdf`}>
                          Baixar PDF
                        </a>
                      </div>
                    </td>
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
