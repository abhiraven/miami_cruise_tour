import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { sql, ensureSchema } from "@/lib/db";
import { getBlogContent } from "@/lib/blog-content";
import { getHomeContent } from "@/lib/home-content";
import { getPostCoverImage } from "@/lib/images";
import type { Post } from "@/lib/posts";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getBlogContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/blog" },
    openGraph: { title: seo.title, description: seo.description },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

async function getPublishedPosts(): Promise<Post[]> {
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC
    `;
    return rows as unknown as Post[];
  } catch (err) {
    console.error("[BlogPage] failed to load posts:", err);
    return [];
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const [{ hero }, posts, { schedule, location }] = await Promise.all([
    getBlogContent(),
    getPublishedPosts(),
    getHomeContent(),
  ]);

  const featured = posts.find((p) => p.featured === 1) || posts[0] || null;
  const trending = posts.filter((p) => p.slug !== featured?.slug).slice(0, 3);
  const categories = Array.from(new Set(posts.map((p) => p.category || "Cruise Tips")));

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="mt-3.5 font-display text-4xl font-bold text-miami-navy">{hero.title}</h1>
        <p className="mt-2 max-w-2xl text-miami-gray">{hero.subtitle}</p>

        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-miami-gray">
          <span>
            <strong className="text-miami-navy">{posts.length}</strong> {posts.length === 1 ? "article" : "articles"}
          </span>
          {categories.length > 0 && (
            <span>
              <strong className="text-miami-navy">{categories.length}</strong>{" "}
              {categories.length === 1 ? "category" : "categories"}
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
          {posts.length === 0 ? (
            <p className="text-miami-gray">New guides for your Miami Cruise &amp; Boat Tour are coming soon.</p>
          ) : (
            <div className="flex flex-col gap-8 sm:gap-10">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid overflow-hidden rounded-3xl border border-miami-mist bg-white transition-shadow hover:shadow-xl sm:grid-cols-2"
                >
                  <div className="relative h-48 overflow-hidden sm:h-full">
                    <Image
                      src={getPostCoverImage(featured)}
                      alt={featured.cover_image_alt || featured.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      priority
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-miami-gold px-3 py-1 text-xs font-bold text-miami-navy shadow">
                      <Icon name="star" className="h-3 w-3" /> Featured
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6">
                    <span className="text-xs font-semibold uppercase tracking-wide text-miami-gold">
                      {featured.category || "Cruise Tips"}
                    </span>
                    <h2 className="mt-1.5 font-display text-2xl font-bold leading-snug text-miami-navy sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-miami-gray sm:text-base">{featured.excerpt}</p>
                    <div className="mt-3 text-xs text-miami-gray">{formatDate(featured.created_at)}</div>
                    <span className="mt-3 inline-flex items-center text-sm font-semibold text-miami-navy group-hover:text-miami-gold">
                      Read More →
                    </span>
                  </div>
                </Link>
              )}

              {trending.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-miami-navy">
                    <Icon name="sparkles" className="h-5 w-5 text-miami-gold" /> Trending Now
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                    {trending.map((post, i) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex items-center gap-3 rounded-2xl border border-miami-mist bg-white p-3 transition-shadow hover:shadow-lg sm:flex-col sm:items-stretch"
                      >
                        <span className="shrink-0 font-display text-2xl font-bold text-miami-mist sm:hidden">
                          0{i + 1}
                        </span>
                        <div className="relative h-14 w-14 shrink-0 sm:h-24 sm:w-full">
                          <Image
                            src={getPostCoverImage(post)}
                            alt={post.cover_image_alt || post.title}
                            fill
                            sizes="(min-width: 640px) 180px, 56px"
                            className="rounded-xl object-cover"
                          />
                          <span className="absolute -left-2 -top-3 hidden h-8 w-8 items-center justify-center rounded-full bg-miami-navy font-display text-sm font-bold text-white shadow sm:flex">
                            {i + 1}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold leading-snug text-miami-navy sm:mt-3">
                          {post.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-miami-mist bg-white p-6">
              <h2 className="font-display text-lg font-bold text-miami-navy">Quick Info</h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-miami-gray">
                {schedule.rows.slice(0, 2).map((row) => (
                  <li key={row.label}>
                    <strong className="text-miami-navy">{row.value}</strong> {row.label.toLowerCase()}
                  </li>
                ))}
                <li>
                  <strong className="text-miami-navy">{location.address}</strong>
                </li>
              </ul>
              <Link href="/#tickets" className="mt-4 inline-block text-sm font-semibold text-miami-navy hover:text-miami-gold">
                See full schedule »
              </Link>
            </div>

            {posts.length > 0 && (
              <div className="rounded-2xl border border-miami-mist bg-white p-6">
                <h2 className="font-display text-lg font-bold text-miami-navy">Popular Guides</h2>
                <ol className="mt-4 flex flex-col gap-3 text-sm">
                  {posts.slice(0, 5).map((post, i) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}`} className="flex gap-3 text-miami-gray hover:text-miami-navy">
                        <span className="font-display font-bold text-miami-mist">0{i + 1}</span>
                        <span>{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-2xl bg-miami-navy p-6 text-center text-white">
              <h2 className="font-display text-lg font-bold">Ready to Reserve?</h2>
              <p className="mt-2 text-sm text-white/72">
                Booking takes a few minutes — pick your package and we&apos;ll handle the rest.
              </p>
              <Link href="/contact" className="btn btn-gold mt-4 w-full py-2.5 text-sm">
                Reserve Your Table →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
