import fs from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";
import { selectRegistryFile, type RegistrySourceFile } from "@/lib/registry";

interface RegistryItem {
  files?: RegistrySourceFile[];
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;

  if (!/^[a-z0-9-]+$/.test(name)) {
    return Response.json({ error: "Invalid component name" }, { status: 400 });
  }

  let sourceFile: RegistrySourceFile | undefined;
  try {
    const registryPath = path.join(process.cwd(), "public", "r", `${name}.json`);
    const item = JSON.parse(await fs.readFile(registryPath, "utf8")) as RegistryItem;
    sourceFile = selectRegistryFile(item.files ?? [], name);
  } catch {
    return Response.json({ error: "Component source could not be loaded" }, { status: 404 });
  }

  if (!sourceFile?.content) {
    return Response.json({ error: "Component source is unavailable" }, { status: 404 });
  }

  const source = sourceFile.content;
  const fileName = path.basename(sourceFile.target ?? sourceFile.path ?? `${name}.tsx`);
  const html = await codeToHtml(source, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  });

  // Source only changes on deploy. Let the browser and CDN reuse the
  // highlighted payload instead of re-running Shiki on every Code tab open.
  return Response.json(
    { code: source, html, fileName },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
