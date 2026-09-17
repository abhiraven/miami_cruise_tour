"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, ImageUploadField, Section, setPath } from "./FormFields";
import type { ContactContent } from "@/lib/contact-content";

export interface ContactContentFormProps {
  initialContent: ContactContent;
}

export default function ContactContentForm({ initialContent }: ContactContentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<ContactContent>(initialContent);
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
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! The Contact page is now updated.");
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
          {message || "Edit any section below, then save."}
        </span>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-full bg-miami-navy px-6 py-2.5 text-sm font-bold text-white hover:bg-miami-gold hover:text-miami-navy transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <Section title="SEO" description="Page title and search-result description" defaultOpen>
        <Field label="Page Title" value={content.seo?.title} onChange={(v) => update(["seo", "title"], v)} />
        <Field
          label="Meta Description"
          value={content.seo?.description}
          onChange={(v) => update(["seo", "description"], v)}
          textarea
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

      <Section title="Header" description="Eyebrow, headline, and subtitle at the top of the page" defaultOpen>
        <Field label="Eyebrow" value={content.hero?.eyebrow} onChange={(v) => update(["hero", "eyebrow"], v)} />
        <Field label="Headline" value={content.hero?.title} onChange={(v) => update(["hero", "title"], v)} />
        <Field
          label="Subtitle"
          value={content.hero?.subtitle}
          onChange={(v) => update(["hero", "subtitle"], v)}
          textarea
        />
      </Section>

      <Section title="Photo" description="The photo shown above the contact details" defaultOpen>
        <ImageUploadField
          label="Photo"
          value={content.image?.src}
          onChange={(v) => update(["image", "src"], v)}
          uploadType="contact"
        />
        <Field label="Alt Text" value={content.image?.alt} onChange={(v) => update(["image", "alt"], v)} />
      </Section>

      <Section title="Contact Details" description="Email address and support hours" defaultOpen>
        <Field label="Email Address" value={content.email} onChange={(v) => update(["email"], v)} />
        <Field label="Support Hours" value={content.supportHours} onChange={(v) => update(["supportHours"], v)} />
      </Section>
    </form>
  );
}
