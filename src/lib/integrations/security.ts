import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";

type OAuthState = {
  clientId: string;
  userId: string;
  expiresAt: number;
  nonce: string;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET nao configurado.");
  return value;
}

function encode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

export function createOAuthState(clientId: string, userId: string) {
  const payload: OAuthState = {
    clientId,
    userId,
    expiresAt: Date.now() + 10 * 60 * 1000,
    nonce: randomBytes(16).toString("hex"),
  };
  const encoded = encode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyOAuthState(value: string): OAuthState | null {
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = createHmac("sha256", secret()).update(encoded).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as OAuthState;
    if (!payload.clientId || !payload.userId || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function encryptionKey() {
  return createHmac("sha256", secret()).update("reportflow-integration-tokens").digest();
}

export function encryptToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return ["v1", encode(iv), encode(cipher.getAuthTag()), encode(encrypted)].join(".");
}

export function decryptToken(value: string) {
  const [version, iv, tag, encrypted] = value.split(".");
  if (version !== "v1" || !iv || !tag || !encrypted) return value;

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
