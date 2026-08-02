import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { skills } from "@/data/content";

export const metadata: Metadata = {
  title: "Toolkit — Sambhav Mehta",
  description: "Languages, data & ML, product & design, platforms.",
};

export default function SkillsPage() {
  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="03"
        label="Toolkit"
        heading="What I work with."
        eyebrow="Tools sharpen thinking. Here's what usually ends up on my desk."
      />

      <div className="mt-16 md:mt-24 grid gap-10 md:grid-cols-2 md:gap-14">
        {skills.map((group, i) => (
          <section
            key={group.label}
            className="reveal border-t border-paper/10 pt-8"
          >
            <header className="flex items-baseline justify-between">
              <h2 className="font-display text-3xl md:text-4xl">{group.label}</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
            </header>

            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <span className="inline-flex items-center rounded-full border border-paper/15 bg-paper/[0.02] px-4 py-2 text-sm text-paper/90 transition-colors duration-300 hover:border-accent hover:text-accent">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
