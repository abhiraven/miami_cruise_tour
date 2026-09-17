import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "posts")) redirect("/admin/users");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">New Post</h1>
      <div className="mt-6">
        <PostForm initialPost={null} postId={null} />
      </div>
    </div>
  );
}
