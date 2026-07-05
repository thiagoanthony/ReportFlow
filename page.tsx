import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #1a1a1a", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 32, height: 32, background: "#2d6a4f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>RF</span>
          <span style={{ fontWeight: 600, fontSize: 18 }}>ReportFlow</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#888", textDecoration: "none", fontSize: 14 }}>Entrar</Link>
          <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Começar grátis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#4ade80", fontSize: 12, padding: "4px 14px", borderRadius: 20, marginBottom: 24 }}>
          ✦ Relatórios com IA em segundos
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
          Chega de perder horas<br />
          <span style={{ color: "#4ade80" }}>montando relatórios</span>
        </h1>
        <p style={{ color: "#888", fontSize: 20, maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Conecte Google Ads e Meta Ads dos seus clientes e gere relatórios profissionais com análise de IA em menos de 1 minuto.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
            Começar grátis — 14 dias
          </Link>
          <Link href="/login" style={{ border: "1px solid #2a2a2a", color: "#ccc", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
            Já tenho conta →
          </Link>
        </div>
        <p style={{ color: "#555", fontSize: 13, marginTop: 12 }}>Sem cartão de crédito · Cancele quando quiser</p>
      </section>

      {/* Plataformas */}
      <div style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "24px 32px", textAlign: "center" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>Integrações nativas com</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {["Google Ads", "Meta Ads", "Google Analytics", "IA Generativa"].map(p => (
            <span key={p} style={{ color: "#777", fontWeight: 500, fontSize: 14 }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Como funciona */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Como funciona</h2>
          <p style={{ color: "#888", fontSize: 16 }}>Três passos para nunca mais montar relatório manual</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { n: "01", title: "Conecte as contas", desc: "Autorize o ReportFlow a ler os dados de Google Ads e Meta Ads dos seus clientes em 1 clique." },
            { n: "02", title: "Escolha o período", desc: "Selecione as datas e clique em Gerar Relatório. A IA analisa todos os dados automaticamente." },
            { n: "03", title: "Envie ao cliente", desc: "Relatório completo com insights e recomendações gerado em segundos. Pronto para enviar." },
          ].map(s => (
            <div key={s.n} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 16, padding: 28 }}>
              <div style={{ color: "#4ade80", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#888", lineHeight: 1.6, fontSize: 14, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section style={{ background: "#0a0a0a", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 40 }}>Por que agências usam o ReportFlow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { icon: "⚡", title: "10x mais rápido", desc: "O que levava 3 horas agora leva 1 minuto. Relatório gerado com um clique." },
              { icon: "🤖", title: "Análise com IA", desc: "Insights automáticos, alertas de campanhas com problema e recomendações práticas." },
              { icon: "📊", title: "Dados reais", desc: "Conectado direto nas APIs do Google e Meta. Zero cópia e cola de planilha." },
              { icon: "🎨", title: "Visual profissional", desc: "Relatório com a cara da sua agência. Impressiona o cliente e retém a conta." },
              { icon: "📅", title: "Envio automático", desc: "Configure para enviar todo dia 5 do mês automaticamente para cada cliente." },
              { icon: "💰", title: "Cobra mais caro", desc: "Relatório profissional justifica honorários maiores. ROI imediato." },
            ].map(b => (
              <div key={b.title} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{b.title}</h3>
                <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 40 }}>O que agências falam</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { name: "Carlos M.", role: "Sócio, Agência Pulse", text: "Antes eu passava a última semana do mês só montando relatório. Agora fecho tudo em uma tarde." },
            { name: "Ana Lima", role: "Diretora de Performance", text: "Os clientes adoraram o novo formato. Usamos isso para aumentar o retainer em 30%." },
            { name: "Felipe R.", role: "Fundador, FR Digital", text: "Conectei em 10 minutos e já gerei o primeiro relatório. A IA identifica problemas que eu nem tinha percebido." },
          ].map(t => (
            <div key={t.name} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 }}>
              <div style={{ color: "#facc15", marginBottom: 10 }}>★★★★★</div>
              <p style={{ color: "#ccc", lineHeight: 1.6, fontSize: 14, marginBottom: 14 }}>"{t.text}"</p>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div style={{ color: "#666", fontSize: 12 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0d1f16", borderTop: "1px solid #1a3028", borderBottom: "1px solid #1a3028", padding: "72px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Pronto para economizar horas todo mês?</h2>
        <p style={{ color: "#888", fontSize: 16, marginBottom: 28 }}>Comece grátis por 14 dias. Sem cartão de crédito.</p>
        <Link href="/pricing" style={{ background: "#2d6a4f", color: "#fff", padding: "14px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
          Criar conta grátis →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: "#555", fontSize: 13 }}>ReportFlow © 2026</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/pricing" style={{ color: "#555", textDecoration: "none", fontSize: 13 }}>Preços</Link>
          <Link href="/login" style={{ color: "#555", textDecoration: "none", fontSize: 13 }}>Entrar</Link>
        </div>
      </footer>
    </div>
  );
}
