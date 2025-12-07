"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Copy, Terminal, Atom } from "lucide-react"
import { useTheme } from "next-themes"
import { Highlight, themes, PrismTheme } from "prism-react-renderer"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Custom VS Code Dark+ inspired theme with subtle refinements (Darker Version)
const vibrantDarkTheme: PrismTheme = {
    plain: {
        color: "#ffffff", // Brighter white for better contrast
        backgroundColor: "transparent",
    },
    styles: [
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: {
                color: "#71717a", // Zinc 500
            },
        },
        {
            types: ["punctuation"],
            style: {
                color: "#a1a1aa", // Zinc 400
            },
        },
        {
            types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"],
            style: {
                color: "#2dd4bf", // Teal 400
            },
        },
        {
            types: ["tag"],
            style: {
                color: "#3b82f6", // Blue 500
            },
        },
        {
            types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
            style: {
                color: "#fdba74", // Orange 300
            },
        },
        {
            types: ["attr-name"],
            style: {
                color: "#7dd3fc", // Sky 300
            },
        },
        {
            types: ["operator"],
            style: {
                color: "#a1a1aa",
            },
        },
        {
            types: ["url", "variable"],
            style: {
                color: "#7dd3fc",
            },
        },
        {
            types: ["atrule", "attr-value", "keyword"],
            style: {
                color: "#d8b4fe", // Purple 300
            },
        },
        {
            types: ["keyword"],
            style: {
                color: "#60a5fa", // Blue 400
            },
        },
        {
            types: ["function", "class-name"],
            style: {
                color: "#fde047", // Yellow 300
            },
        },
        {
            types: ["class-name"],
            style: {
                color: "#5eead4", // Teal 300
            },
        },
        {
            types: ["regex", "important"],
            style: {
                color: "#f87171", // Red 400
            },
        },
    ],
}

function useCopy() {
    const [hasCopied, setHasCopied] = React.useState(false)

    const copy = (text: string) => {
        navigator.clipboard.writeText(text)
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 2000)
    }

    return { hasCopied, copy }
}

interface CodeBlockProps {
    code: string
    language?: string
    className?: string
    expandable?: boolean
    title?: string // Added title prop
    hideCopy?: boolean
}

export function CodeBlock({ code, language = "bash", className, expandable = false, title, hideCopy }: CodeBlockProps) {
    const { resolvedTheme } = useTheme()
    const { hasCopied, copy } = useCopy()
    const [isExpanded, setIsExpanded] = React.useState(false)

    return (
        <div className={cn(
            "relative group/code rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#161616] shadow-sm mb-4", // Added mb-4
            className
        )}>
            {hideCopy ? null : title ? (
                <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black rounded-t-lg">
                    <div className="flex items-center gap-2">
                        {/* Green Triangle Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 fill-emerald-500 rotate-180"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                        <span className="text-sm text-foreground font-medium">{title}</span>
                    </div>
                    {/* Move copy button here if title exists */}
                    <button
                        onClick={() => copy(code)}
                        className="flex items-center justify-center w-7 h-7 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-foreground transition-all"
                        aria-label="Copy code"
                    >
                        {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            ) : hideCopy ? null : (
                <div className="absolute right-3 top-3 z-20 opacity-0 group-hover/code:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => copy(code)}
                        className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 dark:bg-neutral-800/50 backdrop-blur-md border border-black/5 dark:border-white/10 text-neutral-500 hover:text-foreground transition-all active:scale-95"
                        aria-label="Copy code"
                    >
                        {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            )}
            <div className={cn(
                "relative text-[14px] font-mono leading-relaxed overflow-x-auto p-4 scrollbar-hide",
                expandable && !isExpanded && "max-h-32 overflow-hidden",
                // Adjust padding if title exists? actually p-4 is fine.
            )}>
                <Highlight
                    theme={resolvedTheme === 'dark' ? vibrantDarkTheme : themes.vsLight}
                    code={code}
                    language={language}
                >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre style={{ ...style, backgroundColor: 'transparent', margin: 0, padding: 0 }}>
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })} className="table-row">
                                    <span className="table-cell select-none text-right w-8 pr-4 text-neutral-400/30 text-xs">
                                        {i + 1}
                                    </span>
                                    <span className="table-cell">
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token })} />
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </div>
            {expandable && !isExpanded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-t from-neutral-100 via-neutral-100/40 to-transparent dark:from-[#161616] dark:via-[#161616]/40 dark:to-transparent pt-20">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="px-4 py-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm text-[12px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-neutral-700/50 shadow-sm hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 transition-all hover:scale-105 active:scale-95"
                    >
                        Expand code
                    </button>
                </div>
            )}
            {expandable && isExpanded && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10 pointer-events-none">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="pointer-events-auto px-4 py-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm text-[12px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-neutral-700/50 shadow-sm hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 transition-all hover:scale-105 active:scale-95"
                    >
                        Collapse
                    </button>
                </div>
            )}
        </div>
    )
}

