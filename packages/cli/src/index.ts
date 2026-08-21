#!/usr/bin/env node
import { resolve } from "node:path";
import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import { runInit } from "./init.js";
import { error } from "./log.js";
import { promptAgent, promptMcp } from "./prompt.js";
import { resolveSetupFromArgv, toTarget } from "./types.js";

const program = new InteractiveCommand()
  .name("vengeanceui")
  .description(
    "Install the VengeanceUI agent skill, MCP server config, and instructions",
  );

program
  .command("init", { isDefault: true })
  .description("Install agent skill, MCP config, and instructions")
  .argument("[setup]", "cursor | claude | both | mcp")
  .addOption(
    new InteractiveOption(
      "-s, --setup <setup>",
      "which integration to install",
    )
      .choices(["cursor", "claude", "both", "mcp"])
      .prompt(async (current, _option, command) => {
        const fromArgv = resolveSetupFromArgv(process.argv);
        if (fromArgv) return fromArgv;
        const positional = command.args[0];
        if (typeof positional === "string" && positional.length > 0) {
          return positional;
        }
        if (typeof current === "string" && current.length > 0) return current;
        if (command.getOptionValue("yes")) return "both";
        return promptAgent();
      }),
  )
  .addOption(
    new InteractiveOption("--mcp", "configure MCP server")
      .default(true)
      .prompt(async (current, _option, command) => {
        if (command.getOptionValue("yes")) return true;
        const setup =
          (command.getOptionValue("setup") as string | undefined) ??
          resolveSetupFromArgv(process.argv) ??
          command.args[0] ??
          "both";
        if (setup === "mcp") return true;
        return promptMcp(current !== false);
      }),
  )
  .addOption(
    new InteractiveOption("--no-mcp", "skip MCP config").prompt(undefined),
  )
  .addOption(
    new InteractiveOption("-y, --yes", "skip prompts (Both + MCP)").prompt(
      undefined,
    ),
  )
  .addOption(
    new InteractiveOption(
      "--force",
      "overwrite existing VengeanceUI files",
    ).prompt(undefined),
  )
  .addOption(
    new InteractiveOption(
      "--dry-run",
      "print actions without writing files",
    ).prompt(undefined),
  )
  .addOption(
    new InteractiveOption("--cwd <path>", "working directory").prompt(
      undefined,
    ),
  )
  .action(
    async (
      setupArg: string | undefined,
      opts: {
        setup?: string;
        mcp?: boolean;
        yes?: boolean;
        force?: boolean;
        dryRun?: boolean;
        cwd?: string;
      },
    ) => {
      const setup = opts.setup ?? setupArg ?? "both";
      await runInit({
        target: toTarget(setup),
        cwd: resolve(opts.cwd ?? process.cwd()),
        force: Boolean(opts.force),
        dryRun: Boolean(opts.dryRun),
        yes: Boolean(opts.yes),
        includeMcp: opts.mcp !== false,
      });
    },
  );

const argv = process.argv.slice();
const skipInteractive =
  argv.includes("-y") ||
  argv.includes("--yes") ||
  argv.includes("--no-interactive") ||
  !process.stdin.isTTY ||
  !process.stdout.isTTY;

if (skipInteractive && !argv.includes("--no-interactive")) {
  argv.push("--no-interactive");
}

try {
  await program
    .interactive("-I, --no-interactive", "disable interactive prompts")
    .parseAsync(argv);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("commander.help")) process.exit(0);
  error(message);
  process.exit(1);
}
