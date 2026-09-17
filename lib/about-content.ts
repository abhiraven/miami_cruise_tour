import { getContent, saveContent } from "@/lib/content-store";
import { img } from "@/lib/images";

export interface AboutContent {
  seo: { title: string; description: string; noIndex: boolean };
  hero: { eyebrow: string; title: string; subtitle: string };
  images: { src: string; alt: string }[];
  sections: { title: string; body: string }[];
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  seo: {
    title: "About Us | Miami Cruise & Boat Tour",
    description:
      "Learn about the team behind Miami Cruise & Boat Tour — Biscayne Bay sightseeing cruises, sunset party sailings, and private yacht charters departing from downtown Miami.",
    noIndex: false,
  },
  hero: {
    eyebrow: "About Us",
    title: "The Story Behind Miami Cruise & Boat Tour",
    subtitle: "A Miami day built around the skyline, the open bay, and time on the water.",
  },
  images: [
    { src: img("galleryHarbor", 700), alt: "Aerial view of the Miami harbor where our boats depart" },
    { src: img("galleryMarina", 700), alt: "A marina dock lined with boats in Miami" },
    { src: img("gallerySkyline", 700), alt: "Miami's skyline seen from across the bay during the day" },
  ],
  sections: [
    {
      title: "A Day on the Water, Not Just a Sightseeing Trip",
      body: "Miami Cruise & Boat Tour was built around one idea: Miami looks completely different from Biscayne Bay. Where a car or a walking tour shows you the city from the outside, a boat tour puts you right in the middle of it — the downtown skyline rising out of the water, Star Island's celebrity mansions along the shoreline, and the open Atlantic just past the causeway. We work with a small fleet of Coast Guard-certified boats departing from a marina in downtown Miami, pairing sightseeing cruises with live-DJ sunset sailings and private yacht charters, so there's a way to spend a day on the water that fits whatever kind of trip you're having.",
    },
    {
      title: "Our Promise",
      body: "Whether you book the Sightseeing Boat Tour, the Sunset Party Cruise, or a Private Yacht Charter, every guest gets the same thing: a certified boat, a licensed crew, and a clear view of Miami from the water. We keep group sizes comfortable and departures on schedule, so the only thing you have to plan is what to wear.",
    },
    {
      title: "Sunset-First Design",
      body: "Our sunset departures are timed around golden hour, not a fixed clock — so the skyline is turning gold right as your cruise reaches open water, instead of after the light is already gone.",
    },
    {
      title: "Real Boats, Real Crews",
      body: "Every vessel in our fleet is Coast Guard-certified and crewed by a licensed captain, whether you're on a 90-minute sightseeing cruise or a private yacht charter built around your own route.",
    },
  ],
};

export async function getAboutContent(): Promise<AboutContent> {
  return getContent("about", DEFAULT_ABOUT_CONTENT);
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  return saveContent("about", content);
}
