# Conventions

- Most interactive/animated components are **client components** (`"use client"`).
- Prefer `cn(...)` from `@/lib/utils` for class merging.
- Styling is Tailwind-first; respect light/dark via existing theme tokens (`--foreground`, `--background`, `dark:` variants) when the component already does.
- Motion stacks vary: Framer Motion, GSAP, Three.js / R3F, shaders — install only the deps from `get_component` / registry JSON.
- Do not strip accessibility attributes or reduced-motion handling present in registry source.
- Compose landing sections from registry pieces; avoid one-off rewrites of heroes, buttons, navs, or text effects that already exist.
- When editing this monorepo’s Next app, heed [AGENTS.md](../../../AGENTS.md) (Next version differs from training data).
