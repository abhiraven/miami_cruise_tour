/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
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
