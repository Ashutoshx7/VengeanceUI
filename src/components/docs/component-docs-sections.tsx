"use client";

import * as React from "react";
import { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { CLICommand } from "@/components/docs/cli-command";
import { CodeBlock as DocCodeBlock } from "@/components/docs/component-installation";
import { PropsTable } from "@/components/docs/props-table";
import { COMPONENT_DOCS } from "@/lib/component-docs";
// Inline SVG icons used below instead of brand imports

const UTILS_CODE = `import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

interface ComponentDocsSectionsProps {
  componentName: string;
  slug: string;
  sourceCode: string;
}

const InstallationCLI = memo(function InstallationCLI({ componentName }: { componentName: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500 dark:text-zinc-400">Run the following command</p>
      <CLICommand componentName={componentName} />
    </div>
  );
});

const InstallationManual = memo(function InstallationManual({
  componentName,
  sourceCode,
  dependencies,
  includeUtils,
  manualNotes,
}: {
  componentName: string;
  sourceCode: string;
  dependencies: string;
  includeUtils?: boolean;
  manualNotes?: string[];
}) {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-neutral-200 dark:border-[#222] pl-6 space-y-8">
        <div className="relative">
          <div className="absolute -left-[26px] -top-0.5 h-6 w-2 bg-neutral-300 dark:bg-zinc-600 rounded-r-full" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200 mb-4 tracking-tight leading-none">Install dependencies</h3>
          <DocCodeBlock code={dependencies} />
        </div>

        {manualNotes && manualNotes.length > 0 && (
          <div className="relative">
            <div className="absolute -left-[26px] -top-0.5 h-6 w-2 bg-neutral-300 dark:bg-zinc-600 rounded-r-full" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200 mb-4 tracking-tight leading-none">Setup notes</h3>
            <ul className="space-y-2 text-sm leading-6 text-neutral-600 dark:text-zinc-400">
              {manualNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-zinc-500" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {includeUtils && (
          <div className="relative">
            <div className="absolute -left-[26px] -top-0.5 h-6 w-2 bg-neutral-300 dark:bg-zinc-600 rounded-r-full" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200 mb-4 tracking-tight leading-none">lib/utils.ts</h3>
            <DocCodeBlock language="tsx" code={UTILS_CODE} />
          </div>
        )}

        <div className="relative">
          <div className="absolute -left-[26px] -top-0.5 h-6 w-2 bg-neutral-300 dark:bg-zinc-600 rounded-r-full" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200 mb-4 tracking-tight leading-none">Copy the source code</h3>
          <div className="inline-flex items-center rounded-md border border-neutral-200 dark:border-[#222] bg-neutral-100 dark:bg-zinc-900 px-3 py-1 text-sm text-neutral-600 dark:text-zinc-300 mb-4 font-mono">
            components/ui/{componentName}.tsx
          </div>
          <DocCodeBlock
            language="tsx"
            expandable={true}
            code={sourceCode}
          />
        </div>
      </div>
    </div>
  );
});

interface SocialLinkProps {
  href: string;
  platform: "github" | "linkedin" | "twitter";
  author: string;
}

const SocialLink = memo(function SocialLink({ href, platform, author }: SocialLinkProps) {
  const isLinkedIn = platform === "linkedin";
  const label = platform === "github" ? "GitHub" : platform === "linkedin" ? "LinkedIn" : "X";
  const ariaLabel = `View ${author}'s ${platform === "twitter" ? "Twitter" : label} profile`;

  const classes = cn(
    "group inline-flex items-center gap-2 rounded-lg bg-white dark:bg-[#0b0c10] px-4 py-2.5 text-xs font-semibold text-neutral-700 dark:text-zinc-300 transition-all",
    isLinkedIn
      ? "border border-[#0A66C2]/20 dark:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/50 hover:text-neutral-900 dark:hover:text-white"
      : "border border-neutral-200 dark:border-[#222] hover:bg-neutral-50 dark:hover:bg-[#12141a] hover:text-neutral-900 dark:hover:text-white"
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
      aria-label={ariaLabel}
    >
      {platform === "github" && (
        <svg
          className="size-4 text-neutral-900 dark:text-zinc-100 transition-transform group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.06c3-.36 6-2 6-5.24a4.31 4.31 0 0 0-1.2-3.08 4 4 0 0 0-.08-3.2s-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0C5.3 2 4.3 2 4.3 2a4 4 0 0 0-.08 3.2A4.31 4.31 0 0 0 3 8.24c0 3.24 3 4.88 6 5.24A4.8 4.8 0 0 0 8 18v4" />
        </svg>
      )}
      {platform === "twitter" && (
        <svg
          className="size-4 text-neutral-900 dark:text-zinc-100 transition-transform group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )}
      {platform === "linkedin" && (
        <svg
          className="size-4 text-[#0A66C2] transition-transform group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )}
      {label}
    </a>
  );
});

export function ComponentDocsSections({ componentName, slug, sourceCode }: ComponentDocsSectionsProps) {
  const docs = COMPONENT_DOCS[slug] || COMPONENT_DOCS[componentName];
  const [installTab, setInstallTab] = useState<"cli" | "manual">("cli");

  const handleCLI = useCallback(() => setInstallTab("cli"), []);
  const handleManual = useCallback(() => setInstallTab("manual"), []);

  if (!docs) {
    return null;
  }

  return (
    <div className="space-y-10 mt-6">
      {/* ─── Installation Section with CLI | Manual Toggle ─── */}
      <section id="installation" className="scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100 mb-6">Installation</h2>

        {/* CLI / Manual Toggle Tabs */}
        <div className="inline-flex items-center rounded-xl bg-neutral-100 dark:bg-zinc-900/80 border border-neutral-200 dark:border-zinc-700/50 p-1 mb-6">
          <button
            onClick={handleCLI}
            className={cn(
              "relative px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 select-none",
              installTab === "cli"
                ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300"
            )}
          >
            CLI
          </button>
          <button
            onClick={handleManual}
            className={cn(
              "relative px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 select-none",
              installTab === "manual"
                ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300"
            )}
          >
            Manual
          </button>
        </div>

        {/* CLI Tab Content */}
        {installTab === "cli" && <InstallationCLI componentName={componentName} />}

        {/* Manual Tab Content — only rendered when active */}
        {installTab === "manual" && (
          <InstallationManual
            componentName={componentName}
            sourceCode={sourceCode}
            dependencies={docs.dependencies}
            includeUtils={docs.includeUtils}
            manualNotes={docs.manualNotes}
          />
        )}
      </section>

      {/* ─── Usage Section ─── */}
      <section id="usage" className="scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100 mb-6">Usage</h2>
        <DocCodeBlock language="tsx" code={docs.usageCode} />
      </section>

      {/* ─── Props Section ─── */}
      {docs.props.length > 0 && (
        <section id="props" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100 mb-6">Props</h2>
          <PropsTable data={docs.props} />

          {/* Additional prop sections (e.g. metalConfig) */}
          {docs.additionalPropSections?.map((section, i) => (
            <div key={i} className="mt-8">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-zinc-200 mb-4">{section.title}</h3>
              <PropsTable data={section.data} />
            </div>
          ))}
        </section>
      )}
      {/* ─── Credits Section ─── */}
      {docs.credits && (
        <section id="credits" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-100 mb-6">Credits</h2>
          
          <div className="flex flex-col gap-4">
            {(Array.isArray(docs.credits) ? docs.credits : [docs.credits]).map((credit, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-[#222] bg-neutral-50/50 dark:bg-[#07080a] p-6">
                {/* Subtle ambient mesh background glow */}
                <div className="absolute right-0 top-0 -z-10 size-48 bg-radial from-neutral-200/40 via-transparent to-transparent dark:from-zinc-800/5 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 dark:bg-zinc-800/80 px-2.5 py-0.5 font-mono text-[11px] font-medium text-neutral-600 dark:text-zinc-400 border border-neutral-200/50 dark:border-zinc-700/50">
                      {credit.role || "contributor"}
                    </div>
                    <h3 className="font-orbitron text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      {credit.author}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-zinc-400 max-w-md leading-relaxed">
                      {credit.description || "Designed and contributed this component to the Vengeance UI catalog."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {credit.github && (
                      <SocialLink
                        href={credit.github}
                        platform="github"
                        author={credit.author}
                      />
                    )}
                    {credit.twitter && (
                      <SocialLink
                        href={credit.twitter}
                        platform="twitter"
                        author={credit.author}
                      />
                    )}
                    {credit.linkedin && (
                      <SocialLink
                        href={credit.linkedin}
                        platform="linkedin"
                        author={credit.author}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
