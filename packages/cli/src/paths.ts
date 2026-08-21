import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export const packageRoot = join(here, "..");
export const templatesDir = join(packageRoot, "templates");
export const skillTemplateDir = join(templatesDir, "skill");
export const instructionsTemplatePath = join(templatesDir, "instructions.md");

export const MCP_SERVER_KEY = "vengeance-ui";

export const mcpServerEntry = {
  command: "npx",
  args: ["-y", "vengeanceui-mcp"],
} as const;

export const INSTRUCTION_BEGIN = "<!-- BEGIN:vengeance-ui -->";
export const INSTRUCTION_END = "<!-- END:vengeance-ui -->";

export function cursorSkillDir(cwd: string) {
  return join(cwd, ".cursor", "skills", "vengeance-ui");
}

export function claudeSkillDir(cwd: string) {
  return join(cwd, ".claude", "skills", "vengeance-ui");
}

export function cursorMcpPath(cwd: string) {
  return join(cwd, ".cursor", "mcp.json");
}

export function claudeMcpPath(cwd: string) {
  return join(cwd, ".mcp.json");
}

export function agentsMdPath(cwd: string) {
  return join(cwd, "AGENTS.md");
}

export function claudeMdPath(cwd: string) {
  return join(cwd, "CLAUDE.md");
}
