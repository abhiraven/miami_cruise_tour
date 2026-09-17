import { img } from "@/lib/images";
import { getContent, saveContent } from "@/lib/content-store";

export interface HeroFeature {
  icon: string;
  title: string;
  body: string;
}

export interface PackageItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  features: string[];
  rating: string;
  reviews: string;
  price: string;
  duration: string;
  badge: string;
  highlighted?: boolean;
  url: string;
}

export interface IconTextItem {
  icon: string;
  title: string;
  body: string;
}

export interface ComboItem {
  title: string;
  image: string;
  imageAlt?: string;
  description: string;
  url: string;
}

export interface PriceBreakdownItem {
  icon: string;
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface HomeContent {
  seo: {
    title: string;
    description: string;
    noIndex: boolean;
  };
  hero: {
    badgeText: string;
    subBadgeTitle: string;
    subBadgeSubtitle: string;
    title: string;
    subtitle: string;
    features: HeroFeature[];
    primaryCtaText: string;
    secondaryCtaText: string;
    ratingValue: string;
    ratingText: string;
    priceBadgeLabel: string;
    priceBadgeValue: string;
    priceBadgeUnit: string;
    backgroundImage: string;
  };
  trustBar: { items: IconTextItem[] };
  packagesSection: { eyebrow: string; title: string; subtitle: string };
  packages: PackageItem[];
  combosSection: { eyebrow: string; title: string; items: ComboItem[] };
  priceBreakdown: { eyebrow: string; title: string; items: PriceBreakdownItem[] };
  benefits: { eyebrow: string; title: string; backgroundImage: string; items: IconTextItem[] };
  highlights: { eyebrow: string; title: string; items: IconTextItem[]; footnote: string };
  schedule: {
    eyebrow: string;
    title: string;
    body: string;
    tableTitle: string;
    rows: { label: string; value: string }[];
    note: string;
  };
  location: {
    eyebrow: string;
    title: string;
    address: string;
    boardingTime: string;
    metro: string;
  };
  nearby: { eyebrow: string; title: string; items: { title: string; body: string; image: string }[] };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  finalCta: { eyebrow: string; title: string; subtitle: string; ctaText: string; backgroundImage: string };
}

// Full editable copy for every section of the homepage. This is the
// fallback used whenever the database has no saved edits yet (fresh
// install) or is missing a field that was added after someone already
// saved custom content once.
export const DEFAULT_HOME_CONTENT: HomeContent = {
  seo: {
    title: "Miami Cruise & Boat Tour 2026 | Sunset Sailings, Yacht Charters & Sightseeing Cruises",
    description:
      "Book a Miami Cruise & Boat Tour — sightseeing cruises past Biscayne Bay's celebrity homes and skyline, live-DJ sunset party cruises, and private yacht charters. Reserve your Miami boat tour online today.",
    noIndex: false,
  },

  hero: {
    badgeText: "#1 RATED BOAT TOUR",
    subBadgeTitle: "LIVE DJ & DRINKS INCLUDED",
    subBadgeSubtitle: "Daily departures from Miami's Marina",
    title: "Miami Cruise & Boat Tour — See Miami From the Water",
    subtitle:
      "Cruise across Biscayne Bay past Miami's glittering skyline, Star Island's celebrity mansions, and the open Atlantic aboard a Miami cruise & boat tour built for sightseeing, sunset views, and time on the water — with sightseeing, sunset party, and private yacht options for every kind of day on the bay.",
    features: [
      { icon: "anchor", title: "Biscayne Bay Sightseeing", body: "Skyline & celebrity homes" },
      { icon: "music", title: "Live DJ & Drinks", body: "On every sunset cruise" },
      { icon: "sunset", title: "Golden-Hour Views", body: "Miami's skyline at sunset" },
      { icon: "shield", title: "Free Cancellation", body: "Up to 24 hours before departure" },
    ],
    primaryCtaText: "Book Your Miami Cruise & Boat Tour",
    secondaryCtaText: "See Today's Departure Times",
    ratingValue: "4.9",
    ratingText: "3,150+ guests have sailed with us",
    priceBadgeLabel: "Today",
    priceBadgeValue: "$49",
    priceBadgeUnit: "per person",
    backgroundImage: img("heroMain"),
  },

  trustBar: {
    items: [
      { icon: "shield", title: "Free Cancellation", body: "Up to 24 hours before departure" },
      { icon: "anchor", title: "Coast Guard-Certified Boats", body: "A safety-checked fleet & licensed crew" },
      { icon: "music", title: "Live DJ On Sunset Cruises", body: "Included with every sunset sailing" },
      { icon: "check-circle", title: "Best Price Guarantee", body: "Book your Miami boat tour online" },
    ],
  },

  packagesSection: {
    eyebrow: "TODAY'S DEPARTURES",
    title: "Book Your Miami Cruise & Boat Tour",
    subtitle:
      "Choose the package that fits your day on the water — every option sails Biscayne Bay past Miami's skyline and celebrity homes.",
  },

  packages: [
    {
      id: "miami-sightseeing-boat-tour",
      title: "Miami Sightseeing Boat Tour",
      description: "An easygoing narrated cruise across Biscayne Bay past the Miami skyline, Star Island, and celebrity mansions.",
      image: img("galleryHarbor"),
      imageAlt: "Aerial view of the Miami harbor where the Miami Sightseeing Boat Tour departs",
      features: ["Live narrated tour", "Skyline & celebrity home views", "Open-air seating", "Free cancellation"],
      rating: "4.8",
      reviews: "1180",
      price: "$39",
      duration: "90 minutes · Daily departures",
      badge: "",
      url: "/contact",
    },
    {
      id: "miami-sunset-party-cruise",
      title: "Miami Sunset Party Cruise",
      description: "A live DJ, a drinks package, and front-row views of Miami's skyline turning gold over Biscayne Bay.",
      image: img("galleryDeck"),
      imageAlt: "Guests enjoying drinks and music on deck during the Miami Sunset Party Cruise",
      features: ["Live DJ & dance deck", "Drinks package included", "Prime sunset viewing", "Free cancellation"],
      rating: "4.9",
      reviews: "2150",
      price: "$59",
      duration: "2 hours · Sails before sunset",
      badge: "Most Popular",
      highlighted: true,
      url: "/contact",
    },
    {
      id: "private-yacht-charter-experience",
      title: "Private Yacht Charter Experience",
      description: "Your own private yacht and captain, a bottle of champagne, and a route built around what you want to see.",
      image: img("galleryMarina"),
      imageAlt: "A private yacht docked at a Miami marina, available for the Private Yacht Charter Experience",
      features: ["Private yacht & captain", "Champagne included", "Custom route & timing", "Professional photo package"],
      rating: "4.9",
      reviews: "430",
      price: "$399",
      duration: "2–4 hours · Flexible scheduling",
      badge: "",
      url: "/contact",
    },
  ],

  combosSection: {
    eyebrow: "COMPLETE YOUR DAY",
    title: "Pair Your Boat Tour With More of Miami",
    items: [
      {
        title: "Beach Day to Sunset Cruise Combo",
        image: img("gallerySkyline"),
        description: "Spend the afternoon on South Beach, then join us on the water as the sky turns gold over the bay.",
        url: "/contact",
      },
      {
        title: "Miami City & Art Deco Tour",
        image: img("galleryMarina"),
        description: "A guided drive past South Beach's Art Deco district before boarding your Miami cruise & boat tour.",
        url: "/contact",
      },
      {
        title: "Everglades Airboat Add-On",
        image: img("galleryDeck"),
        description: "Extend your Miami trip with an airboat ride through the Everglades on the same day.",
        url: "/contact",
      },
    ],
  },

  priceBreakdown: {
    eyebrow: "WHAT'S INCLUDED",
    title: "Miami Cruise & Boat Tour — Price Breakdown",
    items: [
      { icon: "anchor", title: "Coast Guard-Certified Boats", body: "Every Miami cruise & boat tour sails on a licensed, safety-checked vessel with a certified captain and crew." },
      { icon: "music", title: "Live DJ & Drinks", body: "Sunset and party cruise packages include a live DJ, a dance deck, and a drinks package for the full sailing." },
      { icon: "landmark", title: "Skyline & Celebrity Home Views", body: "Sail past downtown Miami's skyline, Star Island, and the waterfront mansions lining Biscayne Bay." },
      { icon: "sunset", title: "Golden-Hour Departure Times", body: "Sunset sailings are timed so the skyline turns gold right as your cruise reaches open water." },
    ],
  },

  benefits: {
    eyebrow: "THE ON-THE-WATER EXPERIENCE",
    title: "Why Guests Choose Our Miami Boat Tour",
    backgroundImage: img("benefitsBg"),
    items: [
      { icon: "sparkles", title: "Miami's Best Skyline View", body: "There's no better way to see Miami's skyline, Star Island, and Biscayne Bay than from the water — no daytime walking tour compares." },
      { icon: "music", title: "Live DJ & Party Atmosphere", body: "Our sunset cruises bring the energy of a Miami night out onto the water, with a live DJ and a full drinks package." },
      { icon: "moon", title: "Golden-Hour Photography", body: "Sunset departures are timed so you catch Miami's skyline lit up in gold and pink from the open water." },
    ],
  },

  highlights: {
    eyebrow: "WHAT'S INCLUDED",
    title: "Highlights of the Miami Cruise & Boat Tour",
    items: [
      { icon: "landmark", title: "Biscayne Bay Sightseeing", body: "Sail past downtown Miami's skyline, Star Island, and celebrity waterfront homes." },
      { icon: "music", title: "Live DJ & Drinks", body: "A live DJ and a drinks package on every sunset and party cruise." },
      { icon: "sunset", title: "Sunset Departures", body: "Timed sailings so you catch the skyline turning gold at golden hour." },
      { icon: "anchor", title: "Certified Boats & Crew", body: "A safety-checked fleet with licensed captains for every package." },
    ],
    footnote: "Route and drinks package may vary seasonally and by weather conditions.",
  },

  schedule: {
    eyebrow: "WHEN TO SAIL",
    title: "The Best Way to See Miami From the Water",
    body: "Boarding begins about 30 minutes before departure at our Miami marina, so you have time to settle in before we pull away from the dock. Sunset cruises are timed to reach open water right as the sky begins to turn gold, so the Miami skyline, Star Island, and the bay stay lit up for the whole sailing — the same view our guests describe as the highlight of their Miami cruise & boat tour.",
    tableTitle: "Today's Departure Times",
    rows: [
      { label: "Sightseeing Cruise", value: "10:00 AM, 1:00 PM, 3:30 PM" },
      { label: "Sunset Party Cruise", value: "Departs 45 min before sunset" },
      { label: "Boarding", value: "30 minutes before departure" },
      { label: "Private Yacht Charter", value: "By appointment, any time" },
    ],
    note: "Departure times are local (Miami, Eastern Time) and sunset sailings shift slightly with the season.",
  },

  location: {
    eyebrow: "MEETING POINT",
    title: "Where to Board Your Miami Cruise & Boat Tour",
    address: "Bayside Marketplace Marina, Downtown Miami (confirmed on your ticket)",
    boardingTime: "30 minutes before departure",
    metro: "Metromover Bayfront Park station",
  },

  nearby: {
    eyebrow: "MORE OF MIAMI",
    title: "More Ways to Experience Miami",
    items: [
      { title: "Everglades Airboat Tour", body: "An adrenaline-filled airboat ride through the Everglades, about an hour from downtown Miami.", image: img("galleryDeck") },
      { title: "South Beach Art Deco Walking Tour", body: "Explore the pastel-colored Art Deco architecture along Ocean Drive on foot.", image: img("gallerySkyline") },
    ],
  },

  faq: {
    eyebrow: "GOOD TO KNOW",
    title: "Miami Cruise & Boat Tour — FAQ",
    items: [
      { q: "What is included in the Miami Cruise & Boat Tour?", a: "Every package includes a Coast Guard-certified boat and crew, and views of Miami's skyline and Biscayne Bay. Sunset and party cruise packages add a live DJ and a drinks package; the private yacht charter adds champagne and a custom route." },
      { q: "What time does the Miami boat tour depart?", a: "Sightseeing cruises depart several times daily; the Sunset Party Cruise departs about 45 minutes before sunset so the skyline is lit up gold for the full sailing. Private yacht charters can be booked by appointment." },
      { q: "What should I wear on the boat tour?", a: "Casual, comfortable clothing and flat, non-marking shoes are best. Bring sunglasses and sunscreen for daytime sailings, and a light layer for the breeze once the sun goes down." },
      { q: "Is the Miami cruise suitable for children?", a: "Yes — the Sightseeing Boat Tour and Private Yacht Charter are family-friendly. The Sunset Party Cruise, with its DJ and drinks package, is best suited to adults." },
      { q: "Can I cancel or reschedule my Miami boat tour?", a: "Yes — free cancellation is available up to 24 hours before your scheduled departure for a full refund." },
      { q: "Where does the boat depart from?", a: "All public cruises depart from our marina at Bayside Marketplace in downtown Miami. The exact dock and boarding instructions are confirmed on your ticket." },
      { q: "How long is the Miami Cruise & Boat Tour?", a: "The Sightseeing Boat Tour runs about 90 minutes, the Sunset Party Cruise about 2 hours, and Private Yacht Charters run 2–4 hours depending on the route you choose." },
    ],
  },

  finalCta: {
    eyebrow: "TODAY ONLY",
    title: "Your Spot on the Water Is Waiting",
    subtitle: "Seats for today's Miami Cruise & Boat Tour are limited — reserve now and watch Miami's skyline light up from the bay.",
    ctaText: "Reserve Your Miami Cruise & Boat Tour",
    backgroundImage: img("finalCtaBg"),
  },
};

export async function getHomeContent(): Promise<HomeContent> {
  return getContent("home", DEFAULT_HOME_CONTENT);
}

export async function saveHomeContent(content: HomeContent): Promise<void> {
  return saveContent("home", content);
}
