import type { Metadata } from "next";
import { getPrivacyContent } from "@/lib/privacy-content";
import RichText from "@/components/RichText";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/privacy-policy" },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function PrivacyPolicyPage() {
  const { hero, effectiveDate, intro, sections } = await getPrivacyContent();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-miami-navy">{hero.title}</h1>
        <p className="mt-2 text-miami-gray">{hero.subtitle}</p>
        {effectiveDate && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-miami-gray/70">
            Effective Date: {effectiveDate}
          </p>
        )}

        {intro && <p className="mt-8 leading-relaxed text-miami-gray">{intro}</p>}

        <div className="mt-8 flex flex-col gap-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-lg font-bold text-miami-navy">
                {i + 1}. {section.title}
              </h2>
              <RichText
                text={section.body}
                className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-miami-gray"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
