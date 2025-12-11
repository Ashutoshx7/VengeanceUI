"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Line Hover Link Variants
 * 
 * slide    - Line slides in from right to left
 * double   - Two lines animate with different timings
 * grow     - Line grows thicker on hover
 * strike   - Strikethrough effect with text scale
 * fade     - Lines fade up with stagger delay
 * pulse    - Line pulses up and down
 * swap     - Two lines go opposite directions
 * sweep    - Full background cover sweep
 * bounce   - Bouncy squish animation
 * arc      - SVG arc stroke draws in
 * scribble - SVG scribble stroke draws in
 */
export type LineHoverVariant =
    | "slide"
    | "double"
    | "grow"
    | "strike"
    | "fade"
    | "pulse"
    | "swap"
    | "sweep"
    | "bounce"
    | "arc"
    | "scribble";

export interface LineHoverLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /** The animation variant */
    variant?: LineHoverVariant;
    /** Link content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * SVG Arc Graphic - draws an arc stroke on hover
 */
const ArcGraphic = () => (
    <svg
        className="link-hover__graphic link-hover__graphic--stroke link-hover__graphic--arc"
        width="100%"
        height="18"
        viewBox="0 0 59 18"
    >
        <path
            d="M.945.149C12.3 16.142 43.573 22.572 58.785 10.842"
            pathLength="1"
        />
    </svg>
);

/**
 * SVG Scribble Graphic - draws a scribble stroke on hover
 */
const ScribbleGraphic = () => (
    <svg
        className="link-hover__graphic link-hover__graphic--stroke link-hover__graphic--scribble"
        width="100%"
        height="9"
        viewBox="0 0 101 9"
    >
        <path
            d="M.426 1.973C4.144 1.567 17.77-.514 21.443 1.48 24.296 3.026 24.844 4.627 27.5 7c3.075 2.748 6.642-4.141 10.066-4.688 7.517-1.2 13.237 5.425 17.59 2.745C58.5 3 60.464-1.786 66 2c1.996 1.365 3.174 3.737 5.286 4.41 5.423 1.727 25.34-7.981 29.14-1.294"
            pathLength="1"
        />
    </svg>
);

/**
 * LineHoverLink Component
 * 
 * A link component with beautiful underline hover animations.
 * Supports 11 different animation variants.
 * 
 * @example
 * ```tsx
 * <LineHoverLink variant="slide" href="/about">
 *   Learn more
 * </LineHoverLink>
 * ```
 */
export const LineHoverLink = React.forwardRef<
    HTMLAnchorElement,
    LineHoverLinkProps
>(({ variant = "slide", children, className, ...props }, ref) => {
    // Variants that need span wrapper for text animation
    const needsSpan = ["strike", "bounce", "arc", "scribble"].includes(variant);

    // Variants that need SVG graphics
    const svgVariant =
        variant === "arc" ? "arc" : variant === "scribble" ? "scribble" : null;

    return (
        <a
            ref={ref}
            className={cn("link-hover", `link-hover--${variant}`, className)}
            {...props}
        >
            {needsSpan ? <span>{children}</span> : children}
            {svgVariant === "arc" && <ArcGraphic />}
            {svgVariant === "scribble" && <ScribbleGraphic />}
        </a>
    );
});

LineHoverLink.displayName = "LineHoverLink";

export default LineHoverLink;
