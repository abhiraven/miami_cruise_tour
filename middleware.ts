import { NextRequest, NextResponse } from "next/server";

// Canonical host is `www` (this is a brand-new domain with no legacy www
// traffic/backlinks to preserve, so www is the primary host from day one).
// Any request that arrives on the bare apex domain gets a true HTTP 301
// (not Next's config-based redirects, which only offer 307/308) straight
// across to the same path + query string on www, so search engines fully
// consolidate ranking signals onto the one canonical host instead of
// splitting them across both.
const APEX_HOST = "miamicruiseboattour.com";
const WWW_HOST = "www.miamicruiseboattour.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === APEX_HOST || host.startsWith(`${APEX_HOST}:`)) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = WWW_HOST;
    url.port = "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals and static assets — nothing on those paths needs
  // the host check, and running it there would be pure overhead.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
