"use client";

import { useEffect } from "react";

export default function RevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reveal = (el: Element) => el.classList.add("is-visible");

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const mo = new MutationObserver(() => {
      document
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((el) => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    document
      .querySelectorAll(".reveal:not(.is-visible)")
      .forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <>{children}</>;
}
