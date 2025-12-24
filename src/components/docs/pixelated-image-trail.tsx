"use client";

import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with portal
const PixelatedImageTrail = dynamic(
    () => import("@/components/ui/pixelated-image-trail").then(mod => mod.PixelatedImageTrail),
    { ssr: false }
);

/**
 * Default demo showcasing the pixelated image trail effect
 * Uses locally cached images for instant loading and buttery-smooth performance
 */
export function PixelatedImageTrailDemo() {
    return (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
            <PixelatedImageTrail
                images={[
                    "/trail-images/image1.jpg",
                    "/trail-images/image4.jpg",
                    "/trail-images/image5.jpg",
                ]}
                slices={4}
                smoothing={0.1}
                spawnThreshold={100}
                config={{
                    staggerIn: 6,
                    inDuration: 150,
                }}
            />
            <div className="text-center z-10 pointer-events-none">
                <h2 className="text-4xl font-bold text-white mb-2">Move Your Mouse</h2>
                <p className="text-zinc-400">Watch the magic unfold</p>
            </div>
        </div>
    );
}

/**
 * Demo with custom timing configuration
 */
export function PixelatedImageTrailFastDemo() {
    return (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 rounded-xl overflow-hidden flex items-center justify-center">
            <PixelatedImageTrail
                images={[
                    "/trail-images/image8.jpg",
                    "/trail-images/image9.jpg",
                    "/trail-images/image10.jpg",
                ]}
                config={{
                    imageLifespan: 600,
                    inDuration: 300,
                    outDuration: 350,
                    staggerIn: 12,
                    staggerOut: 8,
                }}
                spawnThreshold={50}
                smoothing={0.15}
            />
            <div className="text-center z-10 pointer-events-none">
                <h2 className="text-4xl font-bold text-white mb-2">Fast Mode</h2>
                <p className="text-purple-300">Rapid trail with quick transitions</p>
            </div>
        </div>
    );
}

/**
 * Demo with more slices for finer pixelation
 */
export function PixelatedImageTrailFineDemo() {
    return (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-xl overflow-hidden flex items-center justify-center">
            <PixelatedImageTrail
                images={[
                    "/trail-images/image11.jpg",
                    "/trail-images/image12.jpg",
                    "/trail-images/image1.jpg",
                ]}
                slices={20}
                smoothing={0.12}
                spawnThreshold={55}
                config={{
                    staggerIn: 10,
                    staggerOut: 6,
                    inDuration: 380,
                }}
            />
            <div className="text-center z-10 pointer-events-none">
                <h2 className="text-4xl font-bold text-white mb-2">Fine Slices</h2>
                <p className="text-emerald-300">20 slices for smoother transitions</p>
            </div>
        </div>
    );
}

/**
 * Demo with coarse slices for dramatic pixelation
 */
export function PixelatedImageTrailCoarseDemo() {
    return (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-orange-900 via-red-800 to-rose-900 rounded-xl overflow-hidden flex items-center justify-center">
            <PixelatedImageTrail
                images={[
                    "/trail-images/image2.jpg",
                    "/trail-images/image3.jpg",
                    "/trail-images/image4.jpg",
                ]}
                slices={5}
                smoothing={0.18}
                spawnThreshold={70}
                config={{
                    staggerIn: 40,
                    staggerOut: 30,
                    inDuration: 450,
                }}
            />
            <div className="text-center z-10 pointer-events-none">
                <h2 className="text-4xl font-bold text-white mb-2">Coarse Slices</h2>
                <p className="text-orange-300">5 slices for dramatic effect</p>
            </div>
        </div>
    );
}

export default PixelatedImageTrailDemo;
