import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type ReportPdfInput = {
  agencyName: string;
  clientName: string;
  periodLabel: string;
  createdLabel: string;
  spend: number;
  leads: number;
  cpl: number;
  analysis: string | null;
};

const PAGE = { width: 595.28, height: 841.89 }; // A4
const MARGIN = 48;
const GREEN = rgb(0.176, 0.416, 0.31); // #2d6a4f
const INK = rgb(0.07, 0.07, 0.07);
const MUTED = rgb(0.42, 0.45, 0.5);
const LINE = rgb(0.9, 0.91, 0.92);

const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
    .format(value)
    // O espaço não separável do Intl não existe na codificação WinAnsi das fontes padrão do PDF.
    .replace(/ /g, " ");

/** Deixa só caracteres que a fonte padrão do PDF consegue desenhar (acentos do português incluídos). */
function makeSanitizer(font: PDFFont) {
  const supported = new Set(font.getCharacterSet());
  return (text: string) => {
    let out = "";
    for (const char of text.replace(/\t/g, "    ").replace(/ /g, " ")) {
      const code = char.codePointAt(0)!;
      if (code === 10 || supported.has(code)) out += char;
    }
    return out;
  };
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
        continue;
      }
      if (current) lines.push(current);
      current = "";

      // Palavra maior que a linha inteira (ex.: URL longa): quebra por caracteres.
      let rest = word;
      while (font.widthOfTextAtSize(rest, size) > maxWidth) {
        let cut = rest.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > maxWidth) cut--;
        lines.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      current = rest;
    }
    if (current) lines.push(current);
  }
  return lines;
}

export async function buildReportPdf(input: ReportPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const clean = makeSanitizer(regular);

  pdf.setTitle(`Relatório - ${clean(input.clientName)}`);
  pdf.setProducer("ReportFlow");

  const contentWidth = PAGE.width - MARGIN * 2;
  let page: PDFPage = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      page = pdf.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - MARGIN;
    }
  };

  // Cabeçalho
  page.drawText(clean(input.agencyName), { x: MARGIN, y: y - 10, size: 11, font: bold, color: GREEN });
  y -= 34;
  page.drawText("Relatório de desempenho", { x: MARGIN, y: y - 14, size: 22, font: bold, color: INK });
  y -= 40;
  page.drawText(clean(input.clientName), { x: MARGIN, y: y - 4, size: 14, font: bold, color: INK });
  y -= 22;
  page.drawText(`Período: ${input.periodLabel}  |  Gerado em ${input.createdLabel}`, {
    x: MARGIN,
    y: y - 2,
    size: 10,
    font: regular,
    color: MUTED,
  });
  y -= 18;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE.width - MARGIN, y },
    thickness: 1,
    color: LINE,
  });
  y -= 28;

  // Métricas
  const metrics = [
    { label: "Investimento", value: brl(input.spend) },
    { label: "Leads", value: String(input.leads) },
    { label: "Custo por lead", value: brl(input.cpl) },
  ];
  const gap = 12;
  const boxWidth = (contentWidth - gap * (metrics.length - 1)) / metrics.length;
  const boxHeight = 64;
  metrics.forEach((metric, index) => {
    const x = MARGIN + index * (boxWidth + gap);
    page.drawRectangle({
      x,
      y: y - boxHeight,
      width: boxWidth,
      height: boxHeight,
      borderColor: LINE,
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.98),
    });
    page.drawText(metric.label.toUpperCase(), {
      x: x + 14,
      y: y - 22,
      size: 8,
      font: bold,
      color: MUTED,
    });
    page.drawText(metric.value, { x: x + 14, y: y - 48, size: 20, font: bold, color: INK });
  });
  y -= boxHeight + 32;

  // Análise
  ensureSpace(40);
  page.drawText("Análise", { x: MARGIN, y: y - 12, size: 14, font: bold, color: GREEN });
  y -= 30;

  const analysis = input.analysis ? clean(input.analysis).trim() : "";
  const body = analysis || "Este relatório não possui análise.";
  const size = 11;
  const lineHeight = 17;
  for (const line of wrapText(body, regular, size, contentWidth)) {
    ensureSpace(lineHeight);
    if (line) page.drawText(line, { x: MARGIN, y: y - size, size, font: regular, color: INK });
    y -= lineHeight;
  }

  // Rodapé em todas as páginas
  const pages = pdf.getPages();
  pages.forEach((p, index) => {
    p.drawText(`ReportFlow  |  Página ${index + 1} de ${pages.length}`, {
      x: MARGIN,
      y: 26,
      size: 8,
      font: regular,
      color: MUTED,
    });
  });

  return pdf.save();
}
