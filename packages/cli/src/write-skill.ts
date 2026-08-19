import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dry } from "./log.js";
import { skillTemplateDir } from "./paths.js";

export type WriteContext = {
  cwd: string;
  force: boolean;
  dryRun: boolean;
};

async function copyDir(from: string, to: string, ctx: WriteContext) {
  const entries = await readdir(from, { withFileTypes: true });
  if (!ctx.dryRun) {
    await mkdir(to, { recursive: true });
  } else {
    dry(`mkdir ${to}`);
  }

  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(src, dest, ctx);
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
      continue;
    }
    if (existing !== null && !ctx.force) {
      continue;
    }

    if (ctx.dryRun) {
      dry(`write ${dest}`);
      continue;
    }
    await writeFile(dest, contents, "utf8");
  }
}

export async function writeSkill(
  destDir: string,
  ctx: WriteContext,
): Promise<void> {
  await copyDir(skillTemplateDir, destDir, ctx);
}
