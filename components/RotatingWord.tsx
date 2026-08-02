"use client";

import { useEffect, useState } from "react";

export default function RotatingWord({
  words,
  interval = 2200,
}: {
  words: readonly string[];
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
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [reduced, words.length, interval]);

  const widest =
    words.reduce((w, s) => (s.length > w.length ? s : w), words[0]) ?? "";

  return (
    <span className="relative inline-flex align-baseline">
      <span aria-hidden className="invisible whitespace-nowrap">
        {widest}
      </span>
      <span
        aria-live="polite"
        className="absolute inset-0 whitespace-nowrap text-accent italic"
        key={index}
        style={{
          animation: reduced ? "none" : "revealWord 700ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {words[index]}
      </span>
      <style>{`
        @keyframes revealWord {
          0% { opacity: 0; transform: translateY(0.35em); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
