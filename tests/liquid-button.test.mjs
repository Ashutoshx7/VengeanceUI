import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "src/components/ui/liquid-button.tsx");
const registryPath = path.join(root, "public/r/liquid-button.json");
const source = await readFile(sourcePath, "utf8");
const registry = JSON.parse(await readFile(registryPath, "utf8"));

async function loadParser() {
  const start = source.indexOf("export const DEFAULT_NOISE_FREQUENCY");
  const end = source.indexOf("function formatNoiseFrequency");
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const snippet = source.slice(start, end);
  const { outputText } = ts.transpileModule(snippet, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const dir = await mkdtemp(path.join(os.tmpdir(), "liquid-button-parse-"));
  const file = path.join(dir, "parse-noise-frequency.mjs");
  await writeFile(file, outputText);
  return import(pathToFileURL(file).href);
}

const { parseNoiseFrequency, DEFAULT_NOISE_FREQUENCY } = await loadParser();

test("liquid button registry publishes current source", async () => {
  const file = registry.files.find((item) => item.target === "components/ui/liquid-button.tsx");
  assert.ok(file);
  assert.equal(file.content, source);
});

test("parseNoiseFrequency maps a single value onto X and Y", () => {
  assert.deepEqual(parseNoiseFrequency("0.1"), { baseX: 0.1, baseY: 0.1 });
});

test("parseNoiseFrequency keeps independent X and Y", () => {
  assert.deepEqual(parseNoiseFrequency("0.1 0.2"), { baseX: 0.1, baseY: 0.2 });
});

test("parseNoiseFrequency preserves zero instead of substituting defaults", () => {
  assert.deepEqual(parseNoiseFrequency("0 0.2"), { baseX: 0, baseY: 0.2 });
  assert.deepEqual(parseNoiseFrequency("0"), { baseX: 0, baseY: 0 });
});

test("parseNoiseFrequency falls back to documented defaults", () => {
  assert.deepEqual(parseNoiseFrequency(""), DEFAULT_NOISE_FREQUENCY);
  assert.deepEqual(parseNoiseFrequency("   "), DEFAULT_NOISE_FREQUENCY);
  assert.deepEqual(parseNoiseFrequency("nope"), DEFAULT_NOISE_FREQUENCY);
  assert.deepEqual(parseNoiseFrequency(undefined), DEFAULT_NOISE_FREQUENCY);
  assert.deepEqual(parseNoiseFrequency(null), DEFAULT_NOISE_FREQUENCY);
  assert.deepEqual(parseNoiseFrequency("0.1 foo"), { baseX: 0.1, baseY: DEFAULT_NOISE_FREQUENCY.baseY });
  assert.deepEqual(parseNoiseFrequency("foo 0.2"), { baseX: DEFAULT_NOISE_FREQUENCY.baseX, baseY: 0.2 });
});

test("liquid button keeps inverted text without remounting children", () => {
  assert.match(source, /parsedFreqRef\.current = parsedFreq/);
  assert.match(source, /tickRef\.current/);
  assert.match(source, /cloneInvertedContent/);
  assert.match(source, /data-liquid-inverted/);
  assert.match(source, /clipPath: `var\(--liquid-clip\)`/);
  assert.doesNotMatch(source, /parts\[0\] === 0/);
  const invertedBlock = source.slice(source.indexOf("data-liquid-inverted"));
  assert.doesNotMatch(invertedBlock.slice(0, 500), /\{children\}/);
});
