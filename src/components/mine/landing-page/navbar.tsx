"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Home, User, Calendar, CreditCard, Menu, X, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useSound } from "@/hooks/use-sound"
import { CommandMenu } from "@/components/command-menu"



// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const playClick = useSound("/audio/ui-sounds/click.wav");

  const isDark = (theme === 'dark' || resolvedTheme === 'dark')

  const switchTheme = useCallback(() => {
    playClick();
    setTheme(isDark ? 'light' : 'dark');
  }, [setTheme, isDark, playClick])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={switchTheme}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <Link
    href={href}
    className="group flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
  >
    <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
    <span>{label}</span>
  </Link>
)

// Simple Theme Toggle for Mobile
const MobileThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  const isDark = (theme === 'dark' || resolvedTheme === 'dark')

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}


const Navbar = ({ className, ...props }: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLElement | null>(null);


  // Navigation items configuration
  const items = {
    left: [
      { label: "Components", href: "/docs/components-overview", icon: Home },
      { label: "Templates", href: "/templates", icon: User }
    ],
    right: [] as { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
  }

  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-1001 h-16 flex px-0", className)} {...props} >

        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white dark:bg-black z-20 relative min-w-0">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">

          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white dark:bg-black" style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0 bg-white dark:bg-black">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              </svg>
            </div>
            {/* Content Layer */}
            <div className="relative w-full h-full flex items-end justify-between pb-2 px-4 md:px-8">

              {/* Desktop Left Nav */}
              <nav className="hidden md:flex gap-8 mb-1 shrink-0 items-center">
                {items.left.map(item => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Desktop Logo - centered */}
              <div className="hidden md:flex shrink-0 items-center justify-center translate-x-2">
                {props.logo || (
                  <Link href="/" className="transition-opacity hover:opacity-80">
                    <img
                      src="/logo/bg-less.png"
                      alt="Logo"
                      className="h-8 w-auto dark:invert rotate-180"
                    />
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button (Left) */}
              <button
                className="md:hidden mb-1 p-1 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo (Center) - Mobile */}
              <div className="md:hidden flex-1 flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                {props.logo || (
                  <Link href="/" className="transition-opacity hover:opacity-80">
                    <img
                      src="/logo/bg-less.png"
                      alt="Logo"
                      className="h-8 w-auto dark:invert"
                    />
                  </Link>
                )}
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden md:flex gap-8 items-center shrink-0 -mb-1">
                {items.right.map(item => (
                  <NavLink key={item.label} {...item} />
                ))}
                <CommandMenu />

                <div className="flex gap-4 pl-4 border-l border-foreground/10 shrink-0 items-center">
                  <ThemeToggle />
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="md:hidden flex items-center gap-2 mb-1">
                <MobileThemeToggle />
              </div>

            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white dark:bg-black" style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white dark:bg-black z-20 relative min-w-0 -ml-px">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-neutral-50 dark:bg-neutral-900 border-b border-foreground/5 p-4 md:hidden shadow-lg"
          >
            <nav className="flex flex-col gap-2">
              {/* Combine all items */}
              {[...items.left, ...items.right].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span className="font-medium text-foreground/90">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

export default Navbar
