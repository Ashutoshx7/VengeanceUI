'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import imagesLoaded from 'imagesloaded'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Import ACTUAL UI components from the library
import AnimatedButton from '@/components/ui/animated-button'
import { CreepyButton } from '@/components/ui/creepy-button'
import { FlipText } from '@/components/ui/flip-text'
import { GlassDock } from '@/components/ui/glass-dock'
import { LiquidText } from '@/components/ui/liquid-text'
import { PerspectiveGrid } from '@/components/ui/perspective-grid'
import SocialFlipButton from '@/components/ui/social-flip-button'
import { SpotlightNavbar } from '@/components/ui/spotlight-navbar'
import { MaskedAvatars } from '@/components/ui/masked-avatars'
import InteractiveBook from '@/components/ui/interactive-book'
import TestimonialsCard from '@/components/ui/testimonials-card'
import {
    Sparkles, Book, Grid3X3, Users,
    Layers, Type, MousePointer2, Palette, Dock, PanelTop, Image,
    Home, Settings, User, Mail, Search
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface ComponentPreview {
    id: string
    name: string
    icon: React.ReactNode
    preview?: React.ReactNode
    docPath: string
}

// Using ACTUAL UI library components as previews
const documentedComponents: ComponentPreview[] = [
    {
        id: 'animated-button',
        name: 'Animated Button',
        icon: <MousePointer2 className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center">
                <AnimatedButton className="text-sm px-4 py-2">Hover Me</AnimatedButton>
            </div>
        ),
        docPath: '/docs/animated-button'
    },
    {
        id: 'creepy-button',
        name: 'Creepy Button',
        icon: <Sparkles className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.85]">
                <CreepyButton>Click Me</CreepyButton>
            </div>
        ),
        docPath: '/docs/creepy-button'
    },
    {
        id: 'flip-text',
        name: 'Flip Text',
        icon: <Type className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center">
                <FlipText className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                    Flip
                </FlipText>
            </div>
        ),
        docPath: '/docs/flip-text'
    },
    {
        id: 'glass-dock',
        name: 'Glass Dock',
        icon: <Dock className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.7]">
                <GlassDock
                    items={[
                        { icon: Home, title: 'Home', href: '#' },
                        { icon: User, title: 'User', href: '#' },
                        { icon: Settings, title: 'Settings', href: '#' },
                    ]}
                    className="relative"
                />
            </div>
        ),
        docPath: '/docs/glass-dock'
    },
    {
        id: 'gradient-tiles',
        name: 'Gradient Tiles',
        icon: <Palette className="w-8 h-8" />,
        docPath: '/docs/gradient-tiles'
    },
    {
        id: 'liquid-text',
        name: 'Liquid Text',
        icon: <Type className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.9]">
                <LiquidText text="Liquid" className="text-lg" />
            </div>
        ),
        docPath: '/docs/liquid-text'
    },
    {
        id: 'perspective-grid',
        name: 'Perspective Grid',
        icon: <Layers className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full overflow-hidden rounded-lg">
                <PerspectiveGrid />
            </div>
        ),
        docPath: '/docs/perspective-grid'
    },
    {
        id: 'social-flip-button',
        name: 'Social Flip',
        icon: <MousePointer2 className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.45]">
                <SocialFlipButton />
            </div>
        ),
        docPath: '/docs/social-flip-button'
    },
    {
        id: 'spotlight-navbar',
        name: 'Spotlight Nav',
        icon: <PanelTop className="w-6 h-6" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.6]">
                <SpotlightNavbar
                    items={[
                        { label: 'Home', href: '#' },
                        { label: 'About', href: '#' },
                        { label: 'Work', href: '#' },
                    ]}
                />
            </div>
        ),
        docPath: '/docs/spotlight-navbar'
    },
    {
        id: 'masked-avatars',
        name: 'Masked Avatars',
        icon: <Image className="w-8 h-8" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.7]">
                <MaskedAvatars size={50} />
            </div>
        ),
        docPath: '/docs/masked-avatars'
    },
    {
        id: 'interactive-book',
        name: 'Interactive Book',
        icon: <Book className="w-8 h-8" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.4]">
                <InteractiveBook
                    coverImage="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=350&h=500&fit=crop"
                    bookTitle="Preview"
                    bookAuthor="VengeanceUI"
                    width={200}
                    height={280}
                    pages={[
                        { pageNumber: 1, content: <div className="p-4 text-sm">Page 1</div> },
                        { pageNumber: 2, content: <div className="p-4 text-sm">Page 2</div> },
                    ]}
                />
            </div>
        ),
        docPath: '/docs/interactive-book'
    },
    // These components are complex, show icons instead
    {
        id: 'expandable-bento',
        name: 'Bento Grid',
        icon: <Grid3X3 className="w-8 h-8" />,
        docPath: '/docs/expandable-bento-grid'
    },
    {
        id: 'testimonials-card',
        name: 'Testimonials',
        icon: <Users className="w-8 h-8" />,
        preview: (
            <div className="w-full h-full flex items-center justify-center scale-[0.55] overflow-visible">
                <TestimonialsCard
                    width={300}
                    showNavigation={false}
                    showCounter={false}
                    items={[
                        {
                            id: 1,
                            title: "John Doe",
                            description: "Amazing UI components!",
                            image: "https://i.pravatar.cc/100?u=1"
                        },
                    ]}
                />
            </div>
        ),
        docPath: '/docs/testimonials-card'
    },
    {
        id: 'staggered-grid',
        name: 'Staggered Grid',
        icon: <Grid3X3 className="w-8 h-8" />,
        docPath: '/docs/staggered-grid'
    },
    {
        id: 'animated-hero',
        name: 'Animated Hero',
        icon: <Sparkles className="w-8 h-8" />,
        docPath: '/docs/animated-hero'
    },
]

