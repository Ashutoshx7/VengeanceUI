"use client";

import React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstallationProps {
    children: React.ReactNode;
    className?: string;
}

interface CLIInstallProps {
    componentName: string;
    className?: string;
}

interface ManualStepProps {
    step: number;
    title: string;
    children: React.ReactNode;
    className?: string;
}

// Clean CLI Installation Block
export function CLIInstall({ componentName, className }: CLIInstallProps) {
    const [copied, setCopied] = React.useState(false);
    const command = `npx shadcn@latest add https://www.vengenceui.com/r/${componentName}.json`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative group", className)}>
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-950 dark:bg-neutral-900 rounded-lg border border-neutral-800 font-mono text-sm">
                <Terminal className="h-4 w-4 text-neutral-400 shrink-0" />
                <code className="text-neutral-300 overflow-x-auto whitespace-nowrap flex-1">
                    {command}
                </code>
                <button
                    onClick={copyToClipboard}
                    className="shrink-0 p-1.5 rounded-md hover:bg-neutral-800 transition-colors"
                    aria-label="Copy command"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4 text-neutral-400 hover:text-neutral-200" />
                    )}
                </button>
            </div>
        </div>
    );
}

// Manual Installation Step
export function ManualStep({ step, title, children, className }: ManualStepProps) {
    return (
        <div className={cn("relative pl-8 pb-8 last:pb-0", className)}>
            {/* Step number */}
            <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                {step}
            </div>
            {/* Connecting line */}
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 last:hidden" />
            {/* Content */}
            <div className="pt-0.5">
                <h4 className="text-sm font-medium text-foreground mb-3">{title}</h4>
                <div className="space-y-4">{children}</div>
            </div>
        </div>
    );
}

// Installation Section Wrapper
export function Installation({ children, className }: InstallationProps) {
    return (
        <div className={cn("space-y-8", className)}>
            {children}
        </div>
    );
}

// Section Heading
export function InstallHeading({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={cn("text-lg font-semibold text-foreground mt-8 mb-4 first:mt-0", className)}>
            {children}
        </h3>
    );
}
