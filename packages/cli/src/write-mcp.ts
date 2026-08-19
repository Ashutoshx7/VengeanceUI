import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { dry } from "./log.js";
import { MCP_SERVER_KEY, mcpServerEntry } from "./paths.js";
import type { WriteContext } from "./write-skill.js";

type McpFile = {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
};

function serialize(data: McpFile) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function writeMcp(
  filePath: string,
  ctx: WriteContext,
): Promise<void> {
  let existing: McpFile = {};
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`${filePath} is not a JSON object`);
    }
    existing = parsed as McpFile;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }

  const servers = {
    ...(existing.mcpServers ?? {}),
  };
  const current = servers[MCP_SERVER_KEY];
  const next = { ...mcpServerEntry };
  const same =
    current && JSON.stringify(current) === JSON.stringify(next);

  if (same) {
    return;
  }
  if (current && !ctx.force) {
    return;
  }

  const nextFile: McpFile = {
    ...existing,
    mcpServers: {
      ...servers,
      [MCP_SERVER_KEY]: next,
    },
  };
  const out = serialize(nextFile);

  if (ctx.dryRun) {
    dry(`write ${filePath}`);
    return;
  }

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, out, "utf8");
}
