import { site } from "@/data/content";

const Icon = ({
  path,
  label,
}: {
  path: React.ReactNode;
  label: string;
}) => (
  <svg
    role="img"
    aria-label={label}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    {path}
  </svg>
);

const linkedin = (
  <>
    <path d="M4 4h4v4H4z" />
    <path d="M4 10h4v10H4z" />
    <path d="M10 10h4v2c1-1.5 2.5-2.4 4.5-2.4C21 9.6 22 11.5 22 14v6h-4v-5.5c0-1.6-.6-2.7-2.2-2.7-1.7 0-2.3 1.2-2.3 2.8V20h-3.5z" />
  </>
);

const github = (
  <>
    <path d="M9 19c-4 1.2-4-2-6-2M15 21v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5.9 2.4 4.9 2.7 4.9 2.7A4.4 4.4 0 0 0 4.8 5.9 4.7 4.7 0 0 0 3.5 9.2c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  </>
);

const email = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>
);

export default function SocialIcons({
  className = "",
}: {
  className?: string;
}) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      <li>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-paper/80 hover:text-accent transition-colors"
        >
          <Icon path={linkedin} label="LinkedIn" />
        </a>
      </li>
      <li>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-paper/80 hover:text-accent transition-colors"
        >
          <Icon path={github} label="GitHub" />
        </a>
      </li>
      <li>
        <a
          href={`mailto:${site.email}`}
          aria-label="Email"
          className="text-paper/80 hover:text-accent transition-colors"
        >
          <Icon path={email} label="Email" />
        </a>
      </li>
    </ul>
  );
}
