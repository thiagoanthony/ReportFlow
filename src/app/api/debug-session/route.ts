import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  return NextResponse.json({
    hasSession: Boolean(session),
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
    userName: session?.user?.name ?? null,
  });
}
