import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import SectionHeader from "@/components/SectionHeader";
import GalleryTabs from "@/components/GalleryTabs";
import { gallery, art, type GalleryImage } from "@/data/content";

export const metadata: Metadata = {
  title: "Gallery — Sambhav Mehta",
  description:
    "Photography and drawings — an interactive gallery of work made away from the keyboard.",
};

function realFlags(images: GalleryImage[]): boolean[] {
  return images.map((img) => {
    const base = img.src.replace(/^\//, "");
    return (
      existsSync(join(process.cwd(), "public", base)) ||
      existsSync(join(process.cwd(), "public", base.replace(/\.jpg$/, ".png")))
    );
  });
}

export default function GalleryPage() {
  const tabs = [
    {
      key: "photography",
      label: "Photography",
      blurb:
        "Chasing light on street corners and after dark. Click any frame to enlarge — arrow keys to browse, escape to close.",
      images: gallery,
      hasRealImage: realFlags(gallery),
    },
    {
      key: "art",
      label: "Art",
      blurb:
        "Drawings and sketches — whatever sticks. Pen, pencil, and the occasional experiment.",
      images: art,
      hasRealImage: realFlags(art),
    },
  ];

  return (
    <div className="container-editorial pt-16 pb-24 md:pt-24 md:pb-32">
      <SectionHeader
        number="05"
        label="Gallery"
        heading="Made away from the keyboard."
        eyebrow="Two bodies of work — photographs and drawings — in one interactive room."
      />

      <div className="mt-14 md:mt-20">
        <GalleryTabs tabs={tabs} />
      </div>
    </div>
  );
}
