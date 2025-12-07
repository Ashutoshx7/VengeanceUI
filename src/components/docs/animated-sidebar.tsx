"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SidebarItem {
    title: string;
    href?: string;
    items?: SidebarItem[];
    type?: "separator";
    badge?: string;
}

interface AnimatedSidebarProps {
    items: SidebarItem[];
    className?: string;
}

export function AnimatedSidebar({ items, className }: AnimatedSidebarProps) {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

    return (
        <nav className={cn("space-y-1", className)}>
            {items.map((item, index) => {
                if (item.type === "separator") {
                    return (
                        <div
                            key={index}
                            className={cn(
                                "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                index !== 0 && "mt-6"
                            )}
                        >
                            {item.title}
                        </div>
                    );
                }

                if (item.items) {
                    return (
                        <SidebarFolder
                            key={item.title}
                            item={item}
                            pathname={pathname}
                            hoveredItem={hoveredItem}
                            setHoveredItem={setHoveredItem}
                        />
                    );
                }

                return (
                    <SidebarLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                    />
                );
            })}
        </nav>
    );
}

function SidebarLink({
    item,
    pathname,
    hoveredItem,
    setHoveredItem,
}: {
    item: SidebarItem;
    pathname: string;
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}) {
    const isActive = pathname === item.href;
    const isHovered = hoveredItem === item.href;

    return (
        <Link
            href={item.href || "#"}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-2 text-sm transition-colors ml-2 pl-4",
                isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
            )}
            onMouseEnter={() => setHoveredItem(item.href || null)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {/* Vertical line */}
            <span className="absolute left-[9px] inset-y-0 w-px bg-border" />

            {/* Active indicator */}
            <AnimatePresence initial={false} mode="wait">
                {isActive && (
                    <motion.span
                        layoutId="sidebar-active-indicator"
                        className="pointer-events-none absolute z-20 left-[7px] top-1/2 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Hover indicator */}
            <AnimatePresence initial={false} mode="wait">
                {isHovered && !isActive && (
                    <motion.span
                        layoutId="sidebar-hover-indicator"
                        className="pointer-events-none absolute z-10 left-[7px] top-1/2 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-neutral-300 dark:bg-neutral-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Text with slide animation */}
            <motion.span
                className={cn(
                    "pl-3 text-neutral-700 dark:text-neutral-300",
                    (isActive || isHovered) && "text-foreground dark:text-white"
                )}
                animate={{
                    x: isHovered || isActive ? 3 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                }}
            >
                {item.title}
            </motion.span>

            {/* Badge */}
            {item.badge && (
                <span className="ml-auto text-xs text-muted-foreground bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

function SidebarFolder({
    item,
    pathname,
    hoveredItem,
    setHoveredItem,
}: {
    item: SidebarItem;
    pathname: string;
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}) {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasActiveChild = item.items?.some((child) => pathname === child.href);

    React.useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [hasActiveChild]);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50 rounded-md"
                )}
            >
                <ChevronRight
                    className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90"
                    )}
                />
                {item.title}
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { type: "spring", stiffness: 500, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                    >
                        <div className="py-1">
                            {item.items?.map((child) => (
                                <SidebarLink
                                    key={child.href}
                                    item={child}
                                    pathname={pathname}
                                    hoveredItem={hoveredItem}
                                    setHoveredItem={setHoveredItem}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
