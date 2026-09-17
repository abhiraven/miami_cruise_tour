import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import { isLoginRateLimited, recordFailedLogin, clearLoginAttempts } from "@/lib/login-rate-limit";

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true; // Not configured — skip entirely.
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      cache: "no-store",
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error("[login] Turnstile verification failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const captchaToken = String(body.captchaToken || "");
    const ip = getClientIp(req);

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    await ensureSchema();

    if (await isLoginRateLimited(username, ip)) {
      return NextResponse.json({ error: "Too many failed attempts. Please try again in 15 minutes." }, { status: 429 });
    }

    const captchaOk = await verifyTurnstile(captchaToken, ip);
    if (!captchaOk) {
      return NextResponse.json({ error: "Verification challenge failed. Please try again." }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, username, password_hash, email, role, permissions FROM admin_users
      WHERE username = ${username} OR email = ${username}
    `;
    const user = rows[0] as
      | { id: number; username: string; password_hash: string; email: string | null; role: string | null; permissions: string | null }
      | undefined;

    const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !passwordOk) {
      await recordFailedLogin(username, ip);
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    await clearLoginAttempts(username, ip);

    const token = createSessionToken(user.username);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (err) {
    console.error("[POST /api/admin/login]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
