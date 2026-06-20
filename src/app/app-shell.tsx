import Link from "next/link";
import { logoutAction } from "@/app/actions";

type AppShellProps = {
  agencyName: string;
  userEmail?: string | null;
  children: React.ReactNode;
};

export function AppShell({ agencyName, userEmail, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">RF</span>
          <span>ReportFlow</span>
        </Link>
        <nav aria-label="Navegacao principal">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/clients/new">Novo cliente</Link>
          <Link href="/settings">Configuracoes</Link>
        </nav>
        <div className="sidebar-footer">
          <div>
            <strong>{agencyName}</strong>
            <br />
            <span>{userEmail}</span>
          </div>
          <form action={logoutAction}>
            <button className="ghost-button" type="submit">Sair</button>
          </form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
