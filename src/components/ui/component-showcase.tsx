import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ComponentDocsSections } from "@/components/docs/component-docs-sections";
import { DeferredSourceCode } from "@/components/docs/deferred-source-code";
import { ComponentPreviewPanel } from "@/components/ui/component-preview-panel";
import { COMPONENT_DOCS } from "@/lib/component-docs";
import { getShadcnAddCommand } from "@/lib/registry";

interface ComponentShowcaseProps {
  componentName: string; // The exact filename in the registry (without .tsx)
  title: string;
  description: string;
  slug?: string;
  children: React.ReactNode; // The live component itself
}

const INTERACTION_DEFERRED_PREVIEWS = new Set([
  "books-showcase",
  "circular-gallery",
  "interactive-particles",
  "liquid-ocean",
  "liquid-text",
  "ripple-displacement-slider",
  "scroll-dissolve-reveal",
  "wave-grid-background",
]);

function readFallbackSource(componentName: string) {
  const registryItem = path.join(process.cwd(), "public", "r", `${componentName}.json`);
  if (fs.existsSync(registryItem)) {
    try {
      const item = JSON.parse(fs.readFileSync(registryItem, "utf8")) as {
        files?: Array<{ content?: unknown }>;
      };
      const hasUsableSource = item.files?.some(
        (file) => typeof file.content === "string" && file.content.trim().length > 0,
      );
      if (hasUsableSource) return undefined;
    } catch {
      // A malformed registry record should not hide a valid local source file.
    }
  }

  const fileName = `${componentName}.tsx`;
  const candidates = [
    path.join(process.cwd(), "src", "registry", fileName),
    path.join(process.cwd(), "src", "components", "ui", fileName),
    path.join(process.cwd(), "src", "components", "docs", fileName),
  ];
  const sourcePath = candidates.find((candidate) => fs.existsSync(candidate));

  return sourcePath ? fs.readFileSync(sourcePath, "utf8") : undefined;
}

export function ComponentShowcase({
  componentName,
  title,
  description,
  slug = componentName,
  children,
}: ComponentShowcaseProps) {
  const installCommand = getShadcnAddCommand(componentName);
  const docs = COMPONENT_DOCS[slug] || COMPONENT_DOCS[componentName] || null;
  const deferPreview = INTERACTION_DEFERRED_PREVIEWS.has(slug);
  const fallbackSource = readFallbackSource(componentName);

  return (
    <div className="mb-8 space-y-4">
      {/* Component Header */}
      <div id="overview" className="space-y-1 scroll-mt-24">
        <p className="text-sm font-medium text-neutral-500 dark:text-zinc-500">
          Components <span className="mx-1 text-neutral-400 dark:text-zinc-700">/</span>
          <span className="text-neutral-900 dark:text-zinc-200">{title}</span>
        </p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100">{title}</h1>
        <p className="text-neutral-500 dark:text-zinc-400 text-lg">{description}</p>
      </div>

      {/* The Showcase Toggle */}
      <Tabs defaultValue="preview" className="space-y-4">
        <ComponentPreviewPanel
          installCommand={installCommand}
          deferUntilInteraction={deferPreview}
          previewName={title}
        >
          {children}
        </ComponentPreviewPanel>

        {/* Code Block */}
        <TabsContent value="code" lazy>
          <div id="code" className="scroll-mt-24" />
          <div className="mt-4">
            <DeferredSourceCode componentName={componentName} fallbackSource={fallbackSource} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Documentation Sections (Client Component) ─── */}
      <ComponentDocsSections componentName={componentName} docs={docs} fallbackSource={fallbackSource} />
    </div>
  );
}
