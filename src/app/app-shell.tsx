import Link from "next/link";
import { logoutAction } from "@/app/actions";

type AppShellProps = {
  agencyName: string;
  userEmail?: string | null;
  children: React.ReactNode;
};

export function AppShell({ agencyName, userEmail, children }: AppShellProps) {
  const initials = agencyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Logo */}
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">RF</span>
          <span>ReportFlow</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Navegação principal">
          <Link href="/dashboard" className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/clients/new" className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
            Novo cliente
          </Link>
          <Link href="/settings" className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
            Configurações
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="agency-info">
            <div className="agency-avatar">{initials}</div>
            <div className="agency-details">
              <strong>{agencyName}</strong>
              <span>{userEmail}</span>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="logout-btn" type="submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
