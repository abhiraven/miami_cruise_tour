import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { sql, ensureSchema } from "@/lib/db";
import { slugify } from "@/lib/posts";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "posts")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  await ensureSchema();
  const rows = await sql`SELECT * FROM posts WHERE id = ${id}`;
  const post = rows[0];
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "posts")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const slug = slugify(String(body.slug || title));

    await ensureSchema();
    const rows = await sql`
      UPDATE posts SET
        title = ${title},
        slug = ${slug},
        excerpt = ${body.excerpt || ""},
        content = ${body.content || ""},
        cover_color = ${body.cover_color || "navy"},
        category = ${body.category || "Cruise Tips"},
        featured = ${body.featured ? 1 : 0},
        published = ${body.published === false ? 0 : 1},
        noindex = ${body.noindex ? 1 : 0},
        seo_title = ${body.seo_title || ""},
        meta_description = ${body.meta_description || ""},
        cover_image = ${body.cover_image || ""},
        cover_image_alt = ${body.cover_image_alt || ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json({ ok: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("posts_slug_key") || message.includes("duplicate key")) {
      return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
    }
    console.error("[PUT /api/admin/posts/[id]]", err);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Only admins can delete posts." }, { status: 403 });

  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid post id." }, { status: 400 });

  await ensureSchema();
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
