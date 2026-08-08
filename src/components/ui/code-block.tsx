import * as React from "react";
import { codeToHtml } from "shiki";
import fs from "fs";
import path from "path";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  fileName?: string; // If provided, it reads this file from src/registry/
  code?: string;     // If provided, it just highlights this string
  language?: string;
  title?: string;
}

export async function CodeBlock({ fileName, code, language = "tsx", title }: CodeBlockProps) {
  let codeString = code || "";

  // Try multiple source folders so migrated docs/components can still show code.
  if (fileName) {
    const candidates = [
      path.join(process.cwd(), "src", "registry", fileName),
      path.join(process.cwd(), "src", "components", "ui", fileName),
      path.join(process.cwd(), "src", "components", "docs", fileName),
      path.join(process.cwd(), "src", "components", "docs", "Fliptext-examples", fileName),
    ];

    const existingFilePath = candidates.find((candidatePath) => fs.existsSync(candidatePath));

    if (!existingFilePath) {
      // Avoid throwing or using console.error() with an Error object here,
      // as Next.js Dev Server intercepts it and creates a fatal error overlay.
      console.warn(`[CodeBlock] No matching source file found for: ${fileName}`);
      codeString = `// Error reading file: ${fileName}\n// Looked in src/registry, src/components/ui, and src/components/docs`;
    } else {
      try {
        codeString = fs.readFileSync(existingFilePath, "utf8");
      } catch {
        console.warn(`[CodeBlock] Failed to read existing file: ${fileName}`);
        codeString = `// Error reading file: ${fileName}`;
      }
    }
  }

  // Convert the raw React code to styled HTML using Shiki
  const html = await codeToHtml(codeString, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
    defaultColor: false,
  });

  return (
    <div className="group/code relative rounded-md border border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-black overflow-hidden my-6 shadow-sm">
      {/* Header bar with filename and copy button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900/50 border-b border-neutral-200 dark:border-zinc-800/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-zinc-300">
            {title || fileName || "code"}
          </span>
        </div>
        <CopyButton 
          code={codeString} 
          className="flex items-center justify-center w-7 h-7 rounded-sm border-none bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300 transition-all opacity-0 group-hover/code:opacity-100 [&>svg]:w-3.5 [&>svg]:h-3.5"
        />
      </div>
      
      {/* The beautifully highlighted code */}
      <div
        className="[counter-reset:css-counter] text-sm font-mono leading-relaxed overflow-x-auto p-4 scrollbar-hide selection:bg-neutral-200 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white [&>pre]:!bg-transparent [&>pre]:!m-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
