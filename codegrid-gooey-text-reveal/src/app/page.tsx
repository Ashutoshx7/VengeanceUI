"use client";

import Image from "next/image";
import { ReactLenis } from "lenis/react";
import { GooeyTextReveal } from "@/components/GooeyTextReveal/GooeyTextReveal";

const images = [
  { src: "/images/img1.jpg", alt: "A classical painting in warm shadow" },
  { src: "/images/img2.jpg", alt: "A dramatic classical portrait" },
  { src: "/images/img3.jpg", alt: "A historic painting with deep contrast" },
  { src: "/images/img4.jpg", alt: "A figure rendered in old master light" },
] as const;

function BannerImage({ index }: { index: number }) {
  const image = images[index];

  return (
    <div className="banner-img">
      <Image src={image.src} alt={image.alt} fill sizes="100vw" priority={index === 0} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ReactLenis root />

      <section className="hero">
        <GooeyTextReveal delay={0.8} duration={1.6} blurAmount={0.4}>
          <h1>The Weight of Old Light</h1>
        </GooeyTextReveal>
      </section>

      <BannerImage index={0} />

      <section className="room">
        <GooeyTextReveal mode="scroll" className="copy-block">
          <h3>
            Before the camera, there was only the patient hand. Pigment ground
            by candlelight, flesh rendered warm against a dark that swallows
            everything at the edges of the frame.
          </h3>
        </GooeyTextReveal>

        <GooeyTextReveal mode="scroll" className="copy-block">
          <h3>
            This is a room of Spanish shadow: gods caught mid-argument, men
            caught mid-breath. Each canvas holds a single suspended moment,
            stretched thin across four centuries, still refusing to look away.
          </h3>
        </GooeyTextReveal>
      </section>

      <BannerImage index={1} />

      <section className="index">
        <GooeyTextReveal mode="scrub" start="top 75%" end="bottom 55%">
          <h2>Ground Pigment</h2>
          <h2>Falling Shadow</h2>
          <h2>Warm Flesh</h2>
          <h2>Suspended Gesture</h2>
          <h2>Held Silence</h2>
        </GooeyTextReveal>
      </section>

      <BannerImage index={2} />

      <section className="collection">
        <GooeyTextReveal mode="scrub" start="top 75%" end="bottom 60%">
          <h3>
            We collect the paintings that hold their breath. The wine that never
            spills from a tilted cup, the note that never finishes leaving the
            reed, the eye that has watched the same doorway since 1628. Every
            frame is a single second refusing to end.
          </h3>
        </GooeyTextReveal>
      </section>

      <BannerImage index={3} />

      <section className="outro">
        <GooeyTextReveal mode="scroll" duration={1.8}>
          <h1>Step Closer</h1>
        </GooeyTextReveal>
      </section>
    </>
  );
}
