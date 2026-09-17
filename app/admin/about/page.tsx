import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getAboutContent } from "@/lib/about-content";
import AboutContentForm from "@/components/admin/AboutContentForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "about")) redirect("/admin/users");

  const content = await getAboutContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">About Page Content</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the text and photos on the About page — updates go live immediately.
      </p>
      <div className="mt-6">
        <AboutContentForm initialContent={content} />
      </div>
    </div>
  );
}
