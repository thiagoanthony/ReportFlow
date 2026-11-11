// Dados do responsável pelo serviço, usados nos Termos e na Política de Privacidade.
// Preencha pelas variáveis de ambiente (veja .env.example). Enquanto estiverem vazias, as páginas
// mostram os campos entre colchetes, para ninguém publicar sem perceber.
export const LEGAL = {
  productName: "ReportFlow",
  operatorName: process.env.LEGAL_OPERATOR_NAME || "[NOME OU RAZÃO SOCIAL DO RESPONSÁVEL]",
  operatorDocument: process.env.LEGAL_OPERATOR_DOCUMENT || "[CPF OU CNPJ]",
  contactEmail: process.env.LEGAL_CONTACT_EMAIL || "[E-MAIL DE CONTATO]",
  forum: process.env.LEGAL_FORUM || "[COMARCA E UF]",
  updatedAt: "9 de novembro de 2026",
};
