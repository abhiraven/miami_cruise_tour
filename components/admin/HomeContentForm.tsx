"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Field, ImageUploadField, Repeater, Section, setPath } from "./FormFields";
import { normalizeExternalUrl } from "@/lib/url";
import type { HomeContent } from "@/lib/home-content";

type PathSegment = string | number;

function slugify(text: unknown): string {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function HomeContentForm({ initialContent }: { initialContent: HomeContent }) {
  const router = useRouter();
  const [content, setContent] = useState<HomeContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(path: PathSegment[], value: unknown) {
    setContent((prev) => setPath(prev, path, value));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const packagesList: any[] = content.packages || (content as any).tours || [];
    const normalized: HomeContent = {
      ...content,
      packages: packagesList.map((p: any, i: number) => ({
        ...p,
        id: p.id || (slugify(p.title) ? `${slugify(p.title)}-${i}` : `package-${i}`),
        url: normalizeExternalUrl(p.url),
      })),
      combosSection: {
        ...content.combosSection,
        items: (content.combosSection?.items || []).map((c) => ({
          ...c,
          url: normalizeExternalUrl(c.url),
        })),
      },
    };
    setContent(normalized);

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to save changes.");
        return;
      }
      setMessage("Saved! Your homepage is now updated.");
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

      <Section title="SEO" description="Search engine visibility for the homepage" defaultOpen>
        <Field
          label="Page Title"
          value={content.seo?.title}
          onChange={(v) => update(["seo", "title"], v)}
          hint="Shown in Google & browser tabs — leave blank to use default, ~50–60 characters recommended."
        />
        <Field
          label="Meta Description"
          value={content.seo?.description}
          onChange={(v) => update(["seo", "description"], v)}
          textarea
          hint="Shown under the title in search results — ~150–160 characters recommended."
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

      <Section title="Dinner Cruise Packages" description="The bookable dinner cruise packages shown in the main section" defaultOpen>
        <Repeater
          items={content.packages || (content as any).tours}
          onChange={(v) => update(["packages"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "image", label: "Photo", type: "image", uploadType: "packages" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
            { key: "description", label: "Short Description (1-2 lines)", type: "textarea" },
            { key: "features", label: "Features (one per line)", type: "lines" },
            { key: "rating", label: "Rating (e.g. 4.9)" },
            { key: "reviews", label: "Review Count (e.g. 2340)" },
            { key: "price", label: "Price (e.g. €59)" },
            { key: "duration", label: "Duration (e.g. 3.5 hours · 19:30–23:00)" },
            { key: "badge", label: "Badge Text (optional, e.g. Most Popular)" },
            { key: "url", label: "Booking URL (e.g. /contact or booking link)" },
          ]}
          addLabel="+ Add Package"
        />
      </Section>

      <Section title="Hero Section" description="Top banner with headline, badges, and CTAs" defaultOpen>
        <Field label="Badge Text" value={content.hero?.badgeText} onChange={(v) => update(["hero", "badgeText"], v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Sub-badge Title" value={content.hero?.subBadgeTitle} onChange={(v) => update(["hero", "subBadgeTitle"], v)} />
          <Field label="Sub-badge Subtitle" value={content.hero?.subBadgeSubtitle} onChange={(v) => update(["hero", "subBadgeSubtitle"], v)} />
        </div>
        <Field
          label="Headline"
          value={content.hero?.title}
          onChange={(v) => update(["hero", "title"], v)}
          textarea
          hint="Press Enter for a line break, same as it appears on the page."
        />
        <Field label="Subtitle" value={content.hero?.subtitle} onChange={(v) => update(["hero", "subtitle"], v)} textarea />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Primary Button Text" value={content.hero?.primaryCtaText} onChange={(v) => update(["hero", "primaryCtaText"], v)} />
          <Field label="Secondary Button Text" value={content.hero?.secondaryCtaText} onChange={(v) => update(["hero", "secondaryCtaText"], v)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rating Value" value={content.hero?.ratingValue} onChange={(v) => update(["hero", "ratingValue"], v)} />
          <Field label="Rating Text" value={content.hero?.ratingText} onChange={(v) => update(["hero", "ratingText"], v)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Price Badge Label" value={content.hero?.priceBadgeLabel} onChange={(v) => update(["hero", "priceBadgeLabel"], v)} />
          <Field label="Price Badge Value" value={content.hero?.priceBadgeValue} onChange={(v) => update(["hero", "priceBadgeValue"], v)} />
          <Field label="Price Badge Unit" value={content.hero?.priceBadgeUnit} onChange={(v) => update(["hero", "priceBadgeUnit"], v)} />
        </div>
        <div>
          <div className="text-xs font-semibold text-miami-navy/70 mb-2">Feature Grid (4 items)</div>
          <Repeater
            items={content.hero?.features}
            onChange={(v) => update(["hero", "features"], v)}
            fields={[
              { key: "icon", label: "Icon name (e.g. music, glass, landmark, anchor)" },
              { key: "title", label: "Title" },
              { key: "body", label: "Body" },
            ]}
          />
        </div>
        <div className="mt-3">
          <ImageUploadField
            label="Background Photo (hero backdrop)"
            value={content.hero?.backgroundImage}
            onChange={(v) => update(["hero", "backgroundImage"], v)}
            uploadType="site"
            altValue={content.hero?.backgroundImageAlt}
            onAltChange={(v) => update(["hero", "backgroundImageAlt"], v)}
            altLabel="Alt Text (for accessibility & SEO)"
          />
        </div>
        <div className="mt-4">
          <div className="text-xs font-semibold text-miami-navy/70 mb-2">Hero Collage Photos (the 4 small tiles next to the main hero photo)</div>
          <Repeater
            items={content.hero?.collage}
            onChange={(v) => update(["hero", "collage"], v)}
            fields={[
              { key: "image", label: "Photo", type: "image", uploadType: "site" },
              { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
            ]}
            addLabel="+ Add Collage Photo"
          />
        </div>
      </Section>

      <Section title="Trust Bar" description="Strip of trust badges below the hero">
        <Repeater
          items={content.trustBar?.items}
          onChange={(v) => update(["trustBar", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (e.g. shield, anchor, music, check-circle)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body" },
          ]}
        />
      </Section>

      <Section title="Packages Section Intro" description="Heading above the cruise packages">
        <Field label="Eyebrow" value={content.packagesSection?.eyebrow} onChange={(v) => update(["packagesSection", "eyebrow"], v)} />
        <Field label="Title" value={content.packagesSection?.title} onChange={(v) => update(["packagesSection", "title"], v)} />
        <Field label="Subtitle" value={content.packagesSection?.subtitle} onChange={(v) => update(["packagesSection", "subtitle"], v)} textarea />
      </Section>

      <Section title="Combo Offer Cards" description="Bundled experiences and add-ons" defaultOpen>
        <Field label="Eyebrow" value={content.combosSection?.eyebrow} onChange={(v) => update(["combosSection", "eyebrow"], v)} />
        <Field label="Title" value={content.combosSection?.title} onChange={(v) => update(["combosSection", "title"], v)} />
        <Repeater
          items={content.combosSection?.items}
          onChange={(v) => update(["combosSection", "items"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "image", label: "Photo", type: "image", uploadType: "combos" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
            { key: "description", label: "Description", textarea: true },
            { key: "url", label: "Booking URL (e.g. /contact or affiliate link)" },
          ]}
          addLabel="+ Add Combo Card"
        />
      </Section>

      <Section title="Price Breakdown" description="Explainer cards of what's included">
        <Field label="Eyebrow" value={content.priceBreakdown?.eyebrow} onChange={(v) => update(["priceBreakdown", "eyebrow"], v)} />
        <Field label="Title" value={content.priceBreakdown?.title} onChange={(v) => update(["priceBreakdown", "title"], v)} />
        <Repeater
          items={content.priceBreakdown?.items}
          onChange={(v) => update(["priceBreakdown", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (e.g. anchor, glass, music, landmark)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
      </Section>

      <Section title="Benefits Section" description="Evening experience highlights block">
        <Field label="Eyebrow" value={content.benefits?.eyebrow} onChange={(v) => update(["benefits", "eyebrow"], v)} />
        <Field label="Title" value={content.benefits?.title} onChange={(v) => update(["benefits", "title"], v)} />
        <ImageUploadField
          label="Background Photo"
          value={content.benefits?.backgroundImage}
          onChange={(v) => update(["benefits", "backgroundImage"], v)}
          uploadType="site"
          altValue={content.benefits?.backgroundImageAlt}
          onAltChange={(v) => update(["benefits", "backgroundImageAlt"], v)}
          altLabel="Alt Text (for accessibility & SEO)"
        />
        <Repeater
          items={content.benefits?.items}
          onChange={(v) => update(["benefits", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (e.g. moon, sparkles, glass)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
      </Section>

      <Section title="Highlights Section" description="Featured inclusions and highlights">
        <Field label="Eyebrow" value={content.highlights?.eyebrow} onChange={(v) => update(["highlights", "eyebrow"], v)} />
        <Field label="Title" value={content.highlights?.title} onChange={(v) => update(["highlights", "title"], v)} />
        <Repeater
          items={content.highlights?.items}
          onChange={(v) => update(["highlights", "items"], v)}
          fields={[
            { key: "icon", label: "Icon (e.g. sunset, glass, music, landmark)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
          ]}
        />
        <Field label="Footnote" value={content.highlights?.footnote} onChange={(v) => update(["highlights", "footnote"], v)} />
      </Section>

      <Section title="Schedule & Departure Times" description="Boarding and departure schedule">
        <Field label="Eyebrow" value={content.schedule?.eyebrow} onChange={(v) => update(["schedule", "eyebrow"], v)} />
        <Field label="Title" value={content.schedule?.title} onChange={(v) => update(["schedule", "title"], v)} />
        <Field label="Body" value={content.schedule?.body} onChange={(v) => update(["schedule", "body"], v)} textarea />
        <Field label="Table Title" value={content.schedule?.tableTitle} onChange={(v) => update(["schedule", "tableTitle"], v)} />
        <Repeater
          items={content.schedule?.rows}
          onChange={(v) => update(["schedule", "rows"], v)}
          fields={[
            { key: "label", label: "Label (e.g. Boarding, Departure)" },
            { key: "value", label: "Time / Details (e.g. 19:00, 19:30)" },
          ]}
          addLabel="+ Add Schedule Row"
        />
        <Field label="Note" value={content.schedule?.note} onChange={(v) => update(["schedule", "note"], v)} textarea />
      </Section>

      <Section title="Location & Pier Details" description="Meeting point and boarding address">
        <Field label="Eyebrow" value={content.location?.eyebrow} onChange={(v) => update(["location", "eyebrow"], v)} />
        <Field label="Title" value={content.location?.title} onChange={(v) => update(["location", "title"], v)} />
        <Field label="Address" value={content.location?.address} onChange={(v) => update(["location", "address"], v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Boarding Time" value={content.location?.boardingTime} onChange={(v) => update(["location", "boardingTime"], v)} />
          <Field label="Nearest Metro / Tram" value={content.location?.metro} onChange={(v) => update(["location", "metro"], v)} />
        </div>
        <div className="mt-3">
          <ImageUploadField
            label="Photo (shown beside the meeting point details)"
            value={content.location?.image}
            onChange={(v) => update(["location", "image"], v)}
            uploadType="site"
            altValue={content.location?.imageAlt}
            onAltChange={(v) => update(["location", "imageAlt"], v)}
            altLabel="Alt Text (for accessibility & SEO)"
          />
        </div>
      </Section>

      <Section title="Nearby Attractions" description="More ways to experience Miami">
        <Field label="Eyebrow" value={content.nearby?.eyebrow} onChange={(v) => update(["nearby", "eyebrow"], v)} />
        <Field label="Title" value={content.nearby?.title} onChange={(v) => update(["nearby", "title"], v)} />
        <Repeater
          items={content.nearby?.items}
          onChange={(v) => update(["nearby", "items"], v)}
          fields={[
            { key: "title", label: "Title" },
            { key: "body", label: "Body", textarea: true },
            { key: "image", label: "Photo", type: "image", uploadType: "site" },
            { key: "imageAlt", label: "Photo Alt Text (for accessibility & SEO)" },
          ]}
        />
      </Section>

      <Section title="FAQ" description="Frequently asked questions accordion">
        <Field label="Eyebrow" value={content.faq?.eyebrow} onChange={(v) => update(["faq", "eyebrow"], v)} />
        <Field label="Title" value={content.faq?.title} onChange={(v) => update(["faq", "title"], v)} />
        <Repeater
          items={content.faq?.items}
          onChange={(v) => update(["faq", "items"], v)}
          fields={[
            { key: "q", label: "Question" },
            { key: "a", label: "Answer", type: "richtext", uploadType: "site" },
          ]}
          addLabel="+ Add Question"
        />
      </Section>

      <Section title="Final CTA" description="Closing call-to-action banner">
        <Field label="Eyebrow" value={content.finalCta?.eyebrow} onChange={(v) => update(["finalCta", "eyebrow"], v)} />
        <Field label="Title" value={content.finalCta?.title} onChange={(v) => update(["finalCta", "title"], v)} />
        <Field label="Subtitle" value={content.finalCta?.subtitle} onChange={(v) => update(["finalCta", "subtitle"], v)} textarea />
        <Field label="Button Text" value={content.finalCta?.ctaText} onChange={(v) => update(["finalCta", "ctaText"], v)} />
        <ImageUploadField
          label="Background Photo"
          value={content.finalCta?.backgroundImage}
          onChange={(v) => update(["finalCta", "backgroundImage"], v)}
          uploadType="site"
          altValue={content.finalCta?.backgroundImageAlt}
          onAltChange={(v) => update(["finalCta", "backgroundImageAlt"], v)}
          altLabel="Alt Text (for accessibility & SEO)"
        />
      </Section>

      <div className="pb-10" />
    </form>
  );
}
