"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InstallationTOCProps {
    className?: string
}

const tocItems = [
    { id: "install-nextjs", label: "Install Next.js" },
    { id: "install-tailwind", label: "Install Tailwind CSS" },
    { id: "add-utilities", label: "Add utilities" },
    { id: "cli", label: "CLI", badge: "3.0" },
]

export function InstallationTOC({ className }: InstallationTOCProps) {
    const [activeSection, setActiveSection] = React.useState("")

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { rootMargin: "-100px 0px -66%" }
        )

        tocItems.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setActiveSection(sectionId)
        }
    }

    return (
        <nav className={cn("space-y-1", className)}>
            <h4 className="font-medium text-sm text-foreground mb-3">Installation</h4>
            {tocItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                        "flex items-center justify-between w-full text-left text-sm py-1 transition-colors",
                        activeSection === item.id
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <span>{item.label}</span>
                    {item.badge && (
                        <span className="text-xs text-muted-foreground bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    )
}

