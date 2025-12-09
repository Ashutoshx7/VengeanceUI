"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PerspectiveGridProps {
    className?: string;
}

export function PerspectiveGrid({ className }: PerspectiveGridProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 40x40 grid = 1600 tiles
    const tiles = Array.from({ length: 1600 });

    return (
        <div
            className={cn(
                "relative w-full h-full overflow-hidden bg-white dark:bg-black",
                "[--fade-stop:#ffffff] dark:[--fade-stop:#000000]",
                className
            )}
            style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
            }}
        >
            <div
                className="absolute w-[80rem] aspect-square grid origin-center"
                style={{
                    left: "50%",
                    top: "50%",
                    transform:
                        "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
                    transformStyle: "preserve-3d",
                    gridTemplateColumns: "repeat(40, 1fr)",
                    gridTemplateRows: "repeat(40, 1fr)",
                }}
            >
                {/* Tiles */}
                {mounted &&
                    tiles.map((_, i) => (
                        <div
                            key={i}
                            className="tile min-h-[1px] min-w-[1px] border border-gray-300 dark:border-gray-700 bg-transparent transition-colors duration-[1500ms] hover:duration-0"
                        />
                    ))}
            </div>

            {/* Radial Gradient Mask (Overlay) */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: "radial-gradient(circle, transparent 25%, var(--fade-stop) 80%)",
                }}
            />
        </div>
    );
}

export default PerspectiveGrid;
