"use client";

import { CircularGallery } from "@/components/ui/circular-gallery";

/**
 * Preview for the Circular Gallery. The ring auto-rotates; drag to spin it,
 * move the cursor to tilt it, and hover a card to mirror it in the centre.
 */
const IMAGES = Array.from({ length: 15 }, (_, i) => `/circular-gallery/img${i + 1}.jpg`);

export function CircularGalleryDemo() {
  return <CircularGallery images={IMAGES} count={72} />;
}

export default CircularGalleryDemo;
