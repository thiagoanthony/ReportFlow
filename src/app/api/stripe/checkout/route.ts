import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Preços que podem ser vendidos. Se as variáveis STRIPE_PRICE_* estiverem definidas, só elas são aceitas. */
function allowedPriceIds() {
  return [process.env.STRIPE_PRICE_STARTER, process.env.STRIPE_PRICE_PRO, process.env.STRIPE_PRICE_AGENCY].filter(
    (id): id is string => Boolean(id),
  );
}

export async function POST(req: NextRequest) {
  try {
    // A assinatura precisa estar ligada a uma conta: o webhook usa isso para liberar o plano.
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Faça login para assinar." }, { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "priceId obrigatório" }, { status: 400 });
    }

    const allowed = allowedPriceIds();
    if (allowed.length > 0 && !allowed.includes(priceId)) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agency: true },
    });
    const agency = user?.agency;
    if (!agency) {
      return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // O teste grátis de 14 dias é o da própria conta (sem cartão). Aqui a cobrança começa na assinatura.
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      client_reference_id: agency.id,
      ...(agency.stripeCustomerId
        ? { customer: agency.stripeCustomerId }
        : { customer_email: session.user.email }),
      subscription_data: {
        metadata: { agencyId: agency.id, userEmail: session.user.email },
      },
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}
