import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sql, ensureSchema } from "@/lib/db";
import { getPostCoverImage } from "@/lib/images";
import type { Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

async function getPost(slug: string): Promise<Post | null> {
  try {
    await ensureSchema();
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND published = 1`;
    return (rows[0] as unknown as Post) || null;
  } catch (err) {
    console.error("[BlogPostPage] failed to load post:", err);
    return null;
  }
}

async function getRelatedPosts(slug: string): Promise<Post[]> {
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT title, slug, excerpt, cover_color, cover_image, cover_image_alt, category, created_at
      FROM posts WHERE published = 1 AND slug != ${slug}
      ORDER BY created_at DESC
      LIMIT 6
    `;
    return rows as unknown as Post[];
  } catch (err) {
    console.error("[BlogPostPage] failed to load related posts:", err);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found | Miami Cruise & Boat Tour" };
  const title = post.seo_title || `${post.title} | Miami Cruise & Boat Tour`;
  const description = post.meta_description || post.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title, description, images: [getPostCoverImage(post)] },
    robots: post.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(params.slug);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Link href="/blog" className="text-sm font-semibold text-miami-navy hover:text-miami-gold">
          ← Back to all articles
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10">
          <article className="max-w-3xl">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl sm:h-64">
              <Image
                src={getPostCoverImage(post)}
                alt={post.cover_image_alt || post.title}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
                className="object-cover"
              />
            </div>

            <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-miami-gold">
              {post.category || "Cruise Tips"}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-miami-navy sm:text-4xl">{post.title}</h1>
            <div className="mt-2 text-sm text-miami-gray">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div
              className="prose prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:text-miami-navy prose-a:text-miami-navy prose-a:underline prose-strong:text-miami-navy"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 rounded-2xl bg-miami-navy p-8 text-center text-white">
              <h2 className="font-display text-xl font-bold">Got what you needed? Reserve your table.</h2>
              <Link href="/#tickets" className="btn btn-gold mt-4">
                Reserve Your Table Now →
              </Link>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <aside className="lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold text-miami-navy">Related Articles</h2>
              <div className="mt-4 flex flex-col gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="flex gap-3 rounded-2xl border border-miami-mist bg-white p-3 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={getPostCoverImage(related)}
                        alt={related.cover_image_alt || related.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold leading-snug text-miami-navy">
                        {related.title}
                      </h3>
                      <div className="mt-1 text-xs text-miami-gray">
                        {new Date(related.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
