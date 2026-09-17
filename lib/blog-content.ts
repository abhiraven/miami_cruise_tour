import { getContent, saveContent } from "@/lib/content-store";

export interface BlogPageContent {
  seo: { title: string; description: string; noIndex: boolean };
  hero: { eyebrow: string; title: string; subtitle: string };
}

export const DEFAULT_BLOG_CONTENT: BlogPageContent = {
  seo: {
    title: "Boat Tour Tips & Miami on the Water | Miami Cruise & Boat Tour",
    description:
      "Guides and tips for your Miami Cruise & Boat Tour — what to wear, when to book, and the best of Miami from the water.",
    noIndex: false,
  },
  hero: {
    eyebrow: "The Journal",
    title: "Tips & Guides for Your Miami Cruise & Boat Tour",
    subtitle: "Everything you need to know before you board today's Miami Cruise & Boat Tour.",
  },
};

export async function getBlogContent(): Promise<BlogPageContent> {
  return getContent("blog", DEFAULT_BLOG_CONTENT);
}

export async function saveBlogContent(content: BlogPageContent): Promise<void> {
  return saveContent("blog", content);
}
