import { sql } from "@/lib/db";

// Simple DB-backed brute-force guard for /api/admin/login. Cloudflare
// Turnstile is the primary defense, but it's optional (skipped entirely if
// TURNSTILE_SECRET_KEY isn't set), so a fresh deployment would otherwise
// have zero protection against password guessing. This locks out a given
// username+IP pair after too many wrong passwords in a short window.
const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export async function isLoginRateLimited(username: string, ip: string): Promise<boolean> {
  await sql`DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '1 day'`;

  const cutoff = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const rows = await sql`
    SELECT COUNT(*) AS c FROM login_attempts
    WHERE username = ${username} AND ip = ${ip} AND created_at > ${cutoff}
  `;
  return Number((rows[0] as { c: string } | undefined)?.c || 0) >= MAX_ATTEMPTS;
}

export async function recordFailedLogin(username: string, ip: string): Promise<void> {
  await sql`INSERT INTO login_attempts (username, ip) VALUES (${username}, ${ip})`;
}

export async function clearLoginAttempts(username: string, ip: string): Promise<void> {
  await sql`DELETE FROM login_attempts WHERE username = ${username} AND ip = ${ip}`;
}
