import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to .env.local — see .env.example."
  );
}

// Neon's HTTP driver: every `sql` call is a single stateless HTTPS request,
// which is what makes it safe to use from serverless functions / route
// handlers without managing a connection pool ourselves.
//
// Next.js caches `fetch()` calls by default, and the Neon driver makes its
// queries over `fetch()` under the hood. Without `cache: "no-store"` here,
// Next.js can silently serve a stale cached response for a SELECT query
// even on a `force-dynamic` page — which is why admin panel edits could
// otherwise fail to show up on the live site.
export const sql = neon(connectionString, {
  fetchOptions: { cache: "no-store" },
});

// Idempotent schema setup — safe to call on every cold start. Postgres's
// `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` make re-running this a no-op
// once it's already applied.
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    // If schema setup fails (a transient Neon connection blip, for
    // example), clear the cached promise instead of leaving it rejected —
    // otherwise every future call replays that same stale failure forever.
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          cover_color TEXT DEFAULT 'navy',
          category TEXT DEFAULT 'Cruise Tips',
          featured INTEGER DEFAULT 0,
          published INTEGER DEFAULT 1,
          noindex INTEGER DEFAULT 0,
          seo_title TEXT,
          meta_description TEXT,
          cover_image TEXT,
          cover_image_alt TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          email TEXT,
          role TEXT DEFAULT 'editor',
          permissions TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // Generic key-value store for every editable page's content — one
      // JSON blob per key ('home', 'about', 'contact', 'privacy',
      // 'site-chrome', 'blog'). Simpler than a dedicated table per page,
      // and every content module (lib/*-content.ts) reads/writes through
      // the same two queries.
      await sql`
        CREATE TABLE IF NOT EXISTS site_content (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // Tracks failed admin login attempts so the login route can lock out
      // an IP+username pair after too many wrong passwords in a short
      // window — independent of whether Turnstile is configured.
      await sql`
        CREATE TABLE IF NOT EXISTS login_attempts (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          ip TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // Reservation requests submitted from the homepage booking form.
      await sql`
        CREATE TABLE IF NOT EXISTS reservations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          cruise_date DATE,
          guests INTEGER DEFAULT 2,
          package_name TEXT,
          notes TEXT,
          status TEXT DEFAULT 'new',
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email TEXT`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'editor'`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions TEXT`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
