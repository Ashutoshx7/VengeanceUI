'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useMemo, memo, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { Menu, Star, X } from 'lucide-react'
import LogoIcon from '@/assets/logo/logo-icon'
import { NavbarCommandSearch } from './navbar-command-search'
import { GITHUB_REPO_URL } from '@/lib/github'

const GitHubIcon = memo(function GitHubIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16">
            <path
                fill="currentColor"
                d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"
            />
        </svg>
    )
})

const XIcon = memo(function XIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className="size-4">
            <g fill="none">
                <g clipPath="url(#primeTwitter0)">
                    <path
                        fill="currentColor"
                        d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"
                    />
                </g>
                <defs>
                    <clipPath id="primeTwitter0">
                        <path
                            fill="#fff"
                            d="M0 0h14v14H0z"
                        />
                    </clipPath>
                </defs>
            </g>
        </svg>
    )
})

const starFormatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
})

function formatStars(stars: number | null) {
    if (stars === null) return '...'
    return starFormatter.format(stars).replace('.0', '')
}

const GitHubStarLink = memo(function GitHubStarLink({ className }: { className?: string }) {
    const [stars, setStars] = useState<number | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        async function loadStars() {
            try {
                const response = await fetch('/api/github-stars', { signal: controller.signal })
                if (!response.ok) return

                const data = (await response.json()) as { stars?: number | null }
                if (typeof data.stars === 'number') {
                    setStars(data.stars)
                }
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'AbortError')) {
                    setStars(null)
                }
            }
        }

        loadStars()

        return () => controller.abort()
    }, [])

    const starLabel = formatStars(stars)

    return (
        <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
                'github-star-cta h-8 rounded-full px-2.5 text-xs font-medium text-neutral-500 hover:bg-transparent hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200',
                className,
            )}>
            <Link
                href={GITHUB_REPO_URL}
                target="_blank"
                aria-label={`Star Vengeance UI on GitHub. Current stars: ${starLabel}`}
                rel="noreferrer"
                className="text-sm">
                <GitHubIcon />
                <span className="github-star-count inline-flex min-w-8 items-center justify-center gap-1 border-l border-current/15 pl-2 text-[11px] font-medium leading-none">
                    <Star className="size-3 fill-current opacity-70" />
                    {starLabel}
                </span>
            </Link>
        </Button>
    )
})

export const Navbar = memo(function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = useCallback((path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`)
    }, [pathname])

    const closeMenu = useCallback(() => setIsOpen(false), [])

    // Pre-compute active states to avoid recalculating in render
    const activeStates = useMemo(() => ({
        templates: isActive('/templates'),
        docs: isActive('/docs'),
    }), [isActive])

    return (
        <header className="sticky top-0 isolate z-[200] border-b border-neutral-200 bg-background/95 dark:border-[#222] dark:bg-[#050608]/95">
            <div className="w-full px-4 md:px-8 xl:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 lg:py-4">
                        <Link
                            href="/"
                            className="flex w-fit items-center gap-3"
                            prefetch={true}>
                            <LogoIcon className="w-6 text-foreground rotate-180" />
                            <span className="font-orbitron text-xl font-bold tracking-tight -ml-2">Vengeance UI</span>
                        </Link>

                        <div className="-mr-2 hidden items-center gap-4 min-[870px]:flex">
                            <NavbarCommandSearch />

                            <div className="flex items-center gap-1">
                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className={cn('text-foreground/75 rounded-full', activeStates.templates && 'text-foreground')}>
                                    <Link
                                        href="/templates"
                                        prefetch={true}
                                        className="text-sm!">
                                        Templates
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className={cn('text-foreground/75 rounded-full', activeStates.docs && 'text-foreground')}>
                                    <Link
                                        href="/docs/install-nextjs"
                                        prefetch={true}
                                        className="text-sm!">
                                        Docs
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <GitHubStarLink />
                                <ThemeToggle />
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center gap-2 min-[870px]:hidden">
                            <ThemeToggle />

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="size-8"
                                aria-label="Toggle menu">
                                {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Dropdown Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 right-0 top-full overflow-hidden border-b border-neutral-200 bg-background/98 dark:border-[#222] dark:bg-[#050608]/98 backdrop-blur shadow-2xl min-[870px]:hidden z-50">
                        <div className="flex flex-col gap-3 px-6 py-4">
                            <div className="pb-1">
                                <NavbarCommandSearch />
                            </div>

                            <div className="flex flex-col gap-1 border-t border-neutral-200/60 dark:border-zinc-800/60 pt-3">
                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className={cn('justify-start text-sm font-medium', activeStates.templates && 'bg-accent')}>
                                    <Link
                                        href="/templates"
                                        onClick={closeMenu}>
                                        Templates
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className={cn('justify-start text-sm font-medium', activeStates.docs && 'bg-accent')}>
                                    <Link
                                        href="/docs/install-nextjs"
                                        onClick={closeMenu}>
                                        Docs
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 dark:border-zinc-800/60">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 rounded-full">
                                    <Link
                                        href="https://x.com/Ashutosh_7x7"
                                        target="_blank"
                                        aria-label="x/twitter"
                                        rel="noreferrer">
                                        <XIcon />
                                    </Link>
                                </Button>
                                <GitHubStarLink />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
})
