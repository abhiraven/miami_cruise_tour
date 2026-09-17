import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import type { AdminPageKey } from "@/lib/admin-pages";

const FOLDER_PAGE: Record<string, AdminPageKey> = {
  home: "home",
  packages: "home",
  combos: "home",
  posts: "posts",
  content: "home",
  about: "about",
  contact: "contact",
  privacy: "privacy",
  site: "home",
  "site-chrome": "site-chrome",
  blog: "blog",
};

const ALLOWED_FOLDERS = Object.keys(FOLDER_PAGE);
const PAGE_SIZE = 40;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads aren't configured yet. Add BLOB_READ_WRITE_TOKEN to your environment — see .env.example." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const requestedFolder = searchParams.get("folder") || searchParams.get("type");
  const folder = requestedFolder && ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : null;
  const cursor = searchParams.get("cursor") || undefined;

  const pageKey = folder ? FOLDER_PAGE[folder] : "posts";
  if (!hasPageAccess(session, pageKey)) {
    return NextResponse.json({ error: "You don't have access to this media." }, { status: 403 });
  }

  try {
    const result = await list({
      prefix: folder ? `${folder}/` : undefined,
      limit: PAGE_SIZE,
      cursor,
    });

    const media = result.blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        uploadedAt: b.uploadedAt,
        size: b.size,
      }));

    return NextResponse.json({
      media,
      cursor: result.cursor,
      hasMore: result.hasMore,
    });
  } catch (err) {
    console.error("[GET /api/admin/media]", err);
    return NextResponse.json({ error: "Failed to load the media library." }, { status: 500 });
  }
}
