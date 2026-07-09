import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agency: true },
    });

    if (!user) return NextResponse.redirect(new URL("/login", req.url));

    // Cancela assinatura no Stripe se existir
    if (user.agency?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.agency.stripeSubscriptionId);
      } catch (err) {
        console.error("Erro ao cancelar assinatura:", err);
      }
    }

    // Deleta todos os dados do usuário (cascade no Prisma)
    await prisma.user.delete({ where: { id: user.id } });

    // Redireciona para home após logout
    return NextResponse.redirect(new URL("/?deleted=true", req.url));
  } catch (err) {
    console.error("Account delete error:", err);
    return NextResponse.redirect(new URL("/settings?error=delete", req.url));
  }
}
