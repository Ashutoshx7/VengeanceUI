import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { MCP_SERVER_KEY, mcpServerEntry } from "./paths.js";
import type { WriteStatus } from "./status.js";
import type { WriteContext } from "./write-skill.js";

type McpFile = {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
};

function serialize(data: McpFile) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function writeMcp(
  filePath: string,
  ctx: WriteContext
): Promise<WriteStatus> {
  let existing: McpFile = {};
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) {
      throw new Error(`${filePath} is not a JSON object`);
    }
    if (
      "mcpServers" in parsed &&
      parsed.mcpServers !== undefined &&
      !isPlainObject(parsed.mcpServers)
    ) {
      throw new Error(
        `${filePath}: mcpServers must be a JSON object (got ${Array.isArray(parsed.mcpServers) ? "array" : typeof parsed.mcpServers})`,
      );
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
    Boolean(current) && JSON.stringify(current) === JSON.stringify(next);

  if (same) return "unchanged";
  if (current && !ctx.force) return "skipped";
  if (ctx.dryRun) return "would-write";

  const nextFile: McpFile = {
    ...existing,
    mcpServers: {
      ...servers,
      [MCP_SERVER_KEY]: next,
    },
  };

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, serialize(nextFile), "utf8");
  return "wrote";
}
