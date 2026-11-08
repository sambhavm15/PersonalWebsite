"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/content";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        scrolled || open
          ? "bg-ink/85 backdrop-blur-md border-b border-paper/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-editorial flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group font-display text-lg leading-none tracking-tight"
          aria-label="Home — Sambhav Mehta"
        >
          <span className="text-paper">Sambhav</span>
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative py-2 uppercase tracking-[0.16em] transition-colors ${
                      active ? "text-paper" : "text-muted hover:text-paper"
                    }`}
                  >
                    <span className="mr-2 text-[0.7em] text-muted/70">
                      {String(navLinks.indexOf(link) + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ease-editorial ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded border border-paper/10 text-paper"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-full bg-paper transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-px w-full bg-paper transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-editorial ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-editorial pb-10 pt-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-baseline justify-between border-b border-paper/5 py-4 font-display text-3xl"
                >
                  <span>
                    <span className="mr-3 text-xs text-muted align-top">
                      0{i + 1}
                    </span>
                    {link.label}
                  </span>
                  <span className="text-accent">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
