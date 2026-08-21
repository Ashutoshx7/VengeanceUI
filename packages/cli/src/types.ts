export type Target = "all" | "cursor" | "claude" | "mcp";

export type Options = {
  target: Target;
  cwd: string;
  force: boolean;
  dryRun: boolean;
  yes: boolean;
  includeMcp: boolean;
};

const VALUE_TAKING_FLAGS = new Set(["--cwd", "--setup", "-s"]);

/**
 * Read an explicit setup target from argv before interactive-commander
 * has populated `command.args`. Prefer this over `command.args[0]` in
 * option prompts — otherwise `init cursor` still opens the Agent prompt.
 */
export function resolveSetupFromArgv(argv: string[]): string | undefined {
  const args = argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token === "--setup" || token === "-s") {
      const next = args[i + 1];
      return typeof next === "string" && next.length > 0
        ? next.trim().toLowerCase()
        : undefined;
    }
    if (token.startsWith("--setup=")) {
      const value = token.slice("--setup=".length).trim().toLowerCase();
      return value.length > 0 ? value : undefined;
    }
  }

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token.startsWith("-")) {
      if (!token.includes("=") && VALUE_TAKING_FLAGS.has(token)) i += 1;
      continue;
    }
    if (token === "init") continue;
    return token.trim().toLowerCase();
  }

  return undefined;
}

export function toTarget(value: string): Target {
  const normalized = value.trim().toLowerCase();
  if (normalized === "both" || normalized === "all") return "all";
  if (
    normalized === "cursor" ||
    normalized === "claude" ||
    normalized === "mcp"
  ) {
    return normalized;
  }
  throw new Error(
    `Unknown setup "${value}". Use cursor, claude, both, or mcp.`,
  );
}
