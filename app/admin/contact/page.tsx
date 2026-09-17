import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getContactContent } from "@/lib/contact-content";
import ContactContentForm from "@/components/admin/ContactContentForm";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "contact")) redirect("/admin/users");

  const content = await getContactContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Contact Page Content</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the text, photo, and contact details on the Contact page — updates go live immediately.
      </p>
      <div className="mt-6">
        <ContactContentForm initialContent={content} />
      </div>
    </div>
  );
}
