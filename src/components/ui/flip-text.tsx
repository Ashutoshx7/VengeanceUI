"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
    /**
     * Additional CSS classes for the wrapper
     */
    className?: string;

    /**
     * The text content to animate (will be split by spaces)
     */
    children: string;

    /**
     * Duration of the flip animation in seconds
     * @default 2.2
     */
    duration?: number;

    /**
     * Initial delay before animation starts in seconds
     * @default 0
     */
    delay?: number;

    /**
     * Whether the animation should loop infinitely
     * @default true
     */
    loop?: boolean;

    /**
     * Custom separator for splitting text (default is space)
     * @default " "
     */
    separator?: string;
}

export function FlipText({
    className,
    children,
    duration = 2.2,
    delay = 0,
    loop = true,
    separator = " ",
}: FlipTextProps) {
    const words = useMemo(() => children.split(separator), [children, separator]);
    const totalChars = children.length;

    // Calculate character index for each position
    const getCharIndex = (wordIndex: number, charIndex: number) => {
        let index = 0;
        for (let i = 0; i < wordIndex; i++) {
            index += words[i].length + (separator === " " ? 1 : separator.length);
        }
        return index + charIndex;
    };

    return (
        <div
            className={cn(
                "flip-text-wrapper inline-block leading-none",
                className
            )}
            style={{ perspective: "1000px" }}
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
                            const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

                            // Calculate delay based on character position
                            const normalizedIndex = currentGlobalIndex / totalChars;
                            const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                            const calculatedDelay = sineValue * (duration * 0.25) + delay;

                            return (
                                <span
                                    key={charIndex}
                                    className="flip-char inline-block relative"
                                    data-char={char}
                                    style={
                                        {
                                            "--flip-duration": `${duration}s`,
                                            "--flip-delay": `${calculatedDelay}s`,
                                            "--flip-iteration": loop ? "infinite" : "1",
                                            transformStyle: "preserve-3d",
                                        } as React.CSSProperties
                                    }
                                >
                                    {char}
                                </span>
                            );
                        })}
                        {separator === " " && wordIndex < words.length - 1 && (
                            <span className="whitespace inline-block">&nbsp;</span>
                        )}
                        {separator !== " " && wordIndex < words.length - 1 && (
                            <span className="separator inline-block">{separator}</span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}

export default FlipText;
