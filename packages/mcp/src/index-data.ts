import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentEntry, ComponentIndex } from "./types.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

let cached: ComponentIndex | null = null;

export function getPackageRoot() {
  return packageRoot;
}

export function loadIndex(): ComponentIndex {
  if (cached) return cached;
  const raw = readFileSync(join(packageRoot, "data/index.json"), "utf8");
  cached = JSON.parse(raw) as ComponentIndex;
  return cached;
}

/** Resolve by catalog slug or registry componentName. */
export function resolveComponent(query: string): ComponentEntry | null {
  const index = loadIndex();
  const normalized = query.trim().toLowerCase();

  const bySlug = index.components.find((c) => c.slug.toLowerCase() === normalized);
  if (bySlug) return bySlug;

  const byName = index.components.find(
    (c) => c.componentName.toLowerCase() === normalized,
  );
  if (byName) return byName;

  const byDisplay = index.components.find(
    (c) => c.name.toLowerCase() === normalized,
  );
  if (byDisplay) return byDisplay;

  return null;
}

export function resolveRegistryName(query: string): string | null {
  const component = resolveComponent(query);
  if (component) return component.componentName;

  const index = loadIndex();
  const normalized = query.trim().toLowerCase();
  const registryHit = index.registry.find(
    (r) => r.name.toLowerCase() === normalized,
  );
  return registryHit?.name ?? null;
}
