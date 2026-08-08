"use client";


import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Copy, Terminal, Atom } from "lucide-react"
import { useTheme } from "next-themes"
import { Highlight, PrismTheme } from "prism-react-renderer"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Custom themes to match CLICommand colors exactly
const vibrantLightTheme: PrismTheme = {
    plain: {
        color: "#52525b", // zinc-600
        backgroundColor: "transparent",
    },
    styles: [
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: { color: "#a1a1aa", fontStyle: "italic" }, // zinc-400
        },
        {
            types: ["punctuation", "operator"],
            style: { color: "#71717a" }, // zinc-500
        },
        {
            types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"],
            style: { color: "#4a7f94" }, // muted teal
        },
        {
            types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
            style: { color: "#8a6d3b" }, // muted brown
        },
        {
            types: ["url", "variable", "function", "class-name"],
            style: { color: "#3d7a5f" }, // muted forest
        },
        {
            types: ["atrule", "attr-value", "keyword"],
            style: { color: "#6b6b99" }, // muted indigo
        },
        {
            types: ["regex", "important"],
            style: { color: "#996b6b" }, // muted rose
        },
    ],
}

const vibrantDarkTheme: PrismTheme = {
    plain: {
        color: "#a1a1aa", // zinc-400
        backgroundColor: "transparent",
    },
    styles: [
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: { color: "#3f3f46", fontStyle: "italic" },
        },
        {
            types: ["punctuation", "operator"],
            style: { color: "#52525b" },
        },
        {
            types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"],
            style: { color: "#8bb8d0" }, // muted steel blue
        },
        {
            types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
            style: { color: "#c9a87c" }, // warm muted sand
        },
        {
            types: ["url", "variable", "function", "class-name"],
            style: { color: "#8ec8b0" }, // muted sage green
        },
        {
            types: ["atrule", "attr-value", "keyword"],
            style: { color: "#a0a0cc" }, // muted lavender
        },
        {
            types: ["regex", "important"],
            style: { color: "#c4908a" }, // muted rose
        },
    ],
}

function useCopy() {
    const [hasCopied, setHasCopied] = React.useState(false)
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const copy = React.useCallback((text: string) => {
        navigator.clipboard.writeText(text)
        setHasCopied(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setHasCopied(false), 2000)
    }, [])

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return { hasCopied, copy }
}

interface CodeBlockProps {
    code: string
    language?: string
    className?: string
    expandable?: boolean
    title?: string
    hideCopy?: boolean
    nested?: boolean // New prop
}

const HighlightedCode = React.memo(function HighlightedCode({
    code,
    language,
    theme,
    showLineNumbers,
}: {
    code: string
    language: string
    theme: PrismTheme
    showLineNumbers: boolean
}) {
    return (
        <Highlight
            theme={theme}
            code={code}
            language={language}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre style={{ ...style, backgroundColor: 'transparent', margin: 0, padding: 0 }}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })} className="table-row">
                            {showLineNumbers && (
                                <span className="table-cell select-none text-right w-8 pr-4 text-neutral-400/30 text-xs">
                                    {i + 1}
                                </span>
                            )}
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
    )
})

