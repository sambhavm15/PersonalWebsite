import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import CaseStudy from "@/components/case-study/CaseStudy";
import { caseStudies } from "@/data/caseStudies";
import { work } from "@/data/content";

export const metadata: Metadata = {
  title: "Work — Sambhav Mehta",
  description:
    "Interactive case studies: MongoDB's Central SKU Platform, GI Partners' RAG deal-intelligence agent, and Alumni Ventures' AI CRM.",
};

export default function WorkPage() {
  const admit = work.find((w) => w.company === "Admit AI");

  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-28">
      <SectionHeader
        number="01"
        label="Work"
        heading="Where I've built."
        eyebrow="Three product internships, rebuilt from their one-pagers into interactive case studies. Scroll, or jump in."
      />

      {/* index / overview */}
      <nav aria-label="Case study index" className="reveal mt-14 md:mt-20">
        <ol className="divide-y divide-paper/10 border-y border-paper/10">
          {caseStudies.map((cs, i) => (
            <li key={cs.slug}>
              <a
                href={`#${cs.slug}`}
                className="group grid grid-cols-12 items-baseline gap-3 py-5 transition-colors"
              >
                <span className="col-span-2 font-mono text-xs text-muted md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 font-display text-2xl leading-tight group-hover:text-accent transition-colors md:col-span-4 md:text-3xl">
                  {cs.company}
                </span>
                <span className="col-span-9 col-start-3 text-sm text-muted md:col-span-5 md:col-start-auto">
                  {cs.product}
                </span>
                <span className="col-span-3 col-start-10 text-right text-xs uppercase tracking-[0.15em] text-muted md:col-span-2">
                  {cs.dates}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* case studies, most recent first */}
      <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
        {caseStudies.map((cs, i) => (
          <CaseStudy key={cs.slug} study={cs} index={i} />
        ))}
      </div>

      {/* Admit AI — compact closing entry (no one-pager) */}
      {admit ? (
        <section className="reveal mt-24 border-t border-paper/15 pt-16 md:mt-32">
          <div className="grid gap-6 md:grid-cols-12">
            <header className="md:col-span-4">
              <p className="section-number">Also — {admit.dates}</p>
              <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                {admit.company}
              </h3>
              <p className="mt-3 text-paper/85">{admit.role}</p>
              {admit.team ? (
                <p className="mt-1 text-sm text-muted">{admit.team}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted">{admit.location}</p>
            </header>
            <ul className="md:col-span-8 space-y-4 md:border-l md:border-paper/10 md:pl-8">
              {admit.bullets.map((b, j) => (
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
        </section>
      ) : null}
    </div>
  );
}
