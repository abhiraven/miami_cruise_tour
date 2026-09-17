import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth-server";
import { sql, ensureSchema } from "@/lib/db";

// Any logged-in account (admin or editor) can change its own password —
// this is intentionally not gated by page permissions. It does require the
// account's current password, though: without that check, anyone who got
// hold of a live session (a shared/unlocked browser, a stolen cookie) could
// silently change the password and lock the real owner out for good.
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const password = String(body.password || "");
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await ensureSchema();
    const rows = await sql`SELECT password_hash FROM admin_users WHERE id = ${session.id}`;
    const user = rows[0] as { password_hash: string } | undefined;
    if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const currentOk = await bcrypt.compare(currentPassword, user.password_hash);
    if (!currentOk) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE id = ${session.id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/admin/users/me/password]", err);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
