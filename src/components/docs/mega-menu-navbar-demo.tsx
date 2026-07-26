"use client";

import { MegaMenuNavbar } from "@/components/ui/mega-menu-navbar";

export function MegaMenuNavbarDemo() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-950">
      <MegaMenuNavbar className="absolute inset-x-0 top-0" />

      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Open each desktop mega-menu or resize the preview to test the mobile drawer.
        </p>
      </div>
    </div>
  );
}

export default MegaMenuNavbarDemo;
