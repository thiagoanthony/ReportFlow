# Instruções — copie e cole no terminal do VS Code

## Passo 1 — Instalar Stripe
```
npm install stripe
```

## Passo 2 — Copiar os arquivos

| Arquivo do zip          | Destino no projeto                              |
|-------------------------|-------------------------------------------------|
| page.tsx                | src/app/page.tsx  (SUBSTITUI o arquivo atual)   |
| pricing-page.tsx        | src/app/pricing/page.tsx  (PASTA NOVA)          |
| stripe-checkout-route.ts| src/app/api/stripe/checkout/route.ts  (PASTA NOVA) |
| stripe-webhook-route.ts | src/app/api/stripe/webhook/route.ts  (PASTA NOVA)  |

Para criar as pastas novas no PowerShell:
```
New-Item -ItemType Directory -Path src\app\pricing -Force
New-Item -ItemType Directory -Path src\app\api\stripe\checkout -Force
New-Item -ItemType Directory -Path src\app\api\stripe\webhook -Force
```

## Passo 3 — Adicionar variáveis no Vercel
Settings → Environment Variables → Add:

STRIPE_SECRET_KEY       = sk_test_... (a nova que você regenerou)
STRIPE_WEBHOOK_SECRET   = whsec_... (pegar no passo 4)
STRIPE_PRICE_STARTER    = price_1ToCzs12ZcFkVy759ppfiXcS
STRIPE_PRICE_PRO        = price_1ToD0m12ZcFkVy75gNOAhwwN
STRIPE_PRICE_AGENCY     = price_1ToD1512ZcFkVy75UdnQpp5m

## Passo 4 — Criar webhook no Stripe
1. dashboard.stripe.com → Desenvolvedores → Webhooks
2. Clique em "Adicionar endpoint"
3. URL: https://report-flow-kohl.vercel.app/api/stripe/webhook
4. Eventos:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
5. Copie o "Signing secret" (whsec_...) e adicione como STRIPE_WEBHOOK_SECRET no Vercel

## Passo 5 — Verificar schema Prisma
Abra prisma/schema.prisma e veja se o model Agency tem esses campos.
Se não tiver, adicione:

  plan                 String  @default("trial")
  maxClients           Int     @default(3)
  stripeCustomerId     String? @unique
  stripeSubscriptionId String? @unique
  subscriptionStatus   String  @default("trialing")

Depois rode:
```
npx prisma migrate dev --name add_stripe_fields
```

## Passo 6 — Deploy
```
git add .
git commit -m "feat: landing page, pricing e Stripe"
git push
```
