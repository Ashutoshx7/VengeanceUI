"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { Maximize2, Minimize2, PictureInPicture2, Terminal, TerminalSquare } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { TabsContent, TabsContext, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { preloadComponentSource } from "@/components/ui/deferred-highlighted-code-block";

interface ComponentPreviewPanelProps {
  installCommand: string;
  /** Registry name used to warm the Code tab before it is opened. */
  componentName?: string;
  deferUntilInteraction?: boolean;
  previewName?: string;
  children: React.ReactNode;
}

export function ComponentPreviewPanel({
  installCommand,
  componentName,
  deferUntilInteraction = false,
  previewName = "component",
  children,
}: ComponentPreviewPanelProps) {
  const [isInView, setIsInView] = React.useState(false);
  const [isPageVisible, setIsPageVisible] = React.useState(true);
  const [hasStarted, setHasStarted] = React.useState(!deferUntilInteraction);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  // "native" uses the browser Fullscreen API; "overlay" is a fixed-position
  // fallback for browsers without element fullscreen (e.g. iPhone Safari).
  // Either way the same stage element is promoted, so the live demo keeps its
  // state instead of remounting.
  const [fullscreen, setFullscreen] = React.useState<"off" | "native" | "overlay">("off");
  const isFullscreen = fullscreen !== "off";

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // While the Preview tab is hidden (display: none) the stage has no box
        // and always reports "not intersecting". Ignore that so switching back
        // from Code reveals the live demo on the very first frame.
        const { width, height } = entry.boundingClientRect;
        if (width === 0 && height === 0) return;
        setIsInView(entry.isIntersecting);
      },
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

  const isPreviewActive =
    activeTab === "preview" && isInView && isPageVisible && hasStarted;

  // Mount the demo the first time it becomes visible, then keep it alive.
  // <Activity> hides it and tears down its effects (rAF loops, WebGL frame
  // loops, listeners) while it is off-screen, but keeps its DOM and state so
  // coming back is instant instead of a full remount + chunk load + spinner.
  const [hasMountedPreview, setHasMountedPreview] = React.useState(false);
  if (isPreviewActive && !hasMountedPreview) setHasMountedPreview(true);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      const isStage = document.fullscreenElement === stageRef.current;
      setFullscreen((mode) => (isStage ? "native" : mode === "native" ? "off" : mode));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  React.useEffect(() => {
    if (fullscreen !== "overlay") return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen("off");
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    // Canvas-based demos size themselves on resize; nudge them after the jump.
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    };
  }, [fullscreen]);

  const toggleFullscreen = React.useCallback(() => {
    if (fullscreen === "native") {
      void document.exitFullscreen();
      return;
    }
    if (fullscreen === "overlay") {
      setFullscreen("off");
      return;
    }
    // The stage lives in the Preview tab; show it before going fullscreen.
    // flushSync keeps us inside the click so the browser allows the request.
    if (activeTab !== "preview") flushSync(() => setActiveTab("preview"));
    const stage = stageRef.current;
    if (stage && document.fullscreenEnabled && stage.requestFullscreen) {
      stage.requestFullscreen().catch(() => setFullscreen("overlay"));
    } else {
      setFullscreen("overlay");
    }
  }, [activeTab, fullscreen, setActiveTab]);

  const warmSource = React.useCallback(() => {
    if (componentName) preloadComponentSource(componentName);
  }, [componentName]);

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
        <TabsList className="mb-0">
          <TabsTrigger value="preview" className="gap-2 px-3 py-1.5 text-sm h-8 font-medium">
            <PictureInPicture2 className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            onPointerEnter={warmSource}
            onFocus={warmSource}
            className="gap-2 px-3 py-1.5 text-sm h-8 font-medium"
          >
            <TerminalSquare className="h-4 w-4" />
            Code
          </TabsTrigger>
        </TabsList>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="View preview fullscreen"
            title="Fullscreen"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-[color,background-color,transform] duration-150 hover:bg-neutral-200/70 hover:text-neutral-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-700/80 dark:hover:text-white"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-1.5 py-1.5 text-xs text-neutral-600 shadow-sm dark:border-white/10 dark:bg-black dark:text-zinc-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:w-auto lg:max-w-[70%]">
          <div className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-400 dark:bg-zinc-800 dark:text-zinc-500">
            <Terminal className="size-3.5" />
          </div>
          <span className="min-w-0 flex-1 truncate font-mono text-neutral-500 dark:text-zinc-400">
            {(() => {
              const parts = installCommand.split(" ");
              const shadcnIndex = parts.findIndex((part) => part.includes("shadcn@latest") || part.includes("shadcn-ui@latest"));
              const addIndex = parts.findIndex((part) => part === "add");

              if (shadcnIndex === -1 || addIndex === -1) return installCommand;

              return (
                <>
                  <span className="text-indigo-500 dark:text-[#a0a0cc]">{parts.slice(0, shadcnIndex).join(" ")}</span>{" "}
                  <span className="text-cyan-600 dark:text-[#8bb8d0]">{parts[shadcnIndex]}</span>{" "}
                  <span className="text-neutral-500 dark:text-[#a1a1aa]">add</span>{" "}
                  <span className="text-amber-600 dark:text-[#c9a87c]">{parts.slice(addIndex + 1).join(" ")}</span>
                </>
              );
            })()}
          </span>
          <CopyButton code={installCommand} className="ml-auto size-7 shrink-0 border-neutral-200 bg-transparent hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/10" />
        </div>
      </div>

      <TabsContent value="preview">
        <div className="w-full">
          <div
            id="preview"
            className="w-full scroll-mt-24 rounded-2xl border border-neutral-200 bg-neutral-100 p-2.5 shadow-lg dark:border-[#222] dark:bg-zinc-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-4"
          >
            <div
              ref={stageRef}
              role={isFullscreen ? "dialog" : undefined}
              aria-modal={isFullscreen || undefined}
              aria-label={isFullscreen ? "Fullscreen preview" : undefined}
              className={[
                "relative flex items-stretch overflow-y-auto overflow-x-hidden bg-white outline-none dark:bg-black",
                isFullscreen
                  ? "rounded-none border-0"
                  : "h-[680px] rounded-xl border border-neutral-200 dark:border-[#222]",
                fullscreen === "overlay" ? "fixed inset-0 z-[100] h-dvh w-screen" : "",
              ].join(" ")}
            >
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Exit fullscreen"
                  className="absolute right-4 top-4 z-30 inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 pl-2.5 pr-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-white/10 dark:bg-black/60 dark:text-zinc-200 dark:hover:bg-black/80"
                >
                  <Minimize2 className="size-3.5" />
                  Exit
                  <kbd className="rounded border border-black/10 px-1 font-sans text-[10px] text-neutral-500 dark:border-white/15 dark:text-zinc-400">Esc</kbd>
                </button>
              )}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/5 dark:bg-white/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,0,0,0.03),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(0,0,0,0.02),transparent_34%)] dark:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.04),transparent_34%)]" />

              <div className="relative z-10 flex min-h-full h-full w-full items-center justify-center p-2 sm:p-4">
                {hasMountedPreview ? (
                  <React.Activity mode={isPreviewActive ? "visible" : "hidden"}>
                    {children}
                  </React.Activity>
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
