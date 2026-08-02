"use client";

import { useState } from "react";
import Gallery from "@/components/Gallery";
import type { GalleryImage } from "@/data/content";

type TabData = {
  key: string;
  label: string;
  blurb: string;
  images: GalleryImage[];
  hasRealImage: boolean[];
};

export default function GalleryTabs({ tabs }: { tabs: TabData[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div>
      <div className="reveal flex flex-wrap items-center gap-2">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`group relative overflow-hidden rounded-full border px-6 py-2.5 text-sm transition-colors duration-300 ease-editorial ${
                isActive
                  ? "border-accent text-ink"
                  : "border-paper/20 text-paper/80 hover:border-paper/40"
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-0 -z-0 bg-accent transition-transform duration-400 ease-editorial ${
                  isActive ? "translate-y-0" : "translate-y-full"
                }`}
              />
              <span className="relative z-10 flex items-center gap-2">
                {tab.label}
                <span
                  className={`text-xs ${
                    isActive ? "text-ink/70" : "text-muted"
                  }`}
                >
                  {tab.images.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p key={`blurb-${active}`} className="reveal mt-6 max-w-xl text-sm text-muted">
        {current.blurb}
      </p>

      <div key={current.key} className="mt-10">
        <Gallery images={current.images} hasRealImage={current.hasRealImage} />
      </div>
    </div>
  );
}
