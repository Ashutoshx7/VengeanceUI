"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface InstallationTOCProps {
    className?: string
}

export function InstallationTOC({ className }: InstallationTOCProps) {
    const [activeSection, setActiveSection] = React.useState("component")

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setActiveSection(sectionId)
        }
    }

    return (
        <nav className={cn("space-y-3", className)}>
            <button
                onClick={() => scrollToSection("component")}
                className={cn(
                    "block w-full text-left text-sm transition-colors",
                    activeSection === "component"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Component
            </button>
            <button
                onClick={() => scrollToSection("install-cli")}
                className={cn(
                    "block w-full text-left text-sm transition-colors",
                    activeSection === "cli"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Install using CLI
            </button>
            <button
                onClick={() => scrollToSection("install-manual")}
                className={cn(
                    "block w-full text-left text-sm transition-colors",
                    activeSection === "manual"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Install Manually
            </button>
        </nav>
    )
}

