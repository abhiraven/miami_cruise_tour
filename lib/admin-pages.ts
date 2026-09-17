import type { AdminSession } from "@/lib/auth-server";

// Catalog of admin sections that page access can be granted for. Admins
// always have full access to everything regardless of this list — it only
// restricts editors. The Users page isn't in here: every logged-in account
// can view it and change its own password, independent of page permissions.
export const ADMIN_PAGES = [
  { key: "dashboard", label: "Dashboard", description: "Overview stats and recent posts" },
  { key: "home", label: "Home Page", description: "Edit homepage content, sections, and packages" },
  { key: "about", label: "About Page", description: "Edit the About Us page text" },
  { key: "contact", label: "Contact Page", description: "Edit the Contact Us page text and details" },
  { key: "privacy", label: "Privacy Policy", description: "Edit the Privacy Policy page" },
  { key: "site-chrome", label: "Navbar & Footer", description: "Edit the logo, top navigation, and footer" },
  { key: "blog", label: "Blog Page", description: "Edit the Blog listing page's SEO title and description" },
  { key: "posts", label: "Blog Posts", description: "Create, edit, and publish blog posts" },
] as const;

export type AdminPageKey = (typeof ADMIN_PAGES)[number]["key"];

export function hasPageAccess(session: AdminSession | null, pageKey: AdminPageKey): boolean {
  if (!session) return false;
  if (session.role === "admin") return true;
  return Array.isArray(session.permissions) && session.permissions.includes(pageKey);
}
