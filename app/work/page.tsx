import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { work } from "@/data/content";

export const metadata: Metadata = {
  title: "Work — Sambhav Mehta",
  description: "Where I've built: MongoDB, GI Partners, Alumni Ventures, Admit AI.",
};

export default function WorkPage() {
  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="01"
        label="Work"
        heading="Where I've built."
        eyebrow="Internships across AI product, data infrastructure, and early-stage startups."
      />

      <ol className="mt-16 md:mt-24 space-y-16 md:space-y-20">
        {work.map((entry, i) => (
          <li key={entry.company} className="reveal">
            <article className="grid gap-6 md:grid-cols-12 md:gap-10 border-t border-paper/10 pt-8">
              <header className="md:col-span-4">
                <p className="section-number">
                  {String(i + 1).padStart(2, "0")} / {entry.dates}
                </p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl leading-[1.02]">
                  {entry.company}
                </h2>
                <p className="mt-3 text-paper/85">{entry.role}</p>
                {entry.team ? (
                  <p className="mt-1 text-sm text-muted">{entry.team}</p>
                ) : null}
                <p className="mt-1 text-sm text-muted">{entry.location}</p>
              </header>

              <div className="md:col-span-8 md:pl-8 md:border-l md:border-paper/10">
                <ul className="space-y-4">
                  {entry.bullets.map((b, j) => (
                    <li key={j} className="flex gap-4 text-paper/90">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80"
                      />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
