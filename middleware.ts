import { NextRequest, NextResponse } from "next/server";

// Canonical host is the bare (non-www) domain. Any request that arrives on
// www gets a true HTTP 301 (not Next's config-based redirects, which only
// offer 307/308) straight across to the same path + query string on the
// apex domain, so search engines fully consolidate ranking signals onto
// the one canonical host instead of splitting them across both.
const WWW_HOST = "www.miamicruiseboattour.com";
const APEX_HOST = "miamicruiseboattour.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === WWW_HOST || host.startsWith(`${WWW_HOST}:`)) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = APEX_HOST;
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
