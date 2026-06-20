# Integracoes do ReportFlow

## URLs locais de callback

- Google Ads: `http://localhost:3000/api/integrations/google/callback`
- Meta Ads: `http://localhost:3000/api/integrations/meta/callback`

Em producao, troque `http://localhost:3000` pelo dominio HTTPS do SaaS e atualize
tambem `NEXTAUTH_URL`.

## Google Ads

1. Crie ou selecione um projeto no Google Cloud Console.
2. Ative a Google Ads API.
3. Configure a tela de consentimento OAuth.
4. Crie uma credencial OAuth 2.0 do tipo Aplicativo da Web.
5. Cadastre a URL de callback acima em URIs de redirecionamento autorizados.
6. Obtenha o Developer Token no API Center de uma conta administradora Google Ads.
7. Preencha:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_ADS_DEVELOPER_TOKEN=""
GOOGLE_ADS_API_VERSION="v24"
```

O ReportFlow solicita o escopo `https://www.googleapis.com/auth/adwords`, recebe
um refresh token e cadastra as contas retornadas por
`customers:listAccessibleCustomers`.

## Meta Ads

1. Crie um aplicativo em Meta for Developers.
2. Adicione o produto Facebook Login for Business.
3. Cadastre a URL de callback acima em Valid OAuth Redirect URIs.
4. Solicite as permissoes `ads_read` e `business_management`.
5. Em desenvolvimento, adicione os usuarios como administradores,
   desenvolvedores ou testadores do aplicativo.
6. Para clientes externos, conclua Business Verification e App Review das
   permissoes exigidas pela Meta.
7. Preencha:

```env
META_APP_ID=""
META_APP_SECRET=""
META_GRAPH_API_VERSION="v24.0"
```

O ReportFlow troca o codigo OAuth por um token de longa duracao e importa as
contas retornadas por `/me/adaccounts`.

## Seguranca

- Nunca envie `.env` para Git ou para terceiros.
- Use HTTPS em producao.
- Use um `AUTH_SECRET` longo e aleatorio; ele tambem protege e criptografa os
  tokens das integracoes.
- Restrinja os usuarios e dominios permitidos nas telas de consentimento.
- Revogue tokens quando um cliente encerrar o contrato.
