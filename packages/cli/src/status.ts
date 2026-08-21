import { relative } from "node:path";

export type WriteStatus = "wrote" | "unchanged" | "skipped" | "would-write";

export function rel(cwd: string, path: string) {
  const value = relative(cwd, path);
  return value === "" ? "." : value;
}

export function combineStatuses(statuses: WriteStatus[]): WriteStatus {
  if (statuses.includes("wrote")) return "wrote";
  if (statuses.includes("would-write")) return "would-write";
  if (statuses.includes("skipped")) return "skipped";
  return "unchanged";
}

export function statusLabel(status: WriteStatus) {
  if (status === "would-write") return "would write";
  return status;
}
