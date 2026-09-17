import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import type { SiteChromeContent } from "@/lib/site-chrome-content";

export default function Footer({ chrome }: { chrome: SiteChromeContent }) {
  const { footer } = chrome;
  return (
    <footer className="mt-20 bg-miami-onyx text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm sm:grid-cols-2 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <BrandMark className="h-6 w-6 shrink-0 text-miami-gold" />
            <span className="font-display text-lg font-bold text-white">{footer.about.heading}</span>
          </div>
          <p className="text-white/60">{footer.about.text}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.heading}>
            <div className="mb-3 font-semibold text-white">{col.heading}</div>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-miami-goldBright">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 border-t border-white/10 py-4 text-center text-xs text-white/50 sm:flex-row sm:gap-4">
        <span>
          © {new Date().getFullYear()} {footer.copyright}
        </span>
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-miami-goldBright">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
