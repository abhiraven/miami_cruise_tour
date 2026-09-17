import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { ADMIN_PAGES } from "@/lib/admin-pages";
import { getPasswordError } from "@/lib/password-policy";

const VALID_PAGE_KEYS = ADMIN_PAGES.map((p) => p.key);

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

async function countAdmins() {
  const rows = (await sql`SELECT COUNT(*) AS c FROM admin_users WHERE role = 'admin'`) as any[];
  return Number(rows[0]?.c || 0);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSession();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targetId = Number(params.id);
  if (!Number.isFinite(targetId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const isSelf = me.id === targetId;
  if (me.role !== "admin" && !isSelf) {
    return NextResponse.json({ error: "You can only edit your own account." }, { status: 403 });
  }

  try {
    await ensureSchema();
    const existingRows = (await sql`SELECT * FROM admin_users WHERE id = ${targetId}`) as any[];
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);

    let role = existing.role || "editor";
    if (body?.role !== undefined && body.role !== existing.role) {
      if (me.role !== "admin") {
        return NextResponse.json({ error: "Only admins can change roles." }, { status: 403 });
      }
      if (isSelf) {
        return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
      }
      if (existing.role === "admin" && body.role !== "admin") {
        const adminCount = await countAdmins();
        if (adminCount <= 1) {
          return NextResponse.json({ error: "Can't remove the last admin." }, { status: 400 });
        }
      }
      role = body.role === "admin" ? "admin" : "editor";
    }

    let permissions = existing.permissions || "[]";
    if (body?.permissions !== undefined) {
      if (me.role !== "admin") {
        return NextResponse.json({ error: "Only admins can change page access." }, { status: 403 });
      }
      if (!Array.isArray(body.permissions)) {
        return NextResponse.json({ error: "Invalid page access list." }, { status: 400 });
      }
      const cleaned = body.permissions.filter((key: any) => (VALID_PAGE_KEYS as string[]).includes(key));
      permissions = JSON.stringify(cleaned);
    }

    let passwordHash = existing.password_hash;
    if (body?.password) {
      const passwordError = getPasswordError(body.password);
      if (passwordError) {
        return NextResponse.json({ error: passwordError }, { status: 400 });
      }
      passwordHash = bcrypt.hashSync(body.password, 10);
    }

    const rows = (await sql`
      UPDATE admin_users SET password_hash = ${passwordHash}, role = ${role}, permissions = ${permissions}
      WHERE id = ${targetId}
      RETURNING id, username, email, role, permissions, created_at
    `) as any[];
    return NextResponse.json({ user: serializeUser(rows[0]) });
  } catch (err) {
    console.error("[PUT /api/admin/users/[id]]", err);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const me = await getSession();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (me.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete users." }, { status: 403 });
  }

  const targetId = Number(params.id);
  if (!Number.isFinite(targetId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (targetId === me.id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  try {
    await ensureSchema();
    const existingRows = (await sql`SELECT * FROM admin_users WHERE id = ${targetId}`) as any[];
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.role === "admin") {
      const adminCount = await countAdmins();
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Can't delete the last admin." }, { status: 400 });
      }
    }

    await sql`DELETE FROM admin_users WHERE id = ${targetId}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/users/[id]]", err);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
