import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const registryDir = path.join(root, "public/r");

// Runtime-provided specifiers a consumer never installs from the registry,
// plus lucide-react: every shadcn-style setup installs it with the initial
// scaffold, and most marketing blocks rely on that default.
const IMPLIED = new Set([
  "react", "react-dom", "next", "lucide-react",
  "fs", "path", "os", "util", "crypto", "stream", "child_process",
]);

// Packages that ship no type declarations; a strict TypeScript consumer needs
// the matching @types package declared as a devDependency.
const NEEDS_TYPES = { three: "@types/three", imagesloaded: "@types/imagesloaded" };

const packageName = (specifier) =>
  specifier.startsWith("node:")
    ? specifier.slice("node:".length).split("/")[0]
    : specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

// Registry entries pin versions ("react-day-picker@^9.13.0"); compare by name.
const declaredName = (dep) => {
  if (dep.startsWith("@")) {
    const slash = dep.indexOf("/");
    const at = dep.indexOf("@", slash);
    return at === -1 ? dep : dep.slice(0, at);
  }
  const at = dep.indexOf("@");
  return at <= 0 ? dep : dep.slice(0, at);
};

const importedPackages = (content) => {
  const found = new Set();
  // `from "x"`, side-effect `import "x"`, dynamic `import("x")` and `require("x")`.
  const pattern = /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)["']([^"'\s]+)["']/g;
  for (const match of content.matchAll(pattern)) {
    const specifier = match[1];
    if (specifier.startsWith("@/") || specifier.startsWith("./") || specifier.startsWith("../")) continue;
    found.add(packageName(specifier));
  }
  return found;
};

test("every published registry item declares the packages its payload imports", () => {
  const items = readdirSync(registryDir)
    .filter((name) => name.endsWith(".json") && name !== "registry.json" && name !== "mist-registry.json")
    .sort();
  assert.ok(items.length > 100, "expected the full registry to be scanned");

  const undeclared = [];
  for (const item of items) {
    const json = JSON.parse(readFileSync(path.join(registryDir, item), "utf8"));
    const declared = new Set((json.dependencies ?? []).map(declaredName));
    const declaredDev = new Set((json.devDependencies ?? []).map(declaredName));
    for (const file of json.files ?? []) {
      for (const pkg of importedPackages(file.content ?? "")) {
        if (NEEDS_TYPES[pkg] && !declaredDev.has(NEEDS_TYPES[pkg])) {
          undeclared.push(`${json.name ?? item}: imports "${pkg}" but devDependencies lacks ${NEEDS_TYPES[pkg]}`);
        }
        if (IMPLIED.has(pkg) || declared.has(pkg)) continue;
        undeclared.push(`${json.name ?? item}: imports "${pkg}" but dependencies is [${(json.dependencies ?? []).join(", ")}]`);
      }
    }
  }
  assert.deepEqual(undeclared, []);
});

// Items whose local imports point at files no registry item publishes yet.
// Each needs a real fix (publish the file or rewrite the import), not just a
// registryDependencies entry. Remove an item from here once it is fixed.
const KNOWN_LOCAL_GAPS = new Set([
  "component-showcase", // docs-site internals (component-docs-sections, fullscreen-preview)
  "expandable-bento-grid", // @/hooks/use-outside-click is not published
  "hero-section-3", // imports @/components/motion-primitives/*, installs to components/ui
  "notch-navbar", // @/assets/logo/logo-icon and @/components/theme-toggle are not published
]);

const localImports = (content) => {
  const found = new Set();
  for (const match of content.matchAll(/(?:\bfrom\s+|\bimport\s+)["']((?:@\/|\.\/|\.\.\/)[^"']+)["']/g)) {
    if (match[1] !== "@/lib/utils") found.add(match[1]);
  }
  return found;
};

const baseName = (file) => path.basename(file).replace(/\.[^.]+$/, "");

test("every local import in a registry payload is installed by the item or its registryDependencies", () => {
  const items = readdirSync(registryDir)
    .filter((name) => name.endsWith(".json") && name !== "registry.json" && name !== "mist-registry.json")
    .sort();

  const missing = [];
  for (const item of items) {
    const json = JSON.parse(readFileSync(path.join(registryDir, item), "utf8"));
    if (Array.isArray(json) || KNOWN_LOCAL_GAPS.has(json.name)) continue;
    const provided = new Set();
    for (const file of json.files ?? []) {
      const target = file.target ?? file.path ?? "";
      provided.add(baseName(target));
      if (baseName(target) === "index") provided.add(path.basename(path.dirname(target)));
    }
    for (const dep of json.registryDependencies ?? []) provided.add(baseName(dep.replace(/\/$/, "")));
    for (const file of json.files ?? []) {
      for (const specifier of localImports(file.content ?? "")) {
        if (!provided.has(baseName(specifier))) missing.push(`${json.name ?? item}: imports "${specifier}" but nothing installs it`);
      }
    }
  }
  assert.deepEqual(missing, []);
});
