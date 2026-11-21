"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TapRevealProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Content hidden behind the pixel field until it is revealed. */
  children: React.ReactNode;
  /** Text in the chip shown over the sealed field. */
  label?: React.ReactNode;
  /** Accessible name of the button that seals the content again. */
  hideLabel?: string;
  /** Size of one pixel cell in CSS pixels, including its 1px gap. */
  cellSize?: number;
  /** Length of the dissolve in milliseconds. */
  duration?: number;
  /** Let a few cells brighten and settle while the field is sealed. */
  shimmer?: boolean;
  /** Controlled revealed state. */
  revealed?: boolean;
  /** Initial revealed state when uncontrolled. */
  defaultRevealed?: boolean;
  /** Called when the content is revealed or sealed again. */
  onRevealedChange?: (revealed: boolean) => void;
  /** Show a button that seals the content again after it is revealed. */
  hideable?: boolean;
  /** Classes for the wrapper around children, merged with cn. */
  contentClassName?: string;
}

type Point = { x: number; y: number };

interface Palette {
  base: string;
  shades: [string, string, string];
  twinkle: string;
  flash: string;
}

interface Field {
  reveal: (origin: Point | null) => void;
  seal: () => void;
}

const FALLBACK: Palette = {
  base: "#ffffff",
  shades: ["#f4f4f5", "#efeff1", "#e4e4e7"],
  twinkle: "#d4d4d8",
  flash: "#18181b",
};

function hash(value: number) {
  let n = Math.imul(value ^ 0x9e3779b9, 0x85ebca6b);
  n ^= n >>> 13;
  n = Math.imul(n, 0xc2b2ae35);
  n ^= n >>> 16;
  return n >>> 0;
}

function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function readPalette(el: HTMLElement): Palette {
  const style = getComputedStyle(el);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  const background = style.backgroundColor;
  const opaque = background && background !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(background);
  return {
    // The gaps between cells use the card background so the field reads as one surface.
    base: opaque ? background : read("--tap-reveal-base", FALLBACK.base),
    shades: [
      read("--tap-reveal-1", FALLBACK.shades[0]),
      read("--tap-reveal-2", FALLBACK.shades[1]),
      read("--tap-reveal-3", FALLBACK.shades[2]),
    ],
    twinkle: read("--tap-reveal-twinkle", FALLBACK.twinkle),
    flash: read("--tap-reveal-flash", FALLBACK.flash),
  };
}

