import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { agency: true },
    });

    if (!user?.agency?.stripeCustomerId) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.agency.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/settings`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.redirect(new URL("/settings", req.url));
  }
}
