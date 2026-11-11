/// <reference types="react-dom/canary" />
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { generateReportAction } from "@/app/actions";
import {
  MAX_REPORT_DAYS,
  PERIOD_PRESETS,
  addDaysIso,
  presetRange,
  validateReportPeriod,
} from "@/lib/report-period";

type ReportFormProps = {
  clientId: string;
  /** Hoje (YYYY-MM-DD, fuso de Brasília), calculado no servidor para evitar divergência na hidratação. */
  today: string;
  /** Mensagem de erro vinda do servidor (quando a validação do backend recusou o período). */
  serverError?: string;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="button"
      type="submit"
      disabled={disabled || pending}
      style={{ width: "100%", marginTop: 4, opacity: disabled || pending ? 0.6 : 1 }}
    >
      {pending ? "Gerando relatório…" : "Gerar relatório com IA"}
    </button>
  );
}

export function ReportForm({ clientId, today, serverError }: ReportFormProps) {
  const initial = presetRange("30d") ?? { start: addDaysIso(today, -29), end: today };
  const [preset, setPreset] = useState("30d");
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [touched, setTouched] = useState(false);

  const validation = validateReportPeriod(start, end);
  const clientError = !validation.ok && (touched || preset !== "custom") ? validation.message : null;
  const error = clientError ?? (serverError && !touched ? serverError : null);

  function choosePreset(id: string) {
    setPreset(id);
    setTouched(false);
    const range = presetRange(id);
    if (range) {
      setStart(range.start);
      setEnd(range.end);
    }
  }

  function editDate(which: "start" | "end", value: string) {
    setPreset("custom");
    setTouched(true);
    if (which === "start") setStart(value);
    else setEnd(value);
  }

  return (
    <form
      className="form"
      action={generateReportAction}
      onSubmit={(event) => {
        // Bloqueia o envio no navegador quando o período é inválido.
        // A server action valida de novo, então isso é só conveniência.
        if (!validation.ok) {
          event.preventDefault();
          setTouched(true);
        }
      }}
    >
      <input type="hidden" name="clientId" value={clientId} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="group" aria-label="Atalhos de período">
        {PERIOD_PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === preset ? "button" : "button secondary"}
            style={{ minHeight: 32, padding: "0 12px", fontSize: 12 }}
            aria-pressed={item.id === preset}
            onClick={() => choosePreset(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
        Início do período
        <input
          name="periodStart"
          type="date"
          required
          value={start}
          max={today}
          onChange={(event) => editDate("start", event.target.value)}
          style={{ marginTop: 6 }}
        />
      </label>
      <label style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
        Fim do período
        <input
          name="periodEnd"
          type="date"
          required
          value={end}
          min={start || undefined}
          max={today}
          onChange={(event) => editDate("end", event.target.value)}
          style={{ marginTop: 6 }}
        />
      </label>

      <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
        Período máximo de {MAX_REPORT_DAYS} dias.
        {validation.ok ? ` Selecionado: ${validation.days} ${validation.days === 1 ? "dia" : "dias"}.` : ""}
      </p>

      {error && (
        <div className="notice error" role="alert" style={{ margin: 0 }}>
          {error}
        </div>
      )}

      <SubmitButton disabled={!validation.ok} />
    </form>
  );
}
