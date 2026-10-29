import Link from "next/link";

// Cached 404 page. Without this, every bot probe of a missing URL rendered
// the root layout dynamically and woke the Neon database.
export const dynamic = "force-static";
export const revalidate = 86400; // admin saves purge instantly; this is only a daily safety refresh

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-4 opacity-80">Sorry, we couldn&apos;t find that page.</p>
      <Link href="/" className="mt-8 inline-block font-semibold underline">
        Back to home
      </Link>
    </section>
  );
}
