# Examples

## SaaS hero CTA button

1. `search_components` with query `animated button` (category `Buttons` optional).
2. `get_component` with `my-animated-button` or `animated-button`.
3. `get_install_command` → install `animated-button`.
4. Use the returned `usageCode`; pass children / `className` as needed.

## Text motion headline

1. `search_components` query `gooey` or `flip text` / `stagger`.
2. `get_component` for the chosen slug.
3. Install via `componentName`; wire the usage snippet into the hero.

## Landing navbar

1. `search_components` query `navbar` (category `Navbar & Docs`).
2. Pick e.g. `spotlight-navbar`, `notch-navbar`, or `mega-menu-navbar`.
3. `get_component` → install → adapt links/labels from usage props.

Do not hand-roll a shine CTA, gooey title, or glass nav when a registry match exists.
