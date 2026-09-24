#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(repoRoot, "src/lib/components-catalog.ts");
const registryPath = path.join(repoRoot, "public/r/registry.json");
const errors = [];

const registryTypes = new Set([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:base",
  "registry:font",
  "registry:item",
]);

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function getProperty(object, name) {
  return object.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      ((ts.isIdentifier(property.name) && property.name.text === name) ||
        (ts.isStringLiteralLike(property.name) && property.name.text === name)),
  );
}

function extractCatalogNames() {
  const source = fs.readFileSync(catalogPath, "utf8");
  const sourceFile = ts.createSourceFile(
    catalogPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const diagnostic of sourceFile.parseDiagnostics) {
    errors.push(`components-catalog.ts: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }

  let catalogDeclaration;
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    catalogDeclaration = statement.declarationList.declarations.find(
      (declaration) =>
        ts.isIdentifier(declaration.name) && declaration.name.text === "COMPONENT_CATEGORIES",
    );
    if (catalogDeclaration) break;
  }

  if (!catalogDeclaration?.initializer) {
    errors.push("components-catalog.ts: COMPONENT_CATEGORIES is missing an initializer");
    return [];
  }

  const catalog = unwrapExpression(catalogDeclaration.initializer);
  if (!ts.isArrayLiteralExpression(catalog)) {
    errors.push("components-catalog.ts: COMPONENT_CATEGORIES must be an array literal");
    return [];
  }

  const names = [];
  for (const categoryNode of catalog.elements) {
    const category = unwrapExpression(categoryNode);
    if (!ts.isObjectLiteralExpression(category)) {
      errors.push("components-catalog.ts: every category must be an object literal");
      continue;
    }

    const itemsProperty = getProperty(category, "items");
    const items = itemsProperty && unwrapExpression(itemsProperty.initializer);
    if (!items || !ts.isArrayLiteralExpression(items)) {
      errors.push("components-catalog.ts: every category must contain an items array");
      continue;
    }

    for (const itemNode of items.elements) {
      const item = unwrapExpression(itemNode);
      const componentNameProperty =
        ts.isObjectLiteralExpression(item) && getProperty(item, "componentName");
      const componentName =
        componentNameProperty && unwrapExpression(componentNameProperty.initializer);

      if (!componentName || !ts.isStringLiteralLike(componentName)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(itemNode.getStart(sourceFile));
        errors.push(`components-catalog.ts:${line + 1}: componentName must be a string literal`);
        continue;
      }

      names.push(componentName.text);
    }
  }

  return names;
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${label}: invalid JSON (${error.message})`);
    return null;
  }
}

function validateStringArray(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${label} must be an array of strings`);
    return false;
  }
  return true;
}

function validateRegistryItem(item, entry, relativePath) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    errors.push(`${relativePath}: registry item must be an object`);
    return;
  }

  if (item.name !== entry.name) {
    errors.push(`${relativePath}: item name ${JSON.stringify(item.name)} does not match ${entry.name}`);
  }
  if (!registryTypes.has(item.type)) {
    errors.push(`${relativePath}: unsupported item type ${JSON.stringify(item.type)}`);
  }
  if (item.type !== entry.type) {
    errors.push(`${relativePath}: item type ${JSON.stringify(item.type)} does not match ${entry.type}`);
  }
  if (item.dependencies !== undefined) {
    validateStringArray(item.dependencies, `${relativePath}: dependencies`);
  }
  if (JSON.stringify(item.dependencies ?? []) !== JSON.stringify(entry.dependencies ?? [])) {
    errors.push(`${relativePath}: dependencies do not match the registry index`);
  }

  if (item.files === undefined && item.type === "registry:theme") return;
  if (!Array.isArray(item.files) || item.files.length === 0) {
    errors.push(`${relativePath}: files must be a non-empty array`);
    return;
  }

  for (const [index, file] of item.files.entries()) {
    const label = `${relativePath}: files[${index}]`;
    if (!file || typeof file !== "object" || Array.isArray(file)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (typeof file.path !== "string" || file.path.length === 0) {
      errors.push(`${label}.path must be a non-empty string`);
    }
    if (!registryTypes.has(file.type)) {
      errors.push(`${label}.type is unsupported: ${JSON.stringify(file.type)}`);
    }
    if (typeof file.content !== "string") {
      errors.push(`${label}.content must be a string`);
    }
    if (
      (file.type === "registry:file" || file.type === "registry:page") &&
      (typeof file.target !== "string" || file.target.length === 0)
    ) {
      errors.push(`${label}.target is required for ${file.type}`);
    }
  }
}

const componentNames = extractCatalogNames();
const duplicateCatalogNames = componentNames.filter(
  (name, index) => componentNames.indexOf(name) !== index,
);
for (const name of new Set(duplicateCatalogNames)) {
  errors.push(`components-catalog.ts: duplicate componentName ${JSON.stringify(name)}`);
}

const registry = readJson(registryPath, "public/r/registry.json");
if (registry && !Array.isArray(registry)) {
  errors.push("public/r/registry.json: expected an array");
}

const registryEntries = Array.isArray(registry) ? registry : [];
const registryByName = new Map();
const indexedPaths = new Map();

for (const [index, entry] of registryEntries.entries()) {
  const label = `public/r/registry.json: entries[${index}]`;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    errors.push(`${label} must be an object`);
    continue;
  }
  if (typeof entry.name !== "string" || entry.name.length === 0) {
    errors.push(`${label}.name must be a non-empty string`);
    continue;
  }
  if (registryByName.has(entry.name)) {
    errors.push(`public/r/registry.json: duplicate name ${JSON.stringify(entry.name)}`);
  } else {
    registryByName.set(entry.name, entry);
  }
  if (!registryTypes.has(entry.type)) {
    errors.push(`${label}.type is unsupported: ${JSON.stringify(entry.type)}`);
  }
  validateStringArray(entry.dependencies ?? [], `${label}.dependencies`);
  if (!validateStringArray(entry.files, `${label}.files`) || entry.files.length === 0) {
    if (Array.isArray(entry.files) && entry.files.length === 0) {
      errors.push(`${label}.files must not be empty`);
    }
    continue;
  }

  for (const relativePath of entry.files) {
    const previousOwner = indexedPaths.get(relativePath);
    if (previousOwner) {
      errors.push(`${relativePath}: referenced by both ${previousOwner} and ${entry.name}`);
      continue;
    }
    indexedPaths.set(relativePath, entry.name);

    const itemPath = path.resolve(repoRoot, relativePath);
    if (path.relative(repoRoot, itemPath).startsWith("..")) {
      errors.push(`${entry.name}: indexed path escapes the repository (${relativePath})`);
      continue;
    }
    if (!fs.existsSync(itemPath)) {
      errors.push(`${entry.name}: missing indexed file ${relativePath}`);
      continue;
    }

    validateRegistryItem(readJson(itemPath, relativePath), entry, relativePath);
  }
}

for (const componentName of componentNames) {
  const entry = registryByName.get(componentName);
  const expectedPath = `public/r/${componentName}.json`;
  if (!entry) {
    errors.push(`${componentName}: missing from public/r/registry.json`);
  } else if (!Array.isArray(entry.files) || !entry.files.includes(expectedPath)) {
    errors.push(`${componentName}: registry index does not reference ${expectedPath}`);
  }
}

if (errors.length > 0) {
  console.error("Registry validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Registry validation passed for ${componentNames.length} catalog components and ${registryEntries.length} registry entries.`,
);
