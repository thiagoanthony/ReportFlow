import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    hasGoogleId: Boolean(process.env.AUTH_GOOGLE_ID),
    hasGoogleSecret: Boolean(process.env.AUTH_GOOGLE_SECRET),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    nextAuthUrl: process.env.NEXTAUTH_URL ?? "MISSING",
    authGoogleIdLength: (process.env.AUTH_GOOGLE_ID ?? "").length,
    authGoogleIdTrimmedMatches: (process.env.AUTH_GOOGLE_ID ?? "") === (process.env.AUTH_GOOGLE_ID ?? "").trim(),
    authGoogleSecretTrimmedMatches: (process.env.AUTH_GOOGLE_SECRET ?? "") === (process.env.AUTH_GOOGLE_SECRET ?? "").trim(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}

