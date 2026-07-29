import { LayoutGrid, MousePointerClick, Type, Sparkles, Layers, MousePointer2, Image, Library, Navigation } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ComponentItem {
  name: string;
  slug: string;
  description: string;
  componentName: string;
  isNew?: boolean;
}

export interface ComponentCategory {
  name: string;
  icon: LucideIcon;
  items: ComponentItem[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: "Buttons",
    icon: MousePointer2,
    items: [
      { name: "Animated Button", slug: "my-animated-button", description: "Animated CTA button with shine effect", componentName: "animated-button" },
      { name: "Candy Button", slug: "candy-button", description: "Glassy candy-like button with top highlight", componentName: "candy-button" },
      { name: "Pop Button", slug: "pop-button", description: "Interactive 3D pushable pop button", componentName: "pop-button" },
      {
        name: "Generate Button",
        slug: "generate-button",
        componentName: "generate-button",
        description: "An interactive, animated button for AI generation tasks."
      },
      { name: "Radial Glow Button", slug: "radial-glow-button", description: "Button with animated radial gradient hover", componentName: "radial-glow-button" },
      { name: "Social Flip Button", slug: "social-flip-button", description: "Social icon flip interaction", componentName: "social-flip-button" },
      { name: "Liquid Metal", slug: "liquid-metal", description: "Metallic fluid shader effect", componentName: "liquid-metal" },
      { name: "Creepy Button", slug: "creepy-button", description: "Button with tracking eyes", componentName: "creepy-button" },
      { name: "Corner Button", slug: "corner-button", description: "Animated corner dots & lines button", componentName: "corner-button" },
    ],
  },
  {
    name: "Text & Motion",
    icon: Type,
    items: [
      { name: "Animated Number", slug: "animated-number", description: "Smooth numeric transitions", componentName: "animated-number" },
      { name: "Flip Text", slug: "flip-text", description: "Character flip text animation", componentName: "flip-text" },
      { name: "Flip Fade Text", slug: "flip-fade-text", description: "Word flip and fade cycle", componentName: "flip-fade-text" },
      { name: "Liquid Text", slug: "liquid-text", description: "Fluid displacement text effect", componentName: "liquid-text" },
      { name: "Morph Text", slug: "morph-text", description: "Blur-morph word rotation effect", componentName: "morph-text" },
      { name: "ASCII Glitch Ripple", slug: "ascii-glitch-ripple", description: "Dynamic character-scramble wave ripple hover effect", componentName: "ascii-glitch-ripple" },
      { name: "Stagger Text", slug: "stagger-text", description: "Letters or words stagger reveal animation", componentName: "stagger-text" },
    ],
  },
  {
    name: "Interactive",
    icon: MousePointerClick,
    items: [
      { name: "Image Collage", slug: "image-collage", description: "Interactive scattered image collage toggle", componentName: "image-collage" },
      { name: "Interactive Book", slug: "interactive-book", description: "3D page-flip style book", componentName: "interactive-book" },
      { name: "Image Trail", slug: "image-trail", description: "Cursor-following image trail effect", componentName: "image-trail" },
      { name: "Perspective Carousel", slug: "perspective-carousel", description: "Spring-driven 3D image carousel", componentName: "perspective-carousel" },
      { name: "Cylinder Carousel", slug: "cylinder-carousel", description: "Infinite CSS 3D cylinder image carousel", componentName: "cylinder-carousel" },
      { name: "Diagonal Carousel", slug: "diagonal-carousel", description: "Spring-driven diagonal image carousel", componentName: "diagonal-carousel" },
      { name: "Ripple Displacement Slider", slug: "ripple-displacement-slider", description: "Interactive full-screen WebGL slider with fluid ripple displacement transitions", componentName: "ripple-displacement-slider" },
      { name: "Scroll Dissolve Reveal", slug: "scroll-dissolve-reveal", description: "A beautiful image dissolve effect driven by scrolling using React Three Fiber and Shaders.", componentName: "scroll-dissolve-reveal" },
      { name: "Pixelated Image Trail", slug: "pixelated-image-trail", description: "Cursor trail image reveal", componentName: "pixelated-image-trail" },

      { name: "Interactive Keyboard", slug: "interactive-keyboard", description: "Keyboard UI that mirrors your real key presses", componentName: "interactive-keyboard" },
      { name: "Typing Keyboard", slug: "typing-keyboard", description: "3D isometric keyboard with auto-typing screen", componentName: "typing-keyboard" },
      { name: "Solar System", slug: "solar-system", description: "Interactive 3D technology ecosystem orbit animation", componentName: "solar-system" },
      { name: "Interactive Particles", slug: "interactive-particles", description: "Image-sampled particles that scatter around the cursor", componentName: "interactive-particles" },
      { name: "Music Player", slug: "music-player", description: "Collapsible glass music player with equalizer and seekable progress", componentName: "music-player", isNew: true },
      { name: "Verse Cards", slug: "verse-cards", description: "Nav trigger that fans a deck of cards up with a GSAP reveal", componentName: "verse-cards", isNew: true },
      { name: "Circular Gallery", slug: "circular-gallery", description: "Relaxing 3D ring of images with drag-spin, parallax tilt, and center preview", componentName: "circular-gallery", isNew: true },
    ],
  },
  {
    name: "Layout & Cards",
    icon: LayoutGrid,
    items: [
      { name: "Agent Bento Grid", slug: "agent-bento-grid", description: "Multi-agent workspace grid layout", componentName: "agent-bento-grid" },
      { name: "Expandable Bento Grid", slug: "expandable-bento-grid", description: "Interactive multi-panel bento", componentName: "expandable-bento-grid" },
      { name: "Staggered Grid", slug: "staggered-grid", description: "Offset card grid composition", componentName: "staggered-grid" },
      { name: "Image Scatter", slug: "image-scatter", description: "Smooth scroll-triggered scattered photo gallery", componentName: "image-scatter" },
      { name: "Glow Border Card", slug: "glow-border-card", description: "Card with animated glow border", componentName: "glow-border-card" },
      { name: "Testimonials Card", slug: "testimonials-card", description: "Animated testimonial stack", componentName: "testimonials-card" },
      { name: "Highlight Grid", slug: "highlight-grid", description: "Grid with a colored highlight that glides behind the hovered cell", componentName: "highlight-grid", isNew: true },
    ],
  },
  {
    name: "Tooltip & Marquee",
    icon: Layers,
    items: [
      { name: "Cursor Card", slug: "cursor-card", description: "Inline text link with cursor tracking preview card", componentName: "cursor-card" },
      { name: "Elastic Stack", slug: "elastic-stack", description: "Horizontal expanding staggered stack", componentName: "elastic-stack" },
      { name: "Logo Slider", slug: "logo-slider", description: "Infinite logo marquee", componentName: "logo-slider" },
      { name: "Stacked Logos", slug: "stacked-logos", description: "Overlapping brand logos", componentName: "stacked-logos" },
      { name: "Masked Avatars", slug: "masked-avatars", description: "Stacked masked avatar list", componentName: "masked-avatars" },
      { name: "Image Reveal List", slug: "image-reveal-list", description: "Hover-based image reveal tooltip list", componentName: "image-reveal-list" },
      { name: "FAQ Accordion", slug: "faq-accordion", description: "Animated expanding FAQ list", componentName: "faq-accordion" },
      { name: "Shared Tooltip Avatars", slug: "shared-tooltip-avatars", description: "Avatar stack with a sliding shared tooltip", componentName: "shared-tooltip-avatars" },
      { name: "Magnetic Spotlight Marquee", slug: "magnetic-spotlight-marquee", description: "Interactive full-screen marquee with spotlight cursor effect", componentName: "magnetic-spotlight-marquee" },
    ],
  },
  {
    name: "Loaders",
    icon: Sparkles,
    items: [
      { name: "Kinetic Text Loader", slug: "kinetic-text-loader", description: "Typography-based animated loader", componentName: "kinetic-text-loader" },
    ],
  },
  {
    name: "Navbar & Docs",
    icon: Navigation,
    items: [
      { name: "Glass Dock", slug: "glass-dock", description: "Mac-style floating dock", componentName: "glass-dock" },
      { name: "Spotlight Navbar", slug: "spotlight-navbar", description: "Navbar with animated spotlight effect", componentName: "spotlight-navbar" },
      { name: "Notch Navbar", slug: "notch-navbar", description: "Responsive navbar with a sleek cutout notch design", componentName: "notch-navbar" },
      { name: "Mega Menu Navbar", slug: "mega-menu-navbar", description: "Responsive SaaS navbar with rich dropdowns and a mobile drawer", componentName: "mega-menu-navbar", isNew: true },
      { name: "Gooey Search", slug: "gooey-search", description: "Morphing gooey blob search button with animated results", componentName: "gooey-search" },
      { name: "Animated Footer", slug: "animated-footer", description: "Reveal-on-scroll footer with cursor-lit ASCII art and parallax", componentName: "animated-footer" },
      { name: "Awwwards Nav", slug: "awwwards-nav", description: "Glass bottom nav that expands into a mega-menu", componentName: "awwwards-nav", isNew: true },
      { name: "Search Modal", slug: "search-modal", description: "Minimalist command-palette search with live filtering, tags, and actions", componentName: "search-modal", isNew: true },
    ],
  },
  {
    name: "Collections",
    icon: Library,
    items: [
      { name: "Line Hover Link", slug: "line-hover-link", description: "Animated hover underline styles", componentName: "line-hover-link" },
      { name: "Folder Preview", slug: "folder-preview", description: "Folder stack visual preview", componentName: "folder-preview" },
      { name: "Animated Tooltip", slug: "animated-tooltip", description: "Bouncy SVG-shaped tooltips with spring animations", componentName: "animated-tooltip" },
    ],
  },
  {
    name: "Backgrounds",
    icon: Image,
    items: [
      { name: "Wave Grid", slug: "wave-grid-background", description: "Interactive 3D grid of cubes rippling with cursor-driven waves", componentName: "wave-grid-background" },
      { name: "Aurora Hero", slug: "aurora-hero", description: "Fluted glass dynamic hero with interactive switch", componentName: "aurora-hero" },
      { name: "Fluid Morph Background", slug: "fluid-morph-bg", description: "Organic fluid shape morphing animation", componentName: "fluid-morph-bg" },
      { name: "Twisting Ribbon", slug: "twisting-ribbon", description: "3D waving neon ribbon animation", componentName: "twisting-ribbon" },
      { name: "Animated Rays", slug: "animated-rays", description: "Hero with animated heading", componentName: "animated-rays" },
      { name: "Perspective Grid", slug: "perspective-grid", description: "3D perspective matrix background", componentName: "perspective-grid" },
      { name: "Light Lines", slug: "light-lines", description: "Animated flowing line background", componentName: "light-lines" },
      { name: "Liquid Ocean", slug: "liquid-ocean", description: "Animated ocean wave field", componentName: "liquid-ocean" },
    ],
  },
];

export const COMPONENT_BY_SLUG = new Map(
  COMPONENT_CATEGORIES.flatMap((category) => category.items.map((item) => [item.slug, item] as const))
);
