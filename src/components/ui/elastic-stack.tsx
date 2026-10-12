"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ElasticStackItem {
  id: string | number;
  image?: string;
  name?: string;
}

export interface ElasticStackProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ElasticStackItem[];
  itemSize?: number;
  overlap?: number;
  pushForce?: number;
}

export function ElasticStack({
  items,
  itemSize = 70,
  overlap = 30,
  pushForce = 15,
  className,
  ...props
}: ElasticStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = items.length;
  // Custom spring-like easing from the original CSS
  const springEasing = "linear(0, 0.79 14.4%, 1.026 22.4%, 1.164 31.2%, 1.207 38.2%, 1.208 46.2%, 1.033 80%, 1)";

  return (
    <div
      className={cn("flex items-center justify-center cursor-pointer py-8", className)}
      onMouseLeave={() => setHoveredIndex(null)}
      {...props}
    >
      {items.map((item, i) => {
        let translateX = 0;
        let scale = 1;
        let zIndex = i; // Base stacking order
        let isHovered = hoveredIndex === i;

        if (hoveredIndex !== null) {
          if (i > hoveredIndex) {
            // Right neighbour always clears the hovered item so its z-index swap stays smooth near the end
            translateX = Math.max(Math.min(pushForce * (total - i - 1), overlap), overlap - pushForce * (i - hoveredIndex - 1));
          } else if (i < hoveredIndex) {
            translateX = -Math.min(pushForce * i, overlap);
          } else {
            scale = 1.25;
            zIndex = 100;
          }
        }

        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredIndex(i)}
            className={cn(
              "relative flex items-center justify-center rounded-full isolate bg-neutral-100 dark:bg-neutral-800",
              "border-2 border-white dark:border-neutral-950",
              isHovered ? "shadow-xl" : "shadow-sm"
            )}
            style={{
              width: itemSize,
              height: itemSize,
              marginLeft: i === 0 ? 0 : -overlap,
              transform: `translateX(${translateX}px) scale(${scale})`,
              transitionProperty: "transform, box-shadow, z-index",
              transitionDuration: "700ms, 700ms, 0ms",
              // Raise the hovered item only once its right neighbour has slid mostly clear; drop it instantly on release
              transitionDelay: isHovered ? "0ms, 0ms, 150ms" : "0ms",
              transitionTimingFunction: springEasing,
              zIndex,
            }}
          >
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={item.image} 
                alt={item.name || `Avatar ${i}`}
                className="w-full h-full object-cover rounded-full pointer-events-none"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center font-semibold text-neutral-500 dark:text-neutral-400">
                {item.name ? item.name.charAt(0) : i + 1}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ElasticStack;
