"use client";

import { LiquidButton } from "@/components/ui/liquid-button";

export default function LiquidButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      <LiquidButton size="default">
        Initialize Vengeance <span aria-hidden="true">↗</span>
      </LiquidButton>
      <LiquidButton variant="accent" size="default">
        Explore System
      </LiquidButton>
    </div>
  );
}
