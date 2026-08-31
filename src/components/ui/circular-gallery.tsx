"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Circular Gallery
 *
 * A relaxing 3D ring of images: many small cards are laid out around a giant
 * tilted circle, the whole ring drifts with a gentle auto-rotation you can
 * grab and spin, and the cursor parallaxes the tilt. Hovering a card lifts it
 * and mirrors it in a large centre preview.
 *
 * Ported from the vanilla "CodeGrid 3D Circular Image Gallery" (GSAP) into a
 * single, self-contained, prop-driven React component. The original's full-page
 * ScrollTrigger is replaced with drag + auto-rotation so it works inside any
 * container. GSAP is the only runtime dependency.
 */

export interface CircularGalleryProps {
  /** Image URLs, cycled around the ring. When omitted, neutral placeholder cards are shown. */
  images?: string[];
  /** Number of cards in the ring. Defaults to 150. */
  count?: number;
  /** Base tilt of the ring in degrees (rotateX). Defaults to 55. */
  tilt?: number;
  /** Ring radius in px (card distance from centre). Defaults to 400. */
  radius?: number;
  /** Card width in px. Defaults to 45. */
  itemWidth?: number;
  /** Card height in px. Defaults to 60. */
  itemHeight?: number;
  /** Slowly spin the ring on its own. Defaults to true. */
  autoRotate?: boolean;
  /** Auto-rotation speed in degrees per second. Defaults to 4. */
  autoRotateSpeed?: number;
  /** Show the large centre preview that follows the hovered card. Defaults to true. */
  showPreview?: boolean;
  /** Parallax the ring's tilt toward the cursor. Defaults to true. */
  parallax?: boolean;
  /** Extra classes for the root element. */
  className?: string;
}

