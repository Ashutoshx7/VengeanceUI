#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(repoRoot, "src/lib/components-catalog.ts");
const registryPath = path.join(repoRoot, "public/r/registry.json");

const catalogSource = fs.readFileSync(catalogPath, "utf8");
const componentNames = [
  ...catalogSource.matchAll(/componentName:\s*"([^"]+)"/g),
].map((match) => match[1]);
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const registryByName = new Map(registry.map((item) => [item.name, item]));
const errors = [];

for (const componentName of componentNames) {
  const registryEntry = registryByName.get(componentName);
  const relativeItemPath = `public/r/${componentName}.json`;
  const itemPath = path.join(repoRoot, relativeItemPath);

  if (!registryEntry) {
    errors.push(`${componentName}: missing from public/r/registry.json`);
    continue;
  }

  if (!registryEntry.files?.includes(relativeItemPath)) {
    errors.push(`${componentName}: registry index does not reference ${relativeItemPath}`);
  }

  if (!fs.existsSync(itemPath)) {
    errors.push(`${componentName}: missing ${relativeItemPath}`);
    continue;
  }

  let item;
  try {
    item = JSON.parse(fs.readFileSync(itemPath, "utf8"));
  } catch (error) {
    errors.push(`${componentName}: invalid JSON (${error.message})`);
    continue;
  }

  if (item.name !== componentName) {
    errors.push(`${componentName}: registry item name is ${JSON.stringify(item.name)}`);
  }

  const hasComponentSource = item.files?.some(
    (file) => file.type === "registry:ui" && typeof file.content === "string",
  );

  if (!hasComponentSource) {
    errors.push(`${componentName}: registry item does not contain component source`);
  }
}

if (errors.length > 0) {
  console.error("Registry validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Registry validation passed for ${componentNames.length} catalog components.`);
