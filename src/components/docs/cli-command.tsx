"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CLICommandProps {
    componentName: string;
    className?: string;
}

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

const packageManagerConfig: Record<PackageManager, { icon: React.ReactNode; command: string; label: string }> = {
    npm: {
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" fill="#CB3837" />
            </svg>
        ),
        command: "npx",
        label: "npm",
    },
    pnpm: {
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z" fill="#F69220" />
            </svg>
        ),
        command: "pnpm dlx",
        label: "pnpm",
    },
    bun: {
        icon: (
            <svg viewBox="0 0 80 70" className="h-4 w-4">
                <path d="M71.09 20.74c-.16-.17-.33-.34-.5-.5s-.33-.34-.5-.5c-.12-.12-.24-.24-.37-.35a17.89 17.89 0 0 0-2.4-1.87c-.55-.35-1.12-.68-1.71-1a38.16 38.16 0 0 0-16.93-4.18h-.25c-5.6 0-11.13 1.45-16.12 4.18-.59.32-1.16.65-1.71 1a18.11 18.11 0 0 0-2.4 1.87c-.13.11-.24.23-.37.35-.17.16-.34.33-.5.5s-.34.33-.5.5a16.21 16.21 0 0 0-4 10.69 15.78 15.78 0 0 0 .18 2.37c.9 7.03 5.75 13.05 12.73 16.9.35.19.7.38 1.06.55a38.16 38.16 0 0 0 16.12 4.19h.25a38.16 38.16 0 0 0 16.93-4.18c.36-.18.71-.36 1.06-.55 7-3.86 11.84-9.87 12.73-16.9a15.78 15.78 0 0 0 .18-2.37 16.21 16.21 0 0 0-4-10.69z" fill="#FBEDDC" />
                <path d="M26.18 31.09a3.09 3.09 0 0 1 3-3.19 3.09 3.09 0 0 1 3 3.19 3.09 3.09 0 0 1-3 3.19 3.09 3.09 0 0 1-3-3.19zm15 0a3.09 3.09 0 0 1 3-3.19 3.09 3.09 0 0 1 3 3.19 3.09 3.09 0 0 1-3 3.19 3.09 3.09 0 0 1-3-3.19z" fill="#3E3E3E" />
                <path d="M38.16 38.42c-3.5 0-6.24 2.1-6.24 4.77s2.74 4.77 6.24 4.77 6.24-2.1 6.24-4.77-2.74-4.77-6.24-4.77z" fill="#F59794" />
            </svg>
        ),
        command: "bunx",
        label: "bun",
    },
    yarn: {
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06z" fill="#2C8EBB" />
            </svg>
        ),
        command: "npx",
        label: "yarn",
    },
};

export function CLICommand({ componentName, className }: CLICommandProps) {
    const [activeTab, setActiveTab] = React.useState<PackageManager>("npm");
    const [copied, setCopied] = React.useState(false);

    const getFullCommand = (pm: PackageManager) => {
        const config = packageManagerConfig[pm];
        return `${config.command} shadcn@latest add "https://www.vengenceui.com/r/${componentName}.json"`;
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(getFullCommand(activeTab));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const config = packageManagerConfig[activeTab];

    // Parse command for syntax highlighting
    const renderHighlightedCommand = () => {
        const command = config.command;
        const parts = command.split(" ");

        return (
            <code className="text-sm font-mono leading-relaxed">
                <span className="text-fuchsia-500 dark:text-fuchsia-400">{parts[0]}</span>
                {parts[1] && (
                    <>
                        {" "}
                        <span className="text-fuchsia-500 dark:text-fuchsia-400">{parts[1]}</span>
                    </>
                )}
                {" "}
                <span className="text-sky-500 dark:text-sky-400">shadcn@latest</span>
                {" "}
                <span className="text-neutral-600 dark:text-green-400">add</span>
                {" "}
                <span className="text-amber-600 dark:text-amber-400">{`"https://www.vengenceui.com/r/${componentName}.json"`}</span>
            </code>
        );
    };

    return (
        <div className={cn(
            "rounded-xl overflow-hidden",
            "!border-[1px] !border-neutral-200 dark:!border-neutral-700",
            "bg-neutral-100 dark:bg-[#161616]",
            className
        )}>
            {/* Tab bar */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">
                <div className="flex items-center gap-6">
                    {(Object.keys(packageManagerConfig) as PackageManager[]).map((pm) => {
                        const isActive = activeTab === pm;
                        return (
                            <button
                                key={pm}
                                onClick={() => setActiveTab(pm)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none transition-colors select-none z-10",
                                    isActive
                                        ? "text-neutral-900 dark:text-white"
                                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute bottom-[-11px] left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {packageManagerConfig[pm].icon}
                                <span>{packageManagerConfig[pm].label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "p-2 rounded-md transition-colors",
                        "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
                        "hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    )}
                    aria-label="Copy command"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Command */}
            <div className="px-4 py-4 overflow-x-auto bg-neutral-100 dark:bg-[#161616]">
                {renderHighlightedCommand()}
            </div>
        </div>
    );
}
