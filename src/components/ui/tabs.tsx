"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (v: string) => void;
}>({ activeTab: "", setActiveTab: () => {} });

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ children, defaultValue = "", value, onValueChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultValue);
  const activeTab = value ?? internalActiveTab;

  const setActiveTab = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalActiveTab(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-zinc-800/80 p-1 text-neutral-500 dark:text-zinc-400 mb-4", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white dark:bg-zinc-700/80 text-neutral-900 dark:text-white shadow-sm" 
          : "text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200",
        className
      )}
    >
      {children}
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
