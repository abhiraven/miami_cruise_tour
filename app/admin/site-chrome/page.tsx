import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getSiteChromeContent } from "@/lib/site-chrome-content";
import SiteChromeForm from "@/components/admin/SiteChromeForm";

export const dynamic = "force-dynamic";

export default async function AdminSiteChromePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "site-chrome")) redirect("/admin/users");

  const content = await getSiteChromeContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Navbar &amp; Footer</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the logo, top navigation, and footer shown on every page — updates go live immediately.
      </p>
      <div className="mt-6">
        <SiteChromeForm initialContent={content} />
      </div>
    </div>
  );
}
