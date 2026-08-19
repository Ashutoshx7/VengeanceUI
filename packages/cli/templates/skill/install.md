# Install

Optional agent setup (skill, MCP config, instructions):

```bash
npx vengeanceui init
```

Granular:

```bash
npx vengeanceui init mcp
npx vengeanceui init cursor
npx vengeanceui init claude
```

## Prerequisites

1. Initialize shadcn in the consumer project:

```bash
npx shadcn@latest init
```

2. Ensure Tailwind CSS and a `cn` helper (`clsx` + `tailwind-merge`) exist — most VengeanceUI components expect `@/lib/utils`.

## Add a component

Registry base: `https://www.vengenceui.com/r`

```bash
npx shadcn@latest add https://www.vengenceui.com/r/{componentName}.json
```

Examples:

```bash
npx shadcn@latest add https://www.vengenceui.com/r/animated-button.json
pnpm dlx shadcn@latest add https://www.vengenceui.com/r/gooey-text-reveal.json
bunx shadcn@latest add https://www.vengenceui.com/r/spotlight-navbar.json
```

Prefer MCP `get_install_command` so the package manager and **componentName** (not docs slug) are correct.

## Manual fallback

If CLI is unavailable: install listed npm deps from `get_component`, copy source from `get_component_source` into the target path (usually `components/ui/…`).
