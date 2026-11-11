import Link from "next/link";
import { AppShell } from "@/app/app-shell";
import { createClientAction } from "@/app/actions";
import { requireAgency } from "@/lib/app-data";
import { ACCESS_MESSAGES } from "@/lib/billing";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { session, agency } = await requireAgency();

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Novo cliente</h1>
          <p>Cadastre uma conta para centralizar integrações e relatórios.</p>
        </div>
        <Link className="button secondary" href="/dashboard">Voltar</Link>
      </div>

      {searchParams.error === "limit" && (
        <div className="notice error" style={{ maxWidth: 620 }}>
          {ACCESS_MESSAGES.limit} <Link href="/pricing" style={{ textDecoration: "underline" }}>Ver planos</Link>
        </div>
      )}

      <section className="card" style={{ maxWidth: 620 }}>
        <form className="form" action={createClientAction}>
          <label>
            Nome do cliente
            <input name="name" placeholder="Ex: Loja Aurora" required minLength={2} />
          </label>
          <button className="button" type="submit">Criar cliente</button>
        </form>
      </section>
    </AppShell>
  );
}
