import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    ExternalLink,
    GitBranch,
    Layers3,
    MonitorSmartphone,
    Palette,
    Sparkles,
} from "lucide-react";
import Container from "@/components/landing/container";
import Heading from "@/components/landing/heading";
import SubHeading from "@/components/landing/subheading";
import { Button } from "@/components/landing/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const templatesPageDescription =
    "Portfolio and blog templates with live previews, GitHub source links, and multi-screenshot galleries.";

export const metadata: Metadata = {
    title: "Templates",
    description: templatesPageDescription,
    alternates: {
        canonical: "/templates",
    },
    openGraph: {
        url: "/templates",
        title: "Templates | Vengeance UI",
        description: templatesPageDescription,
    },
};

type TemplateScreenshot = {
    src: string;
    alt: string;
    label: string;
    className?: string;
};

type PortfolioTemplate = {
    title: string;
    label: string;
    description: string;
    accent: string;
    status: string;
    stats: string[];
    tags: string[];
    liveUrl: string;
    githubUrl: string;
    screenshots: TemplateScreenshot[];
};

const portfolioTemplates: PortfolioTemplate[] = [
    {
        title: "Portfolio V2",
        label: "Ashutoshx7 developer portfolio",
        description:
            "A dark, grid-first portfolio with experience, projects, open source work, skills, blogs, contact, and detailed project pages.",
        accent: "from-sky-500/35 via-zinc-300/20 to-transparent",
        status: "Portfolio 01",
        stats: ["Experience", "Projects", "Blog"],
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
        liveUrl: "https://portfolio-v2-koxw.vercel.app/projects/vengenceui",
        githubUrl: "https://github.com/Ashutoshx7/Portfolio-v2-",
        screenshots: [
            {
                src: "/templates/portfolio-v2-home-tall.png",
                alt: "Portfolio V2 homepage and project grid screenshot",
                label: "Homepage flow",
                className: "object-top",
            },
            {
                src: "/templates/portfolio-v2-project.png",
                alt: "Portfolio V2 project detail screenshot",
                label: "Project detail",
                className: "object-top",
            },
            {
                src: "/templates/portfolio-v2-home.png",
                alt: "Portfolio V2 above the fold screenshot",
                label: "Above fold",
                className: "object-top",
            },
        ],
    },
    {
        title: "Portfolio V1",
        label: "Classic dark developer portfolio",
        description:
            "A sharp personal portfolio with serif display type, project cards, proof-of-work activity, experience, blog, and responsive mobile layouts.",
        accent: "from-zinc-200/30 via-neutral-500/20 to-transparent",
        status: "Portfolio 02",
        stats: ["Projects", "Proof", "Contact"],
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        liveUrl: "https://portfoliov1-bice-iota.vercel.app/",
        githubUrl: "https://github.com/Ashutoshx7/Portfoliov1",
        screenshots: [
            {
                src: "/templates/portfolio-v1-wide.png",
                alt: "Portfolio V1 full homepage screenshot",
                label: "Full homepage",
                className: "object-top",
            },
            {
                src: "/templates/portfolio-v1-home.png",
                alt: "Portfolio V1 projects and experience screenshot",
                label: "Projects",
                className: "object-top",
            },
            {
                src: "/templates/portfolio-v1-mobile.png",
                alt: "Portfolio V1 mobile responsive screenshot",
                label: "Mobile",
                className: "object-top",
            },
        ],
    },
];

const blogTemplates: PortfolioTemplate[] = [
    {
        title: "Blog V1",
        label: "Vengeance UI blog template",
        description:
            "A clean editorial blog template with category pages, long-form article layout, and mobile-first reading experience.",
        accent: "from-cyan-500/30 via-zinc-300/15 to-transparent",
        status: "Blog 01",
        stats: ["Categories", "Articles", "Mobile"],
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "MDX-ready"],
        liveUrl: "https://vengeance-blog-template.vercel.app/",
        githubUrl: "https://github.com/FirePheonix/vengeance-ui-blog-template",
        screenshots: [
            {
                src: "/templates/blog-v1-home.png",
                alt: "Blog V1 homepage screenshot",
                label: "Homepage",
                className: "object-top",
            },
            {
                src: "/templates/blog-v1-blogweb.png",
                alt: "Blog V1 blogweb page screenshot",
                label: "Blogweb",
                className: "object-top",
            },
            {
                src: "/templates/blog-v1-mobile.png",
                alt: "Blog V1 mobile reading layout screenshot",
                label: "Mobile",
                className: "object-top",
            },
        ],
    },
];

const pageNotes = [
    {
        icon: MonitorSmartphone,
        title: "Responsive first",
        description: "Each portfolio entry includes desktop and mobile proof so the layout is easier to judge.",
    },
    {
        icon: Palette,
        title: "Visual catalog",
        description: "Templates are shown one after another with larger screenshot rails, inspired by premium template libraries.",
    },
    {
        icon: Layers3,
        title: "Source linked",
        description: "Every portfolio has a live preview and GitHub source attached directly to the listing.",
    },
];

