# vengeanceui-mcp

MCP server for [VengeanceUI](https://www.vengenceui.com): search the component catalog, read props/usage, get shadcn install commands, and fetch registry source.

Pairs with the Cursor skill at `.cursor/skills/vengeance-ui/`.

## Consumer setup

In your app (no clone required):

```bash
npx vengeanceui init
```

In a terminal this prompts for Cursor, Claude, both, or MCP only. `-y` (or a non-TTY) writes both skills, both MCP configs (`npx -y vengeanceui-mcp`), and `AGENTS.md` / `CLAUDE.md`.

Granular:

```bash
npx vengeanceui init cursor
npx vengeanceui init claude
npx vengeanceui init mcp
```

Docs: [CLI](https://www.vengenceui.com/docs/cli).

## Contributor setup

```bash
cd packages/mcp
npm install
npm run build
```

`build` regenerates `data/index.json` then compiles. Re-run it whenever catalog/docs/registry sources change.

### Cursor `mcp.json` (from a clone of this repository)

```json
{
  "mcpServers": {
    "vengeance-ui": {
      "command": "node",
      "args": ["${workspaceFolder}/packages/mcp/dist/index.js"]
    }
  }
}
```

For global `~/.cursor/mcp.json`, use an absolute path to `dist/index.js` instead of `${workspaceFolder}`.

### After npm publish

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

## Tools

| Tool                   | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `list_categories`      | Marketing catalog categories                          |
| `search_components`    | Search by name / slug / description / category        |
| `get_component`        | Full docs entry (slug **or** `componentName`)         |
| `get_install_command`  | `shadcn add https://www.vengenceui.com/r/{name}.json` |
| `get_component_source` | Live registry JSON from the site                      |
| `list_registry`        | All registry names (includes blocks)                  |

## Generate index

Rebuild `data/index.json` from repo sources whenever these change:

- `public/r/registry.json`
- `src/lib/components-catalog.ts`
- `src/lib/component-docs.ts`

```bash
npm run generate-index
```

Or from the repo root:

```bash
node packages/mcp/scripts/generate-index.mjs
```

## Smoke test

```bash
npm run smoke
```

Checks resolve for `my-animated-button` ↔ `animated-button`, install URL shape, and live source fetch.

## License

MIT
