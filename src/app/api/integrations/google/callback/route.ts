import { Platform } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { exchangeGoogleCode, listGoogleAdsAccounts } from "@/lib/integrations/google";
import { getIntegrationContext } from "@/lib/integrations/route-auth";
import { encryptToken, verifyOAuthState } from "@/lib/integrations/security";

export async function GET(request: NextRequest) {
  const state = verifyOAuthState(request.nextUrl.searchParams.get("state") ?? "");
  const code = request.nextUrl.searchParams.get("code");
  if (!state || !code) return NextResponse.redirect(new URL("/dashboard?integrationError=oauth", request.url));

  const context = await getIntegrationContext(state.clientId);
  if (!context || context.session.user.id !== state.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    const accounts = await listGoogleAdsAccounts(tokens.access_token!);
    if (accounts.length === 0) throw new Error("Nenhuma conta Google Ads acessivel.");

    const accessToken = encryptToken(tokens.access_token!);
    const refreshToken = tokens.refresh_token ? encryptToken(tokens.refresh_token) : undefined;
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : undefined;

    await prisma.$transaction(
      accounts.map((account) =>
        prisma.integration.upsert({
          where: {
            clientId_platform_accountId: {
              clientId: state.clientId,
              platform: Platform.GOOGLE,
              accountId: account.accountId,
            },
          },
          create: {
            clientId: state.clientId,
            platform: Platform.GOOGLE,
            accessToken,
            refreshToken,
            expiresAt,
            accountId: account.accountId,
            accountName: account.accountName,
          },
          update: {
            accessToken,
            ...(refreshToken ? { refreshToken } : {}),
            expiresAt,
            accountName: account.accountName,
            active: true,
          },
        }),
      ),
    );

    return NextResponse.redirect(
      new URL(`/clients/${state.clientId}?integration=google`, request.url),
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/clients/${state.clientId}?integrationError=google`, request.url),
    );
  }
}
