// Validação do período de um relatório.
// Funciona no servidor e no navegador (sem dependências), para que o formulário
// e a server action apliquem exatamente as mesmas regras.

export const MAX_REPORT_DAYS = 90;
export const REPORT_TIMEZONE = "America/Sao_Paulo";

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type PeriodErrorCode = "invalid" | "order" | "future" | "too_long";

export const PERIOD_ERROR_MESSAGES: Record<PeriodErrorCode, string> = {
  invalid: "Informe datas válidas para o período.",
  order: "A data final não pode ser anterior à data inicial.",
  future: "A data final não pode estar no futuro.",
  too_long: `O período do relatório pode ter no máximo ${MAX_REPORT_DAYS} dias.`,
};

export type PeriodValidation =
  | { ok: true; start: Date; end: Date; days: number }
  | { ok: false; code: PeriodErrorCode; message: string };

/** Data de hoje (YYYY-MM-DD) no fuso de Brasília, independente do fuso do servidor. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REPORT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Converte "YYYY-MM-DD" em Date (UTC, meia-noite). Retorna null se não for uma data real. */
export function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  // Rejeita datas que o JS "corrige" sozinho (ex.: 2026-02-31).
  if (date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

/** Soma (ou subtrai) dias a uma data "YYYY-MM-DD". */
export function addDaysIso(value: string, days: number): string {
  const date = parseIsoDate(value);
  if (!date) return value;
  return new Date(date.getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

export function validateReportPeriod(
  startValue: string,
  endValue: string,
  now: Date = new Date(),
): PeriodValidation {
  const fail = (code: PeriodErrorCode): PeriodValidation => ({
    ok: false,
    code,
    message: PERIOD_ERROR_MESSAGES[code],
  });

  const start = parseIsoDate(startValue);
  const end = parseIsoDate(endValue);
  if (!start || !end) return fail("invalid");
  if (end.getTime() < start.getTime()) return fail("order");
  if (endValue > todayIso(now)) return fail("future");

  // Dias contados de forma inclusiva (01/06 a 01/06 = 1 dia).
  const days = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
  if (days > MAX_REPORT_DAYS) return fail("too_long");

  return { ok: true, start, end, days };
}

export type PeriodPreset = { id: string; label: string };

export const PERIOD_PRESETS: PeriodPreset[] = [
  { id: "7d", label: "Últimos 7 dias" },
  { id: "30d", label: "Últimos 30 dias" },
  { id: "last-month", label: "Mês passado" },
  { id: "custom", label: "Personalizado" },
];

/** Calcula início e fim de um atalho. "custom" não tem datas fixas. */
export function presetRange(
  presetId: string,
  now: Date = new Date(),
): { start: string; end: string } | null {
  const today = todayIso(now);

  if (presetId === "7d") return { start: addDaysIso(today, -6), end: today };
  if (presetId === "30d") return { start: addDaysIso(today, -29), end: today };

  if (presetId === "last-month") {
    const [year, month] = today.split("-").map(Number);
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    const first = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    const last = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return { start: first, end: last };
  }

  return null;
}

/** Erros da geração de relatório que não são de período (mostrados no formulário da página do cliente). */
export const REPORT_ERROR_MESSAGES = {
  no_integration: "Conecte pelo menos uma conta de anúncios deste cliente antes de gerar o relatório.",
  fetch_failed:
    "Não foi possível ler os dados de uma ou mais contas conectadas. Reconecte as contas e tente novamente.",
} as const;
