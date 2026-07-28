"use client";

import { MegaMenuNavbar } from "@/components/ui/mega-menu-navbar";

export function MegaMenuNavbarDemo() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-[#09090b]">
      <MegaMenuNavbar className="absolute inset-x-0 top-0" />

      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          A quieter navigation system for exploring the VengeanceUI library.
        </p>
      </div>
    </div>
  );
}

export default MegaMenuNavbarDemo;
