import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { getPasswordError } from "@/lib/password-policy";

function serializeUser(row: any) {
  let permissions = [];
  try {
    permissions = row.permissions ? JSON.parse(row.permissions) : [];
    if (!Array.isArray(permissions)) permissions = [];
  } catch {
    permissions = [];
  }
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role || "editor",
    created_at: row.created_at,
    permissions,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const me = await getSession();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  const rows = (await sql`
    SELECT id, username, email, role, permissions, created_at FROM admin_users ORDER BY id ASC
  `) as any[];
  return NextResponse.json({ users: rows.map(serializeUser) });
}

export async function POST(request: NextRequest) {
  const me = await getSession();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (me.role !== "admin") {
    return NextResponse.json({ error: "Only admins can create users." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  const role = body?.role === "admin" ? "admin" : "editor";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "A password is required." }, { status: 400 });
  }
  const passwordError = getPasswordError(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  await ensureSchema();
  const existingRows = (await sql`
    SELECT id FROM admin_users WHERE username = ${email} OR email = ${email}
  `) as any[];
  if (existingRows[0]) {
    return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
  }

  const hash = bcrypt.hashSync(password, 10);
  const permissions = JSON.stringify([]);

  try {
    const rows = (await sql`
      INSERT INTO admin_users (username, email, password_hash, role, permissions, created_at)
      VALUES (${email}, ${email}, ${hash}, ${role}, ${permissions}, NOW())
      RETURNING id, username, email, role, permissions, created_at
    `) as any[];
    return NextResponse.json({ user: serializeUser(rows[0]) }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "23505" || String(err).includes("duplicate key")) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
