import type { MetadataRoute } from "next";
import { sql, ensureSchema } from "@/lib/db";
import { getHomeContent } from "@/lib/home-content";
import { getAboutContent } from "@/lib/about-content";
import { getContactContent } from "@/lib/contact-content";
import { getBlogContent } from "@/lib/blog-content";
import { getPrivacyContent } from "@/lib/privacy-content";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.miamicruisetour.com";

// Every static route is paired with the SEO settings for that same page so
// a page marked "noindex" in the admin panel is left out of the sitemap
// too — otherwise Google would see a sitemap entry pointing at a page that
// itself says "don't index me", which is a contradictory (and penalised)
// signal.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, about, contact, blog, privacy] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getContactContent(),
    getBlogContent(),
    getPrivacyContent(),
  ]);

  const candidateRoutes: (MetadataRoute.Sitemap[number] & { noIndex: boolean })[] = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1, noIndex: home.seo.noIndex },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6, noIndex: about.seo.noIndex },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.5, noIndex: contact.seo.noIndex },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.7, noIndex: blog.seo.noIndex },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2, noIndex: privacy.seo.noIndex },
  ];

  const staticRoutes: MetadataRoute.Sitemap = candidateRoutes
    .filter((route) => !route.noIndex)
    .map(({ noIndex, ...route }) => route);

  try {
    await ensureSchema();
    const rows = await sql`SELECT slug, updated_at FROM posts WHERE published = 1 AND noindex = 0`;
    const postRoutes: MetadataRoute.Sitemap = (rows as { slug: string; updated_at: string }[]).map((row) => ({
      url: `${BASE_URL}/blog/${row.slug}`,
      lastModified: new Date(row.updated_at),
      changeFrequency: "monthly",
      priority: 0.5,
    }));
    return [...staticRoutes, ...postRoutes];
  } catch (err) {
    console.error("[sitemap] failed to load posts:", err);
    return staticRoutes;
  }
}
