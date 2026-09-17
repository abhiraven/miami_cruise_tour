export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_color: string;
  category: string;
  featured: number;
  published: number;
  noindex: number;
  seo_title: string | null;
  meta_description: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  created_at: string;
  updated_at: string;
}

export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  // All-punctuation titles (e.g. "???") or titles in a non-Latin script
  // (e.g. "美食之旅") strip down to nothing above — fall back to a
  // guaranteed-unique slug instead of inserting/updating a row with an
  // empty slug, which would collide with every other such title and
  // produce a broken /blog/ URL.
  return slug || `post-${Date.now().toString(36)}`;
}

export const POST_CATEGORIES = [
  "Cruise Tips",
  "Miami on the Water",
  "What to Wear",
  "Sunset Cruises",
  "Booking Guide",
] as const;

export const COVER_COLORS = ["navy", "gold", "indigo", "mist"] as const;
