import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import Gallery from "@/components/Gallery";
import { gallery } from "@/data/content";
import { realImageFlags } from "@/lib/imageFlags";

export const metadata: Metadata = {
  title: "Photography — Sambhav Mehta",
  description: "Photographs — chasing light on street corners, trails, and after dark.",
};

export default function PhotographyPage() {
  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="04"
        label="Photography"
        heading="Notes on light."
        eyebrow="Chasing light on street corners, trails, and after dark. Click any frame to enlarge — arrow keys to browse, escape to close."
      />
      <div className="mt-14 md:mt-20">
        <Gallery images={gallery} hasRealImage={realImageFlags(gallery)} />
      </div>
    </div>
  );
}
