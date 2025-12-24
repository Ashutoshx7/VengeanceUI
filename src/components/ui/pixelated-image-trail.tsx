"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Configuration options for the pixelated image trail effect
 */
interface TrailConfig {
    /** Duration (ms) before an image starts fading out */
    imageLifespan: number;
    /** Duration (ms) of the reveal animation */
    inDuration: number;
    /** Duration (ms) of the hide animation */
    outDuration: number;
    /** Stagger delay (ms) for slices during reveal */
    staggerIn: number;
    /** Stagger delay (ms) for slices during hide */
    staggerOut: number;
    /** Duration (ms) of the slide animation */
    slideDuration: number;
    /** CSS easing function for slide animation */
    slideEasing: string;
    /** CSS easing function for mask animations */
    easing: string;
}

/**
 * Props for the PixelatedImageTrail component
 */
export interface PixelatedImageTrailProps {
    /** Additional CSS classes for the trail container */
    className?: string;
    /** Array of image URLs to cycle through */
    images?: string[];
    /** Override partial configuration options */
    config?: Partial<TrailConfig>;
    /** Number of horizontal slices (affects pixelation effect) */
    slices?: number;
    /** Distance threshold for spawning new trail images */
    spawnThreshold?: number;
    /** Interpolation factor for mouse smoothing (0-1) */
    smoothing?: number;
}

/**
 * PixelatedImageTrail - A stunning hover effect that creates a trail of pixelated images
 * following the cursor. Images reveal with a slice-based animation creating a 
 * premium, dynamic visual effect.
 * 
 * @example
 * ```tsx
 * <PixelatedImageTrail
 *   images={['/image1.jpg', '/image2.jpg', '/image3.jpg']}
 *   config={{ imageLifespan: 1200, staggerIn: 40 }}
 * />
 * ```
 */
