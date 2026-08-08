import Image from "next/image";

// Deterministic soft gradient so every placeholder looks intentional and
// on-brand (ivory + gold family) rather than a broken image.
const palettes = [
  ["#F6F1E7", "#E7Dcc4"],
  ["#F3EFE6", "#E4D7B8"],
  ["#F7F3EA", "#E9DCBE"],
  ["#F2ECDD", "#D9CBA6"],
  ["#F8F4EC", "#EADFC6"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function ProductMedia({
  src,
  alt,
  name,
  className = "",
  sizes,
  priority = false,
}: {
  src?: string | null;
  alt?: string | null;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? name}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  const [a, b] = palettes[hash(name) % palettes.length];
  const initials = name
    .split(" ")
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${className}`}
      style={{ background: `linear-gradient(150deg, ${a}, ${b})` }}
      aria-label={alt ?? name}
      role="img"
    >
      <span className="font-display text-4xl text-gold-deep/70">{initials}</span>
      <span className="mt-2 max-w-[70%] text-center font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
        Sanskriti
      </span>
    </div>
  );
}
