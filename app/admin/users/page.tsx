import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { sql, ensureSchema } from "@/lib/db";
import UserManagement from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await ensureSchema();
  const rows = (await sql`
    SELECT id, username, email, role, permissions, created_at FROM admin_users ORDER BY id ASC
  `) as any[];

  const users = rows.map((row) => {
    let permissions = [];
    try {
      permissions = row.permissions ? JSON.parse(row.permissions) : [];
      if (!Array.isArray(permissions)) permissions = [];
    } catch {
      permissions = [];
    }
    return { ...row, permissions };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">User Management</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        {session.role === "admin"
          ? "Create and manage admin panel accounts. Only admins can add or remove users."
          : "View admin panel accounts and update your own password."}
      </p>
      <div className="mt-6">
        <UserManagement initialUsers={users} currentUser={{ id: session.id, role: session.role }} />
      </div>
    </div>
  );
}
