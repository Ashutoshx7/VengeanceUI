"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command as CommandPrimitive } from "cmdk"
import { Search, Moon, Sun, Laptop, Home, ArrowRight, Box, Book, Settings } from "lucide-react"
import { useTheme } from "next-themes"

// All VengeanceUI pages and components
const NAVIGATION_ITEMS = {
    general: [
        { name: "Home", path: "/", icon: Home },
        { name: "Components Overview", path: "/docs/components-overview", icon: Box },
        { name: "Introduction", path: "/docs", icon: Book },
    ],
    installation: [
        { name: "Install Next.js", path: "/docs/installation", icon: Settings },
        { name: "Install Tailwind CSS", path: "/docs/install-tailwind", icon: Settings },
        { name: "Add Utilities", path: "/docs/add-utilities", icon: Settings },
        { name: "CLI", path: "/docs/cli", icon: Settings },
    ],
    components: [
        { name: "Animated Button", path: "/docs/animated-button" },
        { name: "Animated Hero", path: "/docs/animated-hero" },
        { name: "Glow Border Card", path: "/docs/glow-border-card" },
        { name: "3D Displacement Text", path: "/docs/liquid-text" },
        { name: "Liquid Ocean", path: "/docs/liquid-ocean" },
        { name: "Liquid Metal", path: "/docs/liquid-metal" },
        { name: "Testimonials Card", path: "/docs/testimonials-card" },
        { name: "Flip Text", path: "/docs/flip-text" },
        { name: "Creepy Button", path: "/docs/creepy-button" },
        { name: "Masked Avatars", path: "/docs/masked-avatars" },
        { name: "Dock", path: "/docs/glass-dock" },
        { name: "Pixelated Image Trail", path: "/docs/pixelated-image-trail" },
        { name: "Perspective Grid", path: "/docs/perspective-grid" },
        { name: "Social Flip Button", path: "/docs/social-flip-button" },
        { name: "Interactive Book", path: "/docs/interactive-book" },
        { name: "Spotlight Navbar", path: "/docs/spotlight-navbar" },
        { name: "Staggered Grid", path: "/docs/staggered-grid" },
        { name: "Expandable Bento Grid", path: "/docs/expandable-bento-grid" },
        { name: "Flip Fade Text", path: "/docs/flip-fade-text" },
        { name: "Folder Preview", path: "/docs/folder-preview" },
        { name: "Light Lines", path: "/docs/light-lines" },
        { name: "Line Hover Link", path: "/docs/line-hover-link" },
        { name: "Logo Slider", path: "/docs/logo-slider" },
        { name: "Stacked Logos", path: "/docs/stacked-logos" },
    ],
}

// Context to share the open state
const CommandMenuContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { },
})

// Provider component - adds keyboard listener globally
export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
            if (e.key === "Escape") {
                setOpen(false)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandMenuContext.Provider value={{ open, setOpen }}>
            {children}
            <CommandMenuDialog />
        </CommandMenuContext.Provider>
    )
}

// The trigger button (for navbar usage)
export function CommandMenu() {
    const { setOpen } = React.useContext(CommandMenuContext)

    return (
        <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-md hover:bg-foreground/5"
            aria-label="Open command menu"
        >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-foreground/10 rounded">
                <span>⌘</span>
                <span>K</span>
            </kbd>
        </button>
    )
}

// The dialog component (rendered by provider)
function CommandMenuDialog() {
    const router = useRouter()
    const { open, setOpen } = React.useContext(CommandMenuContext)
    const { setTheme } = useTheme()

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [setOpen])

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Centered Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <CommandPrimitive
                    className="w-full max-w-[640px] mx-4 rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 pointer-events-auto overflow-hidden"
                    label="Global Command Menu"
                >
                    <div className="flex items-center border-b border-neutral-200 px-4 dark:border-neutral-800">
                        <Search className="mr-3 h-5 w-5 shrink-0 opacity-50" />
                        <CommandPrimitive.Input
                            autoFocus
                            placeholder="Search components, pages, and settings..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-50"
                        />
                        <kbd className="ml-2 px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 rounded">
                            ESC
                        </kbd>
                    </div>

                    <CommandPrimitive.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                        <CommandPrimitive.Empty className="py-6 text-center text-sm text-neutral-500">
                            No results found.
                        </CommandPrimitive.Empty>

                        {/* General Navigation */}
                        <CommandPrimitive.Group heading="Navigation" className="overflow-hidden px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                            {NAVIGATION_ITEMS.general.map((item) => (
                                <CommandPrimitive.Item
                                    key={item.path}
                                    value={item.name}
                                    onSelect={() => runCommand(() => router.push(item.path))}
                                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                >
                                    <item.icon className="mr-3 h-4 w-4 opacity-60" />
                                    <span>{item.name}</span>
                                </CommandPrimitive.Item>
                            ))}
                        </CommandPrimitive.Group>

                        {/* Installation */}
                        <CommandPrimitive.Group heading="Installation" className="overflow-hidden px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                            {NAVIGATION_ITEMS.installation.map((item) => (
                                <CommandPrimitive.Item
                                    key={item.path}
                                    value={item.name}
                                    onSelect={() => runCommand(() => router.push(item.path))}
                                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                >
                                    <item.icon className="mr-3 h-4 w-4 opacity-60" />
                                    <span>{item.name}</span>
                                </CommandPrimitive.Item>
                            ))}
                        </CommandPrimitive.Group>

                        {/* Components */}
                        <CommandPrimitive.Group heading="Components" className="overflow-hidden px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                            {NAVIGATION_ITEMS.components.map((item) => (
                                <CommandPrimitive.Item
                                    key={item.path}
                                    value={item.name}
                                    onSelect={() => runCommand(() => router.push(item.path))}
                                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                >
                                    <ArrowRight className="mr-3 h-4 w-4 opacity-60" />
                                    <span>{item.name}</span>
                                </CommandPrimitive.Item>
                            ))}
                        </CommandPrimitive.Group>

                        {/* Theme */}
                        <CommandPrimitive.Group heading="Theme" className="overflow-hidden px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                            <CommandPrimitive.Item
                                value="Light Mode"
                                onSelect={() => runCommand(() => setTheme("light"))}
                                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                            >
                                <Sun className="mr-3 h-4 w-4 opacity-60" />
                                <span>Light Mode</span>
                            </CommandPrimitive.Item>
                            <CommandPrimitive.Item
                                value="Dark Mode"
                                onSelect={() => runCommand(() => setTheme("dark"))}
                                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                            >
                                <Moon className="mr-3 h-4 w-4 opacity-60" />
                                <span>Dark Mode</span>
                            </CommandPrimitive.Item>
                            <CommandPrimitive.Item
                                value="System Theme"
                                onSelect={() => runCommand(() => setTheme("system"))}
                                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                            >
                                <Laptop className="mr-3 h-4 w-4 opacity-60" />
                                <span>System</span>
                            </CommandPrimitive.Item>
                        </CommandPrimitive.Group>
                    </CommandPrimitive.List>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 text-xs text-neutral-500">
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">↑↓</kbd>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">↵</kbd>
                            <span>Select</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">ESC</kbd>
                            <span>Close</span>
                        </div>
                    </div>
                </CommandPrimitive>
            </div>
        </>
    )
}
