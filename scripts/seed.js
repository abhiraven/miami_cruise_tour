// Creates (or updates) the first admin account and, on a fresh database,
// seeds a couple of sample blog posts so the Blog page and admin panel
// aren't empty on first run.
//
// Usage:
//   npm run seed
//
// Env vars (all optional except DATABASE_URL, which lib/db.ts already
// requires):
//   SEED_ADMIN_USERNAME  — defaults to "admin"
//   SEED_ADMIN_EMAIL     — defaults to unset
//   SEED_ADMIN_PASS      — defaults to a random 16-char password, printed
//                           once to the console (not stored anywhere else)
require("./load-env");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Neon connection string first.");
    process.exit(1);
  }

  const sql = neon(connectionString);

  console.log("Ensuring schema exists...");
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
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      ip TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
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
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const email = process.env.SEED_ADMIN_EMAIL || null;
  const generatedPassword = crypto.randomBytes(12).toString("base64url");
  const password = process.env.SEED_ADMIN_PASS || generatedPassword;
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await sql`SELECT id FROM admin_users WHERE username = ${username}`;
  if (existing.length > 0) {
    await sql`UPDATE admin_users SET password_hash = ${passwordHash}, email = ${email}, role = 'admin' WHERE username = ${username}`;
    console.log(`Updated existing admin account "${username}".`);
  } else {
    await sql`
      INSERT INTO admin_users (username, email, password_hash, role, permissions)
      VALUES (${username}, ${email}, ${passwordHash}, 'admin', '[]')
    `;
    console.log(`Created admin account "${username}".`);
  }

  if (!process.env.SEED_ADMIN_PASS) {
    console.log("");
    console.log("========================================================");
    console.log(`  Admin login:    ${username}`);
    console.log(`  Admin password: ${password}`);
    console.log("  (This password is only shown here — save it now.)");
    console.log("========================================================");
    console.log("");
  }

  const postCount = await sql`SELECT COUNT(*)::int AS count FROM posts`;
  if (Number(postCount[0].count) === 0) {
    console.log("Seeding sample blog posts...");
    const samples = [
      {
        title: "What to Wear on Your Miami Cruise & Boat Tour",
        slug: "what-to-wear-miami-boat-tour",
        excerpt: "Sun during the day, breeze once the sun goes down — here's how to dress for today's cruise.",
        content:
          "<p>Casual, comfortable clothing works best for the Miami Cruise &amp; Boat Tour — think what you'd wear to the beach or a boardwalk. Flat, non-marking shoes are a good idea, since deck surfaces can get slippery near the water.</p><p>Bring sunglasses and sunscreen for daytime sailings, and pack a light layer for the Sunset Party Cruise — the breeze off Biscayne Bay picks up once the sun starts going down.</p>",
        category: "What to Wear",
        cover_color: "gold",
      },
      {
        title: "The Best Time to Book Your Miami Sunset Cruise",
        slug: "best-time-to-book-miami-sunset-cruise",
        excerpt: "Sunset departure times shift with the season — here's what that means for your booking.",
        content:
          "<p>Because the Miami Sunset Party Cruise is timed around golden hour, its departure time shifts slightly through the year to always sail out as the sky starts turning gold. Booking a few days ahead — especially for weekend sailings — helps guarantee the package and headcount you want.</p>",
        category: "Booking Guide",
        cover_color: "indigo",
      },
    ];
    for (const post of samples) {
      await sql`
        INSERT INTO posts (title, slug, excerpt, content, category, cover_color, featured, published)
        VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.category}, ${post.cover_color}, 0, 1)
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log(`Seeded ${samples.length} sample posts.`);
  } else {
    console.log(`Posts table already has ${postCount[0].count} post(s) — skipping sample post seeding.`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
