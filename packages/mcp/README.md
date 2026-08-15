# vengeanceui-mcp

MCP server for [VengeanceUI](https://www.vengenceui.com): search the component catalog, read props/usage, get shadcn install commands, and fetch registry source.

Pairs with the Cursor skill at `.cursor/skills/vengeance-ui/`.

## Setup

```bash
cd packages/mcp
npm install
npm run generate-index   # if catalog/docs/registry changed
npm run build
```

### Cursor `mcp.json` (local clone)

```json
{
  "mcpServers": {
    "vengeance-ui": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"]
    }
  }
}
```

Use an absolute path to `dist/index.js` if your Cursor config is not rooted at the repo.

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

| Tool | Description |
|------|-------------|
| `list_categories` | Marketing catalog categories |
| `search_components` | Search by name / slug / description / category |
| `get_component` | Full docs entry (slug **or** `componentName`) |
| `get_install_command` | `shadcn add https://www.vengenceui.com/r/{name}.json` |
| `get_component_source` | Live registry JSON from the site |
| `list_registry` | All registry names (includes blocks) |

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
