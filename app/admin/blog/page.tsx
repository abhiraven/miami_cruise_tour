import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { getBlogContent } from "@/lib/blog-content";
import BlogContentForm from "@/components/admin/BlogContentForm";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "blog")) redirect("/admin/users");

  const content = await getBlogContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Blog Page</h1>
      <p className="mt-1 text-sm text-miami-navy/60">
        Edit the SEO title and description for the Blog listing page (/blog) — updates go live
        immediately. Individual blog posts have their own SEO fields in the post editor.
      </p>
      <div className="mt-6">
        <BlogContentForm initialContent={content} />
      </div>
    </div>
  );
}
