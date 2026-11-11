import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { todayIso } from "@/lib/report-period";

export async function requireAgency() {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) redirect("/login");

  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {
      name: session.user.name,
    },
    create: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });

  const agency = await prisma.agency.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: `${user.name ?? "Minha"} Agency`,
    },
  });

  return { session, user, agency };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Data de um evento (ex.: criação de um relatório), no fuso de Brasília. */
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(date);
}

/**
 * Data de um período de relatório. Os períodos são gravados como meia-noite UTC,
 * então são formatados em UTC para o dia nunca "voltar" um dia em fusos como o do Brasil.
 */
export function formatPeriodDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

const REPORT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  DONE: "Concluído",
  ERROR: "Erro",
};

export function reportStatusLabel(status: string) {
  return REPORT_STATUS_LABELS[status] ?? status;
}

/** Classe do badge de status: verde para concluído, âmbar para o resto. */
export function reportStatusClass(status: string) {
  return status === "DONE" ? "status" : "status inactive";
}


/** Estimativa de tempo que um relatório automático poupa da agência (ajuste aqui se quiser). */
export const HOURS_SAVED_PER_REPORT = 2;

/** Início do mês atual no horário de Brasília (o Brasil não tem horário de verão desde 2019: UTC-3). */
export function startOfCurrentMonth(now: Date = new Date()): Date {
  const [year, month] = todayIso(now).split("-");
  return new Date(`${year}-${month}-01T00:00:00-03:00`);
}
