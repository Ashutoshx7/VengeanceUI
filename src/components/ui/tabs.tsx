"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (v: string) => void;
  indicatorId: string;
}>({ activeTab: "", setActiveTab: () => {}, indicatorId: "" });

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

// Stiff, well-damped spring: the active pill lands in ~180ms with no wobble.
const INDICATOR_TRANSITION = { type: "spring", stiffness: 640, damping: 42, mass: 0.6 } as const;

export function Tabs({ children, defaultValue = "", value, onValueChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultValue);
  const activeTab = value ?? internalActiveTab;
  const indicatorId = React.useId();

  const setActiveTab = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalActiveTab(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  const context = React.useMemo(
    () => ({ activeTab, setActiveTab, indicatorId }),
    [activeTab, setActiveTab, indicatorId]
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex w-fit self-start shrink-0 h-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-zinc-800/80 p-1 text-neutral-500 dark:text-zinc-400 mb-4", className)}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  onPointerEnter,
  onFocus,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  /** Fires on hover intent; useful for warming up the tab's content. */
  onPointerEnter?: React.PointerEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
}) {
  const { activeTab, setActiveTab, indicatorId } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      // Switch on pointerdown instead of click: saves the ~60-100ms between
      // press and release, which is most of what makes tabs feel "laggy".
      onPointerDown={(event) => {
        if (event.button === 0 && event.pointerType === "mouse") setActiveTab(value);
      }}
      onClick={() => setActiveTab(value)}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "text-neutral-900 dark:text-white"
          : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200",
        className
      )}
    >
      {isActive && (
        <motion.span
          layoutId={indicatorId}
          aria-hidden
          transition={reduceMotion ? { duration: 0 } : INDICATOR_TRANSITION}
          className="absolute inset-0 rounded-[inherit] bg-white shadow-sm dark:bg-zinc-700/80"
        />
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-[inherit]">{children}</span>
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
  lazy = false,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  lazy?: boolean;
}) {
  const { activeTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  if (lazy && !isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      className={cn(
        "mt-4 outline-none",
        isActive ? "block" : "hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
