import { createHmac, timingSafeEqual } from "node:crypto";

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

export function signJwt(payload: Record<string, unknown>, secret: string, expiresInSeconds = 60 * 60 * 8) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJwt<T extends Record<string, unknown>>(token: string, secret: string): T | null {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) {
    return null;
  }
  const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: number };
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}
