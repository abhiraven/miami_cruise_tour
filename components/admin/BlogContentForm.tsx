"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, Section, setPath } from "./FormFields";
import type { BlogPageContent } from "@/lib/blog-content";

export interface BlogContentFormProps {
  initialContent: BlogPageContent;
}

export default function BlogContentForm({ initialContent }: BlogContentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<BlogPageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(path: (string | number)[], value: unknown) {
    setContent((prev) => setPath(prev, path, value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! The Blog page is now updated.");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-miami-pearl/95 backdrop-blur border-b border-miami-mist flex items-center justify-between">
        <span className="text-xs text-miami-navy/50">
          {message || "Edit the fields below, then save."}
        </span>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-full bg-miami-navy px-6 py-2.5 text-sm font-bold text-white hover:bg-miami-gold hover:text-miami-navy transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <Section title="SEO" description="Search engine visibility for the Blog listing page" defaultOpen>
        <Field
          label="Page Title"
          value={content.seo?.title}
          onChange={(v) => update(["seo", "title"], v)}
          hint="Shown in Google & browser tabs — leave blank to use the default Blog page title, ~50–60 characters recommended."
        />
        <Field
          label="Meta Description"
          value={content.seo?.description}
          onChange={(v) => update(["seo", "description"], v)}
          textarea
          hint="Shown under the title in search results — leave blank to use the default description, ~150–160 characters recommended."
        />
        <Checkbox
          label="Hide this page from search engines (noindex, nofollow)"
          checked={content.seo?.noIndex}
          onChange={(v) => update(["seo", "noIndex"], v)}
          hint="Leave unchecked so Google can index and follow links on this page. Check it to keep it out of search results."
          confirmOnCheck="Hide this page from search engines? It will be set to noindex, nofollow."
          confirmOnUncheck="Make this page visible to search engines again? It will be set to index, follow."
        />
      </Section>
    </form>
  );
}