interface DependenciesProps {
    step?: number
    title?: string
    children?: React.ReactNode
    copyText?: string
}

export const Dependencies = ({ step, title, children, copyText }: DependenciesProps) => {
    // Skip rendering step 4 entirely per request
    if (step === 4) return null

    const { hasCopied, copy } = useCopy()
    const textToCopy = copyText ?? (typeof children === "string" ? children : "")

    const processedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === CodeBlock) {
            return React.cloneElement(child as React.ReactElement<any>, { hideCopy: true })
        }
        return child
    })

    const stepEmoji = step === 1 ? "🧰" : step === 2 ? "📦" : step === 3 ? "" : "⭐"
    const stepIcon = step === 3 ? <Atom className="w-4 h-4 text-sky-400" /> : null
    const titledWithEmoji = title ? `${stepEmoji}${stepEmoji ? " " : ""}${title}` : undefined

    return (
        <div className="relative w-full !border-[1px] !border-neutral-200 dark:!border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#161616] border-b border-neutral-200 dark:border-neutral-800 mb-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 font-mono text-xs font-medium text-foreground">
                        {step}
                    </div>
                    {titledWithEmoji && (
                        <h2 className="font-medium text-sm text-foreground leading-none flex items-center gap-2">
                            {stepIcon}
                            <span>{titledWithEmoji}</span>
                        </h2>
                    )}
                </div>
                <button
                    onClick={() => copy(textToCopy)}
                    className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-foreground transition-all active:scale-95"
                    aria-label="Copy code"
                >
                    {hasCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="p-4 bg-neutral-100 dark:bg-[#161616] [&_.group\/code]:border-0 [&_.group\/code]:shadow-none [&_.group\/code]:bg-transparent [&_.group\/code]:mb-0">
                <div className="text-sm text-muted-foreground">{processedChildren}</div>
            </div>
        </div>
    )
}

interface ComponentInstallationProps {
    cli: string
    manual: React.ReactNode
    className?: string
}



