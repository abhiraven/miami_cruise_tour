import { img } from "@/lib/images";
import { getContent, saveContent } from "@/lib/content-store";

export interface ContactContent {
  seo: { title: string; description: string; noIndex: boolean };
  hero: { eyebrow: string; title: string; subtitle: string };
  image: { src: string; alt: string };
  email: string;
  supportHours: string;
}

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  seo: {
    title: "Contact Us | Miami Cruise & Boat Tour",
    description:
      "Questions about your Miami Cruise & Boat Tour? Contact our team about today's departure times, group bookings, or your reservation for a Biscayne Bay boat tour.",
    noIndex: false,
  },
  hero: {
    eyebrow: "Contact Us",
    title: "Questions About Today's Miami Cruise & Boat Tour?",
    subtitle: "Our team can help with departure times, group bookings, and anything else before you book.",
  },
  image: {
    src: img("galleryDeck", 1000),
    alt: "Guests relaxing on the open deck during the Miami Cruise & Boat Tour",
  },
  email: "reservations@miamicruisetour.com",
  supportHours: "Every day, 8:00 am – 8:00 pm Eastern Time",
};

export async function getContactContent(): Promise<ContactContent> {
  return getContent("contact", DEFAULT_CONTACT_CONTENT);
}

export async function saveContactContent(content: ContactContent): Promise<void> {
  return saveContent("contact", content);
}
