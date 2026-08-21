import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { skillTemplateDir } from "./paths.js";
import {
  combineStatuses,
  type WriteStatus,
} from "./status.js";

export type WriteContext = {
  cwd: string;
  force: boolean;
  dryRun: boolean;
};

async function copyDir(
  from: string,
  to: string,
  ctx: WriteContext,
): Promise<WriteStatus> {
  const entries = await readdir(from, { withFileTypes: true });
  const statuses: WriteStatus[] = [];

  if (!ctx.dryRun) {
    await mkdir(to, { recursive: true });
  }

  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      statuses.push(await copyDir(src, dest, ctx));
      continue;
    }

    const contents = await readFile(src, "utf8");
    let existing: string | null = null;
    try {
      existing = await readFile(dest, "utf8");
    } catch {
      existing = null;
    }

    if (existing !== null && existing === contents) {
      statuses.push("unchanged");
      continue;
    }
    if (existing !== null && !ctx.force) {
      statuses.push("skipped");
      continue;
    }

    if (ctx.dryRun) {
      statuses.push("would-write");
      continue;
    }
    await writeFile(dest, contents, "utf8");
    statuses.push("wrote");
  }

  return combineStatuses(statuses);
}

export async function writeSkill(
  destDir: string,
  ctx: WriteContext,
): Promise<WriteStatus> {
  return copyDir(skillTemplateDir, destDir, ctx);
}
