import { AppShell } from "@/app/app-shell";
import { updateAgencyAction } from "@/app/actions";
import { requireAgency } from "@/lib/app-data";

export default async function SettingsPage() {
  const { session, agency } = await requireAgency();

  return (
    <AppShell agencyName={agency.name} userEmail={session.user.email}>
      <div className="page-header">
        <div>
          <h1>Configuracoes</h1>
          <p>Ajustes basicos da agencia e do ambiente demo.</p>
        </div>
      </div>

      <section className="card" style={{ maxWidth: 620 }}>
        <form className="form" action={updateAgencyAction}>
          <label>
            Nome da agencia
            <input name="name" defaultValue={agency.name} required minLength={2} />
          </label>
          <button className="button" type="submit">Salvar alteracoes</button>
        </form>
      </section>
    </AppShell>
  );
}
