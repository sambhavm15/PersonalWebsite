"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/data/content";

const aspectClass: Record<NonNullable<GalleryImage["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export default function Gallery({
  images,
  hasRealImage,
}: {
  images: GalleryImage[];
  hasRealImage: boolean[];
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      <ul className="columns-2 gap-4 md:columns-3 md:gap-6 [column-fill:_balance]">
        {images.map((img, i) => (
          <li
            key={img.src}
            className="reveal mb-4 md:mb-6 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Open ${img.alt} in lightbox`}
              className="group relative block w-full overflow-hidden rounded-sm bg-paper/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div
                className={`${
                  img.width && img.height ? "" : aspectClass[img.aspect ?? "landscape"]
                } relative w-full`}
                style={
                  img.width && img.height
                    ? { aspectRatio: `${img.width} / ${img.height}` }
                    : undefined
                }
              >
                {hasRealImage[i] ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(245,241,232,0.06) 0%, rgba(245,241,232,0.02) 100%)",
                      }}
                    />
                    <span className="section-number relative z-10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(14,14,16,0.75) 0%, transparent 45%)",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-paper/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  {img.caption ?? `Fig. ${String(i + 1).padStart(2, "0")}`}
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3 h-6 w-6 rounded-full border border-paper/70 text-paper/80 grid place-items-center text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  ↗
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[active].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={close}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper hover:border-accent hover:text-accent transition-colors"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-8 flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper hover:border-accent hover:text-accent transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-20 flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper hover:border-accent hover:text-accent transition-colors"
          >
            →
          </button>

          <figure
            className="relative mx-6 max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full overflow-hidden rounded-sm ${
                hasRealImage[active] ? "h-[78vh]" : "aspect-[3/2] bg-paper/5"
              }`}
            >
              {hasRealImage[active] ? (
                <Image
                  src={images[active].src}
                  alt={images[active].alt}
                  fill
                  priority
                  sizes="90vw"
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted">
                  <p className="section-number">Placeholder — {images[active].src}</p>
                </div>
              )}
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
              <span>
                {String(active + 1).padStart(2, "0")} / {images.length}
              </span>
              {images[active].caption ? <span>{images[active].caption}</span> : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
