#!/usr/bin/env node
/**
 * Builds packages/mcp/data/index.json from:
 * - public/r/registry.json
 * - src/lib/components-catalog.ts
 * - src/lib/component-docs.ts
 *
 * Run from packages/mcp: npm run generate-index
 * Or from repo root: node packages/mcp/scripts/generate-index.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "../..");

const registryPath = path.join(repoRoot, "public/r/registry.json");
const catalogPath = path.join(repoRoot, "src/lib/components-catalog.ts");
const docsPath = path.join(repoRoot, "src/lib/component-docs.ts");
const outPath = path.join(packageRoot, "data/index.json");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function parseCatalog(source) {
  const categories = [];
  const categoryBlocks = [
    ...source.matchAll(
      /name:\s*"([^"]+)"\s*,\s*icon:\s*\w+\s*,\s*items:\s*\[([\s\S]*?)\n\s*\],\s*\n\s*\}/g,
    ),
  ];

  for (const match of categoryBlocks) {
    const categoryName = match[1];
    const itemsBlock = match[2];
    const items = [];

    // Single-line items
    for (const item of itemsBlock.matchAll(
      /\{\s*name:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*description:\s*"([^"]*)"\s*,\s*componentName:\s*"([^"]+)"\s*(?:,\s*isNew:\s*(true))?\s*\}/g,
    )) {
      items.push({
        name: item[1],
        slug: item[2],
        description: item[3],
        componentName: item[4],
        isNew: item[5] === "true" || undefined,
        category: categoryName,
      });
    }

    // Multi-line items (field order may vary)
    for (const block of itemsBlock.matchAll(/\{\s*\n([\s\S]*?)\n\s*\}/g)) {
      const body = block[1];
      const name = body.match(/name:\s*"([^"]+)"/)?.[1];
      const slug = body.match(/slug:\s*"([^"]+)"/)?.[1];
      const description = body.match(/description:\s*"([^"]*)"/)?.[1];
      const componentName = body.match(/componentName:\s*"([^"]+)"/)?.[1];
      const isNew = /isNew:\s*true/.test(body);
      if (!name || !slug || !componentName) continue;
      if (items.some((i) => i.slug === slug)) continue;
      items.push({
        name,
        slug,
        description: description ?? "",
        componentName,
        isNew: isNew || undefined,
        category: categoryName,
      });
    }

    categories.push({ name: categoryName, items });
  }

  return categories;
}

function parseDocs(source) {
  const start = source.indexOf("export const COMPONENT_DOCS");
  if (start === -1) {
    throw new Error("COMPONENT_DOCS not found");
  }
  const assign = source.indexOf("=", start);
  const objectStart = source.indexOf("{", assign);
  let depth = 0;
  let end = -1;
  for (let i = objectStart; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Failed to find end of COMPONENT_DOCS");

  const objectLiteral = source.slice(objectStart, end + 1);
  // Strip TS-only trailing commas already fine; evaluate as JS object.
  // eslint-disable-next-line no-new-func
  const docs = new Function(`return (${objectLiteral})`)();
  return docs;
}

function main() {
  const registry = JSON.parse(read(registryPath));
  if (!Array.isArray(registry)) {
    throw new Error("registry.json must be an array");
  }

  const categories = parseCatalog(read(catalogPath));
  const docs = parseDocs(read(docsPath));

  const catalogItems = categories.flatMap((c) => c.items);
  const byComponentName = new Map();
  const bySlug = new Map();

  for (const item of catalogItems) {
    const doc = docs[item.slug] ?? null;
    const entry = {
      name: item.name,
      slug: item.slug,
      componentName: item.componentName,
      category: item.category,
      description: item.description,
      isNew: item.isNew ?? false,
      inCatalog: true,
      registryDependencies:
        registry.find((r) => r.name === item.componentName)?.dependencies ?? [],
      dependencies: doc?.dependencies ?? null,
      includeUtils: doc?.includeUtils ?? null,
      manualNotes: doc?.manualNotes ?? null,
      usageCode: doc?.usageCode ?? null,
      props: doc?.props ?? null,
      additionalPropSections: doc?.additionalPropSections ?? null,
    };
    byComponentName.set(item.componentName, entry);
    bySlug.set(item.slug, entry);
  }

  const registryEntries = registry.map((r) => {
    const catalog = byComponentName.get(r.name);
    return {
      name: r.name,
      type: r.type,
      dependencies: r.dependencies ?? [],
      inCatalog: Boolean(catalog),
      slug: catalog?.slug ?? null,
      category: catalog?.category ?? null,
      description: catalog?.description ?? null,
    };
  });

  const index = {
    generatedAt: new Date().toISOString(),
    registryBaseUrl: "https://www.vengenceui.com/r",
    categories: categories.map((c) => ({
      name: c.name,
      count: c.items.length,
    })),
    components: catalogItems.map((item) => bySlug.get(item.slug)),
    registry: registryEntries,
    lookups: {
      bySlug: Object.fromEntries(
        [...bySlug.entries()].map(([slug, entry]) => [
          slug,
          entry.componentName,
        ]),
      ),
      byComponentName: Object.fromEntries(
        [...byComponentName.entries()].map(([name, entry]) => [
          name,
          entry.slug,
        ]),
      ),
    },
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2) + "\n");

  console.log(
    `Wrote ${outPath} (${index.components.length} catalog, ${index.registry.length} registry)`,
  );

  const animated = bySlug.get("my-animated-button");
  if (!animated || animated.componentName !== "animated-button") {
    throw new Error("slug my-animated-button must map to animated-button");
  }
}

main();
