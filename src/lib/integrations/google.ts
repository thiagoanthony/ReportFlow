import { googleConfig } from "@/lib/integrations/config";

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type AccessibleCustomersResponse = {
  resourceNames?: string[];
  error?: { message?: string };
};

export function googleAuthorizationUrl(state: string) {
  const config = googleConfig();
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/adwords",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  }).toString();
  return url.toString();
}

export async function exchangeGoogleCode(code: string) {
  const config = googleConfig();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  const data = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "Falha ao obter token do Google.");
  }
  return data;
}

export async function listGoogleAdsAccounts(accessToken: string) {
  const config = googleConfig();
  const response = await fetch(
    `https://googleads.googleapis.com/${config.apiVersion}/customers:listAccessibleCustomers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": config.developerToken,
      },
      cache: "no-store",
    },
  );
  const data = (await response.json()) as AccessibleCustomersResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Nao foi possivel listar as contas do Google Ads.");
  }

  return (data.resourceNames ?? []).map((resourceName) => {
    const accountId = resourceName.replace("customers/", "");
    return { accountId, accountName: `Google Ads ${accountId}` };
  });
}

export async function getGoogleAdsMetrics(
  accessToken: string,
  accountId: string,
  periodStart: Date,
  periodEnd: Date,
) {
  const config = googleConfig();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const query = `
    SELECT metrics.cost_micros, metrics.conversions
    FROM customer
    WHERE segments.date BETWEEN ''${fmt(periodStart)}'' AND ''${fmt(periodEnd)}''
  `;

  const response = await fetch(
    `https://googleads.googleapis.com/${config.apiVersion}/customers/${accountId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": config.developerToken,
        "content-type": "application/json",
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    },
  );

  const data = await response.json();
  if (!response.ok) {
    const message = Array.isArray(data) ? data[0]?.error?.message : undefined;
    throw new Error(message ?? "Nao foi possivel buscar metricas do Google Ads.");
  }

  let costMicros = 0;
  let conversions = 0;
  for (const batch of data) {
    for (const row of batch.results ?? []) {
      costMicros += Number(row.metrics?.costMicros ?? 0);
      conversions += Number(row.metrics?.conversions ?? 0);
    }
  }

  return {
    spend: costMicros / 1_000_000,
    leads: Math.round(conversions),
  };
}
