"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function SidebarHoverIndicator() {
    const [hoveredElement, setHoveredElement] = React.useState<HTMLElement | null>(null);
    const [activeElement, setActiveElement] = React.useState<HTMLElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = React.useState({ top: 0, height: 0, left: 0 });
    const [hoverIndicatorStyle, setHoverIndicatorStyle] = React.useState({ top: 0, height: 0, left: 0 });
    const [isHovering, setIsHovering] = React.useState(false);
    const [sidebarContainer, setSidebarContainer] = React.useState<Element | null>(null);
    const pathname = usePathname();

    // Find sidebar container on mount
    React.useEffect(() => {
        const findSidebar = () => {
            const sidebar = document.querySelector(".nextra-sidebar-container");
            if (sidebar) {
                setSidebarContainer(sidebar);
            }
        };

        findSidebar();
        // Retry after a short delay in case sidebar isn't mounted yet
        const timeout = setTimeout(findSidebar, 500);
        return () => clearTimeout(timeout);
    }, [pathname]);

    React.useEffect(() => {
        if (!sidebarContainer) return;

        const links = sidebarContainer.querySelectorAll("a, button:not([aria-label])");

        const handleMouseEnter = (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            setHoveredElement(target);
            setIsHovering(true);

            const rect = target.getBoundingClientRect();
            const sidebarRect = sidebarContainer.getBoundingClientRect();

            setHoverIndicatorStyle({
                top: rect.top - sidebarRect.top + rect.height * 0.22,
                height: rect.height * 0.56,
                left: rect.left - sidebarRect.left + 7, // Position on the vertical line
            });
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            setHoveredElement(null);
        };

        links.forEach((link) => {
            link.addEventListener("mouseenter", handleMouseEnter);
            link.addEventListener("mouseleave", handleMouseLeave);
        });

        // Find and track the active link
        const activeLink = sidebarContainer.querySelector('a[aria-current="page"]') as HTMLElement;
        if (activeLink) {
            setActiveElement(activeLink);
            const rect = activeLink.getBoundingClientRect();
            const sidebarRect = sidebarContainer.getBoundingClientRect();
            setIndicatorStyle({
                top: rect.top - sidebarRect.top + rect.height * 0.22,
                height: rect.height * 0.56,
                left: rect.left - sidebarRect.left + 7,
            });
        }

        return () => {
            links.forEach((link) => {
                link.removeEventListener("mouseenter", handleMouseEnter);
                link.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, [pathname, sidebarContainer]);

    // Update active indicator position on scroll or resize
    React.useEffect(() => {
        if (!sidebarContainer) return;

        const updateActivePosition = () => {
            const activeLink = sidebarContainer.querySelector('a[aria-current="page"]') as HTMLElement;

            if (activeLink) {
                const rect = activeLink.getBoundingClientRect();
                const sidebarRect = sidebarContainer.getBoundingClientRect();
                setIndicatorStyle({
                    top: rect.top - sidebarRect.top + rect.height * 0.22,
                    height: rect.height * 0.56,
                    left: rect.left - sidebarRect.left + 7,
                });
            }
        };

        window.addEventListener("scroll", updateActivePosition, true);
        window.addEventListener("resize", updateActivePosition);

        // Initial position update
        const timeout = setTimeout(updateActivePosition, 100);

        return () => {
            window.removeEventListener("scroll", updateActivePosition, true);
            window.removeEventListener("resize", updateActivePosition);
            clearTimeout(timeout);
        };
    }, [pathname, sidebarContainer]);

    if (!sidebarContainer) return null;

    return createPortal(
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {/* Active Indicator - Always visible */}
            <motion.div
                className="absolute w-[3px] rounded-full bg-foreground dark:bg-white"
                initial={false}
                animate={{
                    top: indicatorStyle.top,
                    height: indicatorStyle.height,
                    left: indicatorStyle.left,
                    opacity: indicatorStyle.height > 0 ? 1 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                }}
            />

            {/* Hover Indicator - Only visible when hovering a different item */}
            <AnimatePresence>
                {isHovering && hoveredElement !== activeElement && (
                    <motion.div
                        className="absolute w-[3px] rounded-full bg-neutral-400 dark:bg-neutral-600"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            top: hoverIndicatorStyle.top,
                            height: hoverIndicatorStyle.height,
                            left: hoverIndicatorStyle.left,
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                        }}
                    />
                )}
            </AnimatePresence>
        </div>,
        sidebarContainer
    );
}

