export function appUrl(path: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (!clientId || !clientSecret || !developerToken) {
    throw new Error("Credenciais do Google Ads incompletas.");
  }

  return {
    clientId,
    clientSecret,
    developerToken,
    apiVersion: process.env.GOOGLE_ADS_API_VERSION ?? "v24",
    redirectUri: appUrl("/api/integrations/google/callback"),
  };
}

export function metaConfig() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Credenciais da Meta incompletas.");
  }

  return {
    appId,
    appSecret,
    apiVersion: process.env.META_GRAPH_API_VERSION ?? "v24.0",
    redirectUri: appUrl("/api/integrations/meta/callback"),
  };
}

export function integrationReadiness() {
  return {
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    ),
    meta: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
  };
}
