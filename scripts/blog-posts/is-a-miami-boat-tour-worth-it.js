// Blog post definition: "Is a Miami Boat Tour Worth It?".
// Seeded by scripts/seed-post.js (idempotent upsert by slug).
//
// Images: free-licence Unsplash photos (https://unsplash.com/license) from the
// curated set in lib/images.ts (aboutBanner, heroMain, finalCtaBg — not used by
// other posts), hotlinked from the images.unsplash.com CDN; nothing uploaded.
// No captions on purpose: lib/sanitize-post-content.ts strips <figure> and
// <figcaption>, so captions would render as loose text on /blog/[slug].
//
// Facts cross-checked against operator listings for Biscayne Bay cruises
// (Headout / Musement, Oct 2026). No prices or timetables are stated.

const SITE = "https://www.miamicruisetour.com";
const GYG = (path) => `https://www.getyourguide.com/miami-l176/${path}/?partner_id=6WVF80I&utm_medium=online_publisher&cmp=vacayin-miamicruise`;
const SIGHTSEEING_URL = GYG("miami-biscayne-bay-millionaire-s-homes-sightseeing-cruise-t643959");
const SUNSET_URL = GYG("miami-biscayne-bay-sunset-boat-cruise-millionaire-homes-t476714");
const PRIVATE_URL = GYG("miami-private-yacht-cruise-with-captain-and-soft-drinks-t1123703");

const ext = (href, text) => `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`;
const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`;

module.exports = {
  title: "Is a Miami Boat Tour Worth It? What You Get and Who It Suits",
  slug: "is-a-miami-boat-tour-worth-it",
  focusKeyword: "Miami boat tour worth it",
  seo_title: "Is a Miami Boat Tour Worth It? Honest Pros & Cons",
  meta_description:
    "Is a Miami boat tour worth it? See what you get on a Biscayne Bay cruise, the pros and cons, who it suits best and how to choose the right tour.",
  excerpt: "Skyline views, Millionaire’s Row and a breeze off Biscayne Bay: here’s when a Miami boat tour is worth it, and when it might not be.",
  category: "Cruise Tips",
  cover_color: "navy",
  featured: 0,
  images: {
    cover: {
      url: unsplash("1740486028433-85c66230f78f", 1200),
      alt: "Miami waterfront apartment buildings and a sailboat on calm turquoise water under a clear blue sky",
    },
    skyline: {
      url: unsplash("1741023705528-2953cb652705", 1200, 800),
      alt: "Miami’s high-rise skyline and palm trees seen across the water on a bright, sunny day",
    },
    sunrise: {
      url: unsplash("1586234221629-d391ac1db4db", 1200, 800),
      alt: "Two people watching the sun rise over Biscayne Bay beneath dramatic clouds",
    },
  },
  content: `<p>Miami is a city built around the water, so it’s no surprise that boat tours are one of its most popular activities. But with beaches, nightlife and great food competing for your time, is a cruise really worth it? If you’re wondering whether a <strong>Miami boat tour is worth it</strong>, this guide covers what you actually get, the pros and cons, and who will enjoy it most.</p>
<h2>What Do You Get on a Miami Boat Tour?</h2>
<p>Most sightseeing cruises explore Biscayne Bay, often for around 75 to 90 minutes. Many leave from Bayside Marketplace in downtown Miami, although departure points vary, so always check your ticket.</p>
<p>Along the way, you’ll typically see:</p>
<ul><li><p>the downtown skyline from the water</p></li><li><p>Millionaire’s Row and exclusive islands such as Star Island and Fisher Island</p></li><li><p>the cruise ships at PortMiami</p></li><li><p>views of the causeways and the Miami Beach shoreline</p></li></ul>
<p>Many cruises include live commentary, and some have a bar on board.</p>
{{image:skyline}}
<h2>Why a Miami Boat Tour Is Worth It</h2>
<h3>You see a side of Miami you can’t reach on foot</h3>
<p>The islands and waterfront mansions of Biscayne Bay are best seen from the water. A cruise lets you take in places that are private or hard to reach by land.</p>
<h3>It’s easy and relaxing</h3>
<p>There’s no driving, no parking hunt at every stop and no long walks in the heat. You simply sit back, feel the breeze and enjoy the views.</p>
<h3>It works for almost everyone</h3>
<p>Couples, families, first-time visitors and groups of friends can all enjoy a short cruise. For something special, a ${ext(PRIVATE_URL, "private yacht cruise with a captain")} suits celebrations.</p>
<h2>When It Might Not Be Worth It</h2>
<ul><li><p><strong>You get seasick easily.</strong> Even bay cruises can feel a little choppy on windy days.</p></li><li><p><strong>You’ve already done a similar cruise.</strong> Most sightseeing routes cover similar highlights.</p></li><li><p><strong>The weather is poor.</strong> Some cruises run rain or shine, and haze or heavy rain can spoil the views.</p></li><li><p><strong>Your ticket is non-refundable.</strong> Some tickets can’t be cancelled, so check before you book.</p></li></ul>
{{image:sunrise}}
<h2>Which Miami Boat Tour Is Best Value?</h2>
<p>For a first visit, a ${ext(SIGHTSEEING_URL, "Biscayne Bay sightseeing cruise")} gives you the classic highlights. If photos are your priority, a ${ext(SUNSET_URL, "sunset boat cruise")} adds golden-hour light. Read our guide to the <a href="${SITE}/blog/best-time-to-book-miami-sunset-cruise">best time to book a Miami sunset cruise</a> to plan ahead.</p>
<h2>Tips to Get the Most From Your Cruise</h2>
<ul><li><p>Arrive early to check in, as operators often ask for 30 to 45 minutes.</p></li><li><p>Bring sunscreen, sunglasses and a light layer for the breeze.</p></li><li><p>Sit on the open deck for the best photos, if there’s space.</p></li></ul>
<p>For booking and boarding details, read our <a href="${SITE}/blog/miami-boat-tour-tickets-booking-guide">Miami boat tour tickets guide</a>.</p>
<h2>Frequently Asked Questions</h2>
<h3>Is a Miami boat tour good for families?</h3>
<p>Yes. Short sightseeing cruises are easy to fit into a family day, though check each operator’s rules on strollers and young children.</p>
<h3>Is a Miami boat tour worth it on a short trip?</h3>
<p>Often, yes. A 90-minute cruise is one of the quickest ways to see many of Miami’s waterfront highlights.</p>
<h2>The Verdict</h2>
<p>For most visitors, a Miami boat tour is worth it: it’s relaxing, easy to plan and shows you a side of the city you can’t see from the street. When you’re ready, <a href="${SITE}/#tickets">compare Miami boat tours</a> and pick the cruise that suits your trip.</p>`,
};
