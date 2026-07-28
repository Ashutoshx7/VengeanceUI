"use client";

import React, { useState } from "react";
import TextAnimation from "@/components/ui/staggerText";
import { Button } from "@/components/ui/button";

export function StaggerTextDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-neutral-950 text-white gap-8 p-10 select-none">
      <div className="flex flex-col gap-4 text-center max-w-lg">
        {/* Word Stagger (Default) */}
        <h2 className="text-2xl font-bold tracking-tight text-neutral-400">
          <TextAnimation key={`word-${key}`} divideBy="word">
            Word by Word Reveal Animation
          </TextAnimation>
        </h2>

        {/* Letter Stagger */}
        <p className="text-lg text-neutral-300">
          <TextAnimation key={`letter-${key}`} divideBy="letter" delay={0.3}>
            Delightful character-by-character animation with spring easing.
          </TextAnimation>
        </p>
      </div>

      <Button
        onClick={() => setKey((prev) => prev + 1)}
        variant="outline"
        className="mt-4 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white"
      >
        Replay Animation
      </Button>
    </div>
  );
}
