import { AppShell } from "@/app/app-shell";
import { updateAgencyAction } from "@/app/actions";
import { requireAgency } from "@/lib/app-data";

export default async function SettingsPage() {
  const { session, agency } = await requireAgency();

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie sua agência e assinatura.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>

        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>🏢 Dados da agência</h2>
          </div>
          <div style={{ padding: 20 }}>
            <form className="form" action={updateAgencyAction}>
              <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
                Nome da agência
                <input name="name" defaultValue={agency.name} required minLength={2} style={{ marginTop: 6 }} />
              </label>
              <button className="button" type="submit">Salvar alterações</button>
            </form>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>💳 Plano e cobrança</h2>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", textTransform: "capitalize" }}>
                  Plano {(agency as any).plan ?? "Trial"}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                  {(agency as any).subscriptionStatus === "active" ? "✅ Assinatura ativa" :
                   (agency as any).subscriptionStatus === "trialing" ? "🕐 Trial em andamento" :
                   (agency as any).subscriptionStatus === "past_due" ? "⚠️ Pagamento pendente" :
                   "Sem assinatura ativa"}
                </div>
              </div>
              <a href="/api/stripe/portal" className="button secondary" style={{ fontSize: 13 }}>
                Gerenciar assinatura →
              </a>
            </div>
          </div>
        </div>

        {(agency as any).plan === "trial" || (agency as any).plan === "starter" ? (
          <div style={{ background: "linear-gradient(135deg, #0d1f16, #0d1a2e)", border: "1px solid #1a3028", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>🚀 Faça upgrade do seu plano</div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 14 }}>Desbloqueie mais clientes, PDF e agendamento automático.</p>
            <a href="/pricing" className="button" style={{ fontSize: 13 }}>Ver planos →</a>
          </div>
        ) : null}

        <div style={{ background: "#fff", border: "1px solid #fee2e2", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #fef2f2", background: "#fff5f5" }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>⚠️ Zona de perigo</h2>
          </div>
          <div style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Cancelar assinatura</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Você continua com acesso até o fim do período pago.</div>
            </div>
            <a href="/api/stripe/portal" style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Cancelar plano
            </a>
          </div>
        </div>

      </div>
    </AppShell>
  );
}