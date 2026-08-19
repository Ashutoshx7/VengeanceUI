import type { Options } from "./args.js";
import { ok } from "./log.js";
import {
  agentsMdPath,
  claudeMdPath,
  claudeMcpPath,
  claudeSkillDir,
  cursorMcpPath,
  cursorSkillDir,
} from "./paths.js";
import { writeInstructions } from "./write-instructions.js";
import { writeMcp } from "./write-mcp.js";
import { writeSkill, type WriteContext } from "./write-skill.js";

export async function runInit(opts: Options) {
  const ctx: WriteContext = {
    cwd: opts.cwd,
    force: opts.force,
    dryRun: opts.dryRun,
  };

  const doCursor = opts.target === "all" || opts.target === "cursor";
  const doClaude = opts.target === "all" || opts.target === "claude";
  const doMcpOnly = opts.target === "mcp";
  const doMcp = doCursor || doClaude || doMcpOnly;
  const doSkill = doCursor || doClaude;
  const doInstructions = doCursor || doClaude;

  if (doCursor) {
    await writeSkill(cursorSkillDir(opts.cwd), ctx);
  }
  if (doClaude) {
    await writeSkill(claudeSkillDir(opts.cwd), ctx);
  }
  if (doSkill) {
    ok("Installed VengeanceUI agent skill");
  }

  if (doCursor || doMcpOnly) {
    await writeMcp(cursorMcpPath(opts.cwd), ctx);
  }
  if (doClaude || doMcpOnly) {
    await writeMcp(claudeMcpPath(opts.cwd), ctx);
  }
  if (doMcp) {
    ok("Configured MCP server");
  }

  if (doCursor) {
    await writeInstructions(agentsMdPath(opts.cwd), ctx);
  }
  if (doClaude) {
    await writeInstructions(claudeMdPath(opts.cwd), ctx);
  }
  if (doInstructions) {
    ok("Added VengeanceUI instructions");
  }
}
