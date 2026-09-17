import crypto from "crypto";

// In production this must come from a real, private env var — falling back
// to a hardcoded string would let anyone forge a valid admin session
// cookie for any username, since the fallback value is committed here.
// Local dev without SESSION_SECRET set still works via the fallback below.
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "SESSION_SECRET is not set. Add a long random string to your production env vars — see .env.example."
  );
}

const SECRET = process.env.SESSION_SECRET || "miami-cruise-boat-tour-dev-secret-change-me";
const COOKIE_NAME = "miami_cruise_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function sign(value: string): string {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed: string | undefined | null): { username: string } | null {
  if (!signed) return null;
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  if (sig.length !== expected.length) return null;
  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return null;
  const [username, expiresAt] = value.split("|");
  if (!username || !expiresAt || Date.now() > Number(expiresAt)) return null;
  return { username };
}

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  return sign(`${username}|${expiresAt}`);
}

export function verifySessionToken(token: string | undefined | null) {
  return verify(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE;
