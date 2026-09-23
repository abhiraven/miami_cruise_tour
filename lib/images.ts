// Curated, free-to-use Miami / Biscayne Bay photography (Unsplash), reused
// across the hero, package cards, and blog covers so the whole site shares
// one consistent, sun-drenched, on-the-water photo set — same sourcing
// approach as the BosphorusDinner-Cruises reference this project is built
// from.
//
// NOTE: Unsplash's photo *page* URLs (unsplash.com/photos/<slug>-<shortId>)
// use a short id that is NOT the same as the actual CDN image id. The CDN
// id (what belongs here) is the longer "timestamp-hash" string found in
// that page's og:image tag, e.g. images.unsplash.com/photo-<CDN id>. Each
// id below has been resolved to its real CDN id from a live photo page.
// Swap any key for your own licensed photography whenever you have it —
// just replace the id string.
const PHOTO_IDS: Record<string, string> = {
  heroMain: "1741023705528-2953cb652705", // Miami's skyline seen across the water on a bright, sunny day
  benefitsBg: "1643067938575-1ead33f78e38", // aerial view of Miami and the bay below
  finalCtaBg: "1586234221629-d391ac1db4db", // a couple watching the sunrise over Biscayne Bay
  aboutBanner: "1740486028433-85c66230f78f", // Miami's waterfront skyline seen across the bay
  galleryHarbor: "1722937293268-62237f5e5435", // aerial view of a Miami-area harbor lined with boats, next to a bridge
  galleryDeck: "1620460944073-38ce944c9283", // a guest relaxing on the open deck of a boat
  galleryMarina: "1666965387106-c14338edfd4c", // a marina dock lined with boats
  gallerySkyline: "1611958710220-9e746bb386c5", // aerial view over the bay during the day
};

export type LocalImageKey = keyof typeof PHOTO_IDS;

export function img(key: LocalImageKey, width = 1200, quality = 75): string {
  const id = PHOTO_IDS[key] || PHOTO_IDS.heroMain;
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

export const BLOG_COVER_BY_COLOR: Record<string, string> = {
  navy: img("galleryHarbor", 900),
  gold: img("galleryDeck", 900),
  indigo: img("galleryMarina", 900),
  mist: img("gallerySkyline", 900),
};

export interface PostCoverLike {
  cover_image?: string | null;
  cover_color?: string | null;
}

// Hostnames allowed by next.config.mjs's images.remotePatterns. Kept in
// sync manually — if a new remote pattern is added there, add its host
// (or suffix, for a wildcard pattern) here too.
const ALLOWED_IMAGE_HOSTS: Array<{ exact: string } | { suffix: string }> = [
  { exact: "images.unsplash.com" },
  { suffix: ".public.blob.vercel-storage.com" },
];

// A saved cover_image is only safe to hand to next/image if it's an
// absolute http(s) URL on one of the allowlisted hosts above. next/image
// throws synchronously during render for anything else (a relative path,
// a blank/whitespace string, a stray host left over from manual data
// edits or an old storage provider) — that's what was turning one bad
// cover_image value into a full 500 on that blog post's page. Validate
// defensively here instead of trusting whatever ended up in the database.
function isAllowedCoverImageUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  return ALLOWED_IMAGE_HOSTS.some((rule) =>
    "exact" in rule ? url.hostname === rule.exact : url.hostname.endsWith(rule.suffix)
  );
}

// Same allowlist check, exposed for the admin save routes so a bad
// cover_image (an arbitrary host, a relative path, a stray blank/
// whitespace string) can never be written to the database in the first
// place — not just filtered out when the blog page renders. Returns the
// trimmed URL when it's safe to store, or "" when it isn't (matching the
// "no cover image saved" value the rest of the app already expects).
export function sanitizeCoverImage(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed && isAllowedCoverImageUrl(trimmed) ? trimmed : "";
}

// Prefer an admin-uploaded cover photo; fall back to the bundled photo
// mapped to the post's cover color when no photo has been uploaded, or
// when the saved value isn't a URL next/image is configured to serve.
export function getPostCoverImage(post: PostCoverLike): string {
  const coverImage = post?.cover_image?.trim();
  if (coverImage && isAllowedCoverImageUrl(coverImage)) return coverImage;
  return BLOG_COVER_BY_COLOR[post?.cover_color || "navy"] || BLOG_COVER_BY_COLOR.navy;
}
