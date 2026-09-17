import { getContent, saveContent } from "@/lib/content-store";
import { img } from "@/lib/images";

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

export interface SiteChromeContent {
  logo: { mainText?: string; subText?: string };
  navbar: { items: NavItem[] };
  footer: {
    about: { heading: string; text: string };
    columns: FooterColumn[];
    copyright: string;
  };
  mobileBookBar: {
    image: string;
    imageAlt: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
  };
}

export const DEFAULT_SITE_CHROME_CONTENT: SiteChromeContent = {
  logo: { mainText: "Miami Cruise.", subText: "& Boat Tour" },
  navbar: {
    items: [
      { label: "MIAMI CRUISE & BOAT TOUR", href: "/" },
      { label: "CRUISE PACKAGES", href: "/#tickets" },
      { label: "ABOUT US", href: "/about" },
      { label: "BLOG", href: "/blog" },
      { label: "CONTACT US", href: "/contact" },
    ],
  },
  footer: {
    about: {
      heading: "Miami Cruise.",
      text: "Miami Cruise & Boat Tour is your independent guide to sightseeing cruises, sunset sailings, and private yacht charters on Biscayne Bay — see the skyline, celebrity homes, and open water the way Miami is meant to be seen.",
    },
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "Packages", href: "/#tickets" },
          { label: "Highlights", href: "/#highlights" },
          { label: "Departure Times", href: "/#schedule" },
          { label: "Meeting Point", href: "/#location" },
          { label: "FAQ", href: "/#faq" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Blog", href: "/blog" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ],
      },
    ],
    copyright: "Miami Cruise & Boat Tour. All rights reserved.",
  },
  mobileBookBar: {
    image: img("galleryDeck", 120, 70),
    imageAlt: "A guest relaxing on the open deck during a Miami boat tour",
    title: "Miami Cruise & Boat Tour",
    subtitle: "From €59 · 4.9 ★ (2,340)",
    ctaLabel: "Book Now",
  },
};

export async function getSiteChromeContent(): Promise<SiteChromeContent> {
  return getContent("site-chrome", DEFAULT_SITE_CHROME_CONTENT);
}

export async function saveSiteChromeContent(content: SiteChromeContent): Promise<void> {
  return saveContent("site-chrome", content);
}
