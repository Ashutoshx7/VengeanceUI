"use client";

import dynamic from 'next/dynamic'
import {
    ArrowRight,
    LayoutTemplate,
    Grid2X2,
    Type,
    MessageSquareQuote,
    Ghost,
    Users,
    PanelBottom,
    Share2,
    BookOpen,
    Menu,
    Waves,
    MousePointerClick,
    Loader2,
    Layers,
    RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// --- Lazy Load & Optimize Heavy Components ---

const LoadingPlaceholder = () => (
    <div className="flex items-center justify-center w-full h-full bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
        <Loader2 className="w-6 h-6 animate-spin" />
    </div>
)

const AnimatedHero = dynamic(() => import('@/components/ui/animated-hero').then(mod => mod.AnimatedHero), {
    ssr: false,
    loading: () => <LoadingPlaceholder />
})

const LiquidText = dynamic(() => import('@/components/ui/liquid-text'), {
    ssr: false,
    loading: () => <LoadingPlaceholder />
})





const TestimonialsCardDemo = dynamic(() => import('@/components/docs/testimonials-card').then(mod => mod.TestimonialsCardDemo), {
    ssr: false,
    loading: () => <LoadingPlaceholder />
})

const InteractiveBook = dynamic(() => import('@/components/ui/interactive-book'), {
    ssr: false,
    loading: () => <LoadingPlaceholder />
})

const PerspectiveGrid = dynamic(() => import('@/components/ui/perspective-grid').then(mod => mod.PerspectiveGrid), {
    ssr: false,
    loading: () => <LoadingPlaceholder />
})

// Lighter components can stay as regular imports or dynamic if needed, 
// strictly optimizing the heaviest ones first.
const SpotlightNavbar = dynamic(() => import('@/components/ui/spotlight-navbar').then(mod => mod.SpotlightNavbar), { ssr: false })
const GlassDock = dynamic(() => import('@/components/ui/glass-dock'), { ssr: false })
const AnimatedButton = dynamic(() => import('@/components/ui/animated-button'), { ssr: false })
const SocialFlipButton = dynamic(() => import('@/components/ui/social-flip-button'), { ssr: false })
const CreepyButton = dynamic(() => import('@/components/ui/creepy-button'), { ssr: false })
const FlipText = dynamic(() => import('@/components/ui/flip-text').then(mod => mod.FlipText), { ssr: false })
const MaskedAvatars = dynamic(() => import('@/components/ui/masked-avatars').then(mod => mod.MaskedAvatars), { ssr: false })
const StaggeredGridDemo = dynamic(() => import('@/components/docs/staggered-grid').then(mod => mod.StaggeredGridDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const FlipFadeText = dynamic(() => import('@/components/ui/flip-fade-text').then(mod => mod.FlipFadeText), { ssr: false, loading: () => <LoadingPlaceholder /> })
const LightLines = dynamic(() => import('@/components/ui/light-lines').then(mod => mod.LightLines), { ssr: false, loading: () => <LoadingPlaceholder /> })

const ExpandableBentoGridDemo = dynamic(() => import('@/components/docs/expandable-bento-grid').then(mod => mod.ExpandableBentoGridDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const FolderPreviewDemo = dynamic(() => import('@/components/docs/folder-preview').then(mod => mod.FolderPreviewDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const GlowBorderCardDemo = dynamic(() => import('@/components/docs/glow-border-card').then(mod => mod.GlowBorderCardDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const LineHoverLinkDemo = dynamic(() => import('@/components/docs/line-hover-link').then(mod => mod.LineHoverLinkDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const LogoSliderDemo = dynamic(() => import('@/components/docs/logo-slider').then(mod => mod.LogoSliderDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const StackedLogosDemo = dynamic(() => import('@/components/docs/stacked-logos').then(mod => mod.StackedLogosDemo), { ssr: false, loading: () => <LoadingPlaceholder /> })
const LiquidOcean = dynamic(() => import('@/components/ui/liquid-ocean').then(mod => mod.LiquidOcean), { ssr: false, loading: () => <LoadingPlaceholder /> })


const components = [
    {
        title: "Animated Hero",
        description: "Aurora effects & glassmorphism",
        category: "Backgrounds",
        href: "/docs/animated-hero",
        icon: LayoutTemplate,
        // Optimization: Lazy loaded + Cached Styles
        component: (
            <div className="absolute inset-0 bg-black overflow-hidden pointer-events-auto text-white">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] flex items-center justify-center transform scale-[0.4]">
                    <AnimatedHero title="HERO" showThemeToggle={false} forceTheme="dark" />
                </div>
            </div>
        )
    },
    {
        title: "3D Displacement Text",
        description: "Fluid text interaction",
        category: "Animations",
        href: "/docs/liquid-text",
        icon: Waves,
        component: (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto transform scale-[1.5]">
                <LiquidText
                    text="Fluid"
                    fontSize={300}
                    lightColor="#111"
                    darkColor="#fff"
                    className="h-full w-full"
                />
            </div>
        )
    },


    {
        title: "Testimonials Card",
        description: "3D stacked carousel",
        category: "Components",
        href: "/docs/testimonials-card",
        icon: MessageSquareQuote,
        component: (
            <div className="scale-[0.55] origin-center transform translate-y-4">
                <TestimonialsCardDemo />
            </div>
        )
    },
    {
        title: "Interactive Book",
        description: "3D page flipping effect",
        category: "Animations",
        href: "/docs/interactive-book",
        icon: BookOpen,
        component: (
            <div className="scale-75 container mx-auto flex justify-center">
                <InteractiveBook
                    coverImage="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                    pages={[
                        { pageNumber: 1, title: "Intro", content: <div className="p-4 text-xs font-serif">Welcome to the book.</div> },
                        { pageNumber: 2, title: "Chapter 1", content: <div className="p-4 text-xs font-serif">This is the first chapter content.</div> },
                    ]}
                />
            </div>
        )
    },
    {
        title: "Spotlight Navbar",
        description: "Dynamic hover spotlight",
        category: "Components",
        href: "/docs/spotlight-navbar",
        icon: Menu,
        component: <div className="mt-8 scale-[0.65] origin-top"><SpotlightNavbar items={[{ label: "Home", href: "#" }, { label: "About", href: "#" }, { label: "Services", href: "#" }]} /></div>
    },
    {
        title: "Glass Dock",
        description: "MacOS-style magnification",
        category: "Components",
        href: "/docs/glass-dock",
        icon: PanelBottom,
        component: <div className="mt-8 scale-[0.65] origin-top"><GlassDock items={[{ icon: LayoutTemplate, title: "Home" }, { icon: Users, title: "Profile" }, { icon: MessageSquareQuote, title: "Chat" }, { icon: Grid2X2, title: "Apps" }]} /></div>
    },
    {
        title: "Perspective Grid",
        description: "3D grid with hover",
        category: "Backgrounds",
        href: "/docs/perspective-grid",
        icon: Grid2X2,
        // Optimization: gridSize reduced from default 40 to 20 (400 tiles vs 1600 tiles)
        component: (
            <div className="absolute inset-0 overflow-hidden">
                <PerspectiveGrid
                    gridSize={20}
                    className="bg-neutral-50 dark:bg-black [--fade-stop:#fafafa] dark:[--fade-stop:#000000]"
                />
            </div>
        )
    },
    {
        title: "Animated Button",
        description: "Shiny text reveal",
        category: "Animations",
        href: "/docs/animated-button",
        icon: MousePointerClick,
        component: <div className="scale-75"><AnimatedButton>Hover Me</AnimatedButton></div>
    },
    {
        title: "Social Flip Button",
        description: "3D flip interaction",
        category: "Animations",
        href: "/docs/social-flip-button",
        icon: Share2,
        component: <div className="scale-[0.6]"><SocialFlipButton /></div>
    },
    {
        title: "Creepy Button",
        description: "Dripping text effect",
        category: "Animations",
        href: "/docs/creepy-button",
        icon: Ghost,
        component: <div className="scale-75"><CreepyButton className="bg-red-600">Creepy</CreepyButton></div>
    },
    {
        title: "Flip Text",
        description: "Character flip animation",
        category: "Animations",
        href: "/docs/flip-text",
        icon: Type,
        component: <div className="scale-75"><FlipText className="text-3xl font-bold text-black dark:text-white">Vengeance</FlipText></div>
    },
    {
        title: "Masked Avatars",
        description: "Stacked avatar list",
        category: "Components",
        href: "/docs/masked-avatars",
        icon: Users,
        component: <div className="scale-[0.6]"><MaskedAvatars /></div>
    },
    {
        title: "Staggered Grid",
        description: "Scroll-animated grid",
        category: "Layouts",
        href: "/docs/staggered-grid",
        icon: Layers,
        component: (
            <div className="scale-[0.35] w-[285%] h-[285%] flex items-center justify-center overflow-hidden">
                <StaggeredGridDemo className="border-none" />
            </div>
        )
    },
    {
        title: "Flip Fade Text",
        description: "3D word flip animation",
        category: "Animations",
        href: "/docs/flip-fade-text",
        icon: RefreshCw,
        component: (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
                <div className="scale-[0.5] origin-center">
                    <FlipFadeText words={["LOADING", "COMPUTING", "BUILDING"]} interval={2000} />
                </div>
            </div>
        )
    },
    {
        title: "Light Lines",
        description: "Flowing light trails animation",
        category: "Backgrounds",
        href: "/docs/light-lines",
        icon: Waves,
        component: (
            <div className="absolute inset-0 overflow-hidden">
                <LightLines speedMultiplier={1.5}>
                    <div className="flex items-center justify-center h-full">
                        <span className="text-white font-bold text-lg tracking-wider">LIGHT</span>
                    </div>
                </LightLines>
            </div>
        )
    },
    // New Components
    {
        title: "Expandable Bento",
        description: "Interactive Grid",
        category: "Layouts",
        href: "/docs/expandable-bento-grid",
        icon: Grid2X2,
        component: (
            <div className="scale-[0.4] origin-top">
                <ExpandableBentoGridDemo />
            </div>
        )
    },
    {
        title: "Folder Preview",
        description: "MacOS-style folder",
        category: "Components",
        href: "/docs/folder-preview",
        icon: LayoutTemplate,
        component: <div className="scale-[0.5]"><FolderPreviewDemo /></div>
    },
    {
        title: "Glow Border Card",
        description: "Neon border effect",
        category: "Components",
        href: "/docs/glow-border-card",
        icon: LayoutTemplate,
        component: <div className="scale-[0.6]"><GlowBorderCardDemo /></div>
    },
    {
        title: "Line Hover Link",
        description: "Underline animations",
        category: "Animations",
        href: "/docs/line-hover-link",
        icon: MousePointerClick,
        component: <div className="scale-[0.65] origin-center w-[180%] h-[180%] shrink-0 flex items-center justify-center pr-6"><LineHoverLinkDemo /></div>
    },
    {
        title: "Logo Slider",
        description: "Infinite Marquee",
        category: "Components",
        href: "/docs/logo-slider",
        icon: LayoutTemplate,
        component: <div className="scale-[0.55] origin-center w-[180%] h-[180%] shrink-0 flex items-center justify-center"><LogoSliderDemo /></div>
    },
    {
        title: "Stacked Logos",
        description: "Overlapping logos",
        category: "Components",
        href: "/docs/stacked-logos",
        icon: Users,
        component: <div className="scale-[0.5] origin-center w-[210%] h-[210%] shrink-0 flex items-center justify-center"><StackedLogosDemo /></div>
    },
    {
        title: "Liquid Ocean",
        description: "3D animated ocean waves",
        category: "Backgrounds",
        href: "/docs/liquid-ocean",
        icon: Waves,
        component: (
            <div className="absolute inset-0 overflow-hidden bg-black">
                <LiquidOcean />
            </div>
        )
    },
]

export const ComponentsGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
            {components.map((component, idx) => (
                <div key={idx} className="block group relative">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="
                            h-full flex flex-col
                            rounded-[24px] overflow-hidden
                            bg-white dark:bg-[#0A0A0A]
                            border border-neutral-200 dark:border-neutral-800
                            hover:border-neutral-300 dark:hover:border-neutral-700
                            hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/60
                            transition-all duration-500 ease-out
                            p-2
                        "
                    >
                        {/* Preview Area */}
                        <div className="
                            relative w-full aspect-[4/3] rounded-[18px] overflow-hidden
                            bg-neutral-50 dark:bg-black
                            border border-neutral-100 dark:border-white/5
                            group-hover:border-neutral-200 dark:group-hover:border-white/10
                            transition-colors
                        ">
                            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                                {/* Direct Rendering with less generic wrapping */}
                                {component.component}
                            </div>

                            {/* Inner Shadow for depth */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] rounded-[18px]" />
                        </div>

                        {/* Minimal Details Area */}
                        <div className="px-3 pt-4 pb-2 flex items-center justify-between">
                            <div>
                                <Link href={component.href} className="block">
                                    <h3 className="
                                        text-sm font-semibold transition-colors
                                        text-neutral-900 dark:text-neutral-100
                                        group-hover:text-blue-600 dark:group-hover:text-blue-400
                                    ">
                                        {component.title}
                                    </h3>
                                </Link>
                            </div>
                            <Link
                                href={component.href}
                                className="
                                    w-7 h-7 flex items-center justify-center rounded-full transition-all hover:scale-105
                                    bg-neutral-100 dark:bg-neutral-800/50
                                    text-neutral-400 dark:text-neutral-500
                                    hover:bg-neutral-200 dark:hover:bg-neutral-700
                                    hover:text-neutral-900 dark:hover:text-neutral-100
                                "
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
