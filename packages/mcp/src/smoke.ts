#!/usr/bin/env node
/**
 * Local smoke checks for tool handlers (no stdio).
 * Run: node --import tsx  — or after build: node dist/smoke.js
 */
import { resolveComponent, resolveRegistryName } from "./index-data.js";
import { getShadcnAddCommand, fetchComponentSource } from "./registry.js";
import { listCategories, searchComponents, listRegistry } from "./search.js";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const categories = listCategories();
assert(categories.length >= 1, "expected categories");

const search = searchComponents("animated button");
assert(
  search.some((c) => c.componentName === "animated-button"),
  "search should find animated-button",
);

const bySlug = resolveComponent("my-animated-button");
const byName = resolveComponent("animated-button");
const byDisplay = resolveComponent("Animated Button");
const byCase = resolveComponent("My-Animated-Button");
assert(bySlug?.componentName === "animated-button", "slug resolve failed");
assert(byName?.slug === "my-animated-button", "name resolve failed");
assert(byDisplay?.componentName === "animated-button", "display resolve failed");
assert(byCase?.componentName === "animated-button", "case resolve failed");
assert(
  bySlug === byName && byName === byDisplay && byDisplay === byCase,
  "resolve paths should return the same entry",
);

const install = getShadcnAddCommand(
  resolveRegistryName("my-animated-button")!,
);
assert(
  resolveRegistryName("ANIMATED-BUTTON") === "animated-button",
  "registry name case resolve failed",
);
assert(
  install ===
    "npx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/animated-button.json",
  `unexpected install command: ${install}`,
);

assert(listRegistry().length >= 100, "registry list too small");

const source = await fetchComponentSource("animated-button");
assert(source.name === "animated-button", "source name mismatch");
assert(Array.isArray(source.files) && source.files.length > 0, "no source files");

console.log("smoke ok", {
  categories: categories.length,
  searchHits: search.length,
  registry: listRegistry().length,
  install,
  sourceFiles: source.files?.length,
});
