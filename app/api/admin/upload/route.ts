import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

const MAGIC_BYTES: { mime: string; bytes: number[] }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function detectMime(buffer: Buffer): string | null {
  for (const { mime, bytes } of MAGIC_BYTES) {
    if (buffer.length < bytes.length) continue;
    const matches = bytes.every((b, i) => buffer[i] === b);
    if (!matches) continue;
    if (mime === "image/webp") {
      const fourcc = buffer.subarray(8, 12).toString("ascii");
      if (fourcc !== "WEBP") continue;
    }
    return mime;
  }
  return null;
}

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image uploads aren't configured yet. Add BLOB_READ_WRITE_TOKEN to your environment — see .env.example." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = String(formData.get("folder") || formData.get("type") || "content");
    const folder = /^[a-z0-9_-]+$/i.test(folderRaw) ? folderRaw : "content";

    const pageKey = FOLDER_PAGE[folder] || "posts";
    if (!hasPageAccess(session, pageKey)) {
      return NextResponse.json({ error: "Not authorized to upload to this section." }, { status: 403 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image is too large. Maximum size is 8MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = detectMime(buffer);
    if (!mime) {
      return NextResponse.json({ error: "Unsupported file type. Please upload a JPG, PNG, GIF, or WEBP image." }, { status: 400 });
    }

    const ext = mime.split("/")[1];
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(safeName, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
