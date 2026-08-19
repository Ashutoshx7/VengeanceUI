import { confirm, select } from "@inquirer/prompts";

export async function promptAgent(): Promise<"cursor" | "claude" | "both" | "mcp"> {
  return select({
    message: "Agent",
    default: "both",
    choices: [
      { name: "Cursor     skill, AGENTS.md", value: "cursor" },
      { name: "Claude     skill, CLAUDE.md", value: "claude" },
      { name: "Both       Cursor + Claude", value: "both" },
      { name: "MCP only   server config", value: "mcp" },
    ],
  });
}

export async function promptMcp(defaultValue = true): Promise<boolean> {
  return confirm({
    message: "Configure MCP server?",
    default: defaultValue,
  });
}
