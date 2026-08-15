"use client";

import * as React from "react";
import { Maximize2, Minimize2, PictureInPicture2, Terminal, TerminalSquare } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComponentPreviewPanelProps {
  installCommand: string;
  children: React.ReactNode;
}

export function ComponentPreviewPanel({ installCommand, children }: ComponentPreviewPanelProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    stageRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  React.useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isFullscreen]);

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TabsList className="mb-0">
          <TabsTrigger value="preview" className="gap-2 px-3 py-1.5 text-sm h-8 font-medium">
            <PictureInPicture2 className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2 px-3 py-1.5 text-sm h-8 font-medium text-neutral-500 dark:text-zinc-400 hover:text-neutral-700 dark:hover:text-zinc-300">
            <TerminalSquare className="h-4 w-4" />
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black px-1.5 py-1.5 text-xs text-neutral-600 dark:text-zinc-300 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:w-auto">
          <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-zinc-500">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <span className="min-w-0 max-w-[42vw] truncate font-mono text-neutral-500 dark:text-zinc-400 lg:max-w-[500px]">
            {(() => {
              const parts = installCommand.split(" ");
              const shadcnIndex = parts.findIndex(p => p.includes("shadcn@latest") || p.includes("shadcn-ui@latest"));
              const addIndex = parts.findIndex(p => p === "add");
              
              if (shadcnIndex === -1 || addIndex === -1) {
                return installCommand;
              }

              const executor = parts.slice(0, shadcnIndex).join(" ");
              const url = parts.slice(addIndex + 1).join(" ");

              return (
                <>
                  <span className="text-indigo-500 dark:text-[#a0a0cc]">{executor}</span>
                  {" "}
                  <span className="text-cyan-600 dark:text-[#8bb8d0]">{parts[shadcnIndex]}</span>
                  {" "}
                  <span className="text-neutral-500 dark:text-[#a1a1aa]">add</span>
                  {" "}
                  <span className="text-amber-600 dark:text-[#c9a87c]">{url}</span>
                </>
              );
            })()}
          </span>
          <CopyButton code={installCommand} className="ml-auto h-7 w-7 shrink-0 border-neutral-200 dark:border-white/10 bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10" />
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-200 dark:border-white/10 bg-transparent text-neutral-400 dark:text-zinc-400 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-700 dark:hover:text-zinc-200"
            aria-label="Expand to fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <TabsContent value="preview">
        <div className="w-full">
          <div
            id="preview"
            className="w-full scroll-mt-24 rounded-2xl border border-neutral-200 dark:border-[#222] bg-neutral-100 dark:bg-zinc-900 p-2.5 shadow-lg dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-4"
          >
            <div
              ref={stageRef}
              tabIndex={isFullscreen ? -1 : undefined}
              role={isFullscreen ? "dialog" : undefined}
              aria-modal={isFullscreen ? true : undefined}
              aria-label={isFullscreen ? "Fullscreen preview" : undefined}
              data-fullscreen-preview-surface
              className={cn(
                "relative flex h-[680px] items-stretch overflow-y-auto overflow-x-hidden rounded-xl border border-neutral-200 dark:border-[#222] bg-white dark:bg-black outline-none",
                isFullscreen && "fixed inset-0 z-[9999] h-[100dvh] w-[100dvw] rounded-none border-0"
              )}
            >
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className={cn(
                  "absolute right-3 top-3 z-[10000] inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-black/70 text-white/70 shadow-lg backdrop-blur transition-colors hover:bg-black/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  !isFullscreen && "hidden"
                )}
                aria-label="Exit fullscreen"
              >
                <Minimize2 className="h-4 w-4" />
              </button>

              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/5 dark:bg-white/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.03),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(0,0,0,0.02),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.04),transparent_34%)]" />

              <div className="relative z-10 w-full min-h-full my-auto flex justify-center items-center p-2 sm:p-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
}
