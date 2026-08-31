"use client";

import React, { useState, useCallback, memo, startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { COMPONENT_CATEGORIES } from "@/lib/components-catalog";
import { ChevronUp, Download, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarLinkItem = {
  name: string;
  href: string;
  isNew?: boolean;
  external?: boolean;
};

const SIDEBAR_SECTIONS: Array<{
  name: string;
  icon: LucideIcon;
  items: SidebarLinkItem[];
}> = [
  {
    name: "Follow for updates",
    icon: X,
    items: [
      {
        name: "X @Ashutosh_7x7",
        href: "https://x.com/Ashutosh_7x7",
        external: true,
      },
    ],
  },
  {
    name: "Installation",
    icon: Download,
    items: [
      { name: "Install Next.js", href: "/docs/install-nextjs" },
      { name: "Install Tailwind CSS", href: "/docs/install-tailwind" },
      { name: "Add utilities", href: "/docs/add-utilities" },
      { name: "CLI", href: "/docs/cli" },
    ],
  },
];

const SidebarItem = memo(function SidebarItem({ 
  item, 
  isActive,
  isHovered,
  onHover,
}: { 
  item: SidebarLinkItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: (href: string) => void;
}) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (item.external) {
      return;
    }

    e.preventDefault();
    startTransition(() => {
      router.push(item.href);
    });
  }, [item.external, router, item.href]);

  return (
    <div
      onMouseEnter={() => onHover(item.href)}
      className="relative"
    >
      {isActive && (
        <div className="absolute inset-0 rounded-md bg-neutral-100 dark:bg-zinc-800/80 z-0" />
      )}
      {isHovered && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 rounded-md bg-neutral-100 dark:bg-zinc-800/40 z-0"
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 35,
          }}
        />
      )}
      <Link
        href={item.href}
        onClick={item.external ? undefined : handleClick}
        prefetch={false}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(
          "relative z-10 flex w-full justify-between items-center rounded-md px-3 py-1.5 text-sm transition-colors",
          isActive
            ? "font-medium text-neutral-900 dark:text-white"
            : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200"
        )}
      >
        <span className="truncate">{item.name}</span>
        {item.isNew && (
          <span className="ml-2 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-emerald-500 dark:text-emerald-400">
            New
          </span>
        )}
      </Link>
    </div>
  );
});

const SidebarSection = memo(function SidebarSection({
  section,
  hoveredPath,
  pathname,
  onHover,
}: {
  section: (typeof SIDEBAR_SECTIONS)[number];
  hoveredPath: string | null;
  pathname: string;
  onHover: (href: string) => void;
}) {
  const SectionIcon = section.icon;
  const isSectionActive = section.items.some((item) => {
    if (item.external) return false;
    return pathname === item.href.split("#")[0];
  });

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors w-full text-left",
          isSectionActive
            ? "bg-neutral-100 dark:bg-zinc-800/80 text-neutral-900 dark:text-zinc-100"
            : "text-neutral-600 dark:text-zinc-300"
        )}
      >
        <SectionIcon className="h-4 w-4" />
        <span className="min-w-0 flex-1 truncate">{section.name}</span>
        <ChevronUp className="h-3.5 w-3.5 text-neutral-400 dark:text-zinc-500" />
      </div>

      <div className="mt-1 ml-4 flex flex-col border-l border-neutral-200 dark:border-[#222]/80 pl-2 space-y-0.5">
        {section.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isActive={!item.external && !item.href.includes("#") && pathname === item.href}
            isHovered={hoveredPath === item.href}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
});

const SidebarCategory = memo(function SidebarCategory({
  category,
  isCategoryActive,
  hoveredPath,
  pathname,
  onHover,
}: {
  category: (typeof COMPONENT_CATEGORIES)[number];
  isCategoryActive: boolean;
  hoveredPath: string | null;
  pathname: string;
  onHover: (href: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <button
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors w-full text-left",
          isCategoryActive 
            ? "bg-neutral-100 dark:bg-zinc-800/80 text-neutral-900 dark:text-zinc-100" 
            : "text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800/40 hover:text-neutral-900 dark:hover:text-zinc-100"
        )}
      >
        <category.icon className="h-4 w-4" />
        {category.name}
      </button>
      
      <div className="mt-1 ml-4 flex flex-col border-l border-neutral-200 dark:border-[#222]/80 pl-2 space-y-0.5">
        {category.items.map((item) => (
          <SidebarItem 
            key={item.slug}
            item={{
              name: item.name,
              href: `/components/${item.slug}`,
              isNew: item.isNew,
            }}
            isActive={pathname === `/components/${item.slug}`}
            isHovered={hoveredPath === `/components/${item.slug}`}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
});

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleHover = useCallback((href: string) => {
    setHoveredPath(href);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPath(null);
  }, []);

  return (
    <div 
      className="w-full space-y-6 pb-8"
      onMouseLeave={handleMouseLeave}
    >
      {SIDEBAR_SECTIONS.map((section) => (
        <SidebarSection
          key={section.name}
          section={section}
          hoveredPath={hoveredPath}
          pathname={pathname}
          onHover={handleHover}
        />
      ))}

      {COMPONENT_CATEGORIES.map((category) => {
        const isCategoryActive = category.items.some(
          (item) => pathname === `/components/${item.slug}`
        );

        return (
          <SidebarCategory
            key={category.name}
            category={category}
            isCategoryActive={isCategoryActive}
            hoveredPath={hoveredPath}
            pathname={pathname}
            onHover={handleHover}
          />
        );
      })}
    </div>
  );
}
