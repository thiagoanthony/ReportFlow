import Link from "next/link";
import { LEGAL } from "@/lib/legal";

type LegalPageProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="legal">
      <header className="legal-nav">
        <Link href="/" className="legal-logo">
          <span className="brand-mark">RF</span>
          <span>{LEGAL.productName}</span>
        </Link>
        <nav>
          <Link href="/termos">Termos de uso</Link>
          <Link href="/privacidade">Privacidade</Link>
        </nav>
      </header>
      <article className="legal-body">
        <h1>{title}</h1>
        <p className="legal-updated">Última atualização: {LEGAL.updatedAt}</p>
        {children}
      </article>
      <footer className="legal-footer">
        <Link href="/">← Voltar ao início</Link>
      </footer>
    </main>
  );
}
