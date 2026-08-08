import Link from "next/link";
import { site } from "@/data/site";
import { clothingCategories, collections } from "@/data/catalog";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      {/* newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-editorial flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="eyebrow text-gold-soft">Join the atelier list</p>
            <h2 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
              Enter the world of Sanskriti
            </h2>
          </div>
          <form className="flex w-full max-w-md items-center gap-2 border-b border-gold pb-2">
            <input
              type="email"
              required
              placeholder="Enter your email here"
              className="w-full bg-transparent text-ivory outline-none placeholder:text-ivory/50"
            />
            <button aria-label="Subscribe" className="text-gold-soft transition hover:text-gold">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* link columns */}
      <div className="container-editorial grid grid-cols-2 gap-10 py-14 md:grid-cols-4 lg:grid-cols-5">
        <FooterCol title="Customer Care">
          <FooterLink href="/contact">Orders & Shipment</FooterLink>
          <FooterLink href="/contact">Returns & Exchange</FooterLink>
          <FooterLink href="/contact">Contact Us</FooterLink>
          <FooterLink href="/contact">FAQs</FooterLink>
        </FooterCol>

        <FooterCol title="About Us">
          <FooterLink href="/our-story">Our Story</FooterLink>
          <FooterLink href="/our-story#craft">The Craft</FooterLink>
          <FooterLink href="/our-story#indore">Indore Roots</FooterLink>
        </FooterCol>

        <FooterCol title="Categories">
          {clothingCategories.slice(0, 5).map((c) => (
            <FooterLink key={c.slug} href={`/shop?category=${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Collections">
          {collections.slice(0, 5).map((c) => (
            <FooterLink key={c.slug} href={`/collections/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Need Help?">
          <li className="flex items-start gap-2 text-sm text-ivory/70">
            <WhatsAppIcon className="mt-0.5 h-4 w-4 text-gold-soft" />
            <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-ivory">
              WhatsApp / Call: {site.whatsappDisplay}
            </a>
          </li>
          <li className="flex items-start gap-2 text-sm text-ivory/70">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
            <a href={`mailto:${site.email}`} className="hover:text-ivory">Email Us</a>
          </li>
          <li className="flex items-start gap-2 text-sm text-ivory/70">
            <FacebookIcon className="mt-0.5 h-4 w-4 text-gold-soft" />
            <a href={site.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-ivory">
              Facebook Marketplace
            </a>
          </li>
        </FooterCol>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-4 py-6 text-xs text-ivory/60 md:flex-row">
          <p>© {new Date().getFullYear()} Sanskriti Clothing. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href={site.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition hover:text-gold-soft">
              <FacebookIcon />
            </a>
            <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition hover:text-gold-soft">
              <WhatsAppIcon />
            </a>
            {site.instagramUrl && (
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-gold-soft">
                <InstagramIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
        {title}
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ivory/70 transition hover:text-ivory">
        {children}
      </Link>
    </li>
  );
}
