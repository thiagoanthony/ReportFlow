import { redirect } from "next/navigation";
import { loginWithGoogleAction } from "@/app/actions";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Lado esquerdo — visual */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #0d1f16 0%, #0a0a0a 50%, #0d1a2e 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }} className="login-left">
        {/* Grid decorativo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(45,106,79,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", top: "20%", left: "30%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(45,106,79,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(24,95,165,0.1) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, background: "#2d6a4f",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff",
          }}>RF</div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>ReportFlow</span>
        </div>

        {/* Conteúdo central */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-block", background: "rgba(45,106,79,0.2)",
            border: "1px solid rgba(45,106,79,0.3)", color: "#4ade80",
            fontSize: 12, padding: "4px 12px", borderRadius: 20, marginBottom: 20,
          }}>
            ✦ Plataforma de relatórios com IA
          </div>
          <h2 style={{
            color: "#fff", fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: 16,
          }}>
            Relatórios profissionais<br />
            <span style={{ color: "#4ade80" }}>em 1 minuto</span>
          </h2>
          <p style={{ color: "#888", fontSize: 16, lineHeight: 1.6, maxWidth: 400 }}>
            Conecte Google Ads e Meta Ads dos seus clientes e gere análises completas com IA automaticamente.
          </p>

          {/* Métricas */}
          <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
            {[
              { value: "10x", label: "mais rápido" },
              { value: "IA", label: "análise automática" },
              { value: "2", label: "plataformas integradas" },
            ].map(m => (
              <div key={m.label}>
                <div style={{ color: "#4ade80", fontSize: 24, fontWeight: 700 }}>{m.value}</div>
                <div style={{ color: "#666", fontSize: 12 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Depoimento */}
        <div style={{
          position: "relative",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "16px 20px",
        }}>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>
            "Antes eu passava a última semana do mês montando relatório. Agora fecho tudo em uma tarde."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #2d6a4f, #185FA5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>C</div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Carlos M.</div>
              <div style={{ color: "#666", fontSize: 11 }}>Sócio, Agência Pulse</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "48px 40px",
        background: "#0f0f0f",
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          {/* Mobile logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 40,
          }} className="mobile-logo">
            <div style={{
              width: 32, height: 32, background: "#2d6a4f", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, color: "#fff",
            }}>RF</div>
            <span style={{ color: "#fff", fontWeight: 600 }}>ReportFlow</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Bem-vindo de volta
          </h1>
          <p style={{ color: "#666", fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
            Entre na sua conta para acessar o painel da sua agência.
          </p>

          {/* Botão Google */}
          <form action={loginWithGoogleAction}>
            <button type="submit" style={{
              width: "100%", padding: "14px 20px",
              background: "#fff", color: "#111",
              border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.15s",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>
          </form>

          <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
            <span style={{ color: "#444", fontSize: 12 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
          </div>

          {/* Criar conta */}
          <a href="/pricing" style={{
            display: "block", width: "100%", padding: "14px 20px",
            background: "transparent", color: "#fff",
            border: "1px solid #2a2a2a", borderRadius: 10,
            fontSize: 15, fontWeight: 500, textAlign: "center",
            textDecoration: "none", transition: "border-color 0.15s",
          }}>
            Criar conta grátis — 14 dias
          </a>

          <p style={{ color: "#444", fontSize: 12, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            Ao entrar, você concorda com nossos{" "}
            <a href="#" style={{ color: "#666", textDecoration: "underline" }}>Termos de uso</a>
            {" "}e{" "}
            <a href="#" style={{ color: "#666", textDecoration: "underline" }}>Política de privacidade</a>.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </main>
  );
}
