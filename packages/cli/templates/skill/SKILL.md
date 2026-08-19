---
name: vengeance-ui
description: >-
  Install and compose VengeanceUI animated React/Tailwind components via the
  shadcn registry and vengeanceui-mcp. Use when building landing pages, heroes,
  buttons, navs, text motion, or when the user mentions VengeanceUI,
  vengenceui.com, or npx shadcn add with the Vengeance registry.
---

# VengeanceUI

Prefer existing registry components over inventing similar UI.

## Workflow

1. Clarify the UI need (hero CTA, text motion, nav, card, background, …).
2. Call MCP **`search_components`** (optional category filter).
3. Call MCP **`get_component`** for props, usage, and deps.
4. Call MCP **`get_install_command`** (or install yourself).
5. Adapt the usage snippet; do **not** rewrite the component unless asked.

If MCP is unavailable, use the install URL pattern in [install.md](install.md) and the docs at https://www.vengenceui.com — still do not invent duplicates of catalog components.

## MCP tools

| Tool                   | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `list_categories`      | Catalog categories                             |
| `search_components`    | Find by name/slug/description                  |
| `get_component`        | Props, usage, deps (slug **or** componentName) |
| `get_install_command`  | `shadcn add` URL for a package manager         |
| `get_component_source` | Live registry JSON + source                    |
| `list_registry`        | All registry names (includes blocks)           |

## Slug vs componentName

- **slug** — docs/URL key (e.g. `my-animated-button`)
- **componentName** — registry install name (e.g. `animated-button`)

`get_component` / `get_install_command` accept either. Always install with **componentName**.

## Rules

- Install via shadcn + Vengeance registry URL — see [install.md](install.md).
- Follow [conventions.md](conventions.md) (`"use client"`, `cn`, theme tokens, motion).
- Keep the skill small; never paste the full catalog into context — use MCP.
- Walkthroughs: [examples.md](examples.md).
