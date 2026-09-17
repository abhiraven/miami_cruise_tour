"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import type { SiteChromeContent } from "@/lib/site-chrome-content";

export default function MobileBookBar({ chrome }: { chrome: SiteChromeContent }) {
  const [visible, setVisible] = useState(false);
  const bar = chrome.mobileBookBar;

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="flex items-center gap-3 border-t border-miami-mist bg-white px-4 py-3 shadow-[0_-8px_28px_rgba(15,45,74,0.14)]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-miami-navy to-miami-indigo">
          {bar?.image ? (
            <Image src={bar.image} alt={bar.imageAlt || ""} fill sizes="44px" className="object-cover" />
          ) : (
            <Icon name="anchor" className="h-5 w-5 text-miami-goldBright" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-miami-navy">{bar?.title}</div>
          <div className="mt-0.5 text-xs text-miami-gray">{bar?.subtitle}</div>
        </div>
        <Link href="/#tickets" className="btn btn-gold !px-5 !py-2.5 text-xs">
          {bar?.ctaLabel || "Book Now"}
        </Link>
      </div>
    </div>
  );
}
