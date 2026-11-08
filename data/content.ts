export type NavLink = { label: string; href: string };

export type SocialLink = { label: string; href: string; kind: "email" | "linkedin" | "github" | "resume" };

export type WorkEntry = {
  company: string;
  role: string;
  team?: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type ProjectEntry = {
  title: string;
  role: string;
  dates: string;
  bullets: string[];
  href?: string;
};

export type Award = { emoji: string; title: string };

export type SkillGroup = { label: string; items: string[] };

export type GalleryImage = {
  src: string;
  caption?: string;
  alt: string;
  /** Real pixel size; when set, the tile uses the photo's true aspect ratio. */
  width?: number;
  height?: number;
  /** Fallback shape for placeholder tiles with no real image yet. */
  aspect?: "portrait" | "landscape" | "square";
};

export const site = {
  name: "Sambhav Mehta",
  domain: "sambhavm.com",
  email: "sambhavm@berkeley.edu",
  linkedin: "https://www.linkedin.com/in/sambhavm",
  github: "https://github.com/sambhavm15",
  resume: "/resume.pdf",
  location: "Fremont, CA",
};

export const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
];

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: site.linkedin, kind: "linkedin" },
  { label: "GitHub", href: site.github, kind: "github" },
  { label: "Email", href: `mailto:${site.email}`, kind: "email" },
];

export const hero = {
  greeting: "Hi, I'm",
  name: "Sambhav Mehta.",
  prefix: "A",
  descriptors: ["builder", "product thinker", "photographer", "problem-solver", "storyteller"] as const,
  intro:
    "I study at UC Berkeley's Management, Entrepreneurship & Technology program, where I build AI products that people actually use — and shoot photos, cook, and make things in between.",
  subline: "Product management · applied AI · a soft spot for good design.",
  ctaLabel: "Let's connect",
  ctaHref: site.linkedin,
  // Rotating "currently" strip — cycles every ~2.5s. Keep the phrasing parallel
  // (gerund + short object) so the swap reads as one rhythm.
  currentlyItems: [
    "Building products at MongoDB",
    "Chalking up for a climb",
    "Chasing light after dark",
    "Sketching whatever sticks",
    "Trading jabs at the boxing gym",
  ] as const,
};

