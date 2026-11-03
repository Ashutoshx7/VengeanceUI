"use client";

import { PricingSection } from "@/components/ui/pricing-section";

export function PricingSectionDemo() {
  return (
    // The preview stage is a fixed-height, vertically centred box. Scrolling
    // inside this wrapper keeps the top of the section reachable.
    <div className="absolute inset-0 overflow-y-auto overscroll-contain rounded-xl">
      <PricingSection className="min-h-full" />
    </div>
  );
}

export default PricingSectionDemo;
