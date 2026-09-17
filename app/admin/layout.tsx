import { getSession } from "@/lib/auth-server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Miami Cruise & Boat Tour",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getSession();
  } catch (err) {
    console.error("[AdminLayout] getSession() failed, rendering logged-out shell:", err);
  }

  if (!session) {
    return <div className="min-h-screen bg-miami-pearl">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-miami-pearl lg:flex">
      <AdminSidebar username={session.username} role={session.role} permissions={session.permissions} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
