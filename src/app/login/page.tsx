import { redirect } from "next/navigation";
import { loginWithGoogleAction } from "@/app/actions";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand" style={{ color: "#111827", marginBottom: 28 }}>
          <span className="brand-mark">RF</span>
          <span>ReportFlow</span>
        </div>
        <h1>Entre no painel</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Entre com sua conta Google para acessar o painel.
        </p>
        <form action={loginWithGoogleAction}>
          <button className="button" type="submit" style={{ width: "100%" }}>
            Entrar com Google
          </button>
        </form>
      </section>
    </main>
  );
}
