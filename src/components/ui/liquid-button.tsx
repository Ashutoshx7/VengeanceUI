"use client";

import React, {
  useId,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  forwardRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const liquidButtonVariants = cva(
  [
    "group relative isolation-isolate inline-flex items-center justify-center overflow-hidden",
    "rounded-full font-medium tracking-tight whitespace-nowrap select-none",
    "cursor-pointer -webkit-tap-highlight-color-transparent",
    "transition-[transform,box-shadow,border-color] duration-150 ease-out",
    "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.38)]",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#615fff]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default:
          "[--liquid-fill:#111111] dark:[--liquid-fill:#ffffff] [--liquid-text:#111111] dark:[--liquid-text:#ffffff] [--liquid-active-text:#ffffff] dark:[--liquid-active-text:#111111] [--liquid-border:#111111] dark:[--liquid-border:#ffffff] border-[1.5px] border-[var(--liquid-border)] text-[var(--liquid-text)] bg-transparent",
        dark:
          "[--liquid-fill:#ffffff] [--liquid-text:#ffffff] [--liquid-active-text:#111111] [--liquid-border:#ffffff] border-[1.5px] border-[var(--liquid-border)] text-[var(--liquid-text)] bg-transparent",
        destructive:
          "[--liquid-fill:#ef4444] [--liquid-text:#ef4444] [--liquid-active-text:#ffffff] [--liquid-border:#ef4444] border-[1.5px] border-[var(--liquid-border)] text-[var(--liquid-text)] bg-transparent",
        accent:
          "[--liquid-fill:#615fff] [--liquid-text:#615fff] [--liquid-active-text:#ffffff] [--liquid-border:#615fff] border-[1.5px] border-[var(--liquid-border)] text-[var(--liquid-text)] bg-transparent",
      },
      size: {
        sm: "min-h-9 px-4 text-xs gap-1.5",
        default: "min-h-12 px-7 text-sm gap-2",
        lg: "min-h-14 px-9 text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  children?: React.ReactNode;
  fillColor?: string;
  textColor?: string;
  activeTextColor?: string;
  borderColor?: string;
  noiseFrequency?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const DEFAULT_NOISE_FREQUENCY = {
  baseX: 0.035,
  baseY: 0.08,
} as const;

const isValidFrequency = (value: number) => Number.isFinite(value) && value >= 0;

/**
 * Parse SVG `feTurbulence` `baseFrequency`.
 *
 * SVG treats a single number as both X and Y. Zero is a valid frequency and
 * must not fall back to the defaults. Negative values are an error in SVG,
 * so they fall back to the defaults like any other invalid value.
 */
export function parseNoiseFrequency(value: string | undefined | null): {
  baseX: number;
  baseY: number;
} {
  if (value == null) {
    return { baseX: DEFAULT_NOISE_FREQUENCY.baseX, baseY: DEFAULT_NOISE_FREQUENCY.baseY };
  }

  const tokens = String(value).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { baseX: DEFAULT_NOISE_FREQUENCY.baseX, baseY: DEFAULT_NOISE_FREQUENCY.baseY };
  }

  const parsed = tokens.map(Number);
  const x = parsed[0];
  const y = parsed[1];

  if (tokens.length === 1) {
    if (!isValidFrequency(x)) {
      return { baseX: DEFAULT_NOISE_FREQUENCY.baseX, baseY: DEFAULT_NOISE_FREQUENCY.baseY };
    }
    return { baseX: x, baseY: x };
  }

  return {
    baseX: isValidFrequency(x) ? x : DEFAULT_NOISE_FREQUENCY.baseX,
    baseY: isValidFrequency(y) ? y : DEFAULT_NOISE_FREQUENCY.baseY,
  };
}

function formatNoiseFrequency(frequency: { baseX: number; baseY: number }) {
  return `${frequency.baseX} ${frequency.baseY}`;
}

/**
 * Copy the label into the inverted layer.
 *
 * The copy's text is drawn with `::before { content: attr(data-liquid-text) }`
 * instead of real text nodes, so the label is only in the DOM once. Otherwise
 * textContent, innerText, `getByText` and analytics click tracking would read
 * "SubmitSubmit".
 */
function cloneInvertedContent(source: HTMLElement, dest: HTMLElement) {
  const fragment = document.createDocumentFragment();
  source.childNodes.forEach((node) => {
    const clone = node.cloneNode(true);
    if (clone instanceof Element) {
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    }
    fragment.append(clone);
  });

  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  for (const text of textNodes) {
    // Whitespace only affects spacing, and SVG text can't hold an HTML span.
    if (!text.data.trim() || text.parentNode instanceof SVGElement) continue;
    const label = document.createElement("span");
    label.setAttribute("data-liquid-text", text.data);
    text.replaceWith(label);
  }

  dest.replaceChildren(fragment);
}

export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      fillColor,
      textColor,
      activeTextColor,
      borderColor,
      noiseFrequency = "0.035 0.08",
      style,
      disabled,
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onFocus,
      onBlur,
      ...rest
    },
    forwardedRef
  ) => {
    const rawId = useId();
    const instanceId = `liquid-ink-${rawId.replace(/[^a-zA-Z0-9-_]/g, "")}`;
    const filterId = `${instanceId}-filter`;
    const clipPathId = `${instanceId}-clip`;

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const blobRef = useRef<SVGEllipseElement | null>(null);
    const clipEllipseRef = useRef<SVGEllipseElement | null>(null);
    const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
    const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
    const rippleRef = useRef<SVGCircleElement | null>(null);

    const [isPressed, setIsPressed] = useState(false);

    const contentRef = useRef<HTMLSpanElement | null>(null);
    const invertedRef = useRef<HTMLSpanElement | null>(null);
    const parsedFreq = parseNoiseFrequency(noiseFrequency);
    const parsedFreqRef = useRef(parsedFreq);
    parsedFreqRef.current = parsedFreq;

    const stateRef = useRef({
      x: 0,
      y: 0,
      radius: 0,
      radiusVelocity: 0,
      pointerActive: false,
      focusActive: false,
      targetSpeed: 0,
      speed: 0,
      targetAngle: 0,
      angle: 0,
      stretch: 1,
      frame: 0,
      lastFrame: 0,
      lastPointerTime: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      disabled: Boolean(disabled),

      time: 0,
      unstableJitterX: 0,
      unstableJitterY: 0,
      randomSeed: 8,

      ringProgress: 0,
      ringPhase: 0,
      ringX: 0,
      ringY: 0,
      ringOriginX: 0,
      ringOriginY: 0,
      ringEscapeAngle: 0,
      ringPeakScale: 0.58,
      ringDipRatio: 0.86,
      ringSpeedMult: 1.0,
      ringEccentricity: 1.0,
    });

    stateRef.current.disabled = Boolean(disabled);

    // Width and height are in the button's own CSS pixels, before transforms
    // such as the press scale or a scaled parent. The inverted label's clip
    // path works in these pixels, so the blob has to use them too or the two
    // drift apart.
    const getDimensions = useCallback(() => {
      const svg = svgRef.current;
      const button = buttonRef.current;
      if (!svg || !button) return { width: 0, height: 0, rect: null };
      const rect = svg.getBoundingClientRect();
      return { width: button.clientWidth, height: button.clientHeight, rect };
    }, []);

    // Map a pointer position on screen into the button's own CSS pixels.
    const toLocalPoint = useCallback(
      (clientX: number, clientY: number) => {
        const { rect, width, height } = getDimensions();
        if (!rect || width <= 0 || height <= 0 || rect.width <= 0 || rect.height <= 0) {
          return null;
        }
        return {
          x: clamp(((clientX - rect.left) * width) / rect.width, 0, width),
          y: clamp(((clientY - rect.top) * height) / rect.height, 0, height),
          width,
          height,
        };
      },
      [getDimensions]
    );

    const setShapeAttributes = useCallback(
      (element: SVGEllipseElement | null, rx: number, ry: number, angle: number) => {
        if (!element) return;
        const s = stateRef.current;
        const renderX = s.x + s.unstableJitterX;
        const renderY = s.y + s.unstableJitterY;

        element.setAttribute("cx", String(renderX));
        element.setAttribute("cy", String(renderY));
        element.setAttribute("rx", String(Math.max(0, rx)));
        element.setAttribute("ry", String(Math.max(0, ry)));
        element.setAttribute("transform", `rotate(${angle} ${renderX} ${renderY})`);
      },
      []
    );

    const renderShape = useCallback(() => {
      const { width, height } = getDimensions();
      if (width <= 0 || height <= 0) return;
      const s = stateRef.current;

      const axisScale = Math.sqrt(s.stretch);
      const rx = s.radius * axisScale;
      const ry = s.radius / axisScale;

      setShapeAttributes(blobRef.current, rx, ry, s.angle);
      setShapeAttributes(clipEllipseRef.current, rx, ry, s.angle);

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (turbulenceRef.current && !prefersReducedMotion) {
        const breathingFactor = 1 + Math.sin(s.time * 2.5) * 0.12;
        const { baseX, baseY } = parsedFreqRef.current;
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `${(baseX * breathingFactor).toFixed(4)} ${(baseY * (2 - breathingFactor)).toFixed(4)}`
        );
      }

      const livingFluidShimmer = Math.sin(s.time * 4) * 1.5;
      const ringTurbulence = s.ringPhase > 0 ? (1 - s.ringProgress) * 18 : 0;
      const displacementScale = prefersReducedMotion
        ? 0
        : 4.5 + s.speed * 18 + livingFluidShimmer + ringTurbulence;
      displacementRef.current?.setAttribute("scale", displacementScale.toFixed(2));

      if (rippleRef.current) {
        if (s.ringPhase > 0) {
          const baseDimension = Math.min(width, height);
          const peakRadius = baseDimension * s.ringPeakScale;
          const recoilDipRadius = peakRadius * s.ringDipRatio;
          let currentRadius = 0;
          let currentOpacity = 0;
          let currentStroke = 2.4;

          if (s.ringPhase === 1) {
            const easeOut = 1 - Math.pow(1 - s.ringProgress, 3);
            currentRadius = easeOut * peakRadius;
            currentOpacity = 0.95 - s.ringProgress * 0.12;
            currentStroke = 2.6 - s.ringProgress * 0.3;
          } else if (s.ringPhase === 2) {
            const recoilFactor = Math.sin(s.ringProgress * Math.PI);
            currentRadius = peakRadius - recoilFactor * (peakRadius - recoilDipRadius);
            currentOpacity = 0.88;
            currentStroke = 2.3;
          } else if (s.ringPhase === 3) {
            const p = s.ringProgress;
            currentRadius = recoilDipRadius + p * Math.max(width, height) * 0.85;
            currentOpacity = Math.max(0, 0.88 * (1 - p));
            currentStroke = Math.max(1, 2.3 * (1 - p * 0.6));
          }

          rippleRef.current.setAttribute("cx", String(s.ringX + s.unstableJitterX * 0.5));
          rippleRef.current.setAttribute("cy", String(s.ringY + s.unstableJitterY * 0.5));
          rippleRef.current.setAttribute("r", String(Math.max(0, currentRadius)));
          rippleRef.current.setAttribute("opacity", String(Math.max(0, currentOpacity)));
          rippleRef.current.style.strokeWidth = `${currentStroke.toFixed(2)}px`;
          rippleRef.current.style.display = "block";
        } else {
          rippleRef.current.style.display = "none";
        }
      }
    }, [getDimensions, setShapeAttributes]);

    const maxCornerDistance = (width: number, height: number, x: number, y: number) => {
      return Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y)
      );
    };

    const tickRef = useRef<(now: number) => void>(() => {});

    const scheduleFrame = useCallback(() => {
      const s = stateRef.current;
      if (s.frame === 0) {
        s.frame = window.requestAnimationFrame((now) => tickRef.current(now));
      }
    }, []);

    tickRef.current = (now: number) => {
      const s = stateRef.current;
      s.frame = 0;

      const dt =
        s.lastFrame === 0
          ? 1 / 60
          : clamp((now - s.lastFrame) / 1000, 1 / 240, 1 / 30);
      s.lastFrame = now;
      s.time += dt;

      const { width, height } = getDimensions();
      if (width <= 0 || height <= 0) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        s.unstableJitterX = 0;
        s.unstableJitterY = 0;
        s.ringPhase = 0;
        s.ringProgress = 0;
      } else {
        const t = s.time;
        s.unstableJitterX =
          Math.sin(t * 3.7) * 2.2 +
          Math.sin(t * 7.1 + 1.2) * 1.4 +
          Math.cos(t * 11.3) * 0.8;
        s.unstableJitterY =
          Math.cos(t * 3.1) * 1.8 +
          Math.sin(t * 6.3 + 2.4) * 1.2 +
          Math.sin(t * 13.1) * 0.6;
      }

      const speedLerp = 1 - Math.exp(-dt / 0.105);
      s.speed += (s.targetSpeed - s.speed) * speedLerp;
      s.targetSpeed = 0;

      const breathingStretch = prefersReducedMotion ? 0 : Math.sin(s.time * 2.8) * 0.04;
      const desiredStretch = 1 + s.speed * 0.55 + (s.pointerActive ? breathingStretch : 0);
      s.stretch += (desiredStretch - s.stretch) * (1 - Math.exp(-dt / 0.08));

      const angleDelta = ((s.targetAngle - s.angle + 540) % 360) - 180;
      s.angle += angleDelta * (1 - Math.exp(-dt / 0.075));

      if (!prefersReducedMotion) {
        if (s.ringPhase === 1) {
          s.ringProgress += dt * 3.8 * s.ringSpeedMult;
          if (s.ringProgress >= 1) {
            s.ringPhase = 2;
            s.ringProgress = 0;
          }
        } else if (s.ringPhase === 2) {
          s.ringProgress += dt * 7.8 * s.ringSpeedMult;
          if (s.ringProgress >= 1) {
            s.ringPhase = 3;
            s.ringProgress = 0;
          }
        } else if (s.ringPhase === 3) {
          s.ringProgress += dt * 3.5 * s.ringSpeedMult;
          const glideSpeed = Math.max(width, height) * 1.55 * dt * s.ringSpeedMult;
          s.ringX += Math.cos(s.ringEscapeAngle) * glideSpeed;
          s.ringY += Math.sin(s.ringEscapeAngle) * glideSpeed;

          if (s.ringProgress >= 1) {
            s.ringPhase = 0;
            s.ringProgress = 0;
          }
        }
      }

      const active = (s.pointerActive || s.focusActive) && !s.disabled;
      const targetRadius = active
        ? maxCornerDistance(width, height, s.x, s.y) * Math.sqrt(s.stretch) * 1.14
        : 0;

      if (prefersReducedMotion) {
        s.radius = targetRadius;
        s.radiusVelocity = 0;
      } else {
        const spring = 150;
        const damping = 24;
        const acceleration =
          (targetRadius - s.radius) * spring - s.radiusVelocity * damping;
        s.radiusVelocity += acceleration * dt;
        s.radius += s.radiusVelocity * dt;
      }

      if (s.radius < 0) {
        s.radius = 0;
        s.radiusVelocity = 0;
      }

      renderShape();

      if (active || s.ringPhase > 0 || Math.abs(s.radius) > 0.1) {
        s.frame = window.requestAnimationFrame((next) => tickRef.current(next));
      } else {
        s.lastFrame = 0;
        s.radius = 0;
        s.radiusVelocity = 0;
        s.stretch = 1;
        s.speed = 0;
        s.ringPhase = 0;
        renderShape();
      }
    };

    const setOrigin = useCallback(
      (clientX: number, clientY: number) => {
        const point = toLocalPoint(clientX, clientY);
        if (!point) return;
        const s = stateRef.current;
        s.x = point.x;
        s.y = point.y;
        renderShape();
      },
      [toLocalPoint, renderShape]
    );

    const triggerClickImpulse = useCallback(
      (clientX: number, clientY: number) => {
        const point = toLocalPoint(clientX, clientY);
        if (!point) return;
        const { x: posX, y: posY, width, height } = point;
        const s = stateRef.current;

        s.ringOriginX = posX;
        s.ringOriginY = posY;
        s.ringX = posX;
        s.ringY = posY;
        s.ringPhase = 1;
        s.ringProgress = 0;

        s.randomSeed = Math.floor(Math.random() * 9999) + 1;
        if (turbulenceRef.current) {
          turbulenceRef.current.setAttribute("seed", String(s.randomSeed));
        }

        s.ringPeakScale = 0.56 + Math.random() * 0.09;
        s.ringDipRatio = 0.82 + Math.random() * 0.08;
        s.ringSpeedMult = 0.92 + Math.random() * 0.22;

        const centerX = width / 2;
        const centerY = height / 2;
        const dx = posX - centerX;
        const dy = posY - centerY;
        const baseAngle = Math.hypot(dx, dy) > 2 ? Math.atan2(dy, dx) : -Math.PI / 2;
        const anglePerturbation = (Math.random() - 0.5) * 0.85;
        s.ringEscapeAngle = baseAngle + anglePerturbation;

        const randomImpulse = 130 + Math.random() * 50;
        s.radiusVelocity += randomImpulse;

        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(10);
          } catch {
            // ignore
          }
        }

        scheduleFrame();
      },
      [toLocalPoint, scheduleFrame]
    );

    const syncSize = useCallback(() => {
      const { width, height } = getDimensions();
      if (width <= 0 || height <= 0) return;
      const s = stateRef.current;
      if (s.x === 0 && s.y === 0) {
        s.x = width / 2;
        s.y = height / 2;
      }
      renderShape();
    }, [getDimensions, renderShape]);

    const updatePointerVelocity = (event: React.PointerEvent<HTMLButtonElement>) => {
      const now = performance.now();
      const s = stateRef.current;
      if (s.lastPointerTime > 0) {
        const elapsed = Math.max(8, now - s.lastPointerTime);
        const dx = event.clientX - s.lastPointerX;
        const dy = event.clientY - s.lastPointerY;
        const pixelsPerMs = Math.hypot(dx, dy) / elapsed;
        s.targetSpeed = clamp(pixelsPerMs / 1.65, 0, 1);

        if (Math.hypot(dx, dy) > 0.5) {
          s.targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        }
      }

      s.lastPointerTime = now;
      s.lastPointerX = event.clientX;
      s.lastPointerY = event.clientY;
    };

    useEffect(() => {
      const btn = buttonRef.current;
      if (!btn) return;

      syncSize();

      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          syncSize();
          scheduleFrame();
        });
        observer.observe(btn);
        return () => {
          observer.disconnect();
        };
      } else {
        const handleResize = () => {
          syncSize();
          scheduleFrame();
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }
    }, [syncSize, scheduleFrame]);

    useEffect(() => {
      const handleWindowBlur = () => {
        stateRef.current.pointerActive = false;
        stateRef.current.focusActive = false;
        stateRef.current.lastPointerTime = 0;
        setIsPressed(false);
        scheduleFrame();
      };

      const handleWindowFocus = () => {
        const btn = buttonRef.current;
        if (btn && btn.matches(":focus-visible") && !disabled) {
          stateRef.current.focusActive = true;
          scheduleFrame();
        }
      };

      window.addEventListener("blur", handleWindowBlur);
      window.addEventListener("focus", handleWindowFocus);
      return () => {
        window.removeEventListener("blur", handleWindowBlur);
        window.removeEventListener("focus", handleWindowFocus);
      };
    }, [disabled, scheduleFrame]);

    useEffect(() => {
      return () => {
        const s = stateRef.current;
        if (s.frame !== 0) {
          window.cancelAnimationFrame(s.frame);
          s.frame = 0;
        }
      };
    }, []);

    useLayoutEffect(() => {
      const source = contentRef.current;
      const dest = invertedRef.current;
      if (!source || !dest) return;

      const syncInvertedLayer = () => {
        cloneInvertedContent(source, dest);
      };

      syncInvertedLayer();
      const observer = new MutationObserver(syncInvertedLayer);
      observer.observe(source, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
      });
      return () => observer.disconnect();
    }, []);

    const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (disabled || e.pointerType === "touch") return;
      stateRef.current.pointerActive = true;
      setOrigin(e.clientX, e.clientY);
      updatePointerVelocity(e);
      scheduleFrame();
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (disabled || e.pointerType === "touch") return;
      setOrigin(e.clientX, e.clientY);
      updatePointerVelocity(e);
      scheduleFrame();
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== "touch") {
        setOrigin(e.clientX, e.clientY);
      }
      stateRef.current.pointerActive = false;
      stateRef.current.lastPointerTime = 0;
      setIsPressed(false);
      scheduleFrame();
      onPointerLeave?.(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      stateRef.current.pointerActive = true;
      setIsPressed(true);
      setOrigin(e.clientX, e.clientY);
      triggerClickImpulse(e.clientX, e.clientY);
      onPointerDown?.(e);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      if (e.pointerType === "touch") {
        stateRef.current.pointerActive = false;
        scheduleFrame();
      }
      onPointerUp?.(e);
    };

    const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
      stateRef.current.pointerActive = false;
      stateRef.current.lastPointerTime = 0;
      setIsPressed(false);
      scheduleFrame();
      onPointerCancel?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      const btn = buttonRef.current;
      const focusVisible = btn?.matches(":focus-visible") && !disabled;
      stateRef.current.focusActive = !!focusVisible;
      if (focusVisible) {
        const { width, height } = getDimensions();
        stateRef.current.x = width / 2;
        stateRef.current.y = height / 2;
        renderShape();
        scheduleFrame();
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      stateRef.current.focusActive = false;
      scheduleFrame();
      onBlur?.(e);
    };

    // Stable, so React doesn't detach and re-attach a caller's callback ref
    // (null, then the element) on every press.
    const assignRef = useCallback(
      (element: HTMLButtonElement | null) => {
        buttonRef.current = element;
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current =
            element;
        }
      },
      [forwardedRef]
    );

    const customVars: React.CSSProperties = {
      ...(fillColor ? { "--liquid-fill": fillColor } : {}),
      ...(textColor ? { "--liquid-text": textColor } : {}),
      ...(activeTextColor ? { "--liquid-active-text": activeTextColor } : {}),
      ...(borderColor ? { "--liquid-border": borderColor } : {}),
      "--liquid-clip": `url(#${clipPathId})`,
      ...style,
    } as React.CSSProperties;

    return (
      <button
        ref={assignRef}
        type="button"
        data-liquid-button
        className={cn(
          liquidButtonVariants({ variant, size }),
          isPressed && "scale-[0.96] -translate-y-0 shadow-inner duration-75",
          className
        )}
        style={customVars}
        disabled={disabled}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {/* No viewBox: one SVG unit is one CSS pixel of the button, the same
            space the inverted label's clip path uses. */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id={filterId}
              x="-35%"
              y="-45%"
              width="170%"
              height="190%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency={formatNoiseFrequency(parsedFreq)}
                numOctaves={2}
                seed={8}
                result="liquid-noise"
              />
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="liquid-noise"
                scale={5}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
              <ellipse ref={clipEllipseRef} cx={0} cy={0} rx={0} ry={0} />
            </clipPath>
          </defs>
          <ellipse
            ref={blobRef}
            filter={`url(#${filterId})`}
            className="fill-[var(--liquid-fill)]"
            cx={0}
            cy={0}
            rx={0}
            ry={0}
          />
          <circle
            ref={rippleRef}
            filter={`url(#${filterId})`}
            cx={0}
            cy={0}
            r={0}
            className="fill-none stroke-current"
            style={{
              stroke: "var(--liquid-active-text)",
              strokeWidth: "2.4px",
              display: "none",
            }}
          />
        </svg>

        <span
          ref={contentRef}
          data-liquid-content
          className={cn(
            "pointer-events-none relative z-10 inline-flex items-center justify-center gap-2 text-[var(--liquid-text)] transition-transform duration-100",
            isPressed && "scale-[0.98]"
          )}
        >
          {children}
        </span>

        <span
          ref={invertedRef}
          data-liquid-inverted
          className={cn(
            "pointer-events-none absolute inset-0 z-20 inline-flex items-center justify-center gap-2 px-[inherit] text-[var(--liquid-active-text)] transition-transform duration-100 [&_[data-liquid-text]]:before:content-[attr(data-liquid-text)]",
            isPressed && "scale-[0.98]"
          )}
          style={{
            clipPath: `var(--liquid-clip)`,
            WebkitClipPath: `var(--liquid-clip)`,
          }}
          aria-hidden="true"
        />
      </button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";
export default LiquidButton;
