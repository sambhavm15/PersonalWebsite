import HeroImage from "@/components/HeroImage";
import RotatingWord from "@/components/RotatingWord";
import SocialIcons from "@/components/SocialIcons";
import CurrentlyStrip from "@/components/CurrentlyStrip";
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
          <div className="reveal">
            <CurrentlyStrip items={hero.currentlyItems} />
          </div>
        </div>
      </section>
    </>
  );
}
