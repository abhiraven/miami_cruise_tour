import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getHomeContent } from "@/lib/home-content";
import HomeContentForm from "@/components/admin/HomeContentForm";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "home")) redirect("/admin/users");

  const content = await getHomeContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Home Page Content</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the text in every section of the homepage. Open a section, make your changes, then
        save — updates go live immediately.
      </p>
      <div className="mt-6">
        <HomeContentForm initialContent={content} />
      </div>
    </div>
  );
}
