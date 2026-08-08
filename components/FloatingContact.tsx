"use client";

import { site, waLink } from "@/data/site";
import { WhatsAppIcon, FacebookIcon } from "@/components/icons";

// Two persistent quick-contact buttons, bottom-right on every page.
export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={waLink("Hi Sanskriti! I have a question about a kurta.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Message us on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <a
        href={site.facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Visit our Facebook"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg shadow-black/20 transition hover:scale-105"
      >
        <FacebookIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
