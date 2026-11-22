"use client";

import { TapReveal } from "@/components/ui/tap-reveal";

export function TapRevealDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <TapReveal>
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[13px] font-semibold dark:border-zinc-800 dark:bg-zinc-900">
            S/
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold tracking-tight">
              Stealth project
              <span className="ml-2 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px align-[2px] text-[11px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                In progress
              </span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Founding engineer, part-time</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          A local-first sync engine for small teams. Offline edits merge cleanly when you reconnect.
        </p>
      </TapReveal>

      <TapReveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Email</p>
        <p className="mt-2 break-all font-mono text-base font-medium">hello@example.dev</p>
        <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">Hidden until someone taps</p>
      </TapReveal>
    </div>
  );
}

export default TapRevealDemo;
