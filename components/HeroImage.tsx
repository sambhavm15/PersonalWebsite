import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";

export default function HeroImage() {
  const publicPath = join(process.cwd(), "public", "hero.jpg");
  const hasReal = existsSync(publicPath);

  return (
    <figure className="reveal relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-paper/5">
      {hasReal ? (
        <Image
          src="/hero.jpg"
          alt="Portrait of Sambhav Mehta"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover transition-transform duration-[1200ms] ease-editorial hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,77,61,0.18),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(245,241,232,0.06),transparent_50%)]" />
          <div className="relative z-10 text-center px-6">
            <p className="section-number">Portrait slot</p>
            <p className="mt-2 font-display text-2xl text-paper/90">
              /public/hero.jpg
            </p>
          </div>
          <div className="absolute inset-0 border border-paper/10" />
        </div>
      )}
      <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between text-[10px] uppercase tracking-[0.2em] text-paper/70">
        <span>Fig. 01</span>
        <span>Fremont, CA — 2026</span>
      </figcaption>
    </figure>
  );
}
