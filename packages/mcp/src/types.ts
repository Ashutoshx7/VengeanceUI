export type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

export interface ComponentEntry {
  name: string;
  slug: string;
  componentName: string;
  category: string;
  description: string;
  isNew: boolean;
  inCatalog: boolean;
  registryDependencies: string[];
  dependencies: string | null;
  includeUtils: boolean | null;
  manualNotes: string[] | null;
  usageCode: string | null;
  props: unknown[] | null;
  additionalPropSections: unknown[] | null;
}

export interface RegistryEntry {
  name: string;
  type: string;
  dependencies: string[];
  inCatalog: boolean;
  slug: string | null;
  category: string | null;
  description: string | null;
}

export interface ComponentIndex {
  generatedAt: string;
  registryBaseUrl: string;
  categories: { name: string; count: number }[];
  components: ComponentEntry[];
  registry: RegistryEntry[];
  lookups: {
    bySlug: Record<string, string>;
    byComponentName: Record<string, string>;
  };
}
