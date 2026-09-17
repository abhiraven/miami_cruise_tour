import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { sql, ensureSchema } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "posts")) redirect("/admin/users");

  const postId = Number(params.id);
  if (!Number.isFinite(postId)) notFound();

  await ensureSchema();
  const rows = (await sql`SELECT * FROM posts WHERE id = ${postId}`) as any[];
  const post = rows[0];
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-miami-navy">Edit Post</h1>
      <div className="mt-6">
        <PostForm initialPost={post} postId={post.id} />
      </div>
    </div>
  );
}
