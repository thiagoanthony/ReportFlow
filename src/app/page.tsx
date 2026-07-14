import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #1a1a1a", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 32, height: 32, background: "#2d6a4f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>RF</span>
          <span style={{ fontWeight: 600, fontSize: 18 }}>ReportFlow</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Entrar</Link>
          <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Comecar gratis</Link>
        </div>
      </nav>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 64px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
          Chega de perder horas<br />
          <span style={{ color: "#4ade80" }}>montando relatorios</span>
        </h1>
        <p style={{ color: "#888", fontSize: 20, maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Conecte Google Ads e Meta Ads dos seus clientes e gere relatorios profissionais com analise de IA em menos de 1 minuto.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>Comecar gratis - 14 dias</Link>
          <Link href="/login" style={{ border: "1px solid #2a2a2a", color: "#ccc", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>Ja tenho conta</Link>
        </div>
      </section>
      <div style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "24px 32px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {["Google Ads", "Meta Ads", "Google Analytics", "IA Generativa"].map(p => (
            <span key={p} style={{ color: "#777", fontWeight: 500, fontSize: 14 }}>{p}</span>
          ))}
        </div>
      </div>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 48 }}>Como funciona</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { n: "01", title: "Conecte as contas", desc: "Autorize o ReportFlow a ler os dados de Google Ads e Meta Ads dos seus clientes em 1 clique." },
            { n: "02", title: "Escolha o periodo", desc: "Selecione as datas e clique em Gerar Relatorio. A IA analisa todos os dados automaticamente." },
            { n: "03", title: "Envie ao cliente", desc: "Relatorio completo com insights e recomendacoes gerado em segundos. Pronto para enviar." },
          ].map(s => (
            <div key={s.n} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 16, padding: 28 }}>
              <div style={{ color: "#4ade80", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#888", lineHeight: 1.6, fontSize: 14, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: "#0d1f16", borderTop: "1px solid #1a3028", borderBottom: "1px solid #1a3028", padding: "72px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Pronto para economizar horas todo mes?</h2>
        <p style={{ color: "#888", fontSize: 16, marginBottom: 28 }}>Comece gratis por 14 dias. Sem cartao de credito.</p>
        <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "14px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
          Criar conta gratis
        </Link>
      </section>
      <footer style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "#555", fontSize: 13 }}>ReportFlow 2026</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/pricing" style={{ color: "#555", textDecoration: "none", fontSize: 13 }}>Precos</Link>
          <Link href="/login" style={{ color: "#555", textDecoration: "none", fontSize: 13 }}>Entrar</Link>
        </div>
      </footer>
    </div>
  );
}