export function PixelatedImageTrail({
    className,
    images = [],
    config: configOverride = {},
    slices = 4,
    spawnThreshold = 100,
    smoothing = 0.1,
}: PixelatedImageTrailProps) {
    const [mounted, setMounted] = useState(false);
    const trailContainerRef = useRef<HTMLDivElement>(null);
    const currentImageIndexRef = useRef(0);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const interpolatedMousePosRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const validImagesRef = useRef<string[]>([]);

    const trailImageCount = 3;
    const finalImages = images.length > 0 ? images : Array.from(
        { length: trailImageCount },
        (_, i) => `/trail-images/image${i + 1}.jpg`
    );

    // Preload images and only use them once loaded
    useEffect(() => {
        validImagesRef.current = [];
        finalImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                validImagesRef.current.push(src);
            };
        });
    }, [JSON.stringify(finalImages)]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Default configuration - Codrops-optimized timing
        const defaultConfig: TrailConfig = {
            imageLifespan: 400,
            inDuration: 150,
            outDuration: 300,
            staggerIn: 6,
            staggerOut: 4,
            slideDuration: 900,
            slideEasing: "cubic-bezier(0.16, 1, 0.3, 1)", // Expo.easeOut
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        };

        const config = { ...defaultConfig, ...configOverride };

        const trailContainer = trailContainerRef.current;
        if (!trailContainer) return;

        // Math utilities for smooth interpolation
        const MathUtils = {
            lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
            distance: (x1: number, y1: number, x2: number, y2: number) =>
                Math.hypot(x2 - x1, y2 - y1),
        };

        const getMouseDistance = () =>
            MathUtils.distance(
                interpolatedMousePosRef.current.x,
                interpolatedMousePosRef.current.y,
                lastMousePosRef.current.x,
                lastMousePosRef.current.y
            );

        /**
         * Creates a trail image element with pixelated slice animation
         */
        const createTrailImage = () => {
            // Skip if no images are loaded yet to prevent glitches
            if (validImagesRef.current.length === 0) return;

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("pixelated-trail-img");

            // Use only valid loaded images
            const imgSrc = validImagesRef.current[currentImageIndexRef.current % validImagesRef.current.length];
            currentImageIndexRef.current = (currentImageIndexRef.current + 1) % validImagesRef.current.length;

            const rect = trailContainer.getBoundingClientRect();
            // ... rest of function ...
            const startX = interpolatedMousePosRef.current.x - rect.left - 87.5;
            const startY = interpolatedMousePosRef.current.y - rect.top - 87.5;

            const dx = mousePosRef.current.x - interpolatedMousePosRef.current.x;
            const dy = mousePosRef.current.y - interpolatedMousePosRef.current.y;

            const targetX = startX + dx * 0.5;
            const targetY = startY + dy * 0.5;

            // Codrops doesn't use specific rotation, just proper placement
            // We keep it simple: translate only, no rotation or scale-in
            imgContainer.style.transform = `translate3d(0, 0, 0)`;

            imgContainer.style.left = `${startX}px`;
            imgContainer.style.top = `${startY}px`;
            imgContainer.style.transition = `left ${config.slideDuration}ms ${config.slideEasing}, top ${config.slideDuration}ms ${config.slideEasing}`;

            const maskLayers: HTMLDivElement[] = [];

            // Create sliced layers for pixelation effect
            for (let i = 0; i < slices; i++) {
                const layer = document.createElement("div");
                layer.classList.add("pixelated-mask-layer");

                const imageLayer = document.createElement("div");
                imageLayer.classList.add("pixelated-image-layer");
                imageLayer.style.backgroundImage = `url(${imgSrc})`;

                const sliceSize = 100 / slices;
                const startClipY = i * sliceSize;
                const endClipY = (i + 1) * sliceSize;

                // Initial collapsed clip-path (hidden)
                layer.style.clipPath = `polygon(50% ${startClipY}%, 50% ${startClipY}%, 50% ${endClipY}%, 50% ${endClipY}%)`;
                layer.style.transition = `clip-path ${config.inDuration}ms ${config.easing}`;
                layer.style.transform = "translateZ(0)";
                layer.style.backfaceVisibility = "hidden";

                layer.appendChild(imageLayer);
                imgContainer.appendChild(layer);
                maskLayers.push(layer);
            }

            trailContainer.appendChild(imgContainer);

            // Animate in with staggered slice reveal + scale pop
            requestAnimationFrame(() => {
                imgContainer.style.left = `${targetX}px`;
                imgContainer.style.top = `${targetY}px`;
                // No rotation or scale change on enter - just position
                imgContainer.style.transform = `translate3d(0, 0, 0)`;

                maskLayers.forEach((layer, i) => {
                    const sliceSize = 100 / slices;
                    const startClipY = i * sliceSize;
                    const endClipY = (i + 1) * sliceSize;

                    // Ripple stagger from center outwards
                    const distanceFromMiddle = Math.abs(i - (slices - 1) / 2);
                    const delay = distanceFromMiddle * config.staggerIn;

                    setTimeout(() => {
                        layer.style.clipPath = `polygon(0% ${startClipY}%, 100% ${startClipY}%, 100% ${endClipY}%, 0% ${endClipY}%)`;
                    }, delay);
                });
            });

            // Animate out - Codrops style fade + scale down
            setTimeout(() => {
                // Use CSS class for reliable exit transition
                imgContainer.classList.add("animate-out");

                // Remove from DOM after fade completes
                setTimeout(() => {
                    if (imgContainer.parentElement === trailContainer) {
                        trailContainer.removeChild(imgContainer);
                    }
                }, config.outDuration);
            }, config.imageLifespan);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        /**
         * Animation loop with smooth mouse interpolation
         */
        const render = () => {
            interpolatedMousePosRef.current.x = MathUtils.lerp(
                interpolatedMousePosRef.current.x,
                mousePosRef.current.x,
                smoothing
            );
            interpolatedMousePosRef.current.y = MathUtils.lerp(
                interpolatedMousePosRef.current.y,
                mousePosRef.current.y,
                smoothing
            );

            if (getMouseDistance() > spawnThreshold) {
                lastMousePosRef.current = { ...interpolatedMousePosRef.current };
                createTrailImage();
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        window.addEventListener("mousemove", handleMouseMove);
        animationFrameRef.current = requestAnimationFrame(render);

        // Initialize mouse position on first move
        const initMouse = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
            interpolatedMousePosRef.current = { x: e.clientX, y: e.clientY };
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
            window.removeEventListener("mousemove", initMouse);
        }
        window.addEventListener("mousemove", initMouse, { once: true });


        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [mounted, configOverride, slices, spawnThreshold, smoothing, JSON.stringify(images)]);

    if (!mounted) return null;

    return createPortal(
        <div className={cn("pixelated-trail-container", className)} ref={trailContainerRef}></div>,
        document.body
    );
}

export default PixelatedImageTrail;