export const work: WorkEntry[] = [
  {
    company: "MongoDB",
    role: "Technical Product Management Intern",
    team: "FinTech AI Team",
    location: "Palo Alto, CA",
    dates: "Jun–Aug 2026",
    bullets: [
      "Built a Central SKU Management Platform in React that cut SKU creation time by over 90% — from weeks to 8 days.",
      "Rolled it out to 6,000+ employees by running 5 UAT sessions and migrating 1,000+ SKUs into the new system.",
      "Shipped an AI auto-fill feature on a RAG pipeline over 5,000+ SKUs, automating 40+ fields and cutting manual data entry by 75%.",
      "Designed three Workato integrations syncing SKU data into Salesforce and NetSuite, removing 90% of manual processing for a 40-person team.",
    ],
  },
  {
    company: "GI Partners",
    role: "Technical Product Management Intern",
    team: "AI Data Infrastructure · $50B+ AUM PE firm",
    location: "San Francisco, CA",
    dates: "Sep–Dec 2025",
    bullets: [
      "Set product direction, OKRs, and use cases for an AI research agent used by 100+ investors, cutting deal-research time by 30%.",
      "Owned the roadmap for an AI co-pilot for investment workflows, aligning 15 stakeholders and driving 90% adoption.",
      "Ran competitive analysis of 40+ AI tools and reported vendor recommendations to executives.",
      "Led a RAG system on Azure with a proprietary vector database over $50B+ in historical deal data, improving retrieval accuracy by 45%.",
    ],
  },
  {
    company: "Alumni Ventures",
    role: "AI Product Management Intern",
    team: "Deep Tech Team · $1.5B+ AUM VC firm",
    location: "Menlo Park, CA",
    dates: "Jun–Aug 2025",
    bullets: [
      "Owned the roadmap for an internal CRM centralizing data on 100,000+ startups and monitoring 1,400+ portfolio companies.",
      "Led a sourcing product from scoping to launch, auto-evaluating 200+ startups/week and tripling annualized deal flow.",
      "Automated manual market analysis with Python and SQL, saving analysts ~3 hours each per week.",
    ],
  },
  {
    company: "Admit AI",
    role: "Product Engineering Intern",
    team: "AI college-counseling startup",
    location: "Palo Alto, CA",
    dates: "Aug–Dec 2024",
    bullets: [
      "Wireframed a “Brainstorming Essays” feature that helped attract 5,000+ users in three months and lifted MRR by 15%.",
      "Raised user satisfaction 25% by folding A/B tests and market analysis into product requirements.",
      "Scoped a “Counselor Dashboard” with real-time engagement analytics and AI essay-feedback summaries.",
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    title: "Diamond Consulting",
    role: "Founder",
    dates: "Nov 2024–Present",
    bullets: [
      "A student-run, pro-bono consulting firm delivering strategy and technical builds to 13+ clients, including Docker.",
      "Shipped 3 client-facing apps with React and Firebase, automating 5+ sales and marketing workflows.",
      "Led go-to-market across 6+ projects and 20+ customer-discovery interviews.",
    ],
  },
  {
    title: "Blue Origin",
    role: "Technical Product Consultant",
    dates: "Aug–Dec 2024",
    bullets: [
      "Built recommendations to aggregate $3B in free cash flow by 2030, presented to Blue Origin executives.",
      "Designed a platform concept for managing the full ECSS lifecycle, projected at ~$3.5B in free cash flow.",
      "Directed five consultants through due diligence and technical analysis of the $188B low-Earth-orbit space stack.",
    ],
  },
];

export const awards: Award[] = [
  { emoji: "🏆", title: "1st place, Xylem Student Innovation Hackathon — out of 5,000+ teams." },
  { emoji: "🎯", title: "Venture Capital Investment Competition — UC Berkeley qualifier." },
];

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["Python", "SQL", "R", "Java"] },
  {
    label: "Data & ML",
    items: [
      "Spark",
      "Databricks",
      "Snowflake",
      "MongoDB Atlas",
      "Machine Learning",
      "Optimization",
      "Data Engineering",
    ],
  },
  {
    label: "Product & Design",
    items: ["Jira", "Confluence", "Asana", "Figma", "Cognos", "Tableau"],
  },
  { label: "Platforms", items: ["Salesforce", "NetSuite", "Firebase", "React"] },
];

export const about = {
  paragraphs: [
    "I'm a builder who happens to also be a maker. When I'm not scoping products or wrangling data pipelines, I'm usually behind a camera, in a kitchen, or somewhere with good light and a sketchbook.",
    "Photography taught me to notice things — framing, patience, the moment before the moment. Cooking taught me that a good process beats a good recipe. Art keeps me curious. I think the best product people are the ones who care about how something feels, not just whether it works — and all of this is where that comes from.",
    "Off the clock you'll find me chasing light on a street corner, testing a new recipe, or getting lost in a museum.",
  ],
};

// Photography. Files live in /public/gallery/ as web-sized JPGs.
// width/height are the real pixel sizes so the masonry grid keeps each
// photo's true shape. To add one: drop NN.jpg in the folder and add a row.
// `caption` is optional — it shows on hover and in the lightbox.
export const gallery: GalleryImage[] = [
  { src: "/gallery/01.jpg", width: 1918, height: 2400, alt: "City avenue at golden hour, crosswalks and traffic below tall buildings" },
  { src: "/gallery/02.jpg", width: 1800, height: 2400, alt: "A curving highway cutting through green hills under a cloudy sunset" },
  { src: "/gallery/03.jpg", width: 1800, height: 2400, alt: "Silhouetted profile looking out over trees and water" },
  { src: "/gallery/04.jpg", width: 1800, height: 2400, alt: "A figure walking up a stone path through a tunnel of trees toward the skyline" },
  { src: "/gallery/05.jpg", width: 1800, height: 2400, alt: "Sunlight flaring between dark skyscrapers on a narrow city street" },
  { src: "/gallery/06.jpg", width: 2400, height: 1720, alt: "Quiet beach with footprints in the sand and mountains across the water" },
  { src: "/gallery/07.jpg", width: 2400, height: 1800, alt: "Palm tree silhouetted against a fiery orange and red sunset" },
  { src: "/gallery/08.jpg", width: 1800, height: 2400, alt: "Looking up through the curving orange walls of a slot canyon to blue sky" },
  { src: "/gallery/09.jpg", width: 1800, height: 2400, alt: "Airplane wing over hills and a lake at dusk" },
];

