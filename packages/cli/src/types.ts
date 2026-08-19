export type Target = "all" | "cursor" | "claude" | "mcp";

export type Options = {
  target: Target;
  cwd: string;
  force: boolean;
  dryRun: boolean;
  yes: boolean;
  includeMcp: boolean;
};

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
