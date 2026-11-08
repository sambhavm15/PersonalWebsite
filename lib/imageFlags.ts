import { existsSync } from "node:fs";
import { join } from "node:path";
import type { GalleryImage } from "@/data/content";

/** For each image, whether its file exists in /public (else a placeholder tile is shown). */
export function realImageFlags(images: GalleryImage[]): boolean[] {
  return images.map((img) => {
    const base = img.src.replace(/^\//, "");
    return (
      existsSync(join(process.cwd(), "public", base)) ||
      existsSync(join(process.cwd(), "public", base.replace(/\.jpg$/, ".png")))
    );
  });
}
