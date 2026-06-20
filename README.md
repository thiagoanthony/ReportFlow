# ReportFlow

SaaS para agencias de marketing gerarem relatorios automatizados de performance de campanhas (Google Ads e Meta Ads), com analise de dados feita por IA via Claude (Anthropic API).

## Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Autenticacao:** Auth.js (NextAuth v5) com Google OAuth
- **Banco de dados:** PostgreSQL via Prisma ORM (Neon)
- **IA:** Anthropic SDK (Claude Sonnet) para geracao de analises em portugues
- **Integracoes:** Google Ads API e Meta Graph API (OAuth + leitura de metricas de campanhas)

## Funcionalidades

- Login via Google OAuth
- Cadastro e gerenciamento de clientes por agencia
- Conexao de contas de anuncios (Google Ads / Meta Ads) via OAuth, com tokens criptografados (AES-256-GCM)
- Geracao de relatorios por periodo, com metricas reais de investimento e leads
- Analise automatica gerada por IA, em portugues, com recomendacoes praticas

## Rodando localmente

### Pre-requisitos

- Node.js 18+
- Banco PostgreSQL (recomendado: Neon)
- Conta na Anthropic Console com creditos
- Projeto no Google Cloud Console com OAuth configurado
- App no Meta for Developers com Facebook Login for Business

### Instalacao

```bash
npm install
cp .env.example .env
```

Preencha o `.env` com suas credenciais (veja `INTEGRACOES.md` para detalhes).

### Banco de dados

```bash
npm run db:generate
npm run db:push
```

### Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000.

## Variaveis de ambiente

Veja `.env.example` para a lista completa.

## Integracoes

Consulte `INTEGRACOES.md` para o passo a passo completo de configuracao do Google Ads e Meta Ads.

## Status do projeto

Projeto em desenvolvimento ativo. Pendencias conhecidas:

- `revenue` e `roas` ainda sao calculados com um multiplicador estimado; falta integrar valor de conversao real
- Sem testes automatizados ainda
- Deploy de producao em andamento

## Licenca

Projeto privado/educacional, sem licenca de uso publico definida.
