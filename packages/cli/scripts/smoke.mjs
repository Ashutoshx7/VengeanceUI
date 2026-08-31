#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
  access,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSetupFromArgv } from "../dist/types.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "dist", "index.js");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function run(cwd, args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    cwd,
    env: { ...process.env, NO_COLOR: "1" },
  });
  if (result.status !== 0) {
    throw new Error(
      `cli failed (${args.join(" ")}):\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result;
}

function runExpectFail(cwd, args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    cwd,
    env: { ...process.env, NO_COLOR: "1" },
  });
  if (result.status === 0) {
    throw new Error(
      `cli should have failed (${args.join(" ")}):\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

const MCP_ENTRY = {
  command: "npx",
  args: ["-y", "vengeanceui-mcp"],
};

async function withTemp(fn) {
  const dir = await mkdtemp(join(tmpdir(), "vengeanceui-cli-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

await withTemp(async (dir) => {
  const result = run(dir, ["init"]);
  assert(result.stdout.includes("✔  Agent skill"), "missing skill checkmark");
  assert(result.stdout.includes("✔  MCP server"), "missing mcp checkmark");
  assert(result.stdout.includes("✔  Instructions"), "missing instructions checkmark");
  assert(result.stdout.includes("wrote"), "first run should write");

  const skillMd = await readFile(
    join(dir, ".cursor/skills/vengeance-ui/SKILL.md"),
    "utf8",
  );
  assert(
    !skillMd.includes("../../../AGENTS.md"),
    "consumer skill should not point at this repo AGENTS.md",
  );
  assert(
    await exists(join(dir, ".cursor/skills/vengeance-ui/install.md")),
    "missing cursor install.md",
  );
  assert(
    await exists(join(dir, ".claude/skills/vengeance-ui/SKILL.md")),
    "missing claude skill",
  );

  const cursorMcp = await readJson(join(dir, ".cursor/mcp.json"));
  const claudeMcp = await readJson(join(dir, ".mcp.json"));
  assert(
    JSON.stringify(cursorMcp.mcpServers["vengeance-ui"]) ===
      JSON.stringify(MCP_ENTRY),
    "cursor mcp entry mismatch",
  );
  assert(
    JSON.stringify(claudeMcp.mcpServers["vengeance-ui"]) ===
      JSON.stringify(MCP_ENTRY),
    "claude mcp entry mismatch",
  );

  const agents = await readFile(join(dir, "AGENTS.md"), "utf8");
  const claudeMd = await readFile(join(dir, "CLAUDE.md"), "utf8");
  assert(agents.includes("<!-- BEGIN:vengeance-ui -->"), "agents marker");
  assert(agents.includes("<!-- END:vengeance-ui -->"), "agents end marker");
  assert(
    claudeMd.includes(
      "raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/{componentName}.json",
    ),
    "install url",
  );

  const again = run(dir, ["init"]);
  assert(again.stdout.includes("✔  Agent skill"), "idempotent");
  assert(again.stdout.includes("unchanged"), "second run should be unchanged");
});

await withTemp(async (dir) => {
  run(dir, ["init", "cursor"]);
  assert(await exists(join(dir, ".cursor/skills/vengeance-ui/SKILL.md")), "cursor skill");
  assert(await exists(join(dir, ".cursor/mcp.json")), "cursor mcp");
  assert(await exists(join(dir, "AGENTS.md")), "AGENTS.md");
  assert(!(await exists(join(dir, ".claude"))), "claude dir should be absent");
  assert(!(await exists(join(dir, ".mcp.json"))), ".mcp.json should be absent");
  assert(!(await exists(join(dir, "CLAUDE.md"))), "CLAUDE.md should be absent");
});

await withTemp(async (dir) => {
  run(dir, ["init", "claude"]);
  assert(await exists(join(dir, ".claude/skills/vengeance-ui/SKILL.md")), "claude skill");
  assert(await exists(join(dir, ".mcp.json")), "claude mcp");
  assert(await exists(join(dir, "CLAUDE.md")), "CLAUDE.md");
  assert(!(await exists(join(dir, ".cursor"))), "cursor dir should be absent");
  assert(!(await exists(join(dir, "AGENTS.md"))), "AGENTS.md should be absent");
});

await withTemp(async (dir) => {
  const out = run(dir, ["init", "mcp"]);
  assert(out.stdout.includes("✔  MCP server"), "mcp checkmark");
  assert(!out.stdout.includes("Agent skill"), "mcp-only should not install skill");
  assert(!out.stdout.includes("Instructions"), "mcp-only should not add instructions");
  assert(await exists(join(dir, ".cursor/mcp.json")), "cursor mcp");
  assert(await exists(join(dir, ".mcp.json")), "claude mcp");
  assert(!(await exists(join(dir, ".cursor/skills"))), "no cursor skill");
  assert(!(await exists(join(dir, "AGENTS.md"))), "no AGENTS.md");
});

await withTemp(async (dir) => {
  await mkdir(join(dir, ".cursor"), { recursive: true });
  await writeFile(
    join(dir, ".cursor/mcp.json"),
    JSON.stringify(
      {
        mcpServers: {
          other: { command: "node", args: ["other.js"] },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  run(dir, ["init", "mcp"]);
  const merged = await readJson(join(dir, ".cursor/mcp.json"));
  assert(merged.mcpServers.other.command === "node", "should keep other server");
  assert(
    JSON.stringify(merged.mcpServers["vengeance-ui"]) ===
      JSON.stringify(MCP_ENTRY),
    "should add vengeance-ui server",
  );
});

await withTemp(async (dir) => {
  const custom = { command: "node", args: ["local-mcp.js"] };
  await mkdir(join(dir, ".cursor"), { recursive: true });
  await writeFile(
    join(dir, ".cursor/mcp.json"),
    JSON.stringify({ mcpServers: { "vengeance-ui": custom } }, null, 2) + "\n",
    "utf8",
  );
  const skipped = run(dir, ["init", "mcp"]);
  assert(skipped.stdout.includes("skipped"), "conflicting mcp should be skipped");
  assert(
    JSON.stringify((await readJson(join(dir, ".cursor/mcp.json"))).mcpServers["vengeance-ui"]) ===
      JSON.stringify(custom),
    "should keep custom vengeance-ui entry without --force",
  );
  run(dir, ["init", "mcp", "--force"]);
  assert(
    JSON.stringify((await readJson(join(dir, ".cursor/mcp.json"))).mcpServers["vengeance-ui"]) ===
      JSON.stringify(MCP_ENTRY),
    "force should replace vengeance-ui entry",
  );
});

await withTemp(async (dir) => {
  const mcpPath = join(dir, ".cursor/mcp.json");
  const invalid = '{\n  "mcpServers": "invalid"\n}\n';
  await mkdir(join(dir, ".cursor"), { recursive: true });
  await writeFile(mcpPath, invalid, "utf8");
  const failed = runExpectFail(dir, ["init", "mcp"]);
  assert(
    failed.stderr.includes("mcpServers must be a JSON object"),
    "should reject non-object mcpServers",
  );
  assert(
    (await readFile(mcpPath, "utf8")) === invalid,
    "should not rewrite invalid mcp.json",
  );
});

await withTemp(async (dir) => {
  const out = run(dir, ["init", "--dry-run"]);
  assert(out.stdout.includes("DRY RUN"), "dry-run should show banner");
  assert(out.stdout.includes("would write"), "dry-run should log file actions");
  assert(!(await exists(join(dir, ".cursor"))), "dry-run must not write cursor");
  assert(!(await exists(join(dir, ".mcp.json"))), "dry-run must not write mcp");
  assert(!(await exists(join(dir, "AGENTS.md"))), "dry-run must not write AGENTS.md");
});

await withTemp(async (dir) => {
  run(dir, ["init", "cursor"]);
  const skillPath = join(dir, ".cursor/skills/vengeance-ui/SKILL.md");
  await writeFile(skillPath, "edited locally\n", "utf8");
  const skipped = run(dir, ["init", "cursor"]);
  assert(
    (await readFile(skillPath, "utf8")) === "edited locally\n",
    "should not overwrite without --force",
  );
  assert(skipped.stdout.includes("skipped"), "edited skill should be skipped");
  run(dir, ["init", "cursor", "--force"]);
  const restored = await readFile(skillPath, "utf8");
  assert(restored.startsWith("---"), "force should restore skill frontmatter");
});

await withTemp(async (dir) => {
  await writeFile(join(dir, "AGENTS.md"), "# Existing\n", "utf8");
  run(dir, ["init", "cursor"]);
  const agents = await readFile(join(dir, "AGENTS.md"), "utf8");
  assert(agents.startsWith("# Existing\n"), "should keep existing instructions");
  assert(agents.includes("<!-- BEGIN:vengeance-ui -->"), "should append block");
  const once = agents;
  run(dir, ["init", "cursor"]);
  assert(
    (await readFile(join(dir, "AGENTS.md"), "utf8")) === once,
    "should not duplicate instruction block",
  );
});

await withTemp(async (dir) => {
  const out = run(dir, ["init", "cursor", "--no-mcp"]);
  assert(await exists(join(dir, ".cursor/skills/vengeance-ui/SKILL.md")), "skill");
  assert(await exists(join(dir, "AGENTS.md")), "AGENTS.md");
  assert(!(await exists(join(dir, ".cursor/mcp.json"))), "mcp skipped");
  assert(!out.stdout.includes("✔  MCP server"), "no mcp section");
});

{
  const node = "node";
  const bin = "/tmp/vengeanceui";
  assert(
    resolveSetupFromArgv([node, bin, "init", "cursor"]) === "cursor",
    "argv init cursor",
  );
  assert(
    resolveSetupFromArgv([node, bin, "cursor"]) === "cursor",
    "argv default-command cursor",
  );
  assert(
    resolveSetupFromArgv([node, bin, "init", "--setup", "claude"]) === "claude",
    "argv --setup claude",
  );
  assert(
    resolveSetupFromArgv([node, bin, "init", "-s", "mcp"]) === "mcp",
    "argv -s mcp",
  );
  assert(
    resolveSetupFromArgv([node, bin, "init", "--cwd", "/tmp", "both"]) ===
      "both",
    "argv skips --cwd value",
  );
  assert(
    resolveSetupFromArgv([node, bin, "init", "-y"]) === undefined,
    "argv bare init has no setup",
  );
}

console.log("smoke ok");
