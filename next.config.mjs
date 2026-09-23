/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // jsdom (used server-side, only in app/blog/[slug]/page.tsx, to run
    // isomorphic-dompurify's HTML sanitizer) loads a CSS asset at runtime
    // via a computed `fs.readFileSync(path.resolve(__dirname, ...))` call.
    // When webpack bundles that code into the route's single compiled
    // page.js, it rewrites `__dirname` to a synthetic path under
    // `.next/server/app/...` that doesn't match jsdom's real file layout,
    // so the computed path points nowhere and the read throws ENOENT the
    // moment the page tries to sanitize any content -- no amount of
    // copying the real file in fixes that, since the compiled code is
    // looking in the wrong place entirely. Marking these packages
    // "external" stops webpack from bundling/rewriting them at all: at
    // runtime they're loaded with a plain Node `require()` straight from
    // node_modules, so `__dirname` resolves correctly and the file is
    // found where it actually lives.
    serverComponentsExternalPackages: ["isomorphic-dompurify", "jsdom"],
    // Belt-and-suspenders: with jsdom external, Next's build-output file
    // tracer (which decides what from node_modules ships with the
    // deployed function) should already pick up whatever jsdom requires
    // via normal, non-bundled `require()` calls -- but the CSS file below
    // is loaded through a *computed* path, not a static `require`/`import`,
    // which tracers can't always follow. This makes sure it's included
    // either way. The glob matches jsdom wherever npm hoists/nests it.
    outputFileTracingIncludes: {
      "/blog/[slug]": ["./node_modules/**/jsdom/lib/jsdom/browser/default-stylesheet.css"],
    },
  },
  images: {
    // Local files under /public are optimized automatically with no config
    // needed. These remote patterns cover the two *external* image sources
    // an admin can point content at: curated Unsplash photos, and photos
    // uploaded through the admin panel, which are stored in Vercel Blob
    // under a per-project random subdomain — hence the wildcard.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Serve modern, smaller formats when the browser supports them.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // These routes render fully per-request (see `dynamic = "force-dynamic"`
      // on each) so admin-panel edits show up quickly without a redeploy.
      // A blanket `no-store` used to sit here, which forced a full
      // server render + DB round-trip for every single visitor — the
      // biggest speed cost on the site. `s-maxage` lets a CDN/edge cache
      // in front of the deployment serve most visitors an instant cached
      // response, while `stale-while-revalidate` keeps serving that cache
      // (fast) for up to 10 minutes after it expires while a fresh copy
      // renders in the background — so admin edits still show up within
      // about a minute, just without paying the DB-render cost on every
      // request. `public` is safe here since none of these pages render
      // anything visitor-specific.
      { source: "/", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=600" }] },
      { source: "/about", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=600" }] },
      { source: "/contact", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=600" }] },
      { source: "/blog", headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=600" }] },
      { source: "/blog/:slug", headers: [{ key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=3600" }] },
      { source: "/privacy-policy", headers: [{ key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=3600" }] },
    ];
  },
};

export default nextConfig;
