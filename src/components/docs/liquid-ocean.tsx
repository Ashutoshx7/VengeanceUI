"use client";

import { LiquidOcean } from "@/components/ui/liquid-ocean";

/**
 * Default demo - Clean ocean animation
 */
export function LiquidOceanDemo() {
    return (
        <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-black">
            <LiquidOcean />
        </div>
    );
}

/**
 * Minimal - No boats, no grid, just ocean waves
 */
export function LiquidOceanMinimal() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                showBoats={false}
                showGrid={false}
                oceanFragments={30}
                waveAmplitude={0.15}
                rotationSpeed={0.0005}
            />
        </div>
    );
}

/**
 * Cyan Theme - Custom cyan/teal colors
 */
export function LiquidOceanCyan() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                backgroundColor={0x0a1a1a}
                accentColor={0x00ffff}
                boatCount={3}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-lg">
                        Cyber Ocean
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}

/**
 * Purple Theme - Custom purple/violet colors
 */
export function LiquidOceanPurple() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                backgroundColor={0x0a0a1a}
                accentColor={0x9933ff}
                boatCount={7}
                rotationSpeed={0.002}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-purple-400 drop-shadow-lg">
                        Neon Dreams
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}

/**
 * High Detail - More fragments, more boats
 */
export function LiquidOceanHighDetail() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                oceanFragments={50}
                boatCount={10}
                boatSpread={8}
                waveAmplitude={0.15}
                showGrid={false}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-3xl font-bold text-pink-500 drop-shadow-lg">
                        High Detail Mode
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}

/**
 * Calm Waters - Slow rotation, gentle waves
 */
export function LiquidOceanCalm() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                backgroundColor={0x0a1a1a}
                accentColor={0x00ffff}
                rotationSpeed={0.0003}
                waveAmplitude={0.08}
                waveSpeed={0.02}
                showBoats={false}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-3xl font-light text-cyan-300 tracking-widest">
                        CALM WATERS
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}

/**
 * Green Matrix - Custom green theme
 */
export function LiquidOceanMatrix() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                backgroundColor={0x0a1a0a}
                accentColor={0x00ff66}
                boatCount={6}
                waveAmplitude={0.3}
                oceanFragments={40}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-green-400 drop-shadow-lg font-mono">
                        MATRIX
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}

/**
 * Sunset Theme - Orange/warm colors
 */
export function LiquidOceanSunset() {
    return (
        <div className="relative flex h-[400px] w-full overflow-hidden rounded-lg border">
            <LiquidOcean
                backgroundColor={0x1a0a0a}
                accentColor={0xff6600}
                boatCount={4}
                waveSpeed={0.08}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-orange-400 drop-shadow-lg">
                        Sunset Waves
                    </h1>
                </div>
            </LiquidOcean>
        </div>
    );
}
