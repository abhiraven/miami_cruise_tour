# Miami Cruise & Boat Tour

A Next.js 14 (App Router, TypeScript) site for Miami Cruise & Boat Tour, with a full admin CMS panel, Neon Postgres, and Vercel Blob image storage — built on the same architecture as BosphorusDinner-Cruises, converted to TypeScript.

## Stack

- Next.js 14 (App Router) + TypeScript (strict mode)
- Neon Postgres (serverless HTTP driver, `@neondatabase/serverless`)
- Vercel Blob for admin-uploaded images
- Tailwind CSS (custom `miami` color palette matching the site's brand colors)
- Tiptap rich text editor for blog posts
- next/image automatic image optimization (resize, AVIF/WebP, lazy loading) for both local and admin-uploaded images
- HMAC-signed session cookies for admin auth, with optional Cloudflare Turnstile bot protection

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Neon Postgres database**

   Sign up at [neon.tech](https://neon.tech), create a project, and copy the pooled connection string from the "Connection Details" panel.

3. **Create a Vercel Blob store**

   In your Vercel project's **Storage** tab, create a Blob store and copy the `BLOB_READ_WRITE_TOKEN` it gives you. (If you're not deploying to Vercel yet, you can still create a standalone Blob store from the Vercel dashboard.)

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in `DATABASE_URL`, `SESSION_SECRET` (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), and `BLOB_READ_WRITE_TOKEN`. Everything else in `.env.example` is optional.

5. **Seed the database**

   ```bash
   npm run seed
   ```

   This creates the tables (if they don't exist yet), creates your first admin account, and seeds two sample blog posts. Your admin username and a generated password are printed once to the terminal — save them immediately, they aren't stored anywhere else.

   To use your own password instead of a generated one:

   ```bash
   SEED_ADMIN_USERNAME=admin SEED_ADMIN_PASS=your-password-here npm run seed
   ```

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin panel.

## Admin Panel

Log in at `/admin/login`. From the dashboard you can edit every page's content (Home, About, Contact, Privacy Policy, Navbar & Footer, Blog page SEO), write and publish blog posts with the rich text editor, manage reservation requests and contact messages, and manage other admin/editor accounts (admins only).

Editor accounts can be restricted to specific sections of the admin panel via the **Users** page — every account, including editors, can always view Users and change its own password.

If you ever lose the admin password:

```bash
SEED_ADMIN_PASS=a-new-password npm run reset-admin-password
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server (after `build`) |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run seed` | Create the database schema, first admin account, and sample posts |
| `npm run reset-admin-password` | Reset (or create) an admin account's password |

## Deploying

This project is built to deploy cleanly to Vercel: connect the repo, add the same environment variables from `.env.local` to the Vercel project's Environment Variables settings (Production and Preview), and deploy. Run `npm run seed` once against the production `DATABASE_URL` (locally, with `.env.local` pointed at production, or via a one-off Vercel deployment shell) to create your first admin account.

`miamicruisetour.com` / `www.miamicruisetour.com` are the placeholder domains baked into `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `middleware.ts`, and the sample contact/privacy email addresses — once you've registered your real domain, update those to match. `www` is the canonical host here (this is a new domain, so there's no legacy non-www traffic to preserve).

In Vercel's Domains settings, point **both** the apex domain and the `www` subdomain at "Connect to an environment → Production" (not "Redirect to Another Domain" on either one) — `middleware.ts` is what performs the actual apex → `www` redirect with a true HTTP 301. Setting Vercel's own domain-level redirect on top of that will create a redirect loop.

## Project Structure

```
app/                    Routes (App Router) — public pages, admin panel, API routes
  admin/                Admin panel pages (session-gated via app/admin/layout.tsx)
  api/admin/            Admin-only API routes (content saves, posts CRUD, uploads, users)
  api/reservations/     Public booking form endpoint
  api/contact/          Public contact form endpoint
components/             Shared UI components
  admin/                Admin panel form components (ArrayEditor, Field, forms per page)
lib/                    Data layer — db schema, auth, per-page content modules
public/images/          Bundled Miami boat-tour imagery, optimized automatically by next/image
scripts/                Node scripts (seed, password reset) — run outside Next's build
```

## Notes

- All editable page content lives in a single `site_content` table as one JSON blob per page key, with defaults defined in `lib/*-content.ts`. This means new fields you add later always have a safe fallback, even for content saved before the field existed.
- Session cookies are signed (HMAC-SHA256) and expire after 8 hours.
- Image uploads are validated by file signature (magic bytes), not just the browser-supplied Content-Type, before being stored in Vercel Blob.
- Cloudflare Turnstile on `/admin/login` is entirely optional — leave `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` unset and the widget is skipped, with a database-backed rate limit (5 attempts / 15 minutes per username+IP) as the fallback brute-force guard.
- The bundled photography in `lib/images.ts` is free-to-use Unsplash photography, not licensed originals of this specific business — swap in your own licensed photos whenever you have them.
