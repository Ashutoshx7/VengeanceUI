# Gooey Text Reveal

A reusable, typed React component that splits copy into visual lines and reveals
each line through a gooey blur. It supports mount, scroll-entry, and scrubbed
scroll animations, responds to width changes, and respects reduced-motion
preferences.

## Run the example

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Validate the TypeScript project and production output with:

```bash
npm run typecheck
npm run build
```

## Install from the Vengeance UI CLI registry

```bash
npx shadcn@latest add https://www.vengenceui.com/r/gooey-text-reveal.json
```

The registry installs `gsap` and `@gsap/react` and writes the component to
`components/ui/gooey-text-reveal.tsx`.

## Usage

```tsx
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";

export function Heading() {
  return (
    <GooeyTextReveal
      mode="scroll"
      duration={1.4}
      stagger={0.12}
      blurAmount={0.4}
      className="max-w-4xl"
    >
      <h2>Old light takes its time becoming visible.</h2>
    </GooeyTextReveal>
  );
}
```

Direct children are reveal targets. For nested markup, add
`data-gooey-reveal-item` to each element that should be split independently.

## Props

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | required | Text-bearing elements to reveal. |
| `mode` | `"immediate" \| "scroll" \| "scrub"` | `"immediate"` | Selects the trigger behavior. |
| `delay` | `number` | `0` | Delay for immediate and scroll modes, in seconds. |
| `duration` | `number` | `1.5` | Reveal duration per line, in seconds. |
| `stagger` | `number` | `0.1` | Delay between lines, in seconds. |
| `blurAmount` | `number` | `0.35` | Initial blur in em units. |
| `ease` | `string` | `"power3.out"` | GSAP ease expression. |
| `start` | `string` | `"top 80%"` | ScrollTrigger start position. |
| `end` | `string` | `"bottom 75%"` | Scrub mode end position. |
| `scroller` | `string \| HTMLElement \| React.RefObject<HTMLElement \| null>` | viewport | Scrollable ancestor for nested panels or modals. |
| `once` | `boolean` | `true` | Prevents scroll mode from replaying. |
| `disabled` | `boolean` | `false` | Leaves content unsplit and static. |
| `onComplete` | `() => void` | — | Runs when the tween finishes. |

All standard `div` attributes, including `className`, `style`, `id`, and data
attributes, are forwarded to the wrapper.

The component does not impose background or text colors. Revealed text inherits
the current color from its parent, so CSS class-based light and dark themes work
without additional configuration.
