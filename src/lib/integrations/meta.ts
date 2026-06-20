import { metaConfig } from "@/lib/integrations/config";

type MetaTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: { message?: string };
};

type MetaAccountsResponse = {
  data?: Array<{ id: string; account_id?: string; name?: string }>;
  error?: { message?: string };
};

export function metaAuthorizationUrl(state: string) {
  const config = metaConfig();
  const url = new URL(`https://www.facebook.com/${config.apiVersion}/dialog/oauth`);
  url.search = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "ads_read,business_management",
    state,
  }).toString();
  return url.toString();
}

async function readTokenResponse(url: URL) {
  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json()) as MetaTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error?.message ?? "Falha ao obter token da Meta.");
  }
  return data;
}

export async function exchangeMetaCode(code: string) {
  const config = metaConfig();
  const shortUrl = new URL(`https://graph.facebook.com/${config.apiVersion}/oauth/access_token`);
  shortUrl.search = new URLSearchParams({
    client_id: config.appId,
    client_secret: config.appSecret,
    redirect_uri: config.redirectUri,
    code,
  }).toString();
  const shortToken = await readTokenResponse(shortUrl);

  const longUrl = new URL(`https://graph.facebook.com/${config.apiVersion}/oauth/access_token`);
  longUrl.search = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: config.appId,
    client_secret: config.appSecret,
    fb_exchange_token: shortToken.access_token!,
  }).toString();

  return readTokenResponse(longUrl);
}

export async function listMetaAdAccounts(accessToken: string) {
  const config = metaConfig();
  const url = new URL(`https://graph.facebook.com/${config.apiVersion}/me/adaccounts`);
  url.search = new URLSearchParams({
    fields: "id,account_id,name",
    limit: "100",
    access_token: accessToken,
  }).toString();

  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json()) as MetaAccountsResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Nao foi possivel listar as contas da Meta.");
  }

  return (data.data ?? []).map((account) => ({
    accountId: account.account_id ?? account.id.replace("act_", ""),
    accountName: account.name ?? `Meta Ads ${account.account_id ?? account.id}`,
  }));
}

type MetaInsightsResponse = {
  data?: Array<{
    spend?: string;
    actions?: Array<{ action_type: string; value: string }>;
  }>;
  error?: { message?: string };
};

export async function getMetaAdsMetrics(
  accessToken: string,
  accountId: string,
  periodStart: Date,
  periodEnd: Date,
) {
  const config = metaConfig();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const url = new URL(`https://graph.facebook.com/${config.apiVersion}/act_${accountId}/insights`);
  url.search = new URLSearchParams({
    fields: "spend,actions",
    time_range: JSON.stringify({ since: fmt(periodStart), until: fmt(periodEnd) }),
    access_token: accessToken,
  }).toString();

  const response = await fetch(url, { cache: "no-store" });
  const data = (await response.json()) as MetaInsightsResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Nao foi possivel buscar metricas da Meta Ads.");
  }

  let spend = 0;
  let leads = 0;
  for (const row of data.data ?? []) {
    spend += Number(row.spend ?? 0);
    const leadAction = row.actions?.find(
      (action) => action.action_type === "lead" || action.action_type === "offsite_conversion.fb_pixel_lead",
    );
    leads += Number(leadAction?.value ?? 0);
  }

  return { spend, leads: Math.round(leads) };
}
