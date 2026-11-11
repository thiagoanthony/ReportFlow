import { AppShell } from "@/app/app-shell";
import { deleteAccountAction, updateAgencyAction } from "@/app/actions";
import { requireAgency } from "@/lib/app-data";
import { getAccessState } from "@/lib/billing";

const PLAN_NAMES: Record<string, string> = {
  trial: "Teste grátis",
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
  free: "Sem plano",
};

const card = {
  background: "var(--surface)",
  border: "1px solid var(--border-2)",
  borderRadius: 12,
  overflow: "hidden",
} as const;

const cardHeader = {
  padding: "16px 20px",
  borderBottom: "1px solid var(--border)",
  background: "var(--surface-2)",
} as const;

const cardTitle = { margin: 0, fontSize: 15, fontWeight: 700, color: "var(--text)" } as const;

type SettingsPageProps = {
  searchParams: { error?: string };
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { session, agency } = await requireAgency();
  const access = getAccessState(agency, { email: session.user.email });
  const hasSubscription = Boolean(agency.stripeSubscriptionId);

  let statusText: string;
  if (access.canUse && access.kind === "trial") {
    statusText = `🕐 Teste grátis: ${access.daysLeft === 1 ? "resta 1 dia" : `restam ${access.daysLeft} dias`}`;
  } else if (access.canUse && access.kind === "subscribed") {
    statusText = "✅ Assinatura ativa";
  } else if (access.canUse && access.kind === "past_due") {
    statusText = "⚠️ Pagamento pendente";
  } else if (access.canUse && access.kind === "bypass") {
    statusText = "✅ Acesso liberado";
  } else if (!access.canUse && access.kind === "expired") {
    statusText = "⛔ Teste grátis encerrado";
  } else {
    statusText = "⛔ Sem assinatura ativa";
  }

  const needsPlan = !access.canUse || (access.canUse && access.kind === "trial");

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie sua agência e assinatura.</p>
        </div>
      </div>

      {searchParams.error === "delete" && (
        <div className="notice error" style={{ maxWidth: 640 }}>
          Não foi possível excluir a conta. Confira se digitou EXCLUIR e tente novamente.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
        <div style={card}>
          <div style={cardHeader}>
            <h2 style={cardTitle}>🏢 Dados da agência</h2>
          </div>
          <div style={{ padding: 20 }}>
            <form className="form" action={updateAgencyAction}>
              <label style={{ color: "var(--text-2)", fontSize: 13, fontWeight: 500 }}>
                Nome da agência
                <input name="name" defaultValue={agency.name} required minLength={2} style={{ marginTop: 6 }} />
              </label>
              <button className="button" type="submit">Salvar alterações</button>
            </form>
          </div>
        </div>

        <div style={card}>
          <div style={cardHeader}>
            <h2 style={cardTitle}>💳 Plano e cobrança</h2>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  Plano {PLAN_NAMES[agency.plan] ?? agency.plan}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{statusText}</div>
                {access.canUse && access.kind !== "bypass" && (
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                    Limite de {access.clientLimit >= 999 ? "clientes ilimitados" : `${access.clientLimit} clientes`}
                  </div>
                )}
              </div>
              {hasSubscription ? (
                <a href="/api/stripe/portal" className="button secondary" style={{ fontSize: 13 }}>
                  Gerenciar assinatura →
                </a>
              ) : (
                <a href="/pricing" className="button" style={{ fontSize: 13 }}>Ver planos →</a>
              )}
            </div>
          </div>
        </div>

        {needsPlan && (
          <div style={{ background: "linear-gradient(135deg, #0d1f16, #0d1a2e)", border: "1px solid #1a3028", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>🚀 Escolha seu plano</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 14 }}>
              Mais clientes, relatórios em PDF e suporte. Sem fidelidade: cancele quando quiser.
            </p>
            <a href="/pricing" className="button" style={{ fontSize: 13 }}>Ver planos →</a>
          </div>
        )}

        {hasSubscription && (
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={cardTitle}>Cancelar assinatura</h2>
            </div>
            <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 380 }}>
                O cancelamento é feito no portal de cobrança. Suas contas e relatórios continuam disponíveis para consulta.
              </div>
              <a href="/api/stripe/portal" className="button secondary" style={{ fontSize: 13 }}>
                Abrir portal
              </a>
            </div>
          </div>
        )}

        <div style={{ ...card, border: "1px solid rgba(248, 113, 113, 0.3)" }}>
          <div style={{ ...cardHeader, background: "var(--red-soft)", borderBottom: "1px solid rgba(248, 113, 113, 0.15)" }}>
            <h2 style={{ ...cardTitle, color: "var(--red)" }}>⚠️ Zona de perigo</h2>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Excluir minha conta</div>
            <p style={{ fontSize: 13, color: "var(--text-2)", margin: "4px 0 14px", lineHeight: 1.6 }}>
              Remove definitivamente sua agência, clientes, integrações e relatórios, e cancela a assinatura ativa. Essa
              ação não pode ser desfeita. Antes, baixe em PDF os relatórios que quiser guardar.
            </p>
            <form action={deleteAccountAction} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input
                name="confirm"
                placeholder="Digite EXCLUIR para confirmar"
                autoComplete="off"
                required
                style={{
                  flex: "1 1 220px", minHeight: 40, padding: "0 12px", borderRadius: 8,
                  border: "1px solid var(--border-2)", background: "var(--bg-2)", color: "var(--text)",
                }}
              />
              <button
                type="submit"
                style={{
                  minHeight: 40, padding: "0 16px", borderRadius: 8, cursor: "pointer",
                  border: "1px solid rgba(248, 113, 113, 0.4)", background: "transparent",
                  color: "var(--red)", fontSize: 13, fontWeight: 600,
                }}
              >
                Excluir conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
