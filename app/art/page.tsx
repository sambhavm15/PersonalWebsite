import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import Gallery from "@/components/Gallery";
import { art } from "@/data/content";
import { realImageFlags } from "@/lib/imageFlags";

export const metadata: Metadata = {
  title: "Art — Sambhav Mehta",
  description: "Drawings and paintings — charcoal, graphite, colored pencil, and watercolor.",
};

export default function ArtPage() {
  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="05"
        label="Art"
        heading="Whatever sticks."
        eyebrow="Drawings and paintings — charcoal, graphite, colored pencil, and watercolor. Hover for the title and medium; click any piece to enlarge."
      />
      <div className="mt-14 md:mt-20">
        <Gallery images={art} hasRealImage={realImageFlags(art)} />
      </div>
    </div>
  );
}