const primaryActionClass =
    "border-foreground/15 bg-foreground/[0.045] text-foreground shadow-none ring-1 ring-inset ring-white/5 hover:border-foreground/25 hover:bg-foreground/[0.075] hover:text-foreground dark:border-white/15 dark:bg-white/[0.045] dark:hover:bg-white/[0.075]";

const secondaryActionClass =
    "border-foreground/10 bg-transparent text-foreground/85 shadow-none hover:border-foreground/20 hover:bg-foreground/[0.045] hover:text-foreground dark:border-white/10 dark:bg-transparent dark:hover:bg-white/[0.055]";

export default function TemplatesPage() {
    return (
        <main>
            <section className="border-b border-border/70">
                <Container>
                    <div className="grid overflow-hidden md:min-h-[560px] md:grid-cols-[minmax(0,1fr)_430px] md:border-x md:border-border/70">
                        <div className="flex flex-col justify-center gap-8 border-b border-border/70 px-4 py-12 md:border-b-0 md:border-r md:border-border/70 md:px-8 md:py-20 lg:px-10">
                            <div className="flex w-fit items-center gap-2 rounded-md border border-foreground/10 bg-foreground/[0.035] px-3 py-1.5 font-mono text-xs text-muted-foreground dark:bg-white/[0.035]">
                                <Sparkles className="size-3.5 text-foreground" />
                                Template library
                            </div>

                            <div className="max-w-3xl space-y-5">
                                <Heading as="h1" variant="big" className="text-start">
                                    Portfolio templates
                                    <span className="block bg-linear-to-r from-zinc-700 via-zinc-950 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-500 dark:via-zinc-100 dark:to-zinc-500">
                                        shown one after another.
                                    </span>
                                </Heading>
                                <SubHeading variant="big" className="max-w-2xl">
                                    A clean catalog for polished portfolio templates with live previews, GitHub links, and multiple screenshots per template.
                                </SubHeading>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild variant="outline" size="lg" className={cn("w-full sm:w-fit", primaryActionClass)}>
                                    <Link href="#portfolio-templates">
                                        Browse templates
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className={cn("w-full sm:w-fit", secondaryActionClass)}>
                                    <Link href="/docs">
                                        View components
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative min-h-[460px] overflow-hidden bg-muted/35 p-4 dark:bg-muted/20 md:p-6">
                            <div
                                className="absolute inset-0 opacity-45"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, rgba(120, 120, 120, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 120, 120, 0.12) 1px, transparent 1px)",
                                    backgroundSize: "34px 34px",
                                }}
                            />
                            <div className="relative flex h-full flex-col justify-between border border-foreground/10 bg-background/80 p-4 backdrop-blur dark:bg-background/65">
                                <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                                    <div>
                                        <p className="font-mono text-xs text-muted-foreground">/templates</p>
                                        <p className="font-orbitron text-sm font-semibold">Portfolio queue</p>
                                    </div>
                                    <BriefcaseBusiness className="size-5 text-muted-foreground" />
                                </div>

                                <div className="grid gap-3 py-6">
                                    {portfolioTemplates.map((template, index) => (
                                        <div
                                            key={template.title}
                                            className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 border border-foreground/10 bg-card/80 p-3"
                                        >
                                            <div className="relative aspect-square overflow-hidden border border-foreground/10 bg-muted">
                                                <div className={cn("absolute inset-0 bg-linear-to-br", template.accent)} />
                                                <Image
                                                    src={template.screenshots[0].src}
                                                    alt=""
                                                    fill
                                                    sizes="72px"
                                                    className="object-cover object-top opacity-85"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                                                    0{index + 1} / portfolio
                                                </p>
                                                <h2 className="truncate font-orbitron text-base font-semibold">
                                                    {template.title}
                                                </h2>
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {template.label}
                                                </p>
                                                <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-emerald-500">
                                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                                    Live connected
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 border-t border-foreground/10 pt-3 text-center font-mono text-[11px] text-muted-foreground">
                                    <span>Preview</span>
                                    <span>Source</span>
                                    <span>Ship</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section id="portfolio-templates" className="border-b border-border/70">
                <Container>
                    <div className="md:border-x md:border-border/70">
                        <div className="grid gap-4 border-b border-border/70 px-4 py-8 md:grid-cols-[minmax(0,1fr)_360px] md:gap-8 md:px-8 md:py-12">
                            <div className="space-y-3">
                                <Heading variant="medium">Two live portfolio templates</Heading>
                                <SubHeading>
                                    Both entries now use real live links, GitHub repositories, and screenshot galleries. The layout is stacked vertically so every template gets room to breathe.
                                </SubHeading>
                            </div>
                            <div className="grid grid-cols-3 border border-foreground/10 bg-foreground/[0.02] text-center font-mono text-xs dark:bg-white/[0.02]">
                                <div className="border-r border-foreground/10 p-3">
                                    <span className="block text-lg font-semibold text-foreground">2</span>
                                    Templates
                                </div>
                                <div className="border-r border-foreground/10 p-3">
                                    <span className="block text-lg font-semibold text-foreground">6</span>
                                    Screens
                                </div>
                                <div className="p-3">
                                    <span className="block text-lg font-semibold text-foreground">2</span>
                                    Repos
                                </div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {portfolioTemplates.map((template, index) => (
                                <PortfolioTemplateRow
                                    key={template.title}
                                    template={template}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section id="blog-templates" className="border-b border-border/70">
                <Container>
                    <div className="md:border-x md:border-border/70">
                        <div className="grid gap-4 border-b border-border/70 px-4 py-8 md:grid-cols-[minmax(0,1fr)_360px] md:gap-8 md:px-8 md:py-12">
                            <div className="space-y-3">
                                <Heading variant="medium">One live blog template</Heading>
                                <SubHeading>
                                    Blog templates follow the same stacked gallery style as portfolio entries, with live link, source link, and screenshot rail.
                                </SubHeading>
                            </div>
                            <div className="grid grid-cols-3 border border-foreground/10 bg-foreground/[0.02] text-center font-mono text-xs dark:bg-white/[0.02]">
                                <div className="border-r border-foreground/10 p-3">
                                    <span className="block text-lg font-semibold text-foreground">1</span>
                                    Template
                                </div>
                                <div className="border-r border-foreground/10 p-3">
                                    <span className="block text-lg font-semibold text-foreground">3</span>
                                    Screens
                                </div>
                                <div className="p-3">
                                    <span className="block text-lg font-semibold text-foreground">1</span>
                                    Repo
                                </div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {blogTemplates.map((template, index) => (
                                <PortfolioTemplateRow
                                    key={template.title}
                                    template={template}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section>
                <Container>
                    <div className="grid border-b border-border/70 md:grid-cols-3 md:border-x md:border-border/70">
                        {pageNotes.map((note) => (
                            <div key={note.title} className="border-b border-border/70 p-4 md:border-b-0 md:border-r md:border-border/70 md:p-8 last:md:border-r-0">
                                <note.icon className="mb-5 size-5 text-muted-foreground" />
                                <Heading variant="small" className="mb-3">
                                    {note.title}
                                </Heading>
                                <SubHeading variant="small">
                                    {note.description}
                                </SubHeading>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}

function PortfolioTemplateRow({
    template,
    index,
}: {
    template: PortfolioTemplate;
    index: number;
}) {
    return (
        <article className="grid gap-6 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
            <div className="flex flex-col justify-between gap-8">
                <div className="space-y-5">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-md font-mono">
                            {template.status}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                            0{index + 1} / live template
                        </span>
                    </div>

                    <div className="space-y-3">
                        <p className="font-mono text-xs uppercase text-muted-foreground">
                            {template.label}
                        </p>
                        <Heading variant="medium">{template.title}</Heading>
                        <SubHeading>{template.description}</SubHeading>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="rounded-md font-mono">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <Button asChild variant="outline" size="sm" className={cn("w-full", primaryActionClass)}>
                        <Link href={template.liveUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" />
                            Live preview
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className={cn("w-full", secondaryActionClass)}>
                        <Link href={template.githubUrl} target="_blank" rel="noreferrer">
                            <GitBranch className="size-4" />
                            GitHub
                        </Link>
                    </Button>
                </div>
            </div>

            <TemplateScreenshotRail template={template} />
        </article>
    );
}

function TemplateScreenshotRail({ template }: { template: PortfolioTemplate }) {
    const [primary, secondary, tertiary] = template.screenshots;

    return (
        <div className="relative overflow-hidden border border-foreground/10 bg-muted/35 p-3 dark:bg-muted/20 md:p-4">
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-45", template.accent)} />
            <div
                className="absolute inset-0 opacity-35"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(120,120,120,0.22) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                }}
            />
            <div className="relative grid gap-3 lg:grid-cols-[1.08fr_0.9fr_0.62fr]">
                <ScreenshotFrame screenshot={primary} size="large" />
                <ScreenshotFrame screenshot={secondary} size="large" />
                <ScreenshotFrame screenshot={tertiary} size="portrait" />
            </div>
        </div>
    );
}

function ScreenshotFrame({
    screenshot,
    size,
}: {
    screenshot: TemplateScreenshot;
    size: "large" | "portrait";
}) {
    return (
        <figure className="overflow-hidden border border-foreground/10 bg-background/85 shadow-none">
            <div className="flex h-8 items-center justify-between border-b border-foreground/10 bg-background/85 px-3">
                <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-400" />
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span className="size-2 rounded-full bg-emerald-400" />
                </div>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {screenshot.label}
                </span>
            </div>
            <div className={cn("relative bg-black", size === "portrait" ? "aspect-[9/16]" : "aspect-[16/10]")}>
                <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    sizes={size === "portrait" ? "(min-width: 1024px) 16vw, 80vw" : "(min-width: 1024px) 30vw, 80vw"}
                    className={cn("object-cover", screenshot.className)}
                />
            </div>
        </figure>
    );
}
