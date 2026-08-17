"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Highlight Grid
 *
 * A grid of labelled cells with a single coloured highlight that glides to sit
 * behind whichever cell the cursor is over — morphing its position, size and
 * colour with a smooth transition. Each cell carries its own accent colour, and
 * rows can hold any number of cells.
 *
 * Ported 1:1 from the vanilla "CodeGrid Direction-Aware Hover" experiment into
 * a single, self-contained, prop-driven React component. No animation library —
 * the highlight is a CSS transition driven by pointer events.
 */

export interface HighlightItem {
  label: string;
  /** Accent colour for this cell. Falls back to the cycled `colors` palette. */
  color?: string;
}

export interface HighlightGridProps {
  /** Rows of cells. Each row can hold a different number of cells. */
  rows?: HighlightItem[][];
  /** Palette cycled for cells without an explicit `color`. */
  colors?: string[];
  /** Highlight transition duration in ms. Defaults to 250. */
  transitionDuration?: number;
  /** Park the highlight on the first cell on mount. Defaults to true. */
  highlightFirst?: boolean;
  /** Extra classes for the root element. */
  className?: string;
}

const DEFAULT_COLORS = [
  "#E24E1B",
  "#4381C1",
  "#F79824",
  "#04A777",
  "#5B8C5A",
  "#2176FF",
  "#818D92",
  "#22AAA1",
];

const DEFAULT_ROWS: HighlightItem[][] = [
  [{ label: "html" }, { label: "css" }, { label: "javascript" }],
  [{ label: "gsap" }, { label: "scrolltrigger" }, { label: "react" }, { label: "next.js" }, { label: "three.js" }],
];

export function HighlightGrid({
  rows = DEFAULT_ROWS,
  colors = DEFAULT_COLORS,
  transitionDuration = 250,
  highlightFirst = true,
  className,
}: HighlightGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<number, HTMLElement>>(new Map());
  const activeRef = useRef<{ gi: number; color: string } | null>(null);
  const [active, setActive] = useState<number | null>(highlightFirst ? 0 : null);

  // Flatten rows into cells with a running global index + resolved colour.
  const gridRows = useMemo(() => {
    let gi = 0;
    return rows.map((row) =>
      row.map((item) => {
        const idx = gi++;
        return { label: item.label, color: item.color ?? colors[idx % colors.length], gi: idx };
      }),
    );
  }, [rows, colors]);

  const moveTo = useCallback((gi: number, color: string) => {
    // The highlight lives inside the grid, so offsets are relative to the grid.
    const grid = gridRef.current;
    const highlight = highlightRef.current;
    const el = cellRefs.current.get(gi);
    if (!grid || !highlight || !el) return;

    const rect = el.getBoundingClientRect();
    const crect = grid.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    highlight.style.opacity = "1";
    highlight.style.transform = `translate(${rect.left - crect.left}px, ${rect.top - crect.top}px)`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.backgroundColor = color;
    activeRef.current = { gi, color };
  }, []);

  // Park on the first cell initially, and keep the highlight aligned on resize.
  useEffect(() => {
    let rafId: number;
    const updatePosition = () => {
      if (activeRef.current) {
        moveTo(activeRef.current.gi, activeRef.current.color);
      } else if (highlightFirst && gridRows[0]?.[0]) {
        const first = gridRows[0][0];
        const h = highlightRef.current;
        if (h) {
          h.style.transitionDuration = "0s";
          moveTo(first.gi, first.color);
          rafId = requestAnimationFrame(() => {
            if (h) h.style.transitionDuration = `${transitionDuration}ms`;
          });
        }
      }
    };

    rafId = requestAnimationFrame(updatePosition);

    let resizeRaf: number;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (activeRef.current) moveTo(activeRef.current.gi, activeRef.current.color);
      });
    };

    const grid = gridRef.current;
    const ro = grid ? new ResizeObserver(onResize) : null;
    if (grid && ro) ro.observe(grid);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(resizeRaf);
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [gridRows, highlightFirst, moveTo, transitionDuration]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center min-h-[320px] p-4 sm:p-8 overflow-hidden",
        className,
      )}
    >
      <div
        ref={gridRef}
        className="relative mx-auto flex h-full min-h-[240px] max-h-[360px] w-full max-w-[640px] flex-col border border-neutral-300 dark:border-white/20 rounded-2xl overflow-hidden bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-xs shadow-sm"
      >
        {/* Sliding highlight — solid accent (which fades between cells) with a
            fixed radiant gradient sheen layered over it. */}
        <div
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-0 opacity-0 rounded-lg"
          style={{
            backgroundImage:
              "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.28), rgba(255,255,255,0) 52%), linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(0,0,0,0.22))",
            transitionProperty: "transform, width, height, background-color, opacity",
            transitionDuration: `${transitionDuration}ms`,
            transitionTimingFunction: "ease",
          }}
        />

        {gridRows.map((row, r) => (
          <div
            key={r}
            className={cn(
              "flex flex-1 min-h-[60px]",
              r < gridRows.length - 1 && "border-b border-neutral-300 dark:border-white/20",
            )}
          >
            {row.map((cell, c) => {
              const isActive = active === cell.gi;
              return (
                <div
                  key={cell.gi}
                  ref={(el) => {
                    if (el) cellRefs.current.set(cell.gi, el);
                    else cellRefs.current.delete(cell.gi);
                  }}
                  onMouseEnter={() => {
                    setActive(cell.gi);
                    moveTo(cell.gi, cell.color);
                  }}
                  className={cn(
                    "flex h-full flex-1 items-center justify-center cursor-pointer p-3 text-center",
                    c < row.length - 1 && "border-r border-neutral-300 dark:border-white/20",
                  )}
                >
                  <p
                    className={cn(
                      "relative z-[2] font-mono text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200 select-none",
                      isActive ? "text-white drop-shadow-xs" : "text-neutral-700 dark:text-white/80",
                    )}
                  >
                    ( {cell.label} )
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighlightGrid;
