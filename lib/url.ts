// Booking/affiliate links are free-text fields in the admin panel. If
// someone pastes a link without "http(s)://" (e.g. "getyourguide.com/...."),
// using it directly as an <a href> makes the browser treat it as a path
// relative to this site instead of leaving the site. normalizeExternalUrl
// guarantees a link always has a scheme so it always takes visitors to the
// exact URL saved in the admin panel.
export function normalizeExternalUrl(url: string | null | undefined): string {
  const trimmed = String(url || "").trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}
