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
        <div className={cn("", className)}>
            <div className="space-y-4">
                <h3 className="font-semibold text-foreground">On This Page</h3>
                <nav className="space-y-3">
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
            </div>
        </div>
    )
}

