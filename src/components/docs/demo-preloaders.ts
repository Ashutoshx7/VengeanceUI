/**
 * Warms a component demo's JS chunk before navigation (e.g. on sidebar hover),
 * so the preview renders immediately instead of flashing "Loading preview…".
 *
 * Keep in sync with DEMO_COMPONENTS in ./demo-renderer.tsx. Next.js requires
 * each import() to sit inside its own dynamic() call there, so the two maps
 * can't share loaders; tests/demo-preloaders.test.mjs checks they match.
 */
const DEMO_PRELOADERS: Record<string, () => Promise<unknown>> = {
  "bento-grid": () => import("@/registry/bento-grid"),
  "liquid-button": () => import("@/registry/liquid-button"),
  "my-animated-button": () => import("@/registry/my-animated-button"),
  "candy-button": () => import("@/components/docs/candy-button-demo"),
  "pop-button": () => import("@/components/docs/pop-button-demo"),
  "creepy-button": () => import("@/components/docs/creepy-button-demo"),
  "corner-button": () => import("@/components/docs/corner-button-demo"),
  "generate-button": () => import("@/components/docs/generate-button-demo"),
  "radial-glow-button": () => import("@/components/docs/radial-glow-button-demo"),
  "animated-rays": () => import("@/components/docs/animated-rays"),
  "animated-number": () => import("@/components/docs/animated-number"),
  "stats-counter": () => import("@/components/docs/stats-counter-demo"),
  "flip-text": () => import("@/components/docs/Fliptext-examples/flip-text-demo"),
  "flip-fade-text": () => import("@/components/docs/flip-fade-text"),
  "morph-text": () => import("@/components/docs/morph-text-demo"),
  "liquid-text": () => import("@/components/docs/liquid-text"),
  "liquid-metal": () => import("@/components/docs/liquid-metal"),
  "ascii-glitch-ripple": () => import("@/components/docs/ascii-glitch-ripple-demo"),
  "stagger-text": () => import("@/components/docs/stagger-text-demo"),
  "gooey-text-reveal": () => import("@/components/docs/gooey-text-reveal-demo"),
  "reveal-loader": () => import("@/components/docs/reveal-loader-demo"),
  "social-flip-button": () => import("@/components/docs/social-flip-button"),
  "line-hover-link": () => import("@/components/docs/line-hover-link"),
  "interactive-book": () => import("@/components/docs/interactive-book"),
  "image-trail": () => import("@/components/docs/image-trail"),
  "perspective-carousel": () => import("@/components/docs/perspective-carousel"),
  "cylinder-carousel": () => import("@/components/docs/cylinder-carousel-demo"),
  "diagonal-carousel": () => import("@/components/docs/diagonal-carousel"),
  "ripple-displacement-slider": () => import("@/components/ui/ripple-displacement-slider"),
  "pixelated-image-trail": () => import("@/components/docs/pixelated-image-trail"),
  "interactive-keyboard": () => import("@/components/docs/interactive-keyboard-demo"),
  "elastic-stack": () => import("@/components/docs/elastic-stack-demo"),
  "solar-system": () => import("@/components/docs/solar-system-demo"),
  "expandable-bento-grid": () => import("@/components/docs/expandable-bento-grid"),
  "staggered-grid": () => import("@/components/docs/staggered-grid"),
  "image-scatter": () => import("@/components/docs/image-scatter-demo"),
  "perspective-grid": () => import("@/components/docs/perspective-grid"),
  "glow-border-card": () => import("@/components/docs/glow-border-card"),
  "testimonials-card": () => import("@/components/docs/testimonials-card"),
  "folder-preview": () => import("@/components/docs/folder-preview"),
  "glass-dock": () => import("@/components/docs/glass-dock"),
  "spotlight-navbar": () => import("@/components/docs/spotlight-navbar-demo"),
  "gooey-search": () => import("@/components/docs/gooey-search-demo"),
  "animated-tooltip": () => import("@/components/docs/animated-tooltip-demo"),
  "wave-grid-background": () => import("@/components/docs/wave-grid-background-demo"),
  "interactive-particles": () => import("@/components/docs/interactive-particles-demo"),
  "masked-avatars": () => import("@/components/docs/masked-avatars"),
  "agent-bento-grid": () => import("@/components/docs/agent-bento-grid-demo"),
  "kinetic-text-loader": () => import("@/components/docs/kinetic-text-loader-demo"),
  "shared-tooltip-avatars": () => import("@/components/docs/shared-tooltip-avatars-demo"),
  "cursor-card": () => import("@/components/docs/cursor-card-demo"),
  "logo-slider": () => import("@/components/docs/logo-slider"),
  "stacked-logos": () => import("@/components/docs/stacked-logos"),
  "image-reveal-list": () => import("@/components/docs/image-reveal-list-demo"),
  "image-collage": () => import("@/components/docs/image-collage-demo"),
  "faq-accordion": () => import("@/components/docs/faq-accordion-demo"),
  "magnetic-spotlight-marquee": () => import("@/components/docs/magnetic-spotlight-marquee-demo"),
  "light-lines": () => import("@/components/docs/light-lines"),
  "liquid-ocean": () => import("@/components/docs/liquid-ocean"),
  "share-sheet": () => import("@/components/docs/share-sheet-demo"),
  "model-viewer": () => import("@/components/docs/model-viewer"),
  "twisting-ribbon": () => import("@/components/docs/twisting-ribbon-demo"),
  "aurora-hero": () => import("@/components/docs/aurora-hero-demo"),
  "fluid-morph-bg": () => import("@/components/docs/fluid-morph-bg-demo"),
  "typing-keyboard": () => import("@/components/docs/typing-keyboard-demo"),
  "notch-navbar": () => import("@/components/docs/notch-navbar-demo"),
  "mega-menu-navbar": () => import("@/components/docs/mega-menu-navbar-demo"),
  "scroll-dissolve-reveal": () => import("@/components/docs/scroll-dissolve-reveal-demo"),
  "animated-footer": () => import("@/components/docs/animated-footer-demo"),
  "music-player": () => import("@/components/docs/music-player-demo"),
  "awwwards-nav": () => import("@/components/docs/awwwards-nav-demo"),
  "verse-cards": () => import("@/components/docs/verse-cards-demo"),
  "search-modal": () => import("@/components/docs/search-modal-demo"),
  "circular-gallery": () => import("@/components/docs/circular-gallery-demo"),
  "books-showcase": () => import("@/components/docs/books-showcase-demo"),
  "highlight-grid": () => import("@/components/docs/highlight-grid-demo"),
  "research-bento-grid": () => import("@/components/docs/research-bento-grid-demo"),
  "team-reveal-grid": () => import("@/components/docs/team-reveal-grid-demo"),
  "pricing-section": () => import("@/components/docs/pricing-section-demo"),
  "why-us-bento": () => import("@/components/docs/why-us-bento-demo"),
};

const preloaded = new Set<string>();

export function preloadDemo(slug: string) {
  if (preloaded.has(slug)) return;
  const load = DEMO_PRELOADERS[slug];
  if (!load) return;
  preloaded.add(slug);
  load().catch(() => {
    // A failed warm-up is harmless; the real render retries and shows its own error.
    preloaded.delete(slug);
  });
}
