"use client";

import { AppShell } from "@/app/app-shell";
import { updateAgencyAction } from "@/app/actions";
import { requireAgency } from "@/lib/app-data";
import { useState } from "react";

// Server component wrapper
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

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

        {/* Dados da agência */}
        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>🏢</span>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>Dados da agência</h2>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <form className="form" action={updateAgencyAction}>
              <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
                Nome da agência
                <input name="name" defaultValue={agency.name} required minLength={2} style={{ marginTop: 6 }} />
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid #f5f5f5" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "linear-gradient(135deg, #2d6a4f, #185FA5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>
                  {agency.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{agency.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{session.user.email}</div>
                </div>
              </div>
              <button className="button" type="submit">Salvar alterações</button>
            </form>
          </div>
        </div>

        {/* Plano atual */}
        <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>💳</span>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>Plano e cobrança</h2>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111", textTransform: "capitalize" }}>
                  Plano {agency.plan ?? "Trial"}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                  {agency.subscriptionStatus === "active" ? "✅ Assinatura ativa" :
                   agency.subscriptionStatus === "trialing" ? "🕐 Trial em andamento" :
                   agency.subscriptionStatus === "past_due" ? "⚠️ Pagamento pendente" :
                   "❌ Cancelada"}
                </div>
              </div>
              <a
                href="/api/stripe/portal"
                className="button secondary"
                style={{ fontSize: 13 }}
              >
                Gerenciar assinatura →
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Plano", value: agency.plan ?? "trial" },
                { label: "Clientes", value: `até ${agency.maxClients ?? 3}` },
                { label: "Status", value: agency.subscriptionStatus ?? "trialing" },
              ].map(item => (
                <div key={item.label} style={{ background: "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111", textTransform: "capitalize" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade */}
        {agency.plan === "trial" || agency.plan === "starter" ? (
          <div style={{ background: "linear-gradient(135deg, #0d1f16, #0d1a2e)", border: "1px solid #1a3028", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              🚀 Faça upgrade do seu plano
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 14 }}>
              Desbloqueie mais clientes, PDF, envio por email e agendamento automático.
            </p>
            <a href="/pricing" className="button" style={{ fontSize: 13 }}>
              Ver planos →
            </a>
          </div>
        ) : null}

        {/* Zona de perigo */}
        <div style={{ background: "#fff", border: "1px solid #fee2e2", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #fef2f2", background: "#fff5f5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚠️</span>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#991b1b" }}>Zona de perigo</h2>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Cancelar assinatura</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  Você continuará tendo acesso até o fim do período pago.
                </div>
              </div>
              <a
                href="/api/stripe/portal"
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  border: "1px solid #fca5a5", background: "#fff",
                  color: "#dc2626", fontSize: 13, fontWeight: 600,
                  textDecoration: "none", cursor: "pointer",
                }}
              >
                Cancelar plano
              </a>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #fee2e2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Excluir conta</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  Todos os dados serão permanentemente removidos.
                </div>
              </div>
              <form action="/api/account/delete" method="POST">
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!confirm("Tem certeza? Esta ação é irreversível.")) e.preventDefault();
                  }}
                  style={{
                    padding: "8px 14px", borderRadius: 8,
                    border: "1px solid #fca5a5", background: "#fee2e2",
                    color: "#dc2626", fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Excluir conta
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
