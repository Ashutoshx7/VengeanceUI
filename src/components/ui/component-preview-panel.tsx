"use client";

import * as React from "react";
import { PictureInPicture2, TerminalSquare } from "lucide-react";
import { TabsContent, TabsContext, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComponentPreviewPanelProps {
  installCommand?: string;
  deferUntilInteraction?: boolean;
  previewName?: string;
  children: React.ReactNode;
}

export function ComponentPreviewPanel({
  deferUntilInteraction = false,
  previewName = "component",
  children,
}: ComponentPreviewPanelProps) {
  const [isInView, setIsInView] = React.useState(false);
  const [isPageVisible, setIsPageVisible] = React.useState(true);
  const [hasStarted, setHasStarted] = React.useState(!deferUntilInteraction);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const { activeTab } = React.useContext(TabsContext);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const shouldMountPreview =
    activeTab === "preview" && isInView && isPageVisible && hasStarted;

  return (
    <>
      <div className="flex items-center justify-between">
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
      </div>

      <TabsContent value="preview">
        <div className="w-full">
          <div
            id="preview"
            className="w-full scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-100 p-2.5 shadow-lg dark:border-[#222] dark:bg-zinc-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-4"
          >
            <div
              ref={stageRef}
              className="relative flex h-[680px] items-stretch overflow-y-auto overflow-x-hidden rounded-xl border border-neutral-200 bg-white outline-none dark:border-[#222] dark:bg-black"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/5 dark:bg-white/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.03),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(0,0,0,0.02),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.04),transparent_34%)]" />

              <div className="relative z-10 flex min-h-full h-full w-full items-center justify-center p-2 sm:p-4">
                {shouldMountPreview ? (
                  children
                ) : deferUntilInteraction && !hasStarted ? (
                  <div className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
                    <div className="space-y-1.5">
                      <p className="font-medium text-neutral-900 dark:text-zinc-100">
                        Interactive preview paused
                      </p>
                      <p className="text-sm leading-6 text-neutral-500 dark:text-zinc-400">
                        This {previewName} demo uses intensive graphics. Start it when you are ready to interact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasStarted(true)}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Load interactive preview
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-zinc-400" role="status">
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Preparing preview…
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
}
