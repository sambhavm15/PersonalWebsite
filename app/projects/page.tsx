import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import { projects, awards } from "@/data/content";

export const metadata: Metadata = {
  title: "Projects & Leadership — Sambhav Mehta",
  description: "Things I've made and led — Diamond Consulting, Blue Origin, awards.",
};

export default function ProjectsPage() {
  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="02"
        label="Projects & Leadership"
        heading="Things I've made and led."
        eyebrow="A student consultancy, a space program, and a few things I'm proud of along the way."
      />

      <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-2 md:gap-10">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className="reveal card-hover group relative flex flex-col rounded-sm border border-paper/10 bg-paper/[0.02] p-8 md:p-10 hover:border-accent/40"
          >
            <div className="flex items-baseline justify-between">
              <p className="section-number">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                {p.dates}
              </p>
            </div>

            <h2 className="mt-6 font-display text-3xl md:text-4xl leading-[1.05] group-hover:text-accent transition-colors">
              {p.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{p.role}</p>

            <ul className="mt-6 space-y-3 text-paper/85">
              {p.bullets.map((b, j) => (
                <li key={j} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-3 shrink-0 bg-accent/80"
                  />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mt-24 md:mt-32">
        <div className="reveal grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <p className="section-number">02.a / Awards</p>
          </div>
          <h2 className="md:col-span-8 font-display text-3xl md:text-4xl leading-[1.05]">
            A little hardware.
          </h2>
        </div>

        <ul className="reveal mt-8 grid gap-4 md:grid-cols-2">
          {awards.map((a) => (
            <li
              key={a.title}
              className="flex items-start gap-4 border-l-2 border-accent bg-paper/[0.03] p-6"
            >
              <span aria-hidden className="text-2xl">
                {a.emoji}
              </span>
              <p className="text-paper/90">{a.title}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
