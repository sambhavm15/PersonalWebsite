import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SectionHeader from "@/components/SectionHeader";
import Gallery from "@/components/Gallery";
import { about, gallery } from "@/data/content";

export const metadata: Metadata = {
  title: "About — Sambhav Mehta",
  description: "Beyond the résumé: photography, cooking, art, and how it all connects.",
};

export default function AboutPage() {
  const hasRealImage = gallery.map((img) =>
    existsSync(join(process.cwd(), "public", img.src.replace(/^\//, "")))
  );

  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="04"
        label="About"
        heading="Beyond the résumé."
        eyebrow="A builder and a maker — with a camera never far away."
      />

      <div className="mt-16 md:mt-24 grid gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7 md:col-start-2">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`reveal text-paper/90 leading-[1.85] ${
                i === 0
                  ? "font-display text-2xl md:text-3xl leading-[1.35] text-paper"
                  : "text-lg mt-6"
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <section className="mt-24 md:mt-32">
        <div className="reveal grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <p className="section-number">04.a / Gallery</p>
            <p className="mt-3 text-sm text-muted">
              A small collection. Click any frame to enlarge — arrow keys to
              browse, escape to close.
            </p>
          </div>
          <h2 className="md:col-span-8 font-display text-3xl md:text-5xl leading-[1.05]">
            Notes on light.
          </h2>
        </div>

        <div className="mt-10 md:mt-14">
          <Gallery images={gallery} hasRealImage={hasRealImage} />
        </div>
      </section>
    </div>
  );
}
