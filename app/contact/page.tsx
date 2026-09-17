import type { Metadata } from "next";
import Image from "next/image";
import Icon from "@/components/Icon";
import { getContactContent } from "@/lib/contact-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    openGraph: { title: seo.title, description: seo.description },
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function ContactPage() {
  const { hero, image, email, supportHours } = await getContactContent();

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-miami-navy">{hero.title}</h1>
        <p className="mt-2 max-w-2xl text-miami-gray">{hero.subtitle}</p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-miami-mist bg-white">
          <div className="relative h-56 w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="flex items-start gap-4">
              <Icon name="mail" className="h-10 w-10 shrink-0 text-miami-gold" />
              <div>
                <div className="text-lg font-semibold text-miami-navy">Email</div>
                <a
                  href={`mailto:${email}`}
                  className="break-all text-lg text-miami-indigo hover:text-miami-gold"
                >
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon name="clock" className="h-10 w-10 shrink-0 text-miami-gold" />
              <div>
                <div className="text-lg font-semibold text-miami-navy">Support Hours</div>
                <div className="text-lg text-miami-gray">{supportHours}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
