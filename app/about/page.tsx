import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { about } from "@/data/content";

export const metadata: Metadata = {
  title: "About — Sambhav Mehta",
  description: "Beyond the résumé: photography, cooking, art, and how it all connects.",
};

export default function AboutPage() {
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

          <div className="reveal mt-10">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 text-accent"
            >
              <span className="link-underline">See the photography & art</span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <aside className="reveal md:col-span-3">
          <div className="border-t border-paper/10 pt-6">
            <p className="section-number">Off the clock</p>
            <ul className="mt-4 space-y-3 text-sm text-paper/85">
              <li className="flex items-baseline gap-3">
                <span aria-hidden className="text-accent">✦</span> Night photography
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden className="text-accent">✦</span> Drawing &amp; sketching
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden className="text-accent">✦</span> Cooking &amp; new recipes
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden className="text-accent">✦</span> Rock climbing &amp; boxing
              </li>
              <li className="flex items-baseline gap-3">
                <span aria-hidden className="text-accent">✦</span> Getting lost in museums
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
