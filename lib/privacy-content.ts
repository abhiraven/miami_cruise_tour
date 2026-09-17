import { getContent, saveContent } from "@/lib/content-store";

export interface PrivacySection {
  title: string;
  body: string;
}

export interface PrivacyContent {
  seo: { title: string; description: string; noIndex: boolean };
  hero: { eyebrow: string; title: string; subtitle: string };
  effectiveDate: string;
  intro: string;
  sections: PrivacySection[];
}

export const DEFAULT_PRIVACY_CONTENT: PrivacyContent = {
  seo: {
    title: "Privacy Policy | Miami Cruise & Boat Tour",
    description:
      "Privacy policy for the Miami Cruise & Boat Tour website — how we collect, use, and protect your information when you book a Miami boat tour.",
    noIndex: false,
  },
  hero: {
    eyebrow: "LEGAL",
    title: "Privacy Policy — Miami Cruise & Boat Tour",
    subtitle:
      "This page explains what information we collect when you visit the Miami Cruise & Boat Tour website, how we use it, and the choices you have.",
  },
  effectiveDate: "September 2026",
  intro:
    "Miami Cruise & Boat Tour (\"we,\" \"our,\" or \"us\") respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have when you visit this website. By using this site, you agree to the practices described below.",
  sections: [
    {
      title: "Information We Collect",
      body: "When you request a reservation, contact our team, or subscribe to updates about Miami Cruise & Boat Tour, we may collect:\n\n- Your name and email address\n- Your phone number\n- Your cruise date preference and number of guests\n- Any special requests you share with us",
    },
    {
      title: "How We Use Your Information",
      body: "We use the information you provide to:\n\n- Confirm reservations and respond to enquiries\n- Communicate departure details\n- Improve the booking experience on this website\n\nWe do not sell your personal information to third parties.",
    },
    {
      title: "Cookies",
      body: "This website may use cookies or similar local storage to remember your preferences and understand how visitors use the site. You can disable cookies in your browser settings, though some features may not work as intended.",
    },
    {
      title: "Third-Party Services",
      body: "Reservation requests submitted through this site are handled by our reservations team. We do not share your details with unrelated third parties except where required to fulfil your booking or comply with the law.",
    },
    {
      title: "Data Retention",
      body: "We retain reservation and contact information only as long as necessary to fulfil your booking, respond to your enquiry, and meet our legal and accounting obligations.",
    },
    {
      title: "Your Rights",
      body: "You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at reservations@miamicruisetour.com.",
    },
    {
      title: "Contact Us",
      body: "Questions about this privacy policy or how your information is handled can be sent to reservations@miamicruisetour.com or via our contact page.",
    },
  ],
};

export async function getPrivacyContent(): Promise<PrivacyContent> {
  return getContent("privacy", DEFAULT_PRIVACY_CONTENT);
}

export async function savePrivacyContent(content: PrivacyContent): Promise<void> {
  return saveContent("privacy", content);
}
