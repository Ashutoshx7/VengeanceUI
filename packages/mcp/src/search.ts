import type { ComponentEntry, ComponentIndex } from "./types.js";
import { loadIndex } from "./index-data.js";

function haystack(entry: ComponentEntry): string {
  return [
    entry.name,
    entry.slug,
    entry.componentName,
    entry.category,
    entry.description,
  ]
    .join(" ")
    .toLowerCase();
}

export function listCategories(index: ComponentIndex = loadIndex()) {
  return index.categories;
}

export function searchComponents(
  query: string,
  category?: string,
  index: ComponentIndex = loadIndex(),
): ComponentEntry[] {
  const q = query.trim().toLowerCase();
  const cat = category?.trim().toLowerCase();

  return index.components.filter((entry) => {
    if (cat && entry.category.toLowerCase() !== cat) return false;
    if (!q) return true;
    return haystack(entry).includes(q);
  });
}

export function listRegistry(index: ComponentIndex = loadIndex()) {
  return index.registry.map((r) => ({
    name: r.name,
    type: r.type,
    dependencies: r.dependencies,
    inCatalog: r.inCatalog,
    slug: r.slug,
    category: r.category,
    description: r.description,
  }));
}
