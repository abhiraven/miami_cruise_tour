import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { sql, ensureSchema } from "@/lib/db";
import { getPostCoverImage } from "@/lib/images";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!hasPageAccess(session, "posts")) redirect("/admin/users");

  await ensureSchema();
  const posts = (await sql`SELECT * FROM posts ORDER BY created_at DESC`) as any[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-miami-navy">Blog Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center rounded-full bg-miami-navy px-5 py-2 text-sm font-bold text-white hover:bg-miami-gold hover:text-miami-navy transition"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-miami-mist bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-miami-mist text-left text-miami-navy/60">
              <th className="px-4 py-3 font-medium">Photo</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-miami-navy/50">
                  No posts yet. Create your first one.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-miami-mist/50 last:border-0">
                <td className="px-4 py-3">
                  <img
                    src={getPostCoverImage(post)}
                    alt={post.title}
                    className="h-10 w-14 rounded-md object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-miami-navy">
                  {post.title}
                  {Boolean(post.featured) && (
                    <span className="ml-2 inline-flex rounded-full bg-miami-navy/10 text-miami-navy px-2.5 py-0.5 text-xs font-semibold">
                      ★ Featured
                    </span>
                  )}
                  {Boolean(post.noindex) && (
                    <span className="ml-2 inline-flex rounded-full bg-miami-ivory text-miami-navy/60 px-2.5 py-0.5 text-xs font-semibold">
                      Noindex
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-miami-navy/60">{post.category || "Cruise Tips"}</td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="inline-flex rounded-full bg-miami-mist/60 text-miami-navy px-2.5 py-0.5 text-xs font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-miami-ivory text-miami-navy/60 px-2.5 py-0.5 text-xs font-semibold">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-miami-navy/60">
                  {new Date(post.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-sm font-semibold text-miami-gold hover:text-miami-navy"
                    >
                      Edit
                    </Link>
                    {session.role === "admin" && (
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
