import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { saveBlogContent } from "@/lib/blog-content";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "blog")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  try {
    const body = await req.json();
    await saveBlogContent(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/admin/blog]", err);
    return NextResponse.json({ error: "Failed to save blog page content." }, { status: 500 });
  }
}
