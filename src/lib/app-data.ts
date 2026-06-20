import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function requireAgency() {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) redirect("/login");

  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {
      name: session.user.name,
    },
    create: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });

  const agency = await prisma.agency.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: `${user.name ?? "Minha"} Agency`,
    },
  });

  return { session, user, agency };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

