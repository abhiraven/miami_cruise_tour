"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import BrandMark from "@/components/BrandMark";
import type { SiteChromeContent } from "@/lib/site-chrome-content";

export default function Header({ chrome }: { chrome: SiteChromeContent }) {
  const [open, setOpen] = useState(false);
  const { logo, navbar } = chrome;

  return (
    <header className="sticky top-0 z-50 border-b border-miami-mist bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 leading-none">
          <BrandMark className="h-11 w-11 shrink-0 text-miami-gold" />
          <span className="flex flex-col">
            <span className="font-display text-2xl font-bold text-miami-navy">
              {(logo?.mainText ?? "").replace(/\.$/, "")}
              {logo?.mainText && <span className="text-miami-gold">.</span>}
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-miami-gray">
              {logo?.subText ?? ""}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navbar?.items?.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs font-bold uppercase tracking-wider text-miami-navy/80 transition hover:text-miami-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-miami-mist text-miami-navy lg:hidden"
        >
          <Icon name={open ? "x" : "menu"} className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-miami-mist bg-white px-4 py-3 lg:hidden">
          {navbar?.items?.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-bold uppercase tracking-wide text-miami-navy/80 hover:bg-miami-mist/20 hover:text-miami-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
