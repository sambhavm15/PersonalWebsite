import Link from "next/link";
import HeroImage from "@/components/HeroImage";
import RotatingWord from "@/components/RotatingWord";
import SocialIcons from "@/components/SocialIcons";
import { hero } from "@/data/content";

export default function HomePage() {
  return (
    <>
      <section className="container-editorial pt-14 md:pt-24 pb-24 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="reveal section-number">00 / Sambhav Mehta</p>

            <h1 className="reveal mt-6 font-display text-hero">
              <span className="block text-muted text-2xl md:text-3xl not-italic font-normal mb-3">
                {hero.greeting}
              </span>
              <span className="block">{hero.name}</span>
              <span className="mt-2 block text-4xl md:text-6xl leading-[1.02]">
                {hero.prefix}{" "}
                <RotatingWord words={hero.descriptors} />
              </span>
            </h1>

            <p className="reveal mt-10 max-w-xl text-lg leading-relaxed text-paper/85">
              {hero.intro}
            </p>
            <p className="reveal mt-3 max-w-xl text-sm text-muted">
              {hero.subline}
            </p>

            <div className="reveal mt-10 flex flex-wrap items-center gap-6">
              <a
                href={hero.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 text-ink font-medium transition-transform duration-300 ease-editorial hover:-translate-y-0.5"
              >
                {hero.ctaLabel}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <SocialIcons />
            </div>
          </div>

          <div className="md:col-span-5">
            <HeroImage />
          </div>
        </div>
      </section>

      <section className="border-y border-paper/10 bg-paper/[0.02]">
        <div className="container-editorial py-8 md:py-10">
          <div className="reveal flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <span className="section-number shrink-0">Currently</span>
            <p className="text-paper/85 text-base md:text-lg">
              {hero.currently}
            </p>
          </div>
        </div>
      </section>

      <section className="container-editorial py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="reveal section-number">Table of contents</p>
            <p className="reveal mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
              Four ways to <em className="not-italic text-accent">read</em> this
              site.
            </p>
          </div>
          <ul className="md:col-span-7 divide-y divide-paper/10 border-y border-paper/10">
            {[
              { n: "01", label: "Work", href: "/work", note: "The résumé, but with context." },
              { n: "02", label: "Projects", href: "/projects", note: "Things I've made and led." },
              { n: "03", label: "Skills", href: "/skills", note: "What I actually use." },
              { n: "04", label: "About", href: "/about", note: "Beyond the résumé — with a camera." },
            ].map((row) => (
              <li key={row.href} className="reveal group">
                <Link
                  href={row.href}
                  className="grid grid-cols-12 items-baseline gap-4 py-6 transition-colors"
                >
                  <span className="col-span-2 text-xs uppercase tracking-[0.2em] text-muted">
                    {row.n}
                  </span>
                  <span className="col-span-6 md:col-span-5 font-display text-2xl md:text-3xl group-hover:text-accent transition-colors">
                    {row.label}
                  </span>
                  <span className="col-span-4 md:col-span-4 text-sm text-muted">
                    {row.note}
                  </span>
                  <span
                    aria-hidden
                    className="col-span-12 md:col-span-1 text-right text-accent transition-transform duration-300 ease-editorial group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
