import { site, waLink } from "@/data/site";
import { WhatsAppIcon, FacebookIcon } from "@/components/icons";

export const metadata = {
  title: "Contact Us · Sanskriti Clothing",
  description: "Reach Sanskriti Clothing on WhatsApp, Facebook, or email.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-cream py-16">
        <div className="container-editorial max-w-2xl text-center">
          <p className="eyebrow">We would love to hear from you</p>
          <h1 className="mt-3 font-display text-hero text-ink">Contact Us</h1>
          <p className="mt-4 text-charcoal">
            Questions about sizing, fabric, custom orders or an existing order?
            The fastest way to reach us is WhatsApp. We usually reply within a few
            hours.
          </p>
        </div>
      </section>

      <div className="container-editorial grid gap-6 py-14 md:grid-cols-2">
        <a
          href={waLink("Hi Sanskriti! I have a question.")}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-start gap-4 rounded-2xl border border-sand bg-white p-8 card-hover"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-ink">WhatsApp</h2>
            <p className="mt-1 text-charcoal">Chat with us directly.</p>
            <p className="mt-3 font-medium text-gold-deep">{site.whatsappDisplay}</p>
          </div>
        </a>

        <a
          href={site.facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-start gap-4 rounded-2xl border border-sand bg-white p-8 card-hover"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white">
            <FacebookIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-display text-2xl text-ink">Facebook</h2>
            <p className="mt-1 text-charcoal">
              See our latest pieces and updates on our page.
            </p>
            <p className="mt-3 font-medium text-gold-deep">Visit our Facebook</p>
          </div>
        </a>

        <a
          href={`mailto:${site.email}`}
          className="group flex flex-col items-start gap-4 rounded-2xl border border-sand bg-white p-8 card-hover"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-gold-soft">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
          </span>
          <div>
            <h2 className="font-display text-2xl text-ink">Email</h2>
            <p className="mt-1 text-charcoal">For detailed enquiries and orders.</p>
            <p className="mt-3 font-medium text-gold-deep">{site.email}</p>
          </div>
        </a>

        <div className="flex flex-col items-start gap-4 rounded-2xl border border-sand bg-cream p-8">
          <h2 className="font-display text-2xl text-ink">Studio Hours</h2>
          <ul className="space-y-1 text-charcoal">
            <li>Monday – Saturday · 10am to 7pm PT</li>
            <li>Sunday · By appointment</li>
          </ul>
          <p className="text-sm text-stone">
            Custom and bulk orders welcome. Message us on WhatsApp to begin.
          </p>
        </div>
      </div>
    </div>
  );
}