export function ComponentInstallation({ cli, manual, className }: ComponentInstallationProps) {
    const [installType, setInstallType] = React.useState("npm")
    const { hasCopied, copy } = useCopy()

    const getCommand = () => {
        switch (installType) {
            case "pnpm": return cli.replace(/^npx/, 'pnpm dlx')
            case "bun": return cli.replace(/^npx/, 'bun x')
            case "yarn": return cli.replace(/^npx/, 'yarn dlx')
            default: return cli
        }
    }

    const copyCommand = () => {
        copy(getCommand())
    }

    return (
        <div className={cn("group relative my-8", className)}>
            <div className="mb-10" id="install-cli">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">Install using CLI</h2>
                <Tabs value={installType} onValueChange={setInstallType} className="relative w-full !border-[1px] !border-neutral-200 dark:!border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#161616] border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">
                        <TabsList className="justify-start gap-6 bg-transparent p-0">
                            {["npm", "pnpm", "bun", "yarn"].map((tab) => {
                                const isActive = installType === tab
                                return (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className={cn(
                                            "relative h-9 px-6 min-w-20 justify-center rounded-full border border-transparent font-medium text-sm transition-all outline-none cursor-pointer select-none",
                                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                                            "bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-transparent dark:hover:bg-transparent"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-tab-pill"
                                                className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {tab === "npm" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14" height="14" fill="none"><rect width="32" height="32" rx="2" fill="#CB3837" /><path d="M16 8v16h8V16h4V8H6v16h4V8h6z" fill="#fff" /></svg>}
                                            {tab === "pnpm" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14" height="14" fill="none"><rect width="32" height="32" rx="2" fill="#F69220" /><path d="M7 7h18v18h-8V15h-2v10H7V7zm2 2v14h4V9H9zm10 0h4v4h-4V9z" fill="#fff" /></svg>}
                                            {tab === "bun" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.79 16.58c.22-.05.44-.08.66-.08 1.96 0 3.63 1.3 4.1 3.09.28-.7 1.05-1.18 1.93-1.18 1.16 0 2.1.94 2.1 2.1 0 .14-.02.28-.06.41a3.07 3.07 0 0 1 1.76.54 9.17 9.17 0 0 0-1.22-3.15c-1.3-2.3-3.6-3.8-6.1-4.2-1.9-.3-3.9.1-5.6 1.1-.3-.3-.7-.5-1.1-.5-1 0-1.8.8-1.8 1.8 0 .2.03.4.1.6-.9.6-1.5 1.6-1.5 2.8 0 1.2.6 2.2 1.5 2.8-.07-.2-.1-.4-.1-.6 0-1 .8-1.8 1.8-1.8.4 0 .8.2 1.1.5 2.1-1.3 4.6-1.6 7.02-.93zM18.8 3.85c-1.4 1.1-2.4 2.7-2.7 4.5l-2.1.8c.8-2.6 2.6-4.7 4.9-5.9.2.2.3.4.5.6H17.8l1 .01zm-9.6 0c2.3 1.2 4.1 3.3 4.9 5.9l-2.1-.8c-.3-1.8-1.3-3.4-2.7-4.5l-.6.6h-.01c.2-.2.3-.4.51-.61zm-4.3 10.9c.7 1.6 2.1 2.8 3.8 3.3l1-2c-1.2-.4-2.2-1.2-2.7-2.3l-2.1 1zm14.2 0l-2.1-1c-.5 1.1-1.5 1.9-2.7 2.3l1 2c1.7-.5 3.1-1.7 3.8-3.3zM6.2 9.5c.3 1.8 1.3 3.4 2.7 4.5l.6-.6h.01c-.2.2-.3.4-.5.6-2.3-1.2-4.1-3.3-4.9-5.9l2.1.8zm11.6 0l2.1-.8c-.8 2.6-2.6 4.7-4.9 5.9-.2-.2-.3-.4-.5-.6h1.6l-1-.01c1.4-1.1 2.4-2.7 2.7-4.48z" /></svg>}
                                            {tab === "yarn" && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="14" height="14" fill="none"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 25.5c-6.4 0-11.5-5.1-11.5-11.5S9.6 4.5 16 4.5 27.5 9.6 27.5 16 22.4 27.5 16 27.5z" fill="#2C8EBB" /><path d="M16 9c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 11.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="#2C8EBB" /></svg>}
                                            {tab}
                                        </span>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                        <button
                            onClick={copyCommand}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-foreground transition-all active:scale-95"
                            aria-label="Copy code"
                        >
                            {hasCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="bg-neutral-100 dark:bg-[#161616] p-0 [&_.group\/code]:border-0 [&_.group\/code]:shadow-none [&_.group\/code]:bg-transparent [&_.group\/code]:mb-0">
                        <TabsContent value="npm" className="!mt-0">
                            <CodeBlock code={cli} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="pnpm" className="!mt-0">
                            <CodeBlock code={cli.replace(/^npx/, 'pnpm dlx')} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="bun" className="!mt-0">
                            <CodeBlock code={cli.replace(/^npx/, 'bun x')} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="yarn" className="!mt-0">
                            <CodeBlock code={cli.replace(/^npx/, 'yarn dlx')} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            {manual && (
                <div className="space-y-3" id="install-manual">
                    <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Install Manually</h2>
                    {manual}
                </div>
            )}
        </div>
    )
}
