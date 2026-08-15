import type { PackageManager } from "./types.js";
import { loadIndex } from "./index-data.js";

export const PACKAGE_MANAGER_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  bun: "bunx",
  yarn: "yarn dlx",
};

export function getRegistryBaseUrl() {
  return loadIndex().registryBaseUrl;
}

export function getRegistryItemUrl(componentName: string) {
  return `${getRegistryBaseUrl()}/${componentName}.json`;
}

export function getShadcnAddCommand(
  componentName: string,
  packageManager: PackageManager = "npm",
) {
  return `${PACKAGE_MANAGER_EXECUTORS[packageManager]} shadcn@latest add ${getRegistryItemUrl(componentName)}`;
}

const REGISTRY_FETCH_TIMEOUT_MS = 15_000;

export async function fetchComponentSource(componentName: string) {
  const url = getRegistryItemUrl(componentName);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REGISTRY_FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as {
    name: string;
    type?: string;
    dependencies?: string[];
    files?: Array<{
      path: string;
      content: string;
      type?: string;
      target?: string;
    }>;
  };
}
