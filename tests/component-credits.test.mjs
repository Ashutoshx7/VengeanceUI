import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);

// Exercise the real documentation data and renderer. Stub unrelated installation
// widgets so this focused test does not need a running Next.js server.
function loadModule(relativePath) {
  const source = readFileSync(new URL(relativePath, root), "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: relativePath,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  assert.deepEqual(diagnostics, []);
  const exports = {};
  const localRequire = (id) => {
    if (id === "@/lib/utils") return { cn: (...values) => values.filter(Boolean).join(" ") };
    if (id.startsWith("@/components/")) {
      return new Proxy({}, { get: () => () => null });
    }
    return require(id);
  };
  vm.runInNewContext(outputText, { exports, require: localRequire }, { filename: relativePath });
  return exports;
}

const { COMPONENT_DOCS } = loadModule("src/lib/component-docs.ts");
const { ComponentDocsSections } = loadModule("src/components/docs/component-docs-sections.tsx");
const renderCredits = (credits) => {
  const html = renderToStaticMarkup(React.createElement(ComponentDocsSections, {
    componentName: "share-sheet", docs: { ...COMPONENT_DOCS["share-sheet"], credits },
  }));
  return html.match(/<section id="credits"[\s\S]*?<\/section>/)?.[0] ?? "";
};

test("Share Sheet credits contain Aseel and exactly GitHub plus website", () => {
  const credit = COMPONENT_DOCS["share-sheet"].credits;
  assert.deepEqual(JSON.parse(JSON.stringify(credit)), {
    author: "Aseel", github: "https://github.com/Aseel012", website: "https://kavynui.com/",
  });
  const html = renderCredits(credit);
  assert.match(html, />Aseel<\/h3>/);
  assert.match(html, /href="https:\/\/github.com\/Aseel012"/);
  assert.match(html, /href="https:\/\/kavynui.com\/"/);
  assert.match(html, /aria-label="Visit Aseel&#x27;s website"/);
  assert.match(html, />Website<\/a>/);
  assert.equal((html.match(/<a /g) ?? []).length, 2);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /LinkedIn|Twitter|>X<\/a>/);
  assert.match(html, /flex flex-wrap items-center gap-3/);
  assert.match(html, /dark:bg-\[#07080a\]/);
});

test("website is optional and existing social platforms still render", () => {
  const html = renderCredits({ author: "Existing contributor", github: "https://github.com/example", twitter: "https://x.com/example", linkedin: "https://www.linkedin.com/in/example" });
  assert.equal((html.match(/<a /g) ?? []).length, 3);
  assert.match(html, />GitHub<\/a>/);
  assert.match(html, />X<\/a>/);
  assert.match(html, />LinkedIn<\/a>/);
  assert.doesNotMatch(html, />Website<\/a>/);
});

test("credits arrays support website-only contributors and omitted credits stay hidden", () => {
  const html = renderCredits([{ author: "Site author", website: "https://example.com/" }, { author: "Other author" }]);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.match(html, />Other author<\/h3>/);
  assert.equal(renderCredits(undefined), "");
});
