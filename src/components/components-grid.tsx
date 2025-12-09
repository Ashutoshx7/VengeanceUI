"use client";

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
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedHero } from '@/components/ui/animated-hero'
import LiquidText from '@/components/ui/liquid-text'
import { GradientTilesDemo } from '@/components/docs/gradient-tiles'
import { TestimonialsCardDemo } from '@/components/docs/testimonials-card'
import InteractiveBook from '@/components/ui/interactive-book'
import { SpotlightNavbar } from '@/components/ui/spotlight-navbar'
import GlassDock from '@/components/ui/glass-dock'
import { PerspectiveGrid } from '@/components/ui/perspective-grid'
import AnimatedButton from '@/components/ui/animated-button'
import SocialFlipButton from '@/components/ui/social-flip-button'
import CreepyButton from '@/components/ui/creepy-button'
import { FlipText } from '@/components/ui/flip-text'
import { MaskedAvatars } from '@/components/ui/masked-avatars'
import Link from 'next/link'

const components = [
    {
        title: "Animated Hero",
        description: "Aurora effects & glassmorphism",
        category: "Backgrounds",
        href: "/docs/animated-hero",
        icon: LayoutTemplate,
        // Increased scale/visibility: 1200x800 container, scale 0.35
        component: (
            <div className="absolute inset-0 bg-black overflow-hidden pointer-events-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] flex items-center justify-center transform scale-[0.35]">
                    <AnimatedHero title="HERO" showThemeToggle={false} />
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
        // Zoomed ULTRA IN: Scale 1.5, Font Size 300, Interactive
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
        title: "Gradient Tiles",
        description: "Fluted glass effect",
        category: "Backgrounds",
        href: "/docs/gradient-tiles",
        icon: Grid2X2,
        // Zoomed out
        component: <div className="scale-75"><GradientTilesDemo /></div>
    },
    {
        title: "Testimonials Card",
        description: "3D stacked carousel",
        category: "Components",
        href: "/docs/testimonials-card",
        icon: MessageSquareQuote,
        // Zoomed out
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
        // Zoomed out
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
        // Zoomed out
        component: <div className="mt-8 scale-[0.65] origin-top"><SpotlightNavbar items={[{ label: "Home", href: "#" }, { label: "About", href: "#" }, { label: "Services", href: "#" }]} /></div>
    },
    {
        title: "Glass Dock",
        description: "MacOS-style magnification",
        category: "Components",
        href: "/docs/glass-dock",
        icon: PanelBottom,
        // Zoomed out
        component: <div className="mt-8 scale-[0.65] origin-top"><GlassDock items={[{ icon: LayoutTemplate, title: "Home" }, { icon: Users, title: "Profile" }, { icon: MessageSquareQuote, title: "Chat" }, { icon: Grid2X2, title: "Apps" }]} /></div>
    },
    {
        title: "Perspective Grid",
        description: "3D grid with hover",
        category: "Backgrounds",
        href: "/docs/perspective-grid",
        icon: Grid2X2,
        // Improved visibility: Dark background container
        component: (
            <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
                <div className="scale-75">
                    <PerspectiveGrid />
                </div>
            </div>
        )
    },
    {
        title: "Animated Button",
        description: "Shiny text reveal",
        category: "Animations",
        href: "/docs/animated-button",
        icon: MousePointerClick,
        // Zoomed out
        component: <div className="scale-75"><AnimatedButton>Hover Me</AnimatedButton></div>
    },
    {
        title: "Social Flip Button",
        description: "3D flip interaction",
        category: "Animations",
        href: "/docs/social-flip-button",
        icon: Share2,
        // Zoomed out more: 0.75 -> 0.6
        component: <div className="scale-[0.6]"><SocialFlipButton /></div>
    },
    {
        title: "Creepy Button",
        description: "Dripping text effect",
        category: "Animations",
        href: "/docs/creepy-button",
        icon: Ghost,
        // Zoomed out
        component: <div className="scale-75"><CreepyButton className="bg-red-600">Creepy</CreepyButton></div>
    },
    {
        title: "Flip Text",
        description: "Character flip animation",
        category: "Animations",
        href: "/docs/flip-text",
        icon: Type,
        // Zoomed out
        component: <div className="scale-75"><FlipText className="text-3xl font-bold text-black dark:text-white">Vengeance</FlipText></div>
    },
    {
        title: "Masked Avatars",
        description: "Stacked avatar list",
        category: "Components",
        href: "/docs/masked-avatars",
        icon: Users,
        // Zoomed out more: 0.75 -> 0.6
        component: <div className="scale-[0.6]"><MaskedAvatars /></div>
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
                            bg-neutral-50 dark:bg-[#161616]
                            border border-neutral-100 dark:border-white/5
                            group-hover:border-neutral-200 dark:group-hover:border-white/10
                            transition-colors
                        ">
                            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                                {/* Component Container */}
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
