import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = await readFile(path.join(root, "src/components/ui/liquid-button.tsx"), "utf8");
const registry = JSON.parse(await readFile(path.join(root, "public/r/liquid-button.json"), "utf8"));

test("liquid button registry publishes the current source", () => {
  const file = registry.files.find((item) => item.target === "components/ui/liquid-button.tsx");
  assert.equal(file?.content, source);
  for (const dependency of ["class-variance-authority", "clsx", "tailwind-merge"]) {
    assert.ok(registry.dependencies.includes(dependency), `missing ${dependency}`);
  }
});

// The parser is pure, so pull just it out of the component and run it
// without React.
function loadParseNoiseFrequency() {
  const file = ts.createSourceFile("liquid-button.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = new Set(["DEFAULT_NOISE_FREQUENCY", "isValidFrequency", "parseNoiseFrequency"]);
  const parts = file.statements
    .filter((node) =>
      (ts.isFunctionDeclaration(node) && names.has(node.name?.text)) ||
      (ts.isVariableStatement(node) && node.declarationList.declarations.some((d) => names.has(d.name.getText(file)))))
    .map((node) => node.getText(file).replace(/^export /, ""));
  assert.equal(parts.length, names.size, "parser helpers not found in the component");
  const js = ts.transpileModule(parts.join("\n"), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return new Function(`${js}\nreturn parseNoiseFrequency;`)();
}

test("noiseFrequency follows SVG baseFrequency rules", () => {
  const parse = loadParseNoiseFrequency();
  const defaults = { baseX: 0.035, baseY: 0.08 };

  assert.deepEqual(parse("0.035 0.08"), defaults);
  assert.deepEqual(parse("0.1"), { baseX: 0.1, baseY: 0.1 });
  assert.deepEqual(parse("0"), { baseX: 0, baseY: 0 });
  assert.deepEqual(parse("0 0.2"), { baseX: 0, baseY: 0.2 });

  assert.deepEqual(parse("-0.1"), defaults);
  assert.deepEqual(parse("-0.1 -0.2"), defaults);
  assert.deepEqual(parse("-0.1 0.2"), { baseX: defaults.baseX, baseY: 0.2 });
  assert.deepEqual(parse("0.2 -1"), { baseX: 0.2, baseY: defaults.baseY });

  assert.deepEqual(parse(""), defaults);
  assert.deepEqual(parse("abc"), defaults);
  assert.deepEqual(parse(undefined), defaults);
});
