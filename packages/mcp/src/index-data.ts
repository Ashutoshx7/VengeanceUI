import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentEntry, ComponentIndex } from "./types.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

interface IndexLookups {
  index: ComponentIndex;
  bySlug: Map<string, ComponentEntry>;
  byComponentName: Map<string, ComponentEntry>;
  byDisplayName: Map<string, ComponentEntry>;
  byRegistryName: Map<string, string>;
}

let cached: IndexLookups | null = null;

export function getPackageRoot() {
  return packageRoot;
}

function buildLookups(index: ComponentIndex): IndexLookups {
  const bySlug = new Map<string, ComponentEntry>();
  const byComponentName = new Map<string, ComponentEntry>();
  const byDisplayName = new Map<string, ComponentEntry>();

  for (const entry of index.components) {
    bySlug.set(entry.slug.toLowerCase(), entry);
    byComponentName.set(entry.componentName.toLowerCase(), entry);
    byDisplayName.set(entry.name.toLowerCase(), entry);
  }

  // Generator lookups must agree with components (catches index drift).
  for (const [slug, componentName] of Object.entries(index.lookups.bySlug)) {
    const entry = bySlug.get(slug.toLowerCase());
    if (!entry || entry.componentName !== componentName) {
      throw new Error(
        `index lookups.bySlug mismatch for "${slug}" → "${componentName}"`,
      );
    }
  }
  for (const [componentName, slug] of Object.entries(
    index.lookups.byComponentName,
  )) {
    const entry = byComponentName.get(componentName.toLowerCase());
    if (!entry || entry.slug !== slug) {
      throw new Error(
        `index lookups.byComponentName mismatch for "${componentName}" → "${slug}"`,
      );
    }
  }

  const byRegistryName = new Map<string, string>();
  for (const entry of index.registry) {
    byRegistryName.set(entry.name.toLowerCase(), entry.name);
  }

  return { index, bySlug, byComponentName, byDisplayName, byRegistryName };
}

function getLookups(): IndexLookups {
  if (cached) return cached;
  const raw = readFileSync(join(packageRoot, "data/index.json"), "utf8");
  const index = JSON.parse(raw) as ComponentIndex;
  cached = buildLookups(index);
  return cached;
}

export function loadIndex(): ComponentIndex {
  return getLookups().index;
}

/** Resolve by catalog slug, registry componentName, or display name. */
export function resolveComponent(query: string): ComponentEntry | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const lookups = getLookups();
  return (
    lookups.bySlug.get(normalized) ??
    lookups.byComponentName.get(normalized) ??
    lookups.byDisplayName.get(normalized) ??
    null
  );
}

export function resolveRegistryName(query: string): string | null {
  const component = resolveComponent(query);
  if (component) return component.componentName;

  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  return getLookups().byRegistryName.get(normalized) ?? null;
}
