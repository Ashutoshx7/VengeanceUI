'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the GlowBorderCard component
 */
export interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Content to display inside the card
     */
    children?: React.ReactNode;

    /**
     * Width of the card (CSS value)
     * @default "320px"
     */
    width?: string;

    /**
     * Height of the card (CSS value). If not provided, uses aspect-ratio.
     */
    height?: string;

    /**
     * Aspect ratio of the card (e.g., "1", "16/9", "4/3")
     * @default "1"
     */
    aspectRatio?: string;

    /**
     * Corner radius of the card
     * @default "0.75rem"
     */
    borderRadius?: string;

    /**
     * Animation duration in seconds
     * @default 4
     */
    animationDuration?: number;

    /**
     * Gradient colors array (up to 10 colors)
     */
    gradientColors?: string[];

    /**
     * Border width for the glow effect
     * @default "1.25em"
     */
    borderWidth?: string;

    /**
     * Blur amount for the glow effect
     * @default "0.75em"
     */
    blurAmount?: string;

    /**
     * Inset distance (negative values push the border outside)
     * @default "-1em"
     */
    inset?: string;

    /**
     * Preset color themes
     */
    colorPreset?: 'nature' | 'ocean' | 'sunset' | 'aurora' | 'custom';

    /**
     * Whether animation is paused
     * @default false
     */
    paused?: boolean;
}

// Preset gradient colors (10 colors each for smooth transitions)
const colorPresets: Record<string, string[]> = {
    nature: ['#669900', '#88bb22', '#99cc33', '#aaddaa', '#ccee66', '#006699', '#228888', '#3399cc', '#55aacc', '#669900'],
    ocean: ['#006699', '#1177aa', '#2288bb', '#3399cc', '#44aadd', '#55bbee', '#66ccff', '#44bbee', '#2299cc', '#006699'],
    sunset: ['#ff6600', '#ff7711', '#ff8822', '#ff9900', '#ffaa22', '#ffbb44', '#ffcc00', '#ff9933', '#ff7722', '#ff6600'],
    aurora: ['#00ff87', '#22ffaa', '#44ffcc', '#60efff', '#88ddff', '#bb99ff', '#dd77ee', '#ff68f0', '#ff55cc', '#00ff87'],
    custom: ['#669900', '#99cc33', '#ccee66', '#006699', '#3399cc', '#990066', '#cc3399', '#ff6600', '#ff9900', '#ffcc00'],
};

/**
 * GlowBorderCard - A CSS-only animated glowing border card component
 * 
 * Features a rotating conic gradient that creates a beautiful
 * aurora-like glow effect around the card edges.
 * Uses @property for smooth angle animation.
 */
export const GlowBorderCard = React.forwardRef<HTMLDivElement, GlowBorderCardProps>(
    (
        {
            children,
            className,
            width = '320px',
            height,
            aspectRatio = '1',
            borderRadius = '0.75rem',
            animationDuration = 4,
            gradientColors,
            borderWidth = '1.25em',
            blurAmount = '0.75em',
            inset = '-1em',
            colorPreset = 'custom',
            paused = false,
            style,
            ...props
        },
        ref
    ) => {
        // Determine the gradient colors to use (up to 10)
        const colors = gradientColors || colorPresets[colorPreset] || colorPresets.custom;

        // Build color CSS variables (--glow-color-1 through --glow-color-10)
        const colorVars: Record<string, string> = {};
        for (let i = 0; i < 10; i++) {
            colorVars[`--glow-color-${i + 1}`] = colors[i % colors.length];
        }

        return (
            <div
                ref={ref}
                className={cn(
                    // Base Container Layout
                    "relative overflow-hidden grid place-content-center isolate",
                    // Glass Effect Background
                    "bg-zinc-50/50 dark:bg-neutral-900/60 backdrop-blur-md",
                    // Custom className support
                    className
                )}
                style={{
                    width: width,
                    height: height || 'auto',
                    aspectRatio: height ? 'unset' : aspectRatio,
                    borderRadius: borderRadius,
                    '--glow-animation-duration': `${animationDuration}s`,
                    ...colorVars,
                    ...style,
                } as React.CSSProperties}
                {...props}
            >
                {/* 
                  The Glow Pseudo-Element Replacer 
                  Using a real div instead of ::before allows better Tailwind control 
                */}
                <div
                    className={cn(
                        "absolute -z-10",
                        // Inset logic handled by style or arbitrary values if fixed
                        "border-solid rounded-[inherit]",
                        // The Gradient Animation Class
                        "glow-conic",
                        // Pause State
                        paused && "[animation-play-state:paused]"
                    )}
                    style={{
                        inset: inset,
                        borderWidth: borderWidth,
                        filter: `blur(${blurAmount})`
                    }}
                />

                {/* Content Container */}
                <div
                    className="relative z-10 w-full h-full bg-transparent flex items-center justify-center p-4"
                >
                    {children}
                </div>
            </div>
        );
    }
);

GlowBorderCard.displayName = 'GlowBorderCard';

export default GlowBorderCard;
