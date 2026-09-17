import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Icon from "@/components/Icon";
import FaqAccordion from "@/components/FaqAccordion";
import { getHomeContent } from "@/lib/home-content";
import { normalizeExternalUrl } from "@/lib/url";
import { img, getPostCoverImage } from "@/lib/images";
import { sql, ensureSchema } from "@/lib/db";
import type { Post } from "@/lib/posts";
import type { IconName } from "@/components/Icon";
import type { LocalImageKey } from "@/lib/images";

// Hero collage tiles below the main photo — bundled Miami boat-tour shots
// reused from the gallery, mirroring the multi-photo hero collage pattern
// from the BosphorusDinner-Cruises reference (one large image + a 2x2 grid
// of smaller ones) so the hero reads as richly photographic instead of a
// single boxed image floating on a flat gradient.
const HERO_COLLAGE: { key: LocalImageKey; alt: string }[] = [
  { key: "galleryHarbor", alt: "Aerial view of the Miami harbor where our boats depart" },
  { key: "galleryDeck", alt: "Guests relaxing on deck during the Miami Cruise & Boat Tour" },
  { key: "galleryMarina", alt: "A marina dock lined with boats in Miami" },
  { key: "gallerySkyline", alt: "Miami's skyline seen from the water, across Biscayne Bay" },
];

export const dynamic = "force-dynamic";

