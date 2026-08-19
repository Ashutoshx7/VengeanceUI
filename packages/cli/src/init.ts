import type { Options } from "./types.js";
import { banner, done, ok, row } from "./log.js";
import {
  agentsMdPath,
  claudeMdPath,
  claudeMcpPath,
  claudeSkillDir,
  cursorMcpPath,
  cursorSkillDir,
} from "./paths.js";
import { rel, statusLabel, type WriteStatus } from "./status.js";
import { writeInstructions } from "./write-instructions.js";
import { writeMcp } from "./write-mcp.js";
import { writeSkill, type WriteContext } from "./write-skill.js";

function item(
  cwd: string,
  label: string,
  path: string,
  status: WriteStatus,
) {
  row(label, rel(cwd, path), statusLabel(status));
}

export async function runInit(opts: Options) {
  banner({ dryRun: opts.dryRun, target: opts.target });

  const ctx: WriteContext = {
    cwd: opts.cwd,
    force: opts.force,
    dryRun: opts.dryRun,
  };

  const doCursor = opts.target === "all" || opts.target === "cursor";
  const doClaude = opts.target === "all" || opts.target === "claude";
  const doMcpOnly = opts.target === "mcp";
  const doSkill = doCursor || doClaude;
  const doInstructions = doCursor || doClaude;
  const doMcp =
    doMcpOnly || (opts.includeMcp && (doCursor || doClaude));

  if (doSkill) {
    const cursorStatus = doCursor
      ? await writeSkill(cursorSkillDir(opts.cwd), ctx)
      : null;
    const claudeStatus = doClaude
      ? await writeSkill(claudeSkillDir(opts.cwd), ctx)
      : null;
    ok("Agent skill");
    if (cursorStatus) {
      item(opts.cwd, "Cursor", cursorSkillDir(opts.cwd), cursorStatus);
    }
    if (claudeStatus) {
      item(opts.cwd, "Claude", claudeSkillDir(opts.cwd), claudeStatus);
    }
    console.log();
  }

  if (doMcp) {
    const cursorStatus =
      doCursor || doMcpOnly
        ? await writeMcp(cursorMcpPath(opts.cwd), ctx)
        : null;
    const claudeStatus =
      doClaude || doMcpOnly
        ? await writeMcp(claudeMcpPath(opts.cwd), ctx)
        : null;
    ok("MCP server");
    if (cursorStatus) {
      item(opts.cwd, "Cursor", cursorMcpPath(opts.cwd), cursorStatus);
    }
    if (claudeStatus) {
      item(opts.cwd, "Claude", claudeMcpPath(opts.cwd), claudeStatus);
    }
    console.log();
  }

  if (doInstructions) {
    const cursorStatus = doCursor
      ? await writeInstructions(agentsMdPath(opts.cwd), ctx)
      : null;
    const claudeStatus = doClaude
      ? await writeInstructions(claudeMdPath(opts.cwd), ctx)
      : null;
    ok("Instructions");
    if (cursorStatus) {
      item(opts.cwd, "Cursor", agentsMdPath(opts.cwd), cursorStatus);
    }
    if (claudeStatus) {
      item(opts.cwd, "Claude", claudeMdPath(opts.cwd), claudeStatus);
    }
  }

  if (!opts.dryRun) {
    done(
      "npx shadcn@latest add https://www.vengenceui.com/r/{name}.json",
    );
  } else {
    console.log();
  }
}