export function CircularGallery({
  images,
  count = 150,
  tilt = 55,
  radius = 400,
  itemWidth = 45,
  itemHeight = 60,
  autoRotate = true,
  autoRotateSpeed = 3,
  showPreview = true,
  parallax = true,
  className,
}: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  const srcOf = (i: number) =>
    images && images.length > 0 ? images[i % images.length] : undefined;
  const defaultPreview = srcOf(0);

  // Live-tunable knobs read inside the ticker/handlers without rebuilding.
  const optsRef = useRef({ autoRotate, autoRotateSpeed, parallax, tilt });
  useEffect(() => {
    optsRef.current = { autoRotate, autoRotateSpeed, parallax, tilt };
  }, [autoRotate, autoRotateSpeed, parallax, tilt]);

  useEffect(() => {
    const root = rootRef.current;
    const gallery = galleryRef.current;
    if (!root || !gallery) return;

    const items = gsap.utils.toArray<HTMLElement>(gallery.querySelectorAll("[data-ring-item]"));
    if (items.length === 0) return;

    const angleIncrement = 360 / items.length;
    const baseAngles = items.map((_, i) => i * angleIncrement - 90);

    // Seat each card on the ring, facing outward.
    items.forEach((item, i) => {
      gsap.set(item, {
        rotationY: 90,
        rotationZ: baseAngles[i],
        transformOrigin: `50% ${radius}px`,
      });
    });
    gsap.set(gallery, { rotationY: 0 });
    // Centre preview stays hidden until a card is hovered.
    if (previewWrapRef.current) gsap.set(previewWrapRef.current, { opacity: 0 });

    const setZ = items.map((item) => gsap.quickSetter(item, "rotationZ", "deg"));

    // ── Tasteful entrance: the ring settles into its tilt, fades up, and the
    // cards bloom in softly at random. ──────────────────────────────────────
    gsap.fromTo(
      gallery,
      { rotationX: optsRef.current.tilt + 16, opacity: 0 },
      { rotationX: optsRef.current.tilt, opacity: 1, duration: 1.4, ease: "power3.out" },
    );
    gsap.from(items, {
      opacity: 0,
      duration: 0.7,
      ease: "power1.out",
      stagger: { amount: 1, from: "random" },
    });

    // ── Rotation: eased current chasing a target, nudged by auto-spin + drag ──
    let current = 0;
    let target = 0;
    let isInViewport = true;
    let isPageVisible = !document.hidden;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;

    const tick = () => {
      if (!isInViewport || !isPageVisible) return;
      const { autoRotate: auto, autoRotateSpeed: speed } = optsRef.current;
      if (auto && !reducedMotion && !dragging) target += (speed / 60) * gsap.ticker.deltaRatio();
      current += (target - current) * 0.05;
      for (let i = 0; i < setZ.length; i++) setZ[i](baseAngles[i] + current);
    };
    gsap.ticker.add(tick);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
      },
      { rootMargin: "160px" },
    );
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };
    visibilityObserver.observe(root);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    // ── Drag to spin ─────────────────────────────────────────────────────
    let dragging = false;
    let lastX = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      root.setPointerCapture?.(e.pointerId);
      root.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      // Parallax tilt toward the cursor.
      if (optsRef.current.parallax) {
        const rect = root.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(gallery, {
          rotationX: optsRef.current.tilt + py * 3,
          rotationY: px * 3,
          duration: 1.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (dragging) {
        target += (e.clientX - lastX) * 0.3;
        lastX = e.clientX;
      }
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      root.releasePointerCapture?.(e.pointerId);
      root.style.cursor = "grab";
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointerleave", endDrag);

    return () => {
      gsap.ticker.remove(tick);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endDrag);
      root.removeEventListener("pointerleave", endDrag);
      gsap.killTweensOf(gallery);
    };
    // Rebuild when structural inputs change; live knobs flow through optsRef.
  }, [count, radius, images]);

  // Reveal the centre preview with the hovered card's image — swaps instantly
  // so moving between cards feels immediate, and the frame fades in.
  const showPreviewImage = (src?: string) => {
    const img = previewRef.current;
    const wrap = previewWrapRef.current;
    if (!img || !wrap || !src) return;
    if (!img.src.endsWith(src)) img.src = src;
    gsap.to(wrap, { opacity: 1, duration: 0.15, ease: "power2.out", overwrite: true });
  };

  // Hide the preview when the cursor leaves the cards.
  const hidePreviewImage = () => {
    const wrap = previewWrapRef.current;
    if (!wrap) return;
    gsap.to(wrap, { opacity: 0, duration: 0.25, ease: "power1.out", overwrite: true });
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative h-full w-full touch-none select-none overflow-hidden [perspective:1500px]",
        "bg-[radial-gradient(circle_at_50%_42%,#f7f7f8,#e6e6e8)] dark:bg-[radial-gradient(circle_at_50%_42%,#17171a,#050505)]",
        className,
      )}
      style={{ cursor: "grab" }}
    >
      {/* Centre preview — hidden until a card is hovered */}
      {showPreview && defaultPreview ? (
        <div
          ref={previewWrapRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[220px] w-[330px] max-w-[72%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl opacity-0 shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={previewRef} src={defaultPreview} alt="" className="h-full w-full object-cover" />
          {/* Soft scrim for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
        </div>
      ) : null}

      {/* The ring */}
      <div
        ref={galleryRef}
        className="absolute left-1/2 top-[20%] z-10 -translate-x-1/2 [transform-style:preserve-3d]"
      >
        {Array.from({ length: count }).map((_, i) => {
          const src = srcOf(i);
          return (
            <div
              key={i}
              data-ring-item
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] bg-neutral-300 shadow-md shadow-black/20 ring-1 ring-black/5 [transform-style:preserve-3d] dark:bg-neutral-700 dark:ring-white/10"
              style={{ width: itemWidth, height: itemHeight, margin: 10 }}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  onMouseEnter={() => showPreviewImage(src)}
                  onMouseLeave={hidePreviewImage}
                  className="h-full w-full object-cover transition-[transform,filter] duration-300 hover:scale-110 hover:brightness-110"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Edge vignette so the ring fades softly at the periphery */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_45%,transparent_52%,rgba(240,240,242,0.85))] dark:bg-[radial-gradient(circle_at_50%_45%,transparent_46%,rgba(5,5,5,0.9))]"
      />
    </div>
  );
}

export default CircularGallery;
