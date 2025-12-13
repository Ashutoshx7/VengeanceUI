"use client";

import * as React from "react";
import { LineHoverLink, LineHoverVariant } from "@/components/ui/line-hover-link";

// ============================================
// Demo: All Variants
// ============================================

const variants: { variant: LineHoverVariant; label: string }[] = [
    { variant: "slide", label: "Slide" },
    { variant: "double", label: "Double" },
    { variant: "grow", label: "Grow" },
    { variant: "strike", label: "Strike" },
    { variant: "fade", label: "Fade" },
    { variant: "pulse", label: "Pulse" },
    { variant: "swap", label: "Swap" },
    { variant: "sweep", label: "Sweep" },
    { variant: "bounce", label: "Bounce" },
    { variant: "arc", label: "Arc" },
    { variant: "scribble", label: "Scribble" },
];

export function LineHoverLinkDemo() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 p-12 bg-neutral-100 dark:bg-black rounded-xl min-h-[350px] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-x-24 gap-y-16">
                {variants.map(({ variant, label }) => (
                    <div key={variant} className="text-center">
                        <LineHoverLink
                            variant={variant}
                            href="#"
                            className="text-lg font-medium text-neutral-900 dark:text-white"
                        >
                            {label}
                        </LineHoverLink>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// Demo: Single showcase
// ============================================

export function LineHoverLinkSingle() {
    return (
        <div className="flex items-center justify-center gap-8 p-12 bg-white dark:bg-black rounded-xl min-h-[200px] border border-neutral-200 dark:border-neutral-800">
            <LineHoverLink
                variant="slide"
                href="#"
                className="text-2xl font-medium text-neutral-900 dark:text-white"
            >
                Hover over me
            </LineHoverLink>
        </div>
    );
}

// ============================================
// Demo: Navigation Example
// ============================================

export function LineHoverLinkNavigation() {
    return (
        <div className="flex items-center justify-center p-12 bg-white dark:bg-black rounded-xl min-h-[200px] border border-neutral-200 dark:border-neutral-800">
            <nav className="flex gap-8">
                <LineHoverLink variant="slide" href="#" className="text-neutral-600 dark:text-white/80">
                    Home
                </LineHoverLink>
                <LineHoverLink variant="slide" href="#" className="text-neutral-600 dark:text-white/80">
                    About
                </LineHoverLink>
                <LineHoverLink variant="slide" href="#" className="text-neutral-600 dark:text-white/80">
                    Services
                </LineHoverLink>
                <LineHoverLink variant="slide" href="#" className="text-neutral-600 dark:text-white/80">
                    Contact
                </LineHoverLink>
            </nav>
        </div>
    );
}

// ============================================
// Demo: SVG Variants
// ============================================

export function LineHoverLinkSVG() {
    return (
        <div className="flex items-center justify-center gap-12 p-12 bg-white dark:bg-black rounded-xl min-h-[200px] border border-neutral-200 dark:border-neutral-800">
            <LineHoverLink
                variant="arc"
                href="#"
                className="text-xl text-neutral-900 dark:text-white"
            >
                Sign up
            </LineHoverLink>
            <LineHoverLink
                variant="scribble"
                href="#"
                className="text-xl text-neutral-900 dark:text-white"
            >
                Writings
            </LineHoverLink>
        </div>
    );
}

export default LineHoverLinkDemo;
