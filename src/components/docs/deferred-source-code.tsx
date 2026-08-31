"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface RegistryFile {
  path?: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  files?: RegistryFile[];
}

interface DeferredSourceCodeProps {
  componentName: string;
  fallbackSource?: string;
  title?: string;
  expandable?: boolean;
  className?: string;
}

function selectSource(files: RegistryFile[], componentName: string) {
  const expectedName = `${componentName}.tsx`.toLowerCase();
  const exact = files.find((file) =>
    [file.target, file.path].some((candidate) => candidate?.toLowerCase().endsWith(expectedName)),
  );

  return exact?.content ?? files.find((file) => typeof file.content === "string")?.content;
}

export function DeferredSourceCode({
  componentName,
  fallbackSource,
  title,
  expandable = false,
  className,
}: DeferredSourceCodeProps) {
  const [fetchedSource, setFetchedSource] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(!expandable);
  const source = fallbackSource ?? fetchedSource;

  React.useEffect(() => {
    if (fallbackSource) return;

    const controller = new AbortController();

    async function loadSource() {
      try {
        const response = await fetch(`/r/${encodeURIComponent(componentName)}.json`, {
          cache: "force-cache",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Registry returned ${response.status}`);

        const item = (await response.json()) as RegistryItem;
        const content = selectSource(item.files ?? [], componentName);
        if (!content) throw new Error("The registry item does not contain source code");
        setFetchedSource(content);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load source code");
      }
    }

    loadSource();
    return () => controller.abort();
  }, [componentName, fallbackSource]);

  if (error && source === null) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300" role="alert">
        Source code could not be loaded: {error}.
      </div>
    );
  }

  if (source === null) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-400" role="status">
        <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading source code…
      </div>
    );
  }

  return (
    <div className={cn("group/code relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 shadow-sm dark:border-zinc-800/80 dark:bg-black", className)}>
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-neutral-500 dark:text-zinc-300">
            {title ?? `${componentName}.tsx`}
          </span>
        </div>
        <CopyButton
          code={source}
          className="h-7 w-7 border-none bg-transparent text-neutral-400 opacity-0 transition-all hover:bg-neutral-100 hover:text-neutral-700 group-hover/code:opacity-100 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        />
      </div>

      <div className={cn("relative overflow-hidden", expandable && !expanded && "max-h-[440px]")}>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-neutral-700 selection:bg-neutral-200 dark:text-zinc-300 dark:selection:bg-zinc-800">
          <code>{source}</code>
        </pre>
        {expandable && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent dark:from-black" />
        )}
      </div>

      {expandable && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center justify-center gap-2 border-t border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          {expanded ? "Collapse source" : "Show complete source"}
        </button>
      )}
    </div>
  );
}