export function CodeBlock({ code, language = "bash", className, expandable = false, title, hideCopy, nested }: CodeBlockProps) {
    const { resolvedTheme } = useTheme()
    const { hasCopied, copy } = useCopy()
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    // Use light theme by default on server/initial render to prevent hydration mismatch
    const currentTheme = isMounted ? (resolvedTheme === 'dark' ? vibrantDarkTheme : vibrantLightTheme) : vibrantLightTheme

    return (
        <div className={cn(
            "relative group/code overflow-hidden",
            // Match the new Shiki CodeBlock aesthetic for dark mode
            nested
                ? "border-0 bg-transparent p-0 m-0 shadow-none !rounded-none"
                : "rounded-md border border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-black mb-4 shadow-sm",
            className
        )}>
            {hideCopy || nested ? null : (
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur rounded-t-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono font-medium text-neutral-500 dark:text-zinc-300">{title || "code"}</span>
                    </div>
                    <button
                        onClick={() => copy(code)}
                        className="flex items-center justify-center w-7 h-7 rounded-sm border-none bg-transparent hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 dark:text-zinc-500 hover:text-neutral-700 dark:hover:text-zinc-300 transition-all"
                        aria-label="Copy code"
                    >
                        {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            )}
            <div className={cn(
                "relative text-sm font-mono leading-relaxed overflow-x-auto scrollbar-hide selection:bg-zinc-800 selection:text-white",
                !nested && "p-4",
                expandable && !isExpanded && "max-h-32 overflow-hidden",
            )}>
                <HighlightedCode
                    code={code}
                    language={language}
                    theme={currentTheme}
                    showLineNumbers={!nested}
                />
            </div>
            {expandable && !isExpanded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-t from-neutral-50 dark:from-zinc-950 via-neutral-50/40 dark:via-zinc-950/40 to-transparent pt-20">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="px-4 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm text-[12px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-zinc-700 shadow-sm hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 transition-all hover:scale-105 active:scale-95"
                    >
                        Expand code
                    </button>
                </div>
            )}
            {expandable && isExpanded && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10 pointer-events-none">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="pointer-events-auto px-4 py-1.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm text-[12px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-zinc-700 shadow-sm hover:bg-neutral-100/80 dark:hover:bg-zinc-800/80 transition-all hover:scale-105 active:scale-95"
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
    id?: string
}

export const Dependencies = ({ step, title, children, copyText, id }: DependenciesProps) => {
    const { hasCopied, copy } = useCopy()

    // trying to extract code from children as string
    const extractCodeFromChildren = React.useMemo(() => {
        if (copyText) return copyText
        if (typeof children === "string") return children

        // use the object method for finding the props
        let codeText = ""
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === CodeBlock) {
                const codeBlockProps = child.props as CodeBlockProps
                if (codeBlockProps.code) {
                    codeText = codeBlockProps.code
                }
            }
        })
        return codeText
    }, [children, copyText])

    const textToCopy = extractCodeFromChildren

    const processedChildren = React.useMemo(() => {
        return React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CodeBlock) {
                const childProps = (child as any).props as CodeBlockProps
                return <CodeBlock {...childProps} hideCopy={true} nested={true} />
            }
            return child
        })
    }, [children])

    // Subtle Lucide icons instead of emojis
    const StepIcon = React.useMemo(() => {
        if (step === 1) return <Terminal className="w-3.5 h-3.5 text-fuchsia-500" /> // Install
        if (step === 2) return <Atom className="w-3.5 h-3.5 text-sky-500" /> // Utils
        if (step === 3) return <Copy className="w-3.5 h-3.5 text-amber-500" /> // Copy Code
        return <Terminal className="w-3.5 h-3.5 text-neutral-500" />
    }, [step])

    return (
        <div id={id} className="relative w-full border border-neutral-200 dark:border-[#222] rounded-sm overflow-hidden bg-neutral-50 dark:bg-zinc-950 mb-6 scroll-mt-24">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200 dark:border-[#222] bg-white dark:bg-zinc-900/80">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-neutral-100 dark:bg-zinc-800 ring-1 ring-neutral-200 dark:ring-zinc-700 font-mono text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                        {step}
                    </div>
                    {title && (
                        <h2 className="font-medium text-sm text-foreground flex items-center gap-2">
                            {StepIcon}
                            <span>{title}</span>
                        </h2>
                    )}
                </div>
                <button
                    onClick={() => copy(textToCopy)}
                    className="flex items-center justify-center w-7 h-7 rounded-md transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Copy code"
                >
                    {hasCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950 [&_.group\/code]:border-0 [&_.group\/code]:shadow-none [&_.group\/code]:bg-transparent [&_.group\/code]:mb-0 [&_.group\/code]:rounded-none">
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

    const getCommand = React.useCallback(() => {
        switch (installType) {
            case "pnpm": return cli.replace(/^npx/, 'pnpm dlx')
            case "bun": return cli.replace(/^npx/, 'bun x')
            case "yarn": return cli.replace(/^npx/, 'yarn dlx')
            default: return cli
        }
    }, [cli, installType])

    const copyCommand = React.useCallback(() => {
        copy(getCommand())
    }, [copy, getCommand])

    // Pre-compute all command variants to avoid recalculating in TabsContent
    const commands = React.useMemo(() => ({
        npm: cli,
        pnpm: cli.replace(/^npx/, 'pnpm dlx'),
        bun: cli.replace(/^npx/, 'bun x'),
        yarn: cli.replace(/^npx/, 'yarn dlx'),
    }), [cli])

    return (
        <div className={cn("group relative my-8", className)}>
            <div className="mb-10" id="install-cli">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">Install using CLI</h2>
                <Tabs value={installType} onValueChange={setInstallType} className="relative w-full !border-[1px] !border-neutral-200 dark:!border-neutral-700 rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#161616] border-b border-neutral-200 dark:border-[#222]">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-[#222] bg-white dark:bg-black">
                        <TabsList className="justify-start gap-6 bg-transparent p-0 h-auto">
                            {["npm", "pnpm", "bun", "yarn"].map((tab) => {
                                const isActive = installType === tab
                                return (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className={cn(
                                            "relative h-auto px-4 py-2 min-w-20 justify-center rounded-none border-t-2 border-transparent font-medium text-sm transition-all outline-none cursor-pointer select-none",
                                            isActive ? "text-neutral-900 dark:text-white" : "text-muted-foreground hover:text-foreground",
                                            "bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-tab-underline"
                                                className="absolute bottom-[-11px] left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white"
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
                            <CodeBlock code={commands.npm} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="pnpm" className="!mt-0">
                            <CodeBlock code={commands.pnpm} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="bun" className="!mt-0">
                            <CodeBlock code={commands.bun} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
                        </TabsContent>
                        <TabsContent value="yarn" className="!mt-0">
                            <CodeBlock code={commands.yarn} className="border-0 shadow-none bg-transparent dark:bg-transparent rounded-none" />
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
