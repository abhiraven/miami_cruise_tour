import Image from "next/image";
import type { Metadata } from "next";
import { getAboutContent } from "@/lib/about-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/about" },
    openGraph: { title: seo.title, description: seo.description },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const { hero, images, sections } = await getAboutContent();

  return (
    <div className="bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-miami-navy">{hero.title}</h1>
        <p className="mt-2 text-miami-gray max-w-2xl">{hero.subtitle}</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images
            .filter((image) => image.src)
            .map((image, i) => (
              <div key={i} className="relative h-56 w-full rounded-2xl overflow-hidden bg-miami-ivory">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
        </div>

        <div className="mt-10 max-w-4xl flex flex-col gap-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-display text-xl font-bold text-miami-navy">{section.title}</h3>
              <p className="mt-2 text-miami-gray leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