// Same "From the Blog" homepage preview pattern as the Spanish Riding
// School reference: latest 3 published posts, silently omitted if there
// aren't any yet (a fresh install with no posts shouldn't show an empty
// section).
async function getLatestPosts(): Promise<Post[]> {
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT title, slug, excerpt, cover_color, cover_image, cover_image_alt, created_at
      FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3
    `;
    return rows as unknown as Post[];
  } catch (err) {
    console.error("[HomePage] failed to load latest posts:", err);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: { title: seo.title, description: seo.description },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function HomePage() {
  const content = await getHomeContent();
  const {
    hero,
    trustBar,
    packagesSection,
    packages,
    combosSection,
    priceBreakdown,
    benefits,
    highlights,
    schedule,
    location,
    nearby,
    faq,
    finalCta,
  } = content;
  const latestPosts = await getLatestPosts();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <Image
          src={hero.backgroundImage || img("gallerySkyline", 1600)}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={55}
          className="object-cover opacity-25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(250,249,246,0.97) 0%, rgba(250,249,246,0.94) 40%, rgba(250,249,246,0.55) 70%, rgba(250,249,246,0.2) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-14 grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-miami-navy px-4 py-2 text-xs font-bold tracking-wide text-white">
                <Icon name="moon" className="h-3.5 w-3.5" /> {hero.badgeText}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-miami-mist bg-white px-4 py-1.5 text-xs font-semibold text-miami-navy shadow-sm">
                <Icon name="music" className="h-3.5 w-3.5 shrink-0" />
                <span className="leading-tight">
                  {hero.subBadgeTitle}
                  <br />
                  <span className="font-normal text-miami-navy/70">{hero.subBadgeSubtitle}</span>
                </span>
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-miami-navy">
              {(hero.title || "").split("\n").map((line: string, i: number, arr: string[]) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-lg text-miami-navy/70 text-base sm:text-lg leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-lg">
              {hero.features.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon name={item.icon as IconName} className="h-8 w-8 shrink-0 text-miami-gold" />
                  <div>
                    <div className="text-sm font-semibold text-miami-navy">{item.title}</div>
                    <div className="text-xs text-miami-navy/60">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="#tickets"
                className="btn btn-gold"
              >
                {hero.primaryCtaText}
              </Link>
              <Link
                href="#schedule"
                className="btn btn-outline-navy"
              >
                {hero.secondaryCtaText}
              </Link>
            </div>
            <div className="mt-7 flex items-center gap-3">
              <span className="flex items-center gap-0.5 text-miami-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" className="h-4 w-4" />
                ))}
              </span>
              <span className="font-bold text-miami-navy">{hero.ratingValue}</span>
              <span className="text-sm text-miami-navy/60">{hero.ratingText}</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-40 sm:h-52 lg:h-56 w-full rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={hero.backgroundImage || img("heroMain", 1200)}
                alt="The Miami Cruise & Boat Tour: Miami's skyline, Biscayne Bay, and guests on deck during a sunset sailing"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
            <span className="absolute -left-4 top-40 sm:top-48 z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-miami-goldBright to-miami-gold text-center text-miami-navy shadow-lg">
              <span className="text-[10px] font-bold tracking-wide">{hero.priceBadgeLabel}</span>
              <span className="text-xl font-extrabold leading-none">{hero.priceBadgeValue}</span>
              <span className="text-[9px] font-semibold tracking-wide">{hero.priceBadgeUnit}</span>
            </span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {HERO_COLLAGE.map((photo) => (
                <div
                  key={photo.key}
                  className="relative h-20 sm:h-24 lg:h-28 w-full rounded-2xl border-4 border-white overflow-hidden shadow"
                >
                  <Image
                    src={img(photo.key, 700)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-miami-mist bg-miami-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {trustBar.items.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <Icon name={item.icon as IconName} className="h-7 w-7 shrink-0 text-miami-gold" />
              <div>
                <div className="text-sm font-semibold text-miami-navy">{item.title}</div>
                <div className="text-xs text-miami-gray">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES / TICKETS */}
      <section id="tickets" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="section-head">
          <span className="eyebrow">{packagesSection.eyebrow}</span>
          <h2>{packagesSection.title}</h2>
          <p>{packagesSection.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
                pkg.highlighted ? "border-miami-gold shadow-lg ring-2 ring-miami-gold/50 sm:-translate-y-1" : "border-miami-mist hover:shadow-lg"
              }`}
            >
              <div className="relative h-48 w-full">
                <Image src={pkg.image} alt={pkg.imageAlt || pkg.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                {pkg.badge && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-miami-gold px-3 py-1 text-xs font-bold text-miami-navy shadow">
                    <Icon name="star" className="h-3 w-3" /> {pkg.badge}
                  </span>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-miami-navy shadow">
                  <Icon name="star" className="h-3.5 w-3.5 text-miami-gold" />
                  {pkg.rating}
                  <span className="font-medium text-miami-gray">({Number(pkg.reviews).toLocaleString()})</span>
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-miami-navy">{pkg.title}</h3>
                <p className="mt-2 text-sm text-miami-gray">{pkg.description}</p>
                <ul className="mt-3.5 space-y-1.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-miami-onyx">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-miami-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-miami-gray">
                  <Icon name="clock" className="h-4 w-4" /> {pkg.duration}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-miami-mist pt-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-miami-gray">From</div>
                    <div className="font-display text-2xl font-bold text-miami-navy">
                      {pkg.price}
                      <span className="text-xs font-normal text-miami-gray">/person</span>
                    </div>
                  </div>
                  <a
                    href={normalizeExternalUrl(pkg.url || "/contact")}
                    target={pkg.url && !pkg.url.startsWith("#") && !pkg.url.startsWith("/") ? "_blank" : undefined}
                    rel={pkg.url && !pkg.url.startsWith("#") && !pkg.url.startsWith("/") ? "noopener noreferrer sponsored" : undefined}
                    className="btn btn-gold !px-5 !py-2.5 text-xs"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMBOS */}
      <section className="border-y border-miami-mist bg-miami-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="section-head">
            <span className="eyebrow">{combosSection.eyebrow}</span>
            <h2>{combosSection.title}</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {combosSection.items.map((c) => (
              <div key={c.title} className="flex flex-col overflow-hidden rounded-2xl border border-miami-mist bg-white shadow-sm">
                <div className="relative h-36 w-full">
                  <Image src={c.image} alt={c.imageAlt || c.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display font-bold text-miami-navy">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-miami-gray">{c.description}</p>
                  <a
                    href={normalizeExternalUrl(c.url)}
                    className="btn btn-gold mt-4 w-fit !px-5 !py-2.5 text-xs"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE BREAKDOWN */}
      <section id="prices" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="section-head">
          <span className="eyebrow">{priceBreakdown.eyebrow}</span>
          <h2>{priceBreakdown.title}</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {priceBreakdown.items.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-2xl border border-miami-mist bg-white p-6">
              <Icon name={item.icon as IconName} className="h-8 w-8 shrink-0 text-miami-gold" />
              <div>
                <h3 className="font-display text-lg font-bold text-miami-navy">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-miami-gray">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS (dark) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-miami-navy to-miami-indigo text-white">
        <Image src={benefits.backgroundImage} alt="" fill sizes="100vw" quality={55} className="object-cover opacity-25" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-miami-navy/95 to-miami-indigo/90" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="section-head">
            <span className="eyebrow-dark">{benefits.eyebrow}</span>
            <h2 className="!text-white">{benefits.title}</h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {benefits.items.map((item) => (
              <div key={item.title}>
                <Icon name={item.icon as IconName} className="h-8 w-8 text-miami-goldBright" />
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlights" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="section-head">
          <span className="eyebrow">{highlights.eyebrow}</span>
          <h2>{highlights.title}</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-miami-mist bg-white p-6">
              <Icon name={item.icon as IconName} className="h-7 w-7 text-miami-gold" />
              <h3 className="mt-3 font-display font-bold text-miami-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-miami-gray">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-miami-gray/80">{highlights.footnote}</p>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="border-y border-miami-mist bg-miami-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <span className="eyebrow">{schedule.eyebrow}</span>
            <h2 className="mt-2.5 font-display text-2xl font-bold text-miami-navy">{schedule.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-miami-gray">{schedule.body}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-miami-navy">{schedule.tableTitle}</h2>
            <table className="mt-3 w-full overflow-hidden rounded-xl border border-miami-mist text-sm">
              <tbody>
                {schedule.rows.map((row, i) => (
                  <tr key={row.label} className={i < schedule.rows.length - 1 ? "border-b border-miami-mist" : ""}>
                    <td className="w-1/2 bg-miami-mist/40 px-4 py-3 font-semibold text-miami-navy">{row.label}</td>
                    <td className="px-4 py-3 text-miami-onyx">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-miami-gray">{schedule.note}</p>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">{location.eyebrow}</span>
            <h2 className="mt-2.5 font-display text-2xl font-bold text-miami-navy">{location.title}</h2>
            <div className="mt-4 flex flex-col gap-2 text-sm text-miami-onyx/85">
              <p>
                <strong className="text-miami-navy">Pier:</strong> {location.address}
              </p>
              <p>
                <strong className="text-miami-navy">Boarding time:</strong> {location.boardingTime}
              </p>
              <p>
                <strong className="text-miami-navy">Nearest tram:</strong> {location.metro}
              </p>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-miami-indigo to-miami-navy">
            <Image
              src={img("galleryHarbor")}
              alt="The Miami harbor near our departure marina"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* NEARBY */}
      <section className="border-y border-miami-mist bg-miami-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="section-head">
            <span className="eyebrow">{nearby.eyebrow}</span>
            <h2>{nearby.title}</h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {nearby.items.map((item) => (
              <div key={item.title} className="flex flex-col overflow-hidden rounded-2xl border border-miami-mist bg-white sm:flex-row">
                <div className="relative h-40 w-full sm:h-auto sm:w-40 sm:shrink-0">
                  <Image src={item.image} alt={item.title} fill sizes="200px" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-miami-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-miami-gray">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FROM THE BLOG */}
      {latestPosts.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="section-head">
                <span className="eyebrow">FROM THE BLOG</span>
                <h2>Miami Cruise &amp; Boat Tour Tips &amp; Guides</h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-miami-navy hover:text-miami-gold">
                View All Articles →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-miami-mist bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={getPostCoverImage(post)}
                      alt={post.cover_image_alt || post.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-xs text-miami-gray">
                      {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold leading-snug text-miami-navy">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-miami-gray">{post.excerpt}</p>
                    <span className="mt-3 text-sm font-semibold text-miami-navy">Read More »</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="border-y border-miami-mist bg-miami-ivory">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="section-head">
            <span className="eyebrow">{faq.eyebrow}</span>
            <h2>{faq.title}</h2>
          </div>
          <div className="mt-8">
            <FaqAccordion items={faq.items} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden text-white">
        <Image src={finalCta.backgroundImage} alt="" fill sizes="100vw" quality={60} className="object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-miami-navy/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="eyebrow-dark justify-center">{finalCta.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white">{finalCta.title}</h2>
          <p className="mx-auto mt-3.5 max-w-xl text-white/75">{finalCta.subtitle}</p>
          <a
            href={normalizeExternalUrl(packages?.[0]?.url || "/contact")}
            target={packages?.[0]?.url && !packages[0].url.startsWith("#") && !packages[0].url.startsWith("/") ? "_blank" : undefined}
            rel={packages?.[0]?.url && !packages[0].url.startsWith("#") && !packages[0].url.startsWith("/") ? "noopener noreferrer sponsored" : undefined}
            className="btn btn-gold mt-7"
          >
            {finalCta.ctaText}
          </a>
        </div>
      </section>
    </>
  );
}
