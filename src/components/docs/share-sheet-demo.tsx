"use client";

import { ShareSheet } from "@/components/ui/share-sheet";

export function ShareSheetDemo() {
  return <div className="flex min-h-64 w-full items-center justify-center"><ShareSheet url="https://example.com/story" title="A story worth sharing" /></div>;
}
