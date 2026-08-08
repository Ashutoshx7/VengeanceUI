import * as React from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";

export function DocsArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="space-y-10 pb-24 text-neutral-900 dark:text-zinc-100">
      {children}
    </article>
  );
}

export function DocsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
        {title}
      </h1>
      <p className="text-lg text-neutral-500 dark:text-zinc-400">
        {description}
      </p>
    </header>
  );
}

export function DocsSection({
  title,
  children,
  id,
  className,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-4", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DocsSubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function DocsParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-4xl text-base leading-7 text-neutral-700 dark:text-zinc-300">
      {children}
    </p>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100">
      {children}
    </code>
  );
}

export function DocsCodeBlock({
  code,
  title,
  className,
  language,
}: {
  code: string;
  title?: string;
  className?: string;
  language?: string;
}) {
  const displayCode = code.trimEnd();
  const detectedLanguage = language || (displayCode.startsWith('{') ? 'json' : 'bash');

  return (
    <div className={cn("space-y-2", className)}>
      <CodeBlock code={displayCode} title={title} language={detectedLanguage} />
    </div>
  );
}

