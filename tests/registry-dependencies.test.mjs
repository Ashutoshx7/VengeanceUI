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

const packageName = (specifier) =>
  specifier.startsWith("@")
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
  for (const match of content.matchAll(/from\s+["']([^"']+)["']/g)) {
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
    for (const file of json.files ?? []) {
      for (const pkg of importedPackages(file.content ?? "")) {
        if (IMPLIED.has(pkg) || declared.has(pkg)) continue;
        undeclared.push(`${json.name ?? item}: imports "${pkg}" but dependencies is [${(json.dependencies ?? []).join(", ")}]`);
      }
    }
  }
  assert.deepEqual(undeclared, []);
});

