#!/usr/bin/env node
import { resolve } from "node:path";
import { parseArgs, USAGE } from "./args.js";
import { runInit } from "./init.js";

try {
  const opts = parseArgs(process.argv);
  if (opts.command === "help") {
    process.stdout.write(USAGE);
    process.exit(0);
  }
  opts.cwd = resolve(opts.cwd);
  await runInit(opts);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
