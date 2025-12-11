'use client';

import React from 'react';
import { GlowBorderCard } from '@/components/ui/glow-border-card';

/**
 * Demo component showcasing the GlowBorderCard with default settings
 */
export function GlowBorderCardDemo() {
    return (
        <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-8">
            <GlowBorderCard
                width="280px"
                aspectRatio="1"
                colorPreset="aurora"
                animationDuration={4}
            />
        </div>
    );
}

/**
 * Demo showing multiple color presets
 */
export function GlowBorderCardPresets() {
    const presets = [
        { preset: 'aurora' as const, label: 'Aurora' },
        { preset: 'ocean' as const, label: 'Ocean' },
        { preset: 'sunset' as const, label: 'Sunset' },
        { preset: 'nature' as const, label: 'Nature' },
    ];

    return (
        <div className="relative flex flex-wrap gap-6 w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-8">
            {presets.map(({ preset, label }) => (
                <GlowBorderCard
                    key={preset}
                    width="180px"
                    aspectRatio="1"
                    colorPreset={preset}
                    animationDuration={5}
                />
            ))}
        </div>
    );
}

/**
 * Demo showing different aspect ratios
 */
export function GlowBorderCardAspects() {
    return (
        <div className="relative flex flex-wrap gap-6 w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-8">
            <GlowBorderCard
                width="200px"
                aspectRatio="1"
                colorPreset="aurora"
                animationDuration={4}
            />

            <GlowBorderCard
                width="280px"
                aspectRatio="16/9"
                colorPreset="ocean"
                animationDuration={5}
            />

            <GlowBorderCard
                width="140px"
                aspectRatio="3/4"
                colorPreset="sunset"
                animationDuration={3}
            />
        </div>
    );
}

/**
 * Demo with custom gradient colors
 */
export function GlowBorderCardCustom() {
    return (
        <div className="relative flex flex-wrap gap-6 w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-8">
            <GlowBorderCard
                width="220px"
                aspectRatio="1"
                gradientColors={['#ff0080', '#ff8c00', '#40e0d0', '#7b68ee', '#ff0080']}
                animationDuration={3}
            />
        </div>
    );
}
