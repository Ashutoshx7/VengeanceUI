export type Target = "all" | "cursor" | "claude" | "mcp";

export type Options = {
  command: "init" | "help";
  target: Target;
  cwd: string;
  force: boolean;
  dryRun: boolean;
};

const TARGETS = new Set(["cursor", "claude", "mcp"]);

export const USAGE = `Usage: vengeanceui init [cursor|claude|mcp] [options]

Install the VengeanceUI agent skill, MCP server config, and instructions.

Commands:
  init              Skill (Cursor + Claude), MCP configs, and instructions
  init cursor       Cursor skill, .cursor/mcp.json, and AGENTS.md
  init claude       Claude skill, .mcp.json, and CLAUDE.md
  init mcp          MCP configs only (.cursor/mcp.json and .mcp.json)

Options:
  --cwd <path>      Working directory (default: current directory)
  --force           Overwrite existing skill files and MCP/instruction sections
  --dry-run         Print actions without writing files
  -h, --help        Show this help
`;

export function parseArgs(argv: string[]): Options {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    return {
      command: "help",
      target: "all",
      cwd: process.cwd(),
      force: false,
      dryRun: false,
    };
  }

  if (args[0] !== "init") {
    throw new Error(`Unknown command "${args[0]}".\n\n${USAGE}`);
  }

  let target: Target = "all";
  let cwd = process.cwd();
  let force = false;
  let dryRun = false;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--cwd") {
      const value = args[++i];
      if (!value) throw new Error("--cwd requires a path");
      cwd = value;
      continue;
    }
    if (arg.startsWith("--cwd=")) {
      cwd = arg.slice("--cwd=".length);
      continue;
    }
    if (TARGETS.has(arg)) {
      target = arg as Target;
      continue;
    }
    throw new Error(`Unknown argument "${arg}".\n\n${USAGE}`);
  }

  return { command: "init", target, cwd, force, dryRun };
}
