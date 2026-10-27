// Blog post definition: "Miami Boat Tour Tickets: Booking, Boarding and What You'll See".
// Seeded by scripts/seed-post.js (idempotent upsert by slug).
//
// Images follow this site's existing convention (lib/images.ts): free-licence
// Unsplash photos (https://unsplash.com/license) from the curated Miami set,
// hotlinked from the images.unsplash.com CDN — nothing is uploaded to storage.
// Inline images are written as {{image:<key>}} placeholders.
//
// NOTE: no captions on purpose. lib/sanitize-post-content.ts does not allow
// <figure>/<figcaption>, so a caption would render on /blog/[slug] as loose,
// unstyled text after the image. Alt text is kept on every image.

const SITE = "https://www.miamicruisetour.com";
const GYG = (path) => `https://www.getyourguide.com/miami-l176/${path}/?partner_id=6WVF80I&utm_medium=online_publisher&cmp=vacayin-miamicruise`;
const SIGHTSEEING_URL = GYG("miami-biscayne-bay-millionaire-s-homes-sightseeing-cruise-t643959");
const SUNSET_URL = GYG("miami-biscayne-bay-sunset-boat-cruise-millionaire-homes-t476714");
const KAYAK_URL = GYG("miami-biscayne-bay-ultimate-boat-tour-with-kayak-experience-t1043052");
const PRIVATE_URL = GYG("miami-private-yacht-cruise-with-captain-and-soft-drinks-t1123703");

const ext = (href, text) => `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`;
const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`;

module.exports = {
  title: "Miami Boat Tour Tickets: Booking, Boarding and What You’ll See",
  slug: "miami-boat-tour-tickets-booking-guide",
  focusKeyword: "Miami boat tour tickets", // no focus-keyword column in this schema; kept for reference
  secondaryKeywords: ["Biscayne Bay cruise", "Millionaire’s Row", "how to book a Miami boat tour"],
  seo_title: "Miami Boat Tour Tickets: Booking, Boarding & Sights",
  meta_description:
    "Buying Miami boat tour tickets? Compare Biscayne Bay cruise types, learn how check-in and boarding work, and see what to expect on the water.",
  excerpt: "Sightseeing, sunset, kayak or private yacht? How to choose, book and board your Biscayne Bay cruise without surprises.",
  category: "Booking Guide",
  cover_color: "navy",
  featured: 0,
  images: {
    cover: {
      unsplashId: "1722937293268-62237f5e5435",
      url: unsplash("1722937293268-62237f5e5435", 1200),
      alt: "Aerial view of a Miami harbor lined with boats beside a causeway, with Biscayne Bay and the skyline beyond",
    },
    marina: {
      unsplashId: "1666965387106-c14338edfd4c",
      url: unsplash("1666965387106-c14338edfd4c", 1200, 800),
      alt: "Boats moored at a Miami marina on Biscayne Bay under a soft sunrise sky",
    },
    islands: {
      unsplashId: "1643067938575-1ead33f78e38",
      url: unsplash("1643067938575-1ead33f78e38", 1200, 800),
      alt: "Aerial view over Biscayne Bay showing its residential islands, PortMiami and Miami Beach",
    },
  },
  content: `<p>Seeing Miami from Biscayne Bay is one of the easiest ways to take in the skyline, the islands and the city’s famous waterfront homes. With so many cruises on offer, though, choosing and using <strong>Miami boat tour tickets</strong> can be confusing. This guide covers the main cruise types, how check-in and boarding work, and what you’ll see once you’re on the water.</p>
<h2>Which Miami Boat Tour Should You Book?</h2>
<h3>Sightseeing cruises</h3>
<p>A classic ${ext(SIGHTSEEING_URL, "Biscayne Bay sightseeing cruise")} is the simplest choice for a first visit. Many sightseeing cruises run for around 75 to 90 minutes, often with live commentary.</p>
<h3>Sunset cruises</h3>
<p>A ${ext(SUNSET_URL, "sunset boat cruise")} adds golden-hour views of the skyline. Departure times move with the season, so read our guide to the <a href="${SITE}/blog/best-time-to-book-miami-sunset-cruise">best time to book a Miami sunset cruise</a>.</p>
<h3>Active and private options</h3>
<p>For something different, a ${ext(KAYAK_URL, "boat tour with a kayak experience")} gets you closer to the water, while a ${ext(PRIVATE_URL, "private yacht cruise with a captain")} suits celebrations and small groups.</p>
<h2>How to Book a Miami Boat Tour</h2>
<p>Booking online in advance is the easiest option, especially for sunset sailings and weekends. After booking, you’ll usually receive a voucher by email. Read it carefully, because it confirms the exact check-in point, the time to arrive and any ID requirements.</p>
<p>Check the cancellation policy before you pay. Some cruises offer a full refund up to 24 hours before departure, while other tickets can’t be cancelled or rescheduled.</p>
{{image:marina}}
<h2>Check-In and Boarding</h2>
<p>Many Biscayne Bay sightseeing cruises leave from Bayside Marketplace in downtown Miami, but not all do, so follow your voucher. A few practical points help:</p>
<ul><li><p><strong>Arrive early.</strong> Operators commonly ask guests to arrive 30 to 45 minutes before departure, and check-in can close shortly before the boat leaves.</p></li><li><p><strong>Have your voucher ready</strong> on your phone, along with photo ID if your listing asks for it.</p></li><li><p><strong>Budget for parking</strong> if you drive, as it’s usually not included.</p></li></ul>
<h2>What You’ll See on a Biscayne Bay Cruise</h2>
<p>Routes vary, but sightseeing cruises typically pass the downtown skyline, the exclusive islands along Millionaire’s Row, such as Star Island and Fisher Island, and the cruise ships at PortMiami. On a clear day, you’ll also see the bay’s causeways and the Miami Beach shoreline.</p>
{{image:islands}}
<h2>What to Know Before You Go</h2>
<ul><li><p><strong>Food and drinks</strong> are often sold on board rather than included, so check your listing.</p></li><li><p><strong>Alcohol</strong> is only served to guests aged 21 or over with valid ID.</p></li><li><p><strong>Accessibility</strong> differs by boat. Some are wheelchair accessible, while others only accept folding wheelchairs.</p></li><li><p><strong>Weather:</strong> some cruises run rain or shine, so check the forecast and pack sunscreen. Not sure what to pack? See <a href="${SITE}/blog/what-to-wear-miami-boat-tour">what to wear on a Miami boat tour</a>.</p></li></ul>
<h2>Frequently Asked Questions</h2>
<h3>Can I buy Miami boat tour tickets at the dock?</h3>
<p>Sometimes, but sunset and weekend cruises can sell out, so booking ahead is safer.</p>
<h3>How long is a Biscayne Bay cruise?</h3>
<p>Many sightseeing cruises last about 75 to 90 minutes. Longer packages are also available.</p>
<h2>Ready to Set Sail?</h2>
<p>With the right ticket, an early arrival and a little sunscreen, a Biscayne Bay cruise is one of Miami’s most relaxing experiences. When you’re ready, <a href="${SITE}/#tickets">compare Miami boat tour tickets</a> and choose the sailing that suits your plans.</p>`,
};
