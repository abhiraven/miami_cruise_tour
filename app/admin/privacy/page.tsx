import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getPrivacyContent } from "@/lib/privacy-content";
import PrivacyContentForm from "@/components/admin/PrivacyContentForm";

export const dynamic = "force-dynamic";

export default async function AdminPrivacyPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "privacy")) redirect("/admin/users");

  const content = await getPrivacyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Privacy Policy Content</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the Privacy Policy page — updates go live immediately. This is a legal document, so
        have any substantive change reviewed before you publish it.
      </p>
      <div className="mt-6">
        <PrivacyContentForm initialContent={content} />
      </div>
    </div>
  );
}
