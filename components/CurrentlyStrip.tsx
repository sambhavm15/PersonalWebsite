"use client";

import { useEffect, useState } from "react";

export default function CurrentlyStrip({
  items,
  interval = 2500,
}: {
  items: readonly string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [reduced, items.length, interval]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <span className="section-number flex shrink-0 items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse"
        />
        Currently
      </span>

      {reduced ? (
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-paper/85">
          {items.map((item) => (
            <li key={item} className="text-base md:text-lg">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative h-7 flex-1 overflow-hidden md:h-8">
          <p
            key={index}
            aria-live="polite"
            className="absolute inset-0 flex items-center text-base text-paper/90 md:text-lg"
            style={{ animation: "currentlyIn 500ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            <span className="mr-2 text-accent">—</span>
            {items[index]}
          </p>
          <style>{`
            @keyframes currentlyIn {
              0% { opacity: 0; transform: translateY(0.75em); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
