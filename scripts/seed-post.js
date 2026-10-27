// Seeds one blog post (defined in scripts/blog-posts/<slug>.js) into the
// posts table. Safe to re-run:
//   • the post is upserted by its unique slug (INSERT ... ON CONFLICT), so a
//     re-run updates the same row instead of creating a duplicate, and its
//     id / created_at are preserved;
//   • it refuses to run if a *different* post already uses the same title;
//   • images are Unsplash CDN URLs stored on the post itself (cover_image,
//     cover_image_alt and inline <figure> markup), the same way lib/images.js
//     references photos, so there are no separate image rows or uploads to
//     duplicate.
// Touches no other posts or site content.
//
// Usage:
//   node scripts/seed-post.js miami-boat-tour-tickets-booking-guide
const path = require("path");
const { neon } = require("@neondatabase/serverless");

require("./load-env");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/seed-post.js <post-slug>");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add your Neon connection string to .env.local first.");
  process.exit(1);
}

const post = require(path.join(__dirname, "blog-posts", `${slug}.js`));
const sql = neon(process.env.DATABASE_URL);

const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function figure(spec) {
  const img = `<img src="${escapeAttr(spec.url)}" alt="${escapeAttr(spec.alt)}" style="width: 100%">`;
  if (!spec.caption) return img;
  return `<figure class="editor-image-figure">${img}<figcaption>${escapeText(spec.caption)}</figcaption></figure>`;
}

async function checkImage(key, url) {
  const res = await fetch(url, { method: "HEAD" });
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`Image "${key}" is not reachable (${res.status} ${type}): ${url}`);
  console.log(`[image] ${key}: OK (${type})`);
}

async function main() {
  for (const [key, spec] of Object.entries(post.images)) await checkImage(key, spec.url);

  const content = post.content
    .replace(/\{\{image:(\w+)\}\}/g, (_, key) => {
      if (!post.images[key] || key === "cover") throw new Error(`Content references unknown inline image "${key}"`);
      return figure(post.images[key]);
    })
    .replace(/\n/g, "");

  const titleClash = await sql`
    SELECT id, slug FROM posts WHERE lower(title) = lower(${post.title}) AND slug <> ${post.slug}
  `;
  if (titleClash.length) {
    throw new Error(`A different post (id ${titleClash[0].id}, slug "${titleClash[0].slug}") already uses this title.`);
  }

  const rows = await sql`
    INSERT INTO posts (title, slug, excerpt, content, cover_color, category, featured, published, noindex,
                       seo_title, meta_description, cover_image, cover_image_alt)
    VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${content}, ${post.cover_color}, ${post.category},
            ${post.featured}, 1, 0, ${post.seo_title}, ${post.meta_description},
            ${post.images.cover.url}, ${post.images.cover.alt})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
      cover_color = EXCLUDED.cover_color, category = EXCLUDED.category, featured = EXCLUDED.featured,
      published = EXCLUDED.published, noindex = EXCLUDED.noindex, seo_title = EXCLUDED.seo_title,
      meta_description = EXCLUDED.meta_description, cover_image = EXCLUDED.cover_image,
      cover_image_alt = EXCLUDED.cover_image_alt, updated_at = NOW()
    RETURNING id, (xmax = 0) AS inserted
  `;
  const { id, inserted } = rows[0];
  const count = await sql`SELECT COUNT(*)::int AS n FROM posts WHERE slug = ${post.slug}`;
  console.log(`[db] ${inserted ? "Inserted" : "Updated"} post id ${id} (/blog/${post.slug}); rows with this slug: ${count[0].n}`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
