import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(await readFile(path.join(root, "public/r/pricing-tiers.json"), "utf8"));
const source = registry.files.find((file) => file.target === "components/ui/pricing-tiers.tsx");

test("pricing tiers registry publishes current source and discovery metadata", async () => {
  assert.equal(source.content, await readFile(path.join(root, "src/components/ui/pricing-tiers.tsx"), "utf8"));
  assert.equal(registry.type, "registry:ui");
  const aggregate = JSON.parse(await readFile(path.join(root, "public/r/registry.json"), "utf8"));
  const entry = aggregate.find((item) => item.name === "pricing-tiers");
  assert.ok(entry, "Pricing Tiers must be discoverable through the aggregate registry");
  assert.deepEqual(entry.files, ["public/r/pricing-tiers.json"]);
  assert.deepEqual(entry.dependencies, registry.dependencies);
});

test("every package the component imports is a registry dependency", () => {
  const file = ts.createSourceFile("pricing-tiers.tsx", source.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const packages = file.statements
    .filter(ts.isImportDeclaration)
    .map((node) => node.moduleSpecifier.text)
    .filter((name) => name !== "react" && !name.startsWith("@/"));
  for (const name of packages) {
    assert.ok(registry.dependencies.includes(name), `missing ${name}`);
  }
  // cn from @/lib/utils needs both of these in the consumer project.
  for (const name of ["clsx", "tailwind-merge"]) {
    assert.ok(registry.dependencies.includes(name), `missing ${name}`);
  }
});

test("installable pricing tiers typechecks as a standalone consumer component", () => {
  const fileName = path.join(root, ".registry-typecheck/components/ui/pricing-tiers.tsx");
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  assert.equal(config.error, undefined);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  assert.deepEqual(parsed.errors, []);
  // Keep the @/* alias: consumers resolve cn from @/lib/utils like any shadcn project.
  const options = { ...parsed.options, noEmit: true, incremental: false };
  const host = ts.createCompilerHost(options);
  const { fileExists, readFile: readSource, getSourceFile } = host;
  host.fileExists = (name) => name === fileName || fileExists(name);
  host.readFile = (name) => name === fileName ? source.content : readSource(name);
  host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) => name === fileName
    ? ts.createSourceFile(name, source.content, languageVersion, true)
    : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([fileName], options, host);
  const errors = ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
    file: diagnostic.file?.fileName,
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
  }));
  assert.deepEqual(errors, []);
});
