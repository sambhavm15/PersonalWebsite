import Link from "next/link";
import { site } from "@/data/content";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-paper/10">
      <div className="container-editorial py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-3xl md:text-4xl leading-[1.05]">
              Let's make something{" "}
              <span className="text-accent italic">worth looking at.</span>
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block link-underline text-lg"
            >
              {site.email}
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="section-number mb-4">Elsewhere</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper hover:text-accent transition-colors"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper hover:text-accent transition-colors"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper hover:text-accent transition-colors"
                >
                  Résumé ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="section-number mb-4">Sitemap</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-paper hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-paper hover:text-accent transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-paper hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-paper hover:text-accent transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-paper hover:text-accent transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/5 pt-8 text-xs text-muted md:flex-row md:items-center">
          <p>© 2026 Sambhav Mehta. Built with Next.js, Tailwind, and TypeScript.</p>
          <p className="uppercase tracking-[0.2em]">{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
