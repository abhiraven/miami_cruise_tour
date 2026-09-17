import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { sql, ensureSchema } from "@/lib/db";
import { slugify } from "@/lib/posts";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "posts")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  await ensureSchema();
  const posts = await sql`SELECT * FROM posts ORDER BY updated_at DESC`;
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "posts")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const slug = slugify(String(body.slug || title));
    await ensureSchema();

    const rows = await sql`
      INSERT INTO posts (
        title, slug, excerpt, content, cover_color, category,
        featured, published, noindex, seo_title, meta_description,
        cover_image, cover_image_alt
      ) VALUES (
        ${title}, ${slug}, ${body.excerpt || ""}, ${body.content || ""}, ${body.cover_color || "navy"}, ${body.category || "Cruise Tips"},
        ${body.featured ? 1 : 0}, ${body.published === false ? 0 : 1}, ${body.noindex ? 1 : 0}, ${body.seo_title || ""}, ${body.meta_description || ""},
        ${body.cover_image || ""}, ${body.cover_image_alt || ""}
      )
      RETURNING id
    `;
    const id = (rows[0] as { id: number }).id;
    return NextResponse.json({ ok: true, id, post: { id } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("posts_slug_key") || message.includes("duplicate key")) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
    }
    console.error("[POST /api/admin/posts]", err);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
