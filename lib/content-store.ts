import { cache } from "react";
import { sql, ensureSchema } from "@/lib/db";

// Generic deep-merge: defaults define the full shape, overrides fill in
// whatever was saved. Anything an override is missing (e.g. a field added
// after someone already saved custom content once) falls back to the
// default so a page never renders `undefined`.
export function deepMerge<T>(defaults: T, overrides: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(overrides) ? overrides : defaults) as T;
  }
  if (defaults && typeof defaults === "object") {
    if (!overrides || typeof overrides !== "object") return defaults;
    const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    for (const key of Object.keys(defaults as Record<string, unknown>)) {
      result[key] = deepMerge(
        (defaults as Record<string, unknown>)[key],
        (overrides as Record<string, unknown>)[key]
      );
    }
    return result as T;
  }
  return overrides === undefined || overrides === null ? defaults : (overrides as T);
}

// Generic reader/writer for the one-JSON-blob-per-key pattern every
// editable page (home, about, contact, privacy, site-chrome, blog) uses
// against the `site_content` table.
//
// Wrapped in React's cache() so repeat calls with the same (key, defaults)
// during a single request/render pass — e.g. generateMetadata() and the
// page component both reading the same content — hit the database once
// instead of twice. Each getXContent() wrapper (getHomeContent, etc.)
// always passes the same module-level DEFAULT_X_CONTENT object reference,
// so the cache key stays stable across those calls within one request.
// This never serves stale data across requests: cache() only memoizes for
// the lifetime of a single render, and every page here still sets
// `dynamic = "force-dynamic"` with the underlying sql client's
// `cache: "no-store"`, so each new request re-fetches from the database.
export const getContent = cache(async function getContent<T>(key: string, defaults: T): Promise<T> {
  try {
    await ensureSchema();
    const rows = await sql`SELECT value FROM site_content WHERE key = ${key}`;
    const row = rows[0] as { value: string } | undefined;
    if (!row) return defaults;
    const parsed = JSON.parse(row.value);
    return deepMerge(defaults, parsed);
  } catch (err) {
    console.error(`[getContent:${key}] falling back to defaults due to:`, err);
    return defaults;
  }
});

export async function saveContent<T>(key: string, content: T): Promise<void> {
  await ensureSchema();
  const value = JSON.stringify(content);
  await sql`
    INSERT INTO site_content (key, value, updated_at) VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;
}
