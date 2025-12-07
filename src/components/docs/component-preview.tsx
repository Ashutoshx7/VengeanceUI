import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Eye, Copy, Check, Terminal } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { ComponentInstallation } from "./component-installation";

interface ComponentPreviewProps {
    component: React.ReactNode;
    code: string;
    title?: string;
    className?: string;
    description?: string;
    installation?: {
        cli: string;
        manual: React.ReactNode;
    };
}

export function ComponentPreview({
    component,
    code,
    title,
    className,
    description,
    installation,
}: ComponentPreviewProps) {
    const [activeTab, setActiveTab] = useState("preview");
    const [hasCopied, setHasCopied] = useState(false);
    const { resolvedTheme } = useTheme();

    const onCopy = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className={cn("group relative my-8 flex flex-col space-y-4", className)}>
            <div className="flex flex-col space-y-1.5">
                {description && <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{description}</p>}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="relative w-full !border-[1px] !border-neutral-200 dark:!border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#161616] border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">
                    <TabsList className="justify-start gap-6 bg-transparent p-0">
                        {['preview', 'code'].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className={cn(
                                        "relative h-9 px-8 min-w-28 justify-center rounded-full border border-transparent font-medium text-sm transition-colors outline-none cursor-pointer select-none",
                                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                                        "bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent dark:hover:bg-transparent"
                                    )}
                                >
                                    {isActive && (
                                        <div
                                            className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded-full transition-all"
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tab === 'preview' ? (
                                            <Eye className="w-4 h-4" />
                                        ) : (
                                            <Code className="w-4 h-4" />
                                        )}
                                        <span className="capitalize">{tab}</span>
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    <button
                        onClick={onCopy}
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-foreground transition-all active:scale-95"
                        aria-label="Copy code"
                    >
                        {hasCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <motion.div
                    className="relative bg-neutral-100 dark:bg-[#161616] overflow-hidden"
                >
                    <TabsContent value="preview" className="m-0 min-h-[350px] flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#404040_1px,transparent_1px)] bg-white dark:bg-neutral-950">
                        {/* Optional: Add a subtle overlay so the grid isn't too harsh */}
                        <div className="absolute inset-0 bg-white/30 dark:bg-neutral-950/30 pointer-events-none" />

                        <div className="preview relative z-10 flex min-h-[350px] w-full items-center justify-center p-10">
                            {component}
                        </div>
                    </TabsContent>

                    <TabsContent value="code" className="m-0">
                        <div className="relative group/code">
                            <div className="relative text-sm font-mono overflow-x-auto max-h-[400px]">
                                <Highlight
                                    theme={resolvedTheme === 'dark' ? themes.vsDark : themes.vsLight}
                                    code={code}
                                    language="tsx"
                                >
                                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                        <pre className={cn(className, "p-6 text-[13px] leading-relaxed")} style={{ ...style, backgroundColor: 'transparent' }}>
                                            {tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    <span className="select-none opacity-30 mr-4 w-4 inline-block text-right text-xs">{i + 1}</span>
                                                    {line.map((token, key) => (
                                                        <span key={key} {...getTokenProps({ token })} />
                                                    ))}
                                                </div>
                                            ))}
                                        </pre>
                                    )}
                                </Highlight>
                            </div>
                        </div>
                    </TabsContent>
                </motion.div>
            </Tabs>

            {installation && (
                <ComponentInstallation cli={installation.cli} manual={installation.manual} />
            )}
        </div>
    );
}
