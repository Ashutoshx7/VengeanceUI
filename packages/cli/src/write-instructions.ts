import { readFile, writeFile } from "node:fs/promises";
import {
  INSTRUCTION_BEGIN,
  INSTRUCTION_END,
  instructionsTemplatePath,
} from "./paths.js";
import type { WriteStatus } from "./status.js";
import type { WriteContext } from "./write-skill.js";

function wrap(body: string) {
  const trimmed = body.trim();
  return `${INSTRUCTION_BEGIN}\n${trimmed}\n${INSTRUCTION_END}\n`;
}

function replaceBlock(source: string, block: string) {
  const start = source.indexOf(INSTRUCTION_BEGIN);
  const end = source.indexOf(INSTRUCTION_END);
  if (start === -1 || end === -1 || end < start) {
    return null;
  }
  const afterEnd = end + INSTRUCTION_END.length;
  const prefix = source.slice(0, start);
  let suffix = source.slice(afterEnd);
  if (suffix.startsWith("\n")) suffix = suffix.slice(1);
  return `${prefix}${block}${suffix}`;
}

export async function writeInstructions(
  filePath: string,
  ctx: WriteContext,
): Promise<WriteStatus> {
  const body = await readFile(instructionsTemplatePath, "utf8");
  const block = wrap(body);

  let existing: string | null = null;
  try {
    existing = await readFile(filePath, "utf8");
  } catch {
    existing = null;
  }

  let next: string;
  if (existing === null) {
    next = block;
  } else if (existing.includes(INSTRUCTION_BEGIN)) {
    const replaced = replaceBlock(existing, block);
    if (replaced === null) {
      throw new Error(
        `Found ${INSTRUCTION_BEGIN} in ${filePath} but no matching ${INSTRUCTION_END}`,
      );
    }
    if (replaced === existing) return "unchanged";
    if (!ctx.force) return "skipped";
    next = replaced;
  } else {
    const sep = existing.endsWith("\n") ? "\n" : "\n\n";
    next = `${existing}${sep}${block}`;
  }

  if (ctx.dryRun) return "would-write";
  await writeFile(filePath, next, "utf8");
  return "wrote";
}