// Drawings & paintings. Files live in /public/art/. width/height are the real
// pixel sizes. Order here = order on the page. `caption` shows on hover and in
// the lightbox — edit the title or medium freely.
export const art: GalleryImage[] = [
  { src: "/art/bearded-man-watercolor.jpg", width: 1837, height: 2375, caption: "Bearded Man · Watercolor", alt: "Watercolor portrait of an older bearded man in glasses" },
  { src: "/art/leopard-3.jpg", width: 688, height: 995, caption: "Leopard · Charcoal", alt: "Close-up charcoal drawing of a leopard's face" },
  { src: "/art/fruit-still-life.jpg", width: 1853, height: 1433, caption: "Fruit Still Life · Color", alt: "Colorful still life of fruit on a plate in front of draped cloth" },
  { src: "/art/woman-portrait.jpg", width: 1024, height: 1024, caption: "Portrait · Graphite", alt: "Graphite portrait of a woman with her hair pulled back, looking straight ahead" },
  { src: "/art/german-shepherd.jpg", width: 1786, height: 2312, caption: "German Shepherd · Colored Pencil", alt: "Colored pencil drawing of a German shepherd" },
  { src: "/art/kettle-and-apple.jpg", width: 762, height: 641, caption: "Kettle & Apple · Charcoal", alt: "Charcoal still life of a glass kettle beside an apple" },
  { src: "/art/figures-colored-pencil.jpg", width: 741, height: 909, caption: "Figures · Colored Pencil", alt: "Stylized colored pencil drawing of a tall figure in orange with two figures beside" },
  { src: "/art/seal.jpg", width: 830, height: 655, caption: "Seal Pup · Charcoal", alt: "Charcoal drawing of a seal pup lying down, facing forward" },
  { src: "/art/promenade-watercolor.jpg", width: 1813, height: 2345, caption: "Promenade · Watercolor", alt: "Watercolor of a waterfront promenade lined with palm trees and reflections" },
  { src: "/art/portrait-in-shadow.jpg", width: 741, height: 829, caption: "Portrait in Shadow · Charcoal", alt: "Charcoal portrait of a face emerging from a dark background" },
  { src: "/art/girl-arms-open.jpg", width: 734, height: 1024, caption: "Arms Open · Colored Pencil", alt: "Colored pencil drawing of a young girl from behind with her arms spread wide" },
  { src: "/art/jug-and-apples.jpg", width: 1797, height: 1388, caption: "Jug & Apples · Pencil", alt: "Pencil still life of a jug with apples on draped cloth" },
  { src: "/art/bird-lamp.jpg", width: 1596, height: 2065, caption: "Bird Lamp · Pencil", alt: "Pencil drawing of an ornate oil lamp topped with a bird" },
  { src: "/art/wine-glass-and-brush.jpg", width: 754, height: 932, caption: "Glass & Brush · Charcoal", alt: "Charcoal drawing of a paintbrush resting in a wine glass" },
  { src: "/art/roses.jpg", width: 1788, height: 2314, caption: "Roses · Pencil", alt: "Pencil drawing of a rose in bloom and a rosebud" },
  { src: "/art/goblet-still-life.jpg", width: 1353, height: 1751, caption: "Goblet · Pencil", alt: "Pencil drawing of a goblet on draped fabric" },
  { src: "/art/wine-bottle.jpg", width: 754, height: 910, caption: "Wine Bottle · Charcoal", alt: "Charcoal drawing of a wine bottle on a table" },
  { src: "/art/man-pencil-portrait.jpg", width: 706, height: 941, caption: "Portrait · Pencil", alt: "Pencil portrait of a man in a collared shirt" },
];
