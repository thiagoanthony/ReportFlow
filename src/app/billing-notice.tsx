import Link from "next/link";
import { ACCESS_MESSAGES, type AccessState } from "@/lib/billing";

/** Aviso de teste/assinatura mostrado no topo do dashboard. Não mostra nada para quem está em dia. */
export function BillingNotice({ access }: { access: AccessState }) {
  if (access.canUse && (access.kind === "subscribed" || access.kind === "bypass")) return null;

  if (access.canUse && access.kind === "trial") {
    return (
      <div className="notice warning row-between">
        <span>
          Teste grátis: {access.daysLeft === 1 ? "resta 1 dia" : `restam ${access.daysLeft} dias`}. Assine um plano para
          não perder o acesso.
        </span>
        <Link className="button small" href="/pricing">Ver planos</Link>
      </div>
    );
  }

  if (access.canUse && access.kind === "past_due") {
    return (
      <div className="notice warning row-between">
        <span>Não conseguimos cobrar sua última fatura. Atualize a forma de pagamento para evitar a suspensão.</span>
        <a className="button small" href="/api/stripe/portal">Atualizar pagamento</a>
      </div>
    );
  }

  if (!access.canUse) {
    return (
      <div className="notice error row-between">
        <span>{ACCESS_MESSAGES[access.reason]} Seus relatórios continuam disponíveis para consulta e download.</span>
        <Link className="button small" href="/pricing">Escolher plano</Link>
      </div>
    );
  }

  return null;
}
