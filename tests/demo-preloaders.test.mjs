import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

function importsBySlug(source, pattern) {
  return Object.fromEntries([...source.matchAll(pattern)].map(([, slug, specifier]) => [slug, specifier]));
}

test("every demo has a matching hover preloader", async () => {
  const renderer = await readFile(path.join(root, "src/components/docs/demo-renderer.tsx"), "utf8");
  const preloaders = await readFile(path.join(root, "src/components/docs/demo-preloaders.ts"), "utf8");

  const demos = importsBySlug(renderer, /^\s*"([a-z0-9-]+)":\s*dynamic\(\(\)\s*=>\s*import\("([^"]+)"\)/gm);
  const warmers = importsBySlug(preloaders, /^\s*"([a-z0-9-]+)":\s*\(\)\s*=>\s*import\("([^"]+)"\)/gm);

  assert.ok(Object.keys(demos).length > 50, "expected to find the demo map");
  assert.deepEqual(warmers, demos);
});
