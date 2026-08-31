import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Boxes, MessageSquarePlus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPONENT_CATEGORIES } from "@/lib/components-catalog";
import { GITHUB_COMPONENT_REQUEST_URL } from "@/lib/github";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Animated React Components",
  description: "Browse the animated component catalog for Vengeance UI.",
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    url: "/components",
    title: "Animated React Components | Vengeance UI",
    description: "Browse the animated component catalog for Vengeance UI.",
  },
};

const componentCount = COMPONENT_CATEGORIES.reduce((total, category) => total + category.items.length, 0);
const newCount = COMPONENT_CATEGORIES.reduce(
  (total, category) => total + category.items.filter((item) => item.isNew).length,
  0,
);

export default function ComponentsIndexPage() {
  return (
    <div className="min-w-0 pb-10">
      <section className="border-b border-border/70 py-8">
        <div className="flex w-fit items-center gap-2 rounded-md border border-foreground/10 bg-foreground/[0.035] px-3 py-1.5 font-mono text-xs text-muted-foreground dark:bg-white/[0.035]">
          <Boxes className="size-3.5 text-foreground" />
          Component catalog
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="max-w-3xl">
            <h1 className="font-orbitron text-3xl font-semibold tracking-tight md:text-5xl">
              Browse the Vengeance UI component library.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Pick a category, open a component, preview the demo, then copy the install command or manual source from the docs.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-foreground/15 bg-foreground/[0.045] text-foreground shadow-none hover:bg-foreground/[0.075] dark:border-white/15 dark:bg-white/[0.045] dark:hover:bg-white/[0.075]"
              >
                <Link href="/components/my-animated-button">
                  Start with buttons
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-foreground/10 bg-transparent text-foreground/85 shadow-none hover:border-foreground/20 hover:bg-foreground/[0.045] dark:border-white/10 dark:hover:bg-white/[0.055]"
              >
                <Link href="/docs/cli">CLI install</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-foreground/10 bg-transparent text-foreground/85 shadow-none hover:border-foreground/20 hover:bg-foreground/[0.045] dark:border-white/10 dark:hover:bg-white/[0.055]"
              >
                <Link href={GITHUB_COMPONENT_REQUEST_URL} target="_blank" rel="noopener noreferrer">
                  <MessageSquarePlus className="size-4" />
                  Request a component
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border/70">
            <div className="bg-background p-4">
              <p className="font-orbitron text-2xl font-semibold">{componentCount}</p>
              <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">components</p>
            </div>
            <div className="bg-background p-4">
              <p className="font-orbitron text-2xl font-semibold">{newCount}</p>
              <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">new</p>
            </div>
            <div className="col-span-2 bg-background p-4">
              <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Sparkles className="size-4 text-foreground" />
                Live demos, usage snippets, and prop notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-0 border-b border-border/70 md:grid-cols-2 xl:grid-cols-3">
        {COMPONENT_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;

          return (
            <div
              key={category.name}
              className={cn(
                "min-w-0 border-r border-t border-border/70 bg-card p-5 first:border-t-0 md:[&:nth-child(2)]:border-t-0 xl:[&:nth-child(3)]:border-t-0",
                "md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r-0",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center border border-foreground/10 bg-muted/60">
                    <CategoryIcon className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-orbitron text-base font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.items.length} components</p>
                  </div>
                </div>
                {category.items.some((item) => item.isNew) && (
                  <Badge variant="secondary" className="rounded-md">
                    New
                  </Badge>
                )}
              </div>

              <div className="mt-5 grid gap-2">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    prefetch={false}
                    className="group block min-w-0 border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-muted/40"
                  >
                    <span className="flex min-w-0 items-center justify-between gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium group-hover:text-foreground">{item.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span>
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="border-b border-border/70 py-8">
        <div className="flex flex-col items-start justify-between gap-4 border border-foreground/10 bg-foreground/[0.035] p-6 sm:flex-row sm:items-center dark:bg-white/[0.035]">
          <div className="max-w-xl">
            <h2 className="font-orbitron text-lg font-semibold">Can&apos;t find what you need?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Request a component and describe the animation you want. You can drag & drop images or a screen recording straight into the issue for reference.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0"
          >
            <Link href={GITHUB_COMPONENT_REQUEST_URL} target="_blank" rel="noopener noreferrer">
              <MessageSquarePlus className="size-4" />
              Request a component
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
