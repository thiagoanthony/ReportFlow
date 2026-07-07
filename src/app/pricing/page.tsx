"use client";

import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: 197,
    priceId: "price_1Tpt2N1p53MueLvpjMeQBm8B",
    clients: 5,
    popular: false,
    features: [
      "Até 5 clientes",
      "Google Ads + Meta Ads",
      "Relatórios com IA",
      "Histórico completo",
      "Suporte por email",
    ],
  },
  {
    name: "Pro",
    price: 397,
    priceId: "price_1Tpt2P1p53MueLvpHmRhCwpW",
    clients: 20,
    popular: true,
    features: [
      "Até 20 clientes",
      "Google Ads + Meta Ads",
      "Relatórios com IA",
      "Exportação em PDF",
      "Envio automático por email",
      "Agendamento mensal",
      "Suporte prioritário",
    ],
  },
  {
    name: "Agency",
    price: 797,
    priceId: "price_1Tpt2Q1p53MueLvpNhrnawu8",
    clients: 999,
    popular: false,
    features: [
      "Clientes ilimitados",
      "Google Ads + Meta Ads",
      "Relatórios com IA",
      "Exportação em PDF",
      "Envio automático por email",
      "Agendamento mensal",
      "White label (sua logo)",
      "Multi-usuário",
      "Suporte dedicado",
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(priceId: string, planName: string) {
    setLoading(planName);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout. Tente novamente.");
      }
    } catch {
      alert("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #1a1a1a", maxWidth: 1100, margin: "0 auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#fff" }}>
          <span style={{ width: 32, height: 32, background: "#2d6a4f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>RF</span>
          <span style={{ fontWeight: 600, fontSize: 18 }}>ReportFlow</span>
        </Link>
        <Link href="/login" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Já tenho conta →</Link>
      </nav>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "56px 32px 40px" }}>
        <h1 style={{ fontSize: 44, fontWeight: 700, marginBottom: 12 }}>Planos simples e transparentes</h1>
        <p style={{ color: "#888", fontSize: 18 }}>Comece grátis por 14 dias. Sem cartão de crédito.</p>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px 72px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {PLANS.map(plan => (
          <div
            key={plan.name}
            style={{
              position: "relative",
              background: plan.popular ? "#0d1f16" : "#141414",
              border: plan.popular ? "2px solid #2d6a4f" : "1px solid #1e1e1e",
              borderRadius: 16,
              padding: 28,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {plan.popular && (
              <div style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                background: "#2d6a4f", color: "#fff", fontSize: 11, padding: "3px 14px",
                borderRadius: 20, fontWeight: 600, whiteSpace: "nowrap"
              }}>
                Mais popular
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700 }}>R$ {plan.price}</span>
                <span style={{ color: "#888" }}>/mês</span>
              </div>
              <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>
                {plan.clients === 999 ? "Clientes ilimitados" : `Até ${plan.clients} clientes`}
              </p>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#ccc" }}>
                  <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 12 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId, plan.name)}
              disabled={loading === plan.name}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                border: plan.popular ? "none" : "1px solid #2a2a2a",
                background: plan.popular ? "#2d6a4f" : "#1e1e1e",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading === plan.name ? "not-allowed" : "pointer",
                opacity: loading === plan.name ? 0.6 : 1,
              }}
            >
              {loading === plan.name ? "Aguarde..." : "Começar grátis — 14 dias"}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 32px 72px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>Perguntas frequentes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { q: "Preciso de cartão de crédito para o trial?", a: "Não. Você tem 14 dias grátis sem precisar cadastrar cartão de crédito." },
            { q: "Posso cancelar a qualquer momento?", a: "Sim. Sem multa ou fidelidade. Cancele com 1 clique no painel." },
            { q: "O que acontece se eu atingir o limite de clientes?", a: "Você pode fazer upgrade para um plano maior a qualquer momento." },
            { q: "Os relatórios ficam salvos?", a: "Sim. Todo histórico de relatórios gerados fica salvo na plataforma." },
          ].map(item => (
            <div key={item.q} style={{ borderBottom: "1px solid #1e1e1e", padding: "20px 0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.q}</h3>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "20px 32px", textAlign: "center" }}>
        <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: 13 }}>← Voltar ao início</Link>
      </footer>
    </div>
  );
}
