"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import type { SiteChromeContent } from "@/lib/site-chrome-content";
import type { ReactNode } from "react";

export default function SiteChrome({
  chrome,
  children,
}: {
  chrome: SiteChromeContent;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = typeof pathname === "string" && pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-miami-pearl">
      <Header chrome={chrome} />
      <main className="flex-1">{children}</main>
      <Footer chrome={chrome} />
      <MobileBookBar chrome={chrome} />
    </div>
  );
}
