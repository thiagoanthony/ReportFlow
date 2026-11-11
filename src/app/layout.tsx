import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReportFlow — Relatórios automáticos com IA para agências",
  description: "Conecte Google Ads e Meta Ads dos seus clientes e gere relatórios profissionais com análise de IA em menos de 1 minuto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
