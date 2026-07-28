"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Code2,
  FileText,
  GraduationCap,
  Menu,
  MessagesSquare,
  MoveRight,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import LogoIcon from "@/assets/logo/logo-icon";

export interface MegaMenuItem {
  title: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  iconClassName?: string;
  badge?: string;
}

export interface MegaMenuResourceGroup {
  title: string;
  links: MegaMenuItem[];
}

export interface MegaMenuNavbarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  brandName?: string;
  brandHref?: string;
  logo?: React.ReactNode;
  features?: MegaMenuItem[];
  useCases?: MegaMenuItem[];
  resourceGroups?: MegaMenuResourceGroup[];
  pricingHref?: string;
  loginHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

type DesktopMenu = "features" | "use-cases" | "resources" | null;
type MobileSection = Exclude<DesktopMenu, null>;

const DEFAULT_FEATURES: MegaMenuItem[] = [
  {
    title: "Components",
    description: "Polished interface elements ready to copy, customize, and ship.",
    href: "/components",
    icon: Sparkles,
    badge: "New",
  },
  {
    title: "Blocks",
    description: "Complete, flexible sections for building pages with less effort.",
    href: "/blocks",
    icon: BarChart3,
  },
  {
    title: "Motion",
    description: "Considered interactions that add rhythm without distraction.",
    href: "/components",
    icon: Zap,
  },
  {
    title: "Templates",
    description: "A curated starting point for landing pages and portfolios.",
    href: "/templates",
    icon: Users,
  },
  {
    title: "Documentation",
    description: "Clear installation notes, usage examples, and component APIs.",
    href: "/docs",
    icon: Code2,
  },
  {
    title: "Open source",
    description: "A practical design system built for the wider frontend community.",
    href: "https://github.com/Ashutoshx7/VengeanceUI",
    icon: ShieldCheck,
  },
];

const DEFAULT_USE_CASES: MegaMenuItem[] = [
  {
    title: "Landing pages",
    description: "Build expressive first impressions with a more considered visual system.",
    href: "/blocks",
    icon: Rocket,
  },
  {
    title: "Product sites",
    description: "Compose useful product narratives, feature sections, and calls to action.",
    href: "/components",
    icon: Briefcase,
  },
  {
    title: "Personal work",
    description: "Give portfolios and creative projects a refined, technical character.",
    href: "/templates",
    icon: Building2,
  },
];

const DEFAULT_RESOURCE_GROUPS: MegaMenuResourceGroup[] = [
  {
    title: "Explore",
    links: [
      { title: "Components", href: "/components", icon: Building2 },
      { title: "Blocks", href: "/blocks", icon: Briefcase },
      { title: "Templates", href: "/templates", icon: MessagesSquare },
    ],
  },
  {
    title: "Learn",
    links: [
      { title: "Documentation", href: "/docs", icon: FileText },
      { title: "Changelog", href: "/changelog", icon: Code2 },
      { title: "GitHub", href: "https://github.com/Ashutoshx7/VengeanceUI", icon: GraduationCap },
    ],
  },
];

function NavAction({
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-lg px-3 text-[13px] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
        variant === "primary" &&
          "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        variant === "ghost" &&
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
        variant === "outline" &&
          "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800",
        className,
      )}
    >
      {children}
    </a>
  );
}

function Brand({
  brandName,
  brandHref,
  logo,
  onNavigate,
}: {
  brandName: string;
  brandHref: string;
  logo?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={brandHref}
      onClick={onNavigate}
      className="relative z-10 flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-zinc-50"
    >
      {logo ?? (
        <LogoIcon className="size-5 rotate-180 text-zinc-900 dark:text-zinc-100" />
      )}
      <span>{brandName}</span>
    </a>
  );
}

