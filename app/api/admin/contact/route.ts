import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { saveContactContent } from "@/lib/contact-content";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "contact")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  try {
    const body = await req.json();
    await saveContactContent(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/admin/contact]", err);
    return NextResponse.json({ error: "Failed to save contact page content." }, { status: 500 });
  }
}
