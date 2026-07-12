export default function SectionHeader({
  number,
  label,
  heading,
  eyebrow,
}: {
  number: string;
  label: string;
  heading: string;
  eyebrow?: string;
}) {
  return (
    <div className="reveal grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-4">
        <p className="section-number">
          {number} / {label}
        </p>
        {eyebrow ? (
          <p className="mt-3 text-sm text-muted">{eyebrow}</p>
        ) : null}
      </div>
      <h1 className="md:col-span-8 font-display text-display leading-[1.02]">
        {heading}
      </h1>
    </div>
  );
}
