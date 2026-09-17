import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // If a valid session cookie is already present, sending the visitor
  // back to the login form (which AdminLayout would then wrap in the
  // full authenticated sidebar) reads as broken — the sidebar and the
  // "please sign in" form both showing at once. Send them straight to
  // the dashboard instead, same as any other already-authenticated
  // admin route.
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  return <AdminLoginForm />;
}