export function TapReveal({
  children,
  label = "Tap to reveal",
  hideLabel = "Hide again",
  cellSize = 8,
  duration = 650,
  shimmer = true,
  revealed,
  defaultRevealed = false,
  onRevealedChange,
  hideable = true,
  className,
  contentClassName,
  onClick,
  onKeyDown,
  "aria-label": ariaLabel,
  ...props
}: TapRevealProps) {
  const id = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fieldRef = React.useRef<Field | null>(null);
  const originRef = React.useRef<Point | null>(null);
  const [internalRevealed, setInternalRevealed] = React.useState(defaultRevealed);
  const isRevealed = revealed ?? internalRevealed;
  const revealedRef = React.useRef(isRevealed);

  const setRevealed = (next: boolean) => {
    if (revealed === undefined) setInternalRevealed(next);
    onRevealedChange?.(next);
  };

  // The pixel field lives in a canvas and is driven imperatively, outside React renders.
  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const cell = Math.max(2, Math.round(cellSize));
    const gap = cell >= 4 ? 1 : 0;
    const seed = hashString(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    let state: "sealed" | "revealing" | "open" = revealedRef.current ? "open" : "sealed";
    let palette = readPalette(root);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let visible = true;
    let revealFrame = 0;
    let shimmerFrame = 0;
    let nextTwinkle = 0;
    const twinkles = new Map<number, number>();

    const shadeOf = (i: number) => {
      const h = hash(i + seed) % 10;
      return palette.shades[h < 6 ? 0 : h < 9 ? 1 : 2];
    };
    const paintCell = (i: number, color: string) => {
      const x = (i % cols) * cell;
      const y = Math.floor(i / cols) * cell;
      ctx.fillStyle = palette.base;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cell - gap, cell - gap);
    };
    const clearCell = (i: number) => {
      ctx.clearRect((i % cols) * cell, Math.floor(i / cols) * cell, cell, cell);
    };
    const clearAll = () => ctx.clearRect(0, 0, width, height);
    const paintAll = () => {
      twinkles.clear();
      ctx.fillStyle = palette.base;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0, n = cols * rows; i < n; i++) paintCell(i, shadeOf(i));
    };

    const shimmerTick = (now: number) => {
      shimmerFrame = 0;
      if (state !== "sealed" || !visible || !shimmer || reduceMotion.matches) return;
      twinkles.forEach((until, i) => {
        if (now > until) {
          paintCell(i, shadeOf(i));
          twinkles.delete(i);
        }
      });
      if (now > nextTwinkle && cols * rows > 0) {
        for (let k = 0; k < 2; k++) {
          const i = Math.floor(Math.random() * cols * rows);
          paintCell(i, Math.random() < 0.5 ? palette.twinkle : palette.shades[2]);
          twinkles.set(i, now + 380 + Math.random() * 420);
        }
        nextTwinkle = now + 90 + Math.random() * 120;
      }
      shimmerFrame = requestAnimationFrame(shimmerTick);
    };
    const startShimmer = () => {
      if (!shimmerFrame) shimmerFrame = requestAnimationFrame(shimmerTick);
    };

    const resize = () => {
      const nextWidth = root.clientWidth;
      const nextHeight = root.clientHeight;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      if (state === "sealed") paintAll();
      else finish();
    };

    const finish = () => {
      cancelAnimationFrame(revealFrame);
      state = "open";
      clearAll();
    };

    const reveal = (origin: Point | null) => {
      if (state !== "sealed") return;
      state = "revealing";
      twinkles.clear();
      if (reduceMotion.matches || duration <= 0) {
        finish();
        return;
      }

      const ox = origin?.x ?? width / 2;
      const oy = origin?.y ?? height / 2;
      const reach = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(width - ox, oy),
        Math.hypot(ox, height - oy),
        Math.hypot(width - ox, height - oy),
      ) || 1;
      const flash = Math.min(70, duration * 0.12);
      const jitter = duration * 0.2;
      const spread = Math.max(0, duration - flash - jitter);
      const count = cols * rows;
      const start = new Float32Array(count);
      const order = new Uint32Array(count);
      for (let i = 0; i < count; i++) {
        const cx = (i % cols) * cell + cell / 2;
        const cy = Math.floor(i / cols) * cell + cell / 2;
        start[i] = (Math.hypot(cx - ox, cy - oy) / reach) * spread + ((hash(i ^ seed) % 1000) / 1000) * jitter;
        order[i] = i;
      }
      order.sort((a, b) => start[a] - start[b]);

      let lit = 0;
      let cleared = 0;
      let startedAt = -1;
      const frame = (now: number) => {
        if (startedAt < 0) startedAt = now;
        const elapsed = now - startedAt;
        while (lit < count && start[order[lit]] <= elapsed) paintCell(order[lit++], palette.flash);
        while (cleared < lit && start[order[cleared]] + flash <= elapsed) clearCell(order[cleared++]);
        if (cleared < count) revealFrame = requestAnimationFrame(frame);
        else finish();
      };
      revealFrame = requestAnimationFrame(frame);
    };

    const repaint = (force = false) => {
      if (state !== "sealed") return;
      const next = readPalette(root);
      // Other scripts (smooth scrolling, scroll locks) also touch <html>; only repaint when a colour changed.
      if (!force && JSON.stringify(next) === JSON.stringify(palette)) return;
      palette = next;
      paintAll();
    };

    const seal = () => {
      if (state === "sealed") return;
      cancelAnimationFrame(revealFrame);
      state = "sealed";
      repaint(true);
      startShimmer();
    };

    resize();
    startShimmer();
    fieldRef.current = { reveal, seal };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startShimmer();
    });
    visibilityObserver.observe(root);
    // Follow class or data-theme switches (next-themes) and the OS scheme.
    const onThemeChange = () => repaint();
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    darkScheme.addEventListener("change", onThemeChange);
    reduceMotion.addEventListener("change", startShimmer);

    return () => {
      fieldRef.current = null;
      cancelAnimationFrame(revealFrame);
      cancelAnimationFrame(shimmerFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      darkScheme.removeEventListener("change", onThemeChange);
      reduceMotion.removeEventListener("change", startShimmer);
    };
  }, [id, cellSize, duration, shimmer]);

  React.useEffect(() => {
    revealedRef.current = isRevealed;
    const field = fieldRef.current;
    if (!field) return;
    if (isRevealed) field.reveal(originRef.current);
    else field.seal();
    originRef.current = null;
  }, [isRevealed]);

  // A null origin dissolves from the centre.
  const revealFrom = (origin: Point | null) => {
    originRef.current = origin;
    setRevealed(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isRevealed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // detail is 0 for clicks synthesised from the keyboard.
    revealFrom(event.detail === 0 ? null : { x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || isRevealed || event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      revealFrom(null);
    }
  };

  const handleHide = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setRevealed(false);
    requestAnimationFrame(() => rootRef.current?.focus());
  };

  return (
    <div
      {...props}
      ref={rootRef}
      role={isRevealed ? props.role : "button"}
      // -1 once revealed keeps keyboard focus on the card instead of dropping it to the body.
      tabIndex={isRevealed ? props.tabIndex ?? -1 : 0}
      aria-label={isRevealed ? ariaLabel : ariaLabel ?? (typeof label === "string" ? label : "Reveal hidden content")}
      data-state={isRevealed ? "revealed" : "sealed"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/tap-reveal relative isolate overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-950 transition-[border-color] duration-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white",
        "[--tap-reveal-1:#f4f4f5] [--tap-reveal-2:#efeff1] [--tap-reveal-3:#e4e4e7] [--tap-reveal-twinkle:#d4d4d8] [--tap-reveal-flash:#18181b]",
        "dark:[--tap-reveal-1:#121214] dark:[--tap-reveal-2:#18181b] dark:[--tap-reveal-3:#1f1f23] dark:[--tap-reveal-twinkle:#3f3f46] dark:[--tap-reveal-flash:#e4e4e7]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-white",
        !isRevealed && "cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700",
        className,
      )}
    >
      {/* Hidden from view and assistive tech until revealed. The text is still in the page source, so do not use this for secrets. */}
      <div className={cn("relative z-[1] min-w-0 p-5", !isRevealed && "invisible", contentClassName)}>{children}</div>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn("absolute inset-0 z-[2] block size-full", isRevealed && "pointer-events-none")}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-[3] grid place-items-center transition-opacity duration-200 motion-reduce:transition-none",
          isRevealed && "opacity-0",
        )}
      >
        <span className="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-[13px] font-medium text-zinc-600 ring-[6px] ring-white transition-[color,border-color,translate] duration-200 group-hover/tap-reveal:-translate-y-px group-hover/tap-reveal:border-zinc-300 group-hover/tap-reveal:text-zinc-950 motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-950 dark:group-hover/tap-reveal:border-zinc-700 dark:group-hover/tap-reveal:text-white">
          <Eye className="size-[15px]" strokeWidth={1.75} />
          {label}
        </span>
      </div>

      {hideable && (
        <button
          type="button"
          aria-label={hideLabel}
          tabIndex={isRevealed ? 0 : -1}
          onClick={handleHide}
          className={cn(
            "absolute right-2.5 top-2.5 z-[4] grid size-8 place-items-center rounded-md text-zinc-500 transition-[opacity,visibility,background-color,color] duration-200 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-950 motion-reduce:transition-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:outline-white",
            // Fade in after the dissolve, but keep hover colour changes instant (delays follow the transition list above).
            isRevealed ? "visible opacity-100 [transition-delay:300ms,300ms,0ms,0ms]" : "invisible opacity-0",
          )}
        >
          <EyeOff className="size-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

export default TapReveal;
