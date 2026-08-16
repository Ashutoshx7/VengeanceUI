import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { resolveComponent, resolveRegistryName } from "./index-data.js";
import { fetchComponentSource, getShadcnAddCommand } from "./registry.js";
import { listCategories, listRegistry, searchComponents } from "./search.js";
import type { PackageManager } from "./types.js";

function text(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text:
          typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

function errorText(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  };
}

export function registerTools(server: McpServer) {
  server.registerTool(
    "list_categories",
    {
      description:
        "List VengeanceUI marketing catalog categories and component counts.",
    },
    async () => text(listCategories()),
  );

  server.registerTool(
    "search_components",
    {
      description:
        "Search VengeanceUI catalog components by name, slug, description, or category.",
      inputSchema: {
        query: z
          .string()
          .describe("Search text (name, slug, description, category)"),
        category: z
          .string()
          .optional()
          .describe("Optional exact category name filter"),
      },
    },
    async ({ query, category }) => {
      const results = searchComponents(query, category).map((c) => ({
        name: c.name,
        slug: c.slug,
        componentName: c.componentName,
        category: c.category,
        description: c.description,
        isNew: c.isNew,
      }));
      return text({ count: results.length, results });
    },
  );

  server.registerTool(
    "get_component",
    {
      description:
        "Get full catalog/docs for a component by slug or registry componentName (e.g. my-animated-button or animated-button).",
      inputSchema: {
        name: z
          .string()
          .describe("Catalog slug or registry componentName"),
      },
    },
    async ({ name }) => {
      const component = resolveComponent(name);
      if (!component) {
        return errorText(
          `Component not found in catalog: ${name}. Try search_components or list_registry.`,
        );
      }
      return text(component);
    },
  );

  server.registerTool(
    "get_install_command",
    {
      description:
        "Return the shadcn CLI add command for a VengeanceUI registry component.",
      inputSchema: {
        name: z
          .string()
          .describe("Catalog slug or registry componentName"),
        packageManager: z
          .enum(["npm", "pnpm", "bun", "yarn"])
          .optional()
          .describe("Package manager (default npm)"),
      },
    },
    async ({ name, packageManager }) => {
      const componentName = resolveRegistryName(name);
      if (!componentName) {
        return errorText(`Unknown component or registry item: ${name}`);
      }
      const pm = (packageManager ?? "npm") as PackageManager;
      const command = getShadcnAddCommand(componentName, pm);
      return text({
        componentName,
        packageManager: pm,
        command,
      });
    },
  );

  server.registerTool(
    "get_component_source",
    {
      description:
        "Fetch live registry JSON (including source files) from www.vengenceui.com/r/{name}.json.",
      inputSchema: {
        name: z
          .string()
          .describe("Catalog slug or registry componentName"),
      },
    },
    async ({ name }) => {
      const componentName = resolveRegistryName(name);
      if (!componentName) {
        return errorText(`Unknown component or registry item: ${name}`);
      }
      try {
        const source = await fetchComponentSource(componentName);
        return text(source);
      } catch (err) {
        return errorText(
          err instanceof Error ? err.message : String(err),
        );
      }
    },
  );

  server.registerTool(
    "list_registry",
    {
      description:
        "List all shadcn registry entry names (includes blocks not in the marketing catalog).",
    },
    async () => text({ count: listRegistry().length, items: listRegistry() }),
  );
}
