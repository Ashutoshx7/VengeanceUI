# vengeanceui

CLI to install [VengeanceUI](https://www.vengenceui.com) agent tooling in a consumer project: skill, MCP config, and instructions.

This does **not** install UI components. Use the [shadcn CLI](https://www.vengenceui.com/docs/cli) for that.

## Setup

```bash
npx vengeanceui init
```

In a terminal this uses arrow-key prompts (↑/↓, Enter):

```text
? Agent
❯ Cursor     skill, AGENTS.md
  Claude     skill, CLAUDE.md
  Both       Cursor + Claude
  MCP only   server config

? Configure MCP server? (Y/n)
```

Pass a target or `-y` to skip:

```bash
npx vengeanceui init cursor
npx vengeanceui init claude
npx vengeanceui init mcp
npx vengeanceui init -y
```

| Command       | Writes                                                              |
| ------------- | ------------------------------------------------------------------- |
| `init`        | Prompts, then writes the chosen agent files                         |
| `init -y`     | Cursor + Claude skills, both MCP configs, `AGENTS.md` + `CLAUDE.md` |
| `init cursor` | `.cursor/skills/vengeance-ui/`, `.cursor/mcp.json`, `AGENTS.md`     |
| `init claude` | `.claude/skills/vengeance-ui/`, `.mcp.json`, `CLAUDE.md`            |
| `init mcp`    | `.cursor/mcp.json` and `.mcp.json` only                             |

Options: `--cwd <path>`, `-y` / `--yes`, `--no-mcp`, `--force`, `--dry-run`.

MCP configs point at:

```json
{
  "mcpServers": {
    "vengeance-ui": {
      "command": "npx",
      "args": ["-y", "vengeanceui-mcp"]
    }
  }
}
```

Existing MCP servers are preserved. Re-runs are idempotent; `--force` overwrites the VengeanceUI skill files and instruction block.

## Local development

```bash
cd packages/cli
npm install
npm run build
node dist/index.js init --dry-run
npm run smoke
```

## License

MIT
