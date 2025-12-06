"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
    className?: string;
    children: string;
    duration?: number;
    delay?: number;
}

export function FlipText({
    className,
    children,
    duration = 2.2,
    delay = 0,
}: FlipTextProps) {
    const words = useMemo(() => children.split(" "), [children]);
    const totalChars = children.length;

    let charIndexCounter = 0;

    return (
        <div
            className={cn(
                "flip-text-wrapper inline-block leading-none perspective-[1000px]",
                className
            )}
        >
            {words.map((word, wordIndex) => {
                const chars = word.split("");
                return (
                    <span
                        key={wordIndex}
                        className="word inline-block whitespace-nowrap"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {chars.map((char, charIndex) => {
                            const currentGlobalIndex = charIndexCounter;
                            charIndexCounter++;

                            // Calculate delay in JS to mimic the CSS sin() logic
                            // CSS: sin((var(--char-index) / var(--char-total)) * 90deg) * (var(--duration) * 0.25)
                            const normalizedIndex = currentGlobalIndex / totalChars;
                            const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                            const calculatedDelay = sineValue * (duration * 0.25) + delay;

                            return (
                                <span
                                    key={charIndex}
                                    className="char inline-block relative"
                                    data-char={char}
                                    style={
                                        {
                                            "--duration": `${duration}s`,
                                            "--delay": `${calculatedDelay}s`,
                                            transformStyle: "preserve-3d",
                                        } as React.CSSProperties
                                    }
                                >
                                    {char}
                                </span>
                            );
                        })}
                        {wordIndex < words.length - 1 && (
                            <span className="whitespace inline-block">&nbsp;</span>
                        )}
                    </span>
                );
            })}

            <style dangerouslySetInnerHTML={{
                __html: `
        .char {
          color: inherit;
          -webkit-text-fill-color: transparent;
          height: 1.2em;
          line-height: 1.2em;
          vertical-align: middle;
          animation: flip var(--duration) var(--delay) infinite ease;
        }

        .char::before,
        .char::after {
          color: inherit;
          -webkit-text-fill-color: currentColor;
          content: attr(data-char);
          position: absolute;
          top: 50%;
          left: 50%;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
          animation: fade var(--duration) var(--delay) infinite ease;
        }

        /* Front Face (Initial) */
        .char::after {
          transform: translate(-50%, -50%) translateZ(0.6em);
        }

        /* Bottom Face (Rotates in) */
        .char::before {
          transform: translate(-50%, -50%) rotateX(-90deg) translateZ(0.6em);
          opacity: 0;
          --opacity: 1;
        }

        @keyframes flip {
          0% { transform: rotateX(0deg); }
          25%, 100% { transform: rotateX(90deg); }
        }

        @keyframes fade {
          0% { opacity: 1; }
          30%, 100% { opacity: var(--opacity, 0); }
        }
      `}} />
        </div>
    );
}