function MenuTrigger({
  id,
  label,
  isOpen,
  onToggle,
  onOpen,
}: {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={id}
      onClick={onToggle}
      onFocus={onOpen}
      className={cn(
        "flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
        "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
        "dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100",
        isOpen && "bg-zinc-100 text-zinc-950 dark:bg-white/[0.08] dark:text-zinc-100",
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          "size-3.5 opacity-60 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

function FeatureGrid({ items }: { items: MegaMenuItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.title}
            href={item.href}
            className={cn(
              "group/item flex items-start gap-3 rounded-lg p-3 transition-colors",
              "hover:bg-zinc-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
              "dark:hover:bg-white/[0.05] dark:focus-visible:ring-zinc-700",
            )}
          >
            {Icon ? (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 bg-zinc-50 transition-colors group-hover/item:bg-white dark:border-white/[0.08] dark:bg-white/[0.04] dark:group-hover/item:bg-white/[0.08]">
                <Icon className={cn("size-4", item.iconClassName ?? "text-zinc-600 dark:text-zinc-300")} />
              </span>
            ) : null}

            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-950 dark:text-zinc-100">
                  {item.title}
                </span>
                {item.badge ? (
                  <span className="rounded-full border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-zinc-300">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              {item.description ? (
                <span className="mt-1 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </span>
              ) : null}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function DesktopDropdown({
  id,
  open,
  className,
  children,
}: {
  id: string;
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      aria-hidden={!open}
      className={cn(
        "absolute left-0 top-full z-50 pt-2 transition-all duration-150",
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-2 opacity-0 pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MobileAccordion({
  title,
  value,
  openSection,
  onToggle,
  children,
}: {
  title: string;
  value: MobileSection;
  openSection: MobileSection | null;
  onToggle: (value: MobileSection) => void;
  children: React.ReactNode;
}) {
  const isOpen = openSection === value;
  const contentId = `mobile-${value}-content`;

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => onToggle(value)}
        className="flex w-full items-center justify-between py-4 text-sm font-medium text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-100"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-zinc-500 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="ml-2 flex flex-col gap-1 border-l-2 border-zinc-100 pl-3 dark:border-zinc-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenuItem({ item, onNavigate }: { item: MegaMenuItem; onNavigate: () => void }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
    >
      {Icon ? <Icon className={cn("size-4", item.iconClassName)} /> : null}
      <span>{item.title}</span>
    </a>
  );
}

export function MegaMenuNavbar({
  brandName = "VengeanceUI",
  brandHref = "/",
  logo,
  features = DEFAULT_FEATURES,
  useCases = DEFAULT_USE_CASES,
  resourceGroups = DEFAULT_RESOURCE_GROUPS,
  pricingHref = "/templates",
  loginHref = "/docs",
  ctaHref = "/components",
  ctaLabel = "Browse components",
  className,
  ...props
}: MegaMenuNavbarProps) {
  const [openMenu, setOpenMenu] = React.useState<DesktopMenu>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSection, setMobileSection] = React.useState<MobileSection | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const toggleDesktopMenu = (menu: Exclude<DesktopMenu, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const toggleMobileSection = (section: MobileSection) => {
    setMobileSection((current) => (current === section ? null : section));
  };

  return (
    <header
      {...props}
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl",
        "dark:border-white/[0.08] dark:bg-zinc-950/85",
        className,
      )}
      onMouseLeave={(event) => {
        setOpenMenu(null);
        props.onMouseLeave?.(event);
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Brand brandName={brandName} brandHref={brandHref} logo={logo} />

            <nav aria-label="Primary navigation" className="hidden items-center lg:flex">
              <ul className="flex items-center gap-1">
                <li className="relative" onMouseEnter={() => setOpenMenu("features")}>
                  <MenuTrigger
                    id="features-mega-menu"
                    label="Features"
                    isOpen={openMenu === "features"}
                    onToggle={() => toggleDesktopMenu("features")}
                    onOpen={() => setOpenMenu("features")}
                  />
                  <DesktopDropdown id="features-mega-menu" open={openMenu === "features"} className="w-[640px]">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.55)] dark:border-white/[0.1] dark:bg-zinc-950">
                      <FeatureGrid items={features} />
                      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 px-2 pt-3 dark:border-white/[0.08]">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          Building something distinct?
                        </span>
                        <a
                          href="/components"
                          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-950 hover:underline dark:text-zinc-100"
                        >
                          Explore the library
                          <MoveRight className="size-4" />
                        </a>
                      </div>
                    </div>
                  </DesktopDropdown>
                </li>

                <li className="relative" onMouseEnter={() => setOpenMenu("use-cases")}>
                  <MenuTrigger
                    id="use-cases-mega-menu"
                    label="Use Cases"
                    isOpen={openMenu === "use-cases"}
                    onToggle={() => toggleDesktopMenu("use-cases")}
                    onOpen={() => setOpenMenu("use-cases")}
                  />
                  <DesktopDropdown id="use-cases-mega-menu" open={openMenu === "use-cases"} className="w-[390px]">
                    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.55)] dark:border-white/[0.1] dark:bg-zinc-950">
                      <div className="flex flex-col gap-1">
                        {useCases.map((item) => {
                          const Icon = item.icon;

                          return (
                            <a
                              key={item.title}
                              href={item.href}
                              className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:hover:bg-white/[0.05] dark:focus-visible:ring-zinc-700"
                            >
                              {Icon ? (
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
                                  <Icon className="size-4 text-zinc-600 dark:text-zinc-300" />
                                </span>
                              ) : null}
                              <span>
                                <span className="block text-sm font-medium text-zinc-950 dark:text-zinc-100">
                                  {item.title}
                                </span>
                                {item.description ? (
                                  <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {item.description}
                                  </span>
                                ) : null}
                              </span>
                            </a>
                          );
                        })}
                      </div>

                      <div className="mt-2 rounded-lg border border-zinc-100 bg-zinc-50/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
                        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">Made to be remixed</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Start with a detail, then make it entirely yours.
                        </p>
                        <a href="/components" className="mt-3 inline-flex text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                          Browse components →
                        </a>
                      </div>
                    </div>
                  </DesktopDropdown>
                </li>

                <li>
                  <a
                    href={pricingHref}
                    className="inline-flex rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100/80 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                  >
                    Templates
                  </a>
                </li>

                <li className="relative" onMouseEnter={() => setOpenMenu("resources")}>
                  <MenuTrigger
                    id="resources-mega-menu"
                    label="Resources"
                    isOpen={openMenu === "resources"}
                    onToggle={() => toggleDesktopMenu("resources")}
                    onOpen={() => setOpenMenu("resources")}
                  />
                  <DesktopDropdown
                    id="resources-mega-menu"
                    open={openMenu === "resources"}
                    className="left-1/2 w-[620px] -translate-x-1/2"
                  >
                    <div className="grid grid-cols-3 gap-5 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.55)] dark:border-white/[0.1] dark:bg-zinc-950">
                      <div className="flex flex-col justify-between rounded-lg border border-zinc-100 bg-zinc-50/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
                        <div>
                          <span className="flex size-9 items-center justify-center rounded-md bg-zinc-200/70 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200">
                            <BookOpen className="size-4" />
                          </span>
                          <h4 className="mt-4 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                            Designed with restraint
                          </h4>
                          <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                            A small set of expressive details, kept deliberately quiet.
                          </p>
                        </div>
                        <a href="/about" className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-100">
                          About VengeanceUI
                          <MoveRight className="size-3.5" />
                        </a>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-5">
                        {resourceGroups.map((group) => (
                          <div key={group.title} className="flex flex-col gap-1">
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              {group.title}
                            </h4>
                            {group.links.map((item) => {
                              const Icon = item.icon;

                              return (
                                <a
                                  key={item.title}
                                  href={item.href}
                                  className="flex items-center gap-2 rounded-md p-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100/80 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                                >
                                  {Icon ? <Icon className="size-4 text-zinc-400" /> : null}
                                  {item.title}
                                </a>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DesktopDropdown>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <NavAction href={loginHref} variant="ghost">
                Log in
              </NavAction>
              <NavAction href={ctaHref}>{ctaLabel}</NavAction>
            </div>

            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-950 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Brand brandName={brandName} brandHref={brandHref} logo={logo} onNavigate={closeMobile} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="flex size-10 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="-mx-6 flex-1 overflow-y-auto px-6">
          <MobileAccordion
            title="Features"
            value="features"
            openSection={mobileSection}
            onToggle={toggleMobileSection}
          >
            {features.map((item) => (
              <MobileMenuItem key={item.title} item={item} onNavigate={closeMobile} />
            ))}
          </MobileAccordion>

          <MobileAccordion
            title="Use Cases"
            value="use-cases"
            openSection={mobileSection}
            onToggle={toggleMobileSection}
          >
            {useCases.map((item) => (
              <MobileMenuItem key={item.title} item={item} onNavigate={closeMobile} />
            ))}
          </MobileAccordion>

          <a
            href={pricingHref}
            onClick={closeMobile}
            className="block border-b border-zinc-200 py-4 text-sm font-medium text-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
          >
            Templates
          </a>

          <MobileAccordion
            title="Resources"
            value="resources"
            openSection={mobileSection}
            onToggle={toggleMobileSection}
          >
            {resourceGroups.flatMap((group) =>
              group.links.map((item) => (
                <MobileMenuItem key={`${group.title}-${item.title}`} item={item} onNavigate={closeMobile} />
              )),
            )}
          </MobileAccordion>
        </nav>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <NavAction href={loginHref} variant="outline" className="w-full" onClick={closeMobile}>
            Log in
          </NavAction>
          <NavAction href={ctaHref} className="w-full" onClick={closeMobile}>
            {ctaLabel}
          </NavAction>
        </div>
      </aside>
    </header>
  );
}

export default MegaMenuNavbar;
