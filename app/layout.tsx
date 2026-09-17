import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Jost } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSiteChromeContent } from "@/lib/site-chrome-content";
import { img } from "@/lib/images";

// next/font/google self-hosts the font files at build time (no runtime
// request to fonts.googleapis.com, no render-blocking stylesheet, no
// layout shift) and exposes each as a CSS variable that tailwind.config.ts
// resolves through font-display / font-sans.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.miamicruisetour.com"),
  title: "Miami Cruise & Boat Tour 2026 | Sunset Sailings, Yacht Charters & Sightseeing Cruises",
  description:
    "Book a Miami Cruise & Boat Tour — sightseeing cruises past Biscayne Bay's celebrity homes and skyline, live-DJ sunset party cruises, and private yacht charters. Reserve your Miami boat tour online today.",
  openGraph: {
    title: "Miami Cruise & Boat Tour 2026 | Sunset Sailings, Yacht Charters & Sightseeing Cruises",
    description:
      "Cruise Biscayne Bay aboard a Miami Cruise & Boat Tour — sightseeing, sunset party sailings with a live DJ, and private yacht charters past Miami's skyline and celebrity homes.",
    type: "website",
    images: [img("heroMain")],
  },
};

// The root layout fetches the admin-editable navbar/footer content on every
// request and threads it down through SiteChrome — which is why every page
// under it needs to render dynamically rather than being statically
// generated at build time (see the "force-dynamic" export on each page).
export const dynamic = "force-dynamic";

// This site's GA4 measurement ID — hardcoded rather than pulled from
// NEXT_PUBLIC_GA_ID so tracking works out of the box without needing that
// env var configured in every deploy environment.
// Placeholder until a real Miami Cruise & Boat Tour GA4 property ID is
// provided -- do not reuse another site's measurement ID here.
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // A transient DB hiccup here shouldn't take the whole site down with it —
  // getSiteChromeContent() already falls back to defaults internally, but
  // wrap defensively anyway since this runs on every single page.
  let chrome;
  try {
    chrome = await getSiteChromeContent();
  } catch (err) {
    console.error("[RootLayout] getSiteChromeContent() failed, using defaults:", err);
    const { DEFAULT_SITE_CHROME_CONTENT } = await import("@/lib/site-chrome-content");
    chrome = DEFAULT_SITE_CHROME_CONTENT;
  }

  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <SiteChrome chrome={chrome}>{children}</SiteChrome>
      </body>
    </html>
  );
}
