import Link from "next/link";

const steps = [
  ["01", "Conecte as contas", "Autorize a leitura dos dados de Google Ads dos seus clientes em um clique. Meta Ads está a caminho."],
  ["02", "Escolha o período", "Use um atalho (últimos 7 ou 30 dias, mês passado) ou escolha as datas. A IA analisa investimento, leads e custo por lead."],
  ["03", "Envie ao cliente", "Relatório com análise e recomendações pronto para baixar em PDF e enviar ao seu cliente."],
];

const without = [
  "Exportar CSV de cada plataforma cliente por cliente",
  "Copiar números para planilha e conferir na mão",
  "Escrever análise do zero em cada relatório",
  "Horas todo mês só no fechamento dos relatórios",
];

const withRF = [
  "Contas conectadas uma única vez, dados sempre atualizados",
  "Métricas do Google Ads de todos os clientes no mesmo painel (Meta Ads em breve)",
  "Análise e recomendações escritas pela IA sobre os seus dados",
  "Relatório de cada cliente em poucos minutos, em PDF",
];

const metrics = [
  ["Investimento", "R$ 48.230"],
  ["Leads", "1.284"],
  ["Custo por lead", "R$ 37,56"],
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <div className="landing-container nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">RF</span>
            <span>ReportFlow</span>
          </Link>
          <nav>
            <Link href="/login" className="nav-login">Entrar</Link>
            <Link href="/login" className="landing-btn landing-btn-small">Começar grátis</Link>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-grid" />
        <div className="landing-container hero-content">
          <span className="eyebrow"><span className="pulse-dot" /> Plataforma de relatórios com IA</span>
          <h1>Chega de perder horas <span>montando relatórios</span></h1>
          <p className="hero-description">
            Conecte o Google Ads dos seus clientes (Meta Ads em breve) e gere relatórios profissionais com
            análise de IA em minutos.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="landing-btn">Criar conta grátis — 14 dias <b>→</b></Link>
            <Link href="/pricing" className="landing-btn outline">Ver planos</Link>
          </div>
          <p className="small-note">Sem cartão de crédito. Cancele quando quiser.</p>

          <div className="hero-stats">
            <div><strong>Minutos</strong><span>por relatório</span></div>
            <div><strong>IA</strong><span>análise em português</span></div>
            <div><strong>PDF</strong><span>pronto para enviar</span></div>
          </div>

          <ReportMockup />
        </div>
      </section>

      <section className="landing-section">
        <SectionHeading eyebrow="Como funciona" title="Três passos. Zero planilha."
          text="Do acesso às contas ao PDF pronto para enviar ao cliente, sem planilha." />
        <div className="steps-grid">
          {steps.map(([n, title, text]) => (
            <div className="feature-card" key={n}>
              <div className="step-number">{n}</div>
              <div className="feature-icon">✦</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="comparison-section">
        <div className="landing-container landing-section">
          <SectionHeading eyebrow="Comparativo" title="Seu fechamento de mês, antes e depois" />
          <div className="comparison-grid">
            <div className="compare-card">
              <p className="compare-label">Sem ReportFlow</p>
              <ul>{without.map(t => <li key={t}><span className="x-icon">×</span>{t}</li>)}</ul>
            </div>
            <div className="compare-card positive">
              <p className="compare-label">Com ReportFlow</p>
              <ul>{withRF.map(t => <li key={t}><span className="check-icon">✓</span>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-container cta-wrap">
        <div className="final-cta">
          <div className="cta-glow" />
          <h2>Pronto para economizar horas todo mês?</h2>
          <p>Comece grátis por 14 dias. Sem cartão de crédito, sem fidelidade.</p>
          <Link href="/login" className="landing-btn">Criar conta grátis →</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container footer-grid">
          <div>
            <Link href="/" className="logo"><span className="logo-mark">RF</span><span>ReportFlow</span></Link>
            <p>Relatórios automáticos com análise de IA para agências de marketing digital.</p>
          </div>
          <div><h4>Produto</h4><Link href="/">Recursos</Link><Link href="/pricing">Preços</Link><Link href="/login">Painel</Link></div>
          <div><h4>Legal</h4><Link href="/termos">Termos de uso</Link><Link href="/privacidade">Política de privacidade</Link></div>
          <div><h4>Conta</h4><Link href="/login">Entrar</Link><Link href="/login">Criar conta</Link></div>
        </div>
        <div className="footer-bottom">© 2026 ReportFlow. Todos os direitos reservados. Feito para agências brasileiras.</div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text && <span>{text}</span>}
    </div>
  );
}

function ReportMockup() {
  const google = [42, 55, 61, 70, 82, 96];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  return (
    <div className="report-mockup">
      <div className="mockup-head">
        <div><small>RELATÓRIO MENSAL</small><h3>Cliente: Loja Verde • Junho</h3></div>
        <span>Exemplo ilustrativo</span>
      </div>
      <div className="metrics-grid">
        {metrics.map(([label, value]) => (
          <div className="metric-box" key={label}><small>{label}</small><strong>{value}</strong></div>
        ))}
      </div>
      <div className="mockup-lower">
        <div className="chart-box">
          <div className="chart-title"><b>Leads por mês</b><small>● Google Ads</small></div>
          <div className="bars">
            {months.map((m, i) => <div className="bar-group" key={m}>
              <div className="bar-area"><i style={{height: `${google[i]}%`}}/></div><small>{m}</small>
            </div>)}
          </div>
        </div>
        <div className="insight-box">
          <b>✦ Análise da IA</b>
          <ul>
            <li>No período, o investimento de R$ 48.230 gerou 1.284 leads, com custo por lead de R$ 37,56.</li>
            <li>Recomendação: concentrar verba nas campanhas com menor custo por lead.</li>
            <li>Recomendação: testar novos criativos nas campanhas com volume estável e CPL acima da média.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