// Featured components for center bento - using ACTUAL components
const featuredComponents = [
    {
        id: 'creepy-button',
        name: 'Creepy Button',
        preview: (
            <div className="scale-[0.6] origin-center">
                <CreepyButton>Hover</CreepyButton>
            </div>
        ),
    },
    {
        id: 'flip-text',
        name: 'Flip Text',
        preview: (
            <FlipText className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                Animate
            </FlipText>
        ),
    },
    {
        id: 'animated-button',
        name: 'Animated Button',
        preview: (
            <AnimatedButton className="text-xs px-3 py-1.5">Explore</AnimatedButton>
        ),
    },
]

export interface LandingPageGridProps {
    centerText?: string
    className?: string
    showFooter?: boolean
}

export function LandingPageGrid({
    centerText = "Explore",
    className,
    showFooter = false
}: LandingPageGridProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeBento, setActiveBento] = useState<number>(0)
    const gridFullRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    const splitText = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ))
    }

    useEffect(() => {
        const handleLoad = () => {
            document.body.classList.remove('loading')
            setIsLoaded(true)
        }
        imagesLoaded(document.querySelectorAll('.grid__item-img'), { background: true }, handleLoad)
        return () => { }
    }, [])

    useEffect(() => {
        if (!isLoaded) return

        // Animate Text
        if (textRef.current) {
            const chars = textRef.current.querySelectorAll('.char')
            gsap.timeline({
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top bottom',
                    end: 'center center-=25%',
                    scrub: 1,
                }
            }).from(chars, {
                ease: 'sine.out',
                yPercent: 300,
                autoAlpha: 0,
                stagger: { each: 0.05, from: 'center' }
            })
        }

        // Animate Grid
        if (gridFullRef.current) {
            const gridFullItems = gridFullRef.current.querySelectorAll('.grid__item')
            const numColumns = getComputedStyle(gridFullRef.current).getPropertyValue('grid-template-columns').split(' ').length
            const middleColumnIndex = Math.floor(numColumns / 2)

            const columns: Element[][] = Array.from({ length: numColumns }, () => [])
            gridFullItems.forEach((item: any, index: number) => {
                const columnIndex = index % numColumns
                columns[columnIndex].push(item)
            })

            columns.forEach((columnItems, columnIndex) => {
                const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2
                gsap.timeline({
                    scrollTrigger: {
                        trigger: gridFullRef.current,
                        start: 'top bottom',
                        end: 'center center',
                        scrub: 1.5,
                    }
                }).from(columnItems, {
                    yPercent: 450,
                    autoAlpha: 0,
                    delay: delayFactor,
                    ease: 'sine.out',
                }).from(columnItems.map(item => item.querySelector('.grid__item-img')), {
                    transformOrigin: '50% 0%',
                    ease: 'sine.out',
                }, 0)
            })

            // Bento animation
            const bentoContainer = gridFullRef.current.querySelector('.bento-container')
            if (bentoContainer) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: gridFullRef.current,
                        start: 'top top+=15%',
                        end: 'bottom center',
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                }).to(bentoContainer, {
                    y: window.innerHeight * 0.1,
                    scale: 1.5,
                    zIndex: 1000,
                    ease: 'power2.out',
                    duration: 1,
                    force3D: true
                }, 0)
            }
        }
    }, [isLoaded])

    // 21 items for 7x3 grid
    const gridItems = [...documentedComponents, ...documentedComponents].slice(0, 21)

    return (
        <div className={cn("shadow relative overflow-hidden w-full", className)}
            style={{ '--grid-item-translate': '0px' } as React.CSSProperties}>

            {/* Center Text */}
            <section className="grid place-items-center w-full relative mt-[10vh]">
                <div ref={textRef} className="text font-alt uppercase flex content-center text-[clamp(3rem,14vw,10rem)] leading-[0.7] text-neutral-900 dark:text-white">
                    {splitText(centerText)}
                </div>
            </section>

            {/* Grid - 7x3 */}
            <section className="grid place-items-center w-full relative">
                <div ref={gridFullRef} className="grid--full relative w-full my-[10vh] h-auto aspect-[2] max-w-none p-4 grid gap-4 grid-cols-7 grid-rows-3">
                    <div className="grid-overlay absolute inset-0 z-[15] pointer-events-none opacity-0 bg-white/80 dark:bg-black/80 rounded-lg transition-opacity duration-500" />

                    {gridItems.map((item, i) => {
                        // Bento at position 16 (row 3, center) - bottom row
                        if (i === 16) {
                            return (
                                <div key="bento-group" className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2 h-full w-full will-change-transform">
                                    {featuredComponents.map((feat, index) => {
                                        const isActive = activeBento === index
                                        return (
                                            <div
                                                key={feat.id}
                                                className={cn(
                                                    "relative cursor-pointer overflow-hidden rounded-2xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                                                    isActive ? "shadow-2xl" : ""
                                                )}
                                                style={{ width: isActive ? "60%" : "20%" }}
                                                onMouseEnter={() => setActiveBento(index)}
                                                onClick={() => setActiveBento(index)}
                                            >
                                                <div className={cn(
                                                    "absolute inset-0 rounded-2xl border z-50 pointer-events-none transition-colors duration-700",
                                                    isActive ? "border-zinc-300 dark:border-zinc-700" : "border-transparent"
                                                )} />
                                                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                                                    <div className={cn(
                                                        "flex flex-col items-center justify-center transition-all duration-500",
                                                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                                    )}>
                                                        {feat.preview}
                                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium">{feat.name}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "absolute inset-0 flex items-center justify-center transition-all duration-500",
                                                        isActive ? "opacity-0" : "opacity-100"
                                                    )}>
                                                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">{feat.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }

                        if (i === 17 || i === 18) return null

                        return (
                            <figure key={`${item.id}-${i}`} className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-pointer">
                                <Link href={item.docPath} className="absolute inset-0 z-30 opacity-0">
                                    <span className="sr-only">View {item.name}</span>
                                </Link>
                                <div className="block w-full h-full">
                                    <div className="grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-xl group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                                        {/* Full-size preview container */}
                                        <div className="absolute inset-0 flex items-center justify-center p-2 overflow-hidden pointer-events-none">
                                            {item.preview ? (
                                                <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                                    {item.preview}
                                                </div>
                                            ) : (
                                                <div className="text-zinc-400 dark:text-zinc-500 transition-all duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:scale-110">
                                                    {item.icon}
                                                </div>
                                            )}
                                        </div>
                                        {/* Gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-xl pointer-events-none" />
                                        {/* Label at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2 z-20 pointer-events-none">
                                            <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-white transition-colors uppercase tracking-wider text-center block">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </figure>
                        )
                    })}
                </div>
            </section>

            {showFooter && (
                <footer className="frame__footer w-full p-8 flex justify-between items-center relative z-50 text-neutral-900 dark:text-white uppercase font-medium text-xs tracking-wider">
                    <a href="#" className="hover:opacity-60 transition-opacity">Vengeance UI</a>
                    <a href="/docs" className="hover:opacity-60 transition-opacity">View Docs</a>
                </footer>
            )}
        </div>
    )
}

export default LandingPageGrid
