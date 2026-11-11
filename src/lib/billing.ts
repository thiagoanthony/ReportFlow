// Regras de acesso por plano. Sem dependências, para rodar no servidor e ser testável.
//
// Modelo:
// - Conta nova: teste grátis de 14 dias, sem cartão (plan "trial", limite de clientes do schema).
// - Depois do teste: precisa assinar (Stripe). A assinatura chega por webhook em
//   plan / subscriptionStatus / maxClients / stripeSubscriptionId.
// - Quem está sem acesso continua VENDO e BAIXANDO o que já gerou; só não cria clientes nem relatórios.

export const TRIAL_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

export type BillingAgency = {
  plan: string;
  maxClients: number;
  subscriptionStatus: string;
  stripeSubscriptionId: string | null;
  createdAt: Date;
};

export type AccessReason = "trial_expired" | "inactive";

export type AccessState =
  | { canUse: true; kind: "trial"; daysLeft: number; endsAt: Date; clientLimit: number }
  | { canUse: true; kind: "subscribed"; clientLimit: number }
  | { canUse: true; kind: "past_due"; clientLimit: number }
  | { canUse: true; kind: "bypass"; clientLimit: number }
  | { canUse: false; kind: "expired" | "inactive"; reason: AccessReason; clientLimit: 0 };

/**
 * E-mails que nunca são bloqueados (ex.: o dono do produto e contas de demonstração).
 * Configure BILLING_BYPASS_EMAILS="voce@exemplo.com,demo@exemplo.com".
 */
export function isBillingBypassed(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.BILLING_BYPASS_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export function getAccessState(
  agency: BillingAgency,
  options: { email?: string | null; now?: Date } = {},
): AccessState {
  const now = options.now ?? new Date();

  if (isBillingBypassed(options.email)) {
    return { canUse: true, kind: "bypass", clientLimit: 999 };
  }

  if (agency.stripeSubscriptionId) {
    const status = agency.subscriptionStatus;
    if (status === "active" || status === "trialing") {
      return { canUse: true, kind: "subscribed", clientLimit: agency.maxClients };
    }
    // Pagamento falhou: o Stripe ainda tenta cobrar de novo. Mantemos o acesso e avisamos.
    if (status === "past_due") {
      return { canUse: true, kind: "past_due", clientLimit: agency.maxClients };
    }
    return { canUse: false, kind: "inactive", reason: "inactive", clientLimit: 0 };
  }

  if (agency.plan === "trial") {
    const endsAt = new Date(agency.createdAt.getTime() + TRIAL_DAYS * DAY_MS);
    if (now.getTime() < endsAt.getTime()) {
      const daysLeft = Math.max(1, Math.ceil((endsAt.getTime() - now.getTime()) / DAY_MS));
      return { canUse: true, kind: "trial", daysLeft, endsAt, clientLimit: agency.maxClients };
    }
    return { canUse: false, kind: "expired", reason: "trial_expired", clientLimit: 0 };
  }

  // Plano "free" (assinatura cancelada) ou qualquer estado sem assinatura.
  return { canUse: false, kind: "inactive", reason: "inactive", clientLimit: 0 };
}

export const ACCESS_MESSAGES = {
  trial_expired: "Seu teste grátis de 14 dias terminou. Escolha um plano para continuar criando clientes e relatórios.",
  inactive: "Sua assinatura não está ativa. Escolha um plano para continuar criando clientes e relatórios.",
  limit: "Você atingiu o limite de clientes do seu plano. Faça upgrade para cadastrar mais.",
} as const;

export type PricingReason = keyof typeof ACCESS_MESSAGES;
