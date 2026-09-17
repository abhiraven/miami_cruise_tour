"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SVGProps } from "react";
import LogoutButton from "./LogoutButton";
import type { AdminPageKey } from "@/lib/admin-pages";

function IconDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function IconDocument(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 20c0-3.45 2.8-6 6.25-6s6.25 2.55 6.25 6" />
      <path d="M16.5 5.75a3.25 3.25 0 0 1 0 6.42" />
      <path d="M18.75 14.5c2.35.55 3.5 2.5 3.5 5.5" />
    </svg>
  );
}

function IconInfo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-2.5Z" />
      <path d="m9.25 12 2 2 3.5-3.75" />
    </svg>
  );
}

function IconLayout(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="4" rx="1.2" />
      <rect x="3" y="10.5" width="18" height="4" rx="1.2" />
      <rect x="3" y="17" width="18" height="4" rx="1.2" />
    </svg>
  );
}

function IconRss(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5.5" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M4 11.5a8.5 8.5 0 0 1 8.5 8.5" />
      <path d="M4 5.5A14.5 14.5 0 0 1 18.5 20" />
    </svg>
  );
}

interface NavItem {
  href: string;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  pageKey: AdminPageKey | null;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: IconDashboard, pageKey: "dashboard" },
  { href: "/admin/home", label: "Home Page", Icon: IconHome, pageKey: "home" },
  { href: "/admin/about", label: "About Page", Icon: IconInfo, pageKey: "about" },
  { href: "/admin/contact", label: "Contact Page", Icon: IconMail, pageKey: "contact" },
  { href: "/admin/privacy", label: "Privacy Policy", Icon: IconShield, pageKey: "privacy" },
  { href: "/admin/site-chrome", label: "Navbar & Footer", Icon: IconLayout, pageKey: "site-chrome" },
  { href: "/admin/blog", label: "Blog Page", Icon: IconRss, pageKey: "blog" },
  { href: "/admin/posts", label: "Blog Posts", Icon: IconDocument, pageKey: "posts" },
  { href: "/admin/users", label: "Users", Icon: IconUsers, pageKey: null },
];

function isActive(pathname: string | null, item: NavItem): boolean {
  if (item.href === "/admin/posts") {
    return pathname === "/admin/posts" || /^\/admin\/posts\/[^/]+\/edit$/.test(pathname || "");
  }
  return pathname === item.href;
}

export interface AdminSidebarProps {
  username: string;
  role: string;
  permissions: string[];
}

export default function AdminSidebar({ username, role, permissions }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = role === "admin";
  const visibleItems = NAV_ITEMS.filter(
    (item) => item.pageKey === null || isAdmin || (permissions || []).includes(item.pageKey)
  );

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-4">
        <Link href="/admin/dashboard" className="font-display text-lg font-bold text-white">
          Miami Cruise & Boat Tour Admin
        </Link>
        <div className="mt-1 truncate text-sm text-white/50">{username}</div>
      </div>

      <nav className="mt-2 flex flex-col gap-1 px-3">
        {visibleItems.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold transition-colors ${
                active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between px-5 py-6">
        <span className="text-sm text-white/40">Signed in</span>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-14 items-center justify-between bg-miami-navy px-4 lg:hidden">
        <Link href="/admin/dashboard" className="font-display font-bold text-white">
          Admin Panel
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="text-2xl leading-none text-white"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-miami-navy">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-xl text-white"
              aria-label="Close menu"
            >
              ✕
            </button>
            {navContent}
          </div>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-miami-navy lg:block">
        {navContent}
      </aside>
    </>
  );
}
