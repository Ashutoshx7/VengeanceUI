"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { PricingTiers } from "@/components/ui/pricing-tiers";
import { cn } from "@/lib/utils";

// Free stand-ins for the reference fonts. The component picks up Aeonik Pro
// first when it is installed, then these variables.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export function PricingTiersDemo() {
  return (
    // The preview stage is a fixed-height, vertically centred box. Scrolling
    // inside this wrapper keeps the top of the section reachable.
    <div
      className={cn(
        "absolute inset-0 overflow-y-auto overscroll-contain rounded-xl",
        geist.variable,
        geistMono.variable,
      )}
    >
      <PricingTiers className="min-h-full" />
    </div>
  );
}

export default PricingTiersDemo;
