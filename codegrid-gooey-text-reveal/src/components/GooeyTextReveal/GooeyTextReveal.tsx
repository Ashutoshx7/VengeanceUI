"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export type GooeyTextRevealMode = "immediate" | "scroll" | "scrub";
export type GooeyTextRevealScroller =
  | string
  | HTMLElement
  | React.RefObject<HTMLElement | null>;

export interface GooeyTextRevealProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Text-bearing elements to split into animated lines. */
  children: React.ReactNode;
  /** Controls when the reveal runs. */
  mode?: GooeyTextRevealMode;
  /** Delay before non-scrub animations begin, in seconds. */
  delay?: number;
  /** Reveal duration for each line, in seconds. */
  duration?: number;
  /** Delay between consecutive lines, in seconds. */
  stagger?: number;
  /** Starting blur measured in em units. */
  blurAmount?: number;
  /** GSAP easing expression used by the reveal tween. */
  ease?: string;
  /** ScrollTrigger start position for scroll and scrub modes. */
  start?: string;
  /** ScrollTrigger end position for scrub mode. */
  end?: string;
  /** Optional scrollable ancestor used instead of the browser viewport. */
  scroller?: GooeyTextRevealScroller;
  /** Whether a scroll reveal should only run once. */
  once?: boolean;
  /** Disables splitting and animation while preserving the content. */
  disabled?: boolean;
  /** Called after the reveal completes. */
  onComplete?: () => void;
}

const LINE_EDGE_BLUR = 0.4;

function wrapLine(line: HTMLElement) {
  const inner = document.createElement("span");
  inner.dataset.gooeyRevealInner = "";
  inner.style.display = "inline-block";
  inner.style.willChange = "filter";

  while (line.firstChild) {
    inner.appendChild(line.firstChild);
  }

  line.appendChild(inner);
  return inner;
}

function getRevealTargets(container: HTMLDivElement) {
  const explicitTargets = Array.from(
    container.querySelectorAll<HTMLElement>("[data-gooey-reveal-item]"),
  );

  if (explicitTargets.length > 0) return explicitTargets;

  const directChildren = Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

  return directChildren.length > 0 ? directChildren : [container];
}

export const GooeyTextReveal = React.forwardRef<
  HTMLDivElement,
  GooeyTextRevealProps
>(function GooeyTextReveal(
  {
    children,
    mode = "immediate",
    delay = 0,
    duration = 1.5,
    stagger = 0.1,
    blurAmount = 0.35,
    ease = "power3.out",
    start = "top 80%",
    end = "bottom 75%",
    scroller,
    once = true,
    disabled = false,
    onComplete,
    ...props
  },
  forwardedRef,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reactId = React.useId();
  const filterId = React.useMemo(
    () => `gooey-text-reveal-${reactId.replace(/:/g, "")}`,
    [reactId],
  );
  const setContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || disabled) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) return;

      let splits: SplitText[] = [];
      let tween: gsap.core.Tween | null = null;
      let animationFrame = 0;
      let measuredWidth = container.getBoundingClientRect().width;
      let disposed = false;

      const revert = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = null;

        splits.forEach((split) => split.revert());
        splits = [];
      };

      const build = () => {
        if (disposed) return;
        revert();

        const layers: HTMLElement[] = [];

        getRevealTargets(container).forEach((target) => {
          const split = SplitText.create(target, {
            type: "lines",
            linesClass: "gooey-text-reveal-line",
            aria: "auto",
          });

          split.lines.forEach((line) => {
            const lineElement = line as HTMLElement;
            lineElement.style.display = "block";
            lineElement.style.filter =
              `url(#${filterId}) blur(${LINE_EDGE_BLUR}px)`;
            lineElement.style.willChange = "filter";
            layers.push(wrapLine(lineElement));
          });

          splits.push(split);
        });

        if (layers.length === 0) return;

        gsap.set(layers, { filter: `blur(${blurAmount}em)` });

        const animation: gsap.TweenVars = {
          filter: "blur(0em)",
          duration,
          ease,
          stagger,
          onComplete,
        };

        if (mode === "scrub") {
          const resolvedScroller =
            typeof scroller === "string" || scroller instanceof HTMLElement
              ? scroller
              : scroller?.current ?? undefined;

          animation.scrollTrigger = {
            trigger: container,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
            scroller: resolvedScroller,
          };
        } else if (mode === "scroll") {
          const resolvedScroller =
            typeof scroller === "string" || scroller instanceof HTMLElement
              ? scroller
              : scroller?.current ?? undefined;

          animation.delay = delay;
          animation.scrollTrigger = {
            trigger: container,
            start,
            once,
            toggleActions: once ? "play none none none" : "play none none reverse",
            invalidateOnRefresh: true,
            scroller: resolvedScroller,
          };
        } else {
          animation.delay = delay;
        }

        tween = gsap.to(layers, animation);
      };

      build();

      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(() => {
          if (!disposed) build();
        });
      }

      const resizeObserver = new ResizeObserver(([entry]) => {
        const nextWidth = entry.contentRect.width;
        if (Math.abs(nextWidth - measuredWidth) < 0.5) return;

        measuredWidth = nextWidth;
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(build);
      });

      resizeObserver.observe(container);

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        window.cancelAnimationFrame(animationFrame);
        revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [
        mode,
        delay,
        duration,
        stagger,
        blurAmount,
        ease,
        start,
        end,
        scroller,
        once,
        disabled,
        onComplete,
        filterId,
        children,
      ],
    },
  );

  return (
    <>
      <div ref={setContainerRef} {...props}>
        {children}
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
});

GooeyTextReveal.displayName = "GooeyTextReveal";

export default GooeyTextReveal;
