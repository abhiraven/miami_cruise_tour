"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, Repeater, Section, setPath } from "./FormFields";
import type { PrivacyContent } from "@/lib/privacy-content";

export interface PrivacyContentFormProps {
  initialContent: PrivacyContent;
}

export default function PrivacyContentForm({ initialContent }: PrivacyContentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<PrivacyContent>(initialContent);
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
      const res = await fetch("/api/admin/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! The Privacy Policy page is now updated.");
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

      <Section title="Header" description="Eyebrow, headline, subtitle, and effective date at the top of the page" defaultOpen>
        <Field label="Eyebrow" value={content.hero?.eyebrow} onChange={(v) => update(["hero", "eyebrow"], v)} />
        <Field label="Headline" value={content.hero?.title} onChange={(v) => update(["hero", "title"], v)} />
        <Field
          label="Subtitle"
          value={content.hero?.subtitle}
          onChange={(v) => update(["hero", "subtitle"], v)}
          textarea
        />
        <Field
          label="Effective Date"
          value={content.effectiveDate}
          onChange={(v) => update(["effectiveDate"], v)}
          hint="Shown as plain text — update this yourself whenever you publish a change."
        />
        <Field
          label="Intro Paragraph"
          value={content.intro}
          onChange={(v) => update(["intro"], v)}
          textarea
        />
      </Section>

      <Section
        title="Policy Sections"
        description="Each item becomes a numbered section. In the Body field: leave a blank line between paragraphs, use **text** for bold, and start consecutive lines with '- ' to make a bullet list."
        defaultOpen
      >
        <Repeater
          items={content.sections}
          onChange={(v) => update(["sections"], v)}
          fields={[
            { key: "title", label: "Section Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
          addLabel="+ Add Section"
        />
      </Section>
    </form>
  );
}
