import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { saveHomeContent } from "@/lib/home-content";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (!hasPageAccess(session, "home")) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  try {
    const body = await req.json();
    await saveHomeContent(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/admin/home]", err);
    return NextResponse.json({ error: "Failed to save home page content." }, { status: 500 });
  }
}
