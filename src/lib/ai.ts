import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type ReportMetrics = {
  spend: number;
  leads: number;
  revenue: number;
  cpl: number;
  roas: number;
};

export async function generateAiAnalysis(
  clientName: string,
  periodStart: Date,
  periodEnd: Date,
  metrics: ReportMetrics
): Promise<string> {
  const prompt = `Voce e um analista de marketing digital especializado em midia paga (Meta Ads e Google Ads).

Cliente: ${clientName}
Periodo: ${periodStart.toLocaleDateString("pt-BR")} a ${periodEnd.toLocaleDateString("pt-BR")}

Metricas do periodo:
- Investimento total: R$ ${metrics.spend.toLocaleString("pt-BR")}
- Leads gerados: ${metrics.leads}
- Receita: R$ ${metrics.revenue.toLocaleString("pt-BR")}
- CPL (Custo por Lead): R$ ${metrics.cpl}
- ROAS (Retorno sobre investimento em anuncios): ${metrics.roas}x

Escreva uma analise curta (3 a 5 frases) em portugues do Brasil, em tom profissional e direto,
destacando o desempenho do periodo e dando 1 ou 2 recomendacoes praticas para o proximo periodo.
Nao use markdown, apenas texto corrido.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock && textBlock.type === "text") {
      return textBlock.text.trim();
    }

    return "Nao foi possivel gerar a analise neste momento.";
  } catch (error) {
    console.error("[ai] Erro ao gerar analise com a Anthropic API:", error);
    return "Nao foi possivel gerar a analise com IA neste momento. Os dados numericos do relatorio permanecem disponiveis.";
  }
}
