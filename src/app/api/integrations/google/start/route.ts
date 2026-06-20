import { NextRequest, NextResponse } from "next/server";
import { googleAuthorizationUrl } from "@/lib/integrations/google";
import { getIntegrationContext } from "@/lib/integrations/route-auth";
import { createOAuthState } from "@/lib/integrations/security";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId") ?? "";
  const context = await getIntegrationContext(clientId);
  if (!context) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const state = createOAuthState(clientId, context.session.user.id);
    return NextResponse.redirect(googleAuthorizationUrl(state));
  } catch {
    return NextResponse.redirect(
      new URL(`/clients/${clientId}?integrationError=google_config`, request.url),
    );
  }
}
