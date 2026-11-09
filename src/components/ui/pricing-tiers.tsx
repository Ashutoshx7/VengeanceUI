"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  AppWindowIcon,
  ArrowsClockwiseIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  ClockCounterClockwiseIcon,
  ClockIcon,
  CloudArrowDownIcon,
  CloudCheckIcon,
  CodeBlockIcon,
  CubeIcon,
  FileArrowDownIcon,
  FlaskIcon,
  GlobeIcon,
  HandPalmIcon,
  HardDrivesIcon,
  LaptopIcon,
  LifebuoyIcon,
  LinkIcon,
  ListMagnifyingGlassIcon,
  PuzzlePieceIcon,
  ReceiptIcon,
  SignatureIcon,
  SlackLogoIcon,
  SparkleIcon,
  SquaresFourIcon,
  StorefrontIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type PricingTiersBilling = "monthly" | "yearly";

export interface PricingTiersFeature {
  /** Wrap part of the label in <b> or <strong> to emphasise it, e.g. <><b>30 day</b> build retention</>. */
  label: React.ReactNode;
  /** Any icon element. Sized to 22px. */
  icon?: React.ReactNode;
}

export interface PricingTiersAction {
  label: React.ReactNode;
  /** Renders a link when set, otherwise a button. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface PricingTier {
  id: string;
  name: React.ReactNode;
  description?: React.ReactNode;
  /** Price per month for each billing cycle, or a label such as "Custom". */
  price: Record<PricingTiersBilling, number> | string;
  /** Renders the dark highlighted card with the blue call to action. */
  featured?: boolean;
  cta: PricingTiersAction;
  /** Monospaced label above the feature list, e.g. "Everything in Essential, plus:". */
  featuresLabel?: React.ReactNode;
  features: PricingTiersFeature[];
}

export interface PricingTiersEnterprise {
  name: React.ReactNode;
  description?: React.ReactNode;
  cta: PricingTiersAction;
  /** Shown above the features when the row stacks in narrow containers. */
  featuresLabel?: React.ReactNode;
  features: PricingTiersFeature[];
}

export interface PricingTiersProps extends Omit<React.ComponentProps<"section">, "title"> {
  badge?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tiers?: PricingTier[];
  /** Full-width row under the tiers. Pass null to hide it. */
  enterprise?: PricingTiersEnterprise | null;
  /** Controlled billing cycle. */
  billing?: PricingTiersBilling;
  defaultBilling?: PricingTiersBilling;
  onBillingChange?: (billing: PricingTiersBilling) => void;
  billingLabels?: Record<PricingTiersBilling, React.ReactNode>;
  /** Chip next to the yearly option. Pass null to hide it. */
  yearlyDiscountLabel?: React.ReactNode | null;
  currency?: string;
  /** Locale used to group digits, e.g. 1,200 or 1.200. */
  locale?: string;
  periodLabel?: React.ReactNode;
  /** Fades the cards up the first time they scroll into view. */
  animateIn?: boolean;
}

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    description: (
      <>
        For simple desktop apps and
        <br className="@2xl:@max-5xl:hidden" /> solo developers.
      </>
    ),
    price: { monthly: 125, yearly: 100 },
    cta: { label: "Start free trial" },
    featuresLabel: "Essential plan includes:",
    features: [
      { label: <><b>30 day</b> build retention</>, icon: <ClockCounterClockwiseIcon weight="fill" /> },
      { label: <><b>10,000</b> downloads/month</>, icon: <CloudArrowDownIcon weight="fill" /> },
      { label: <><b>Unlimited</b> App Updates</>, icon: <ArrowsClockwiseIcon weight="fill" /> },
      { label: "Windows, Mac & Linux build servers", icon: <HardDrivesIcon weight="fill" /> },
      { label: "Code signing", icon: <SignatureIcon weight="fill" /> },
      { label: "Native app installers", icon: <FileArrowDownIcon weight="fill" /> },
      { label: "Native module rebuilding", icon: <CubeIcon weight="fill" /> },
      { label: "Automated Electron code analysis", icon: <ListMagnifyingGlassIcon weight="fill" /> },
      { label: "CDN-backed downloads/updates", icon: <GlobeIcon weight="fill" /> },
      { label: "Download links on your domain", icon: <LinkIcon weight="fill" /> },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    description: (
      <>
        For sophisticated desktop apps
        <br className="@2xl:@max-5xl:hidden" /> and small teams.
      </>
    ),
    price: { monthly: 375, yearly: 300 },
    featured: true,
    cta: { label: "Start free trial" },
    featuresLabel: "Everything in Essential, plus:",
    features: [
      { label: <><b>60 day</b> build retention</>, icon: <ClockCounterClockwiseIcon weight="fill" /> },
      { label: <><b>30,000</b> downloads/month</>, icon: <CloudArrowDownIcon weight="fill" /> },
      { label: "Staging and dev apps", icon: <FlaskIcon weight="fill" /> },
      { label: "Auto-update smoke testing", icon: <CloudCheckIcon weight="fill" /> },
      { label: "Windows & Mac web installers", icon: <AppWindowIcon weight="fill" /> },
      { label: "Private Slack-channel support", icon: <SlackLogoIcon weight="fill" /> },
      { label: "MSI and PKG installers", icon: <LaptopIcon weight="fill" /> },
      { label: "Microsoft and Mac app store", icon: <StorefrontIcon weight="fill" /> },
      { label: "Download analytics", icon: <ChartLineUpIcon weight="fill" /> },
      { label: "Build analytics", icon: <ChartBarIcon weight="fill" /> },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: (
      <>
        For advanced features and
        <br className="@2xl:@max-5xl:hidden" /> dedicated support.
      </>
    ),
    price: { monthly: 1500, yearly: 1200 },
    cta: { label: "Start free trial" },
    featuresLabel: "Everything in Performance, plus:",
    features: [
      { label: <><b>360 day</b> build retention</>, icon: <ClockCounterClockwiseIcon weight="fill" /> },
      { label: <><b>100,000</b> downloads/month</>, icon: <CloudArrowDownIcon weight="fill" /> },
      { label: "Support for staggered rollouts", icon: <SquaresFourIcon weight="fill" /> },
      { label: "Account manager", icon: <UserIcon weight="fill" /> },
      { label: "Priority support & onboarding", icon: <LifebuoyIcon weight="fill" /> },
      { label: "Integration assistance", icon: <PuzzlePieceIcon weight="fill" /> },
    ],
  },
];

export const DEFAULT_PRICING_TIERS_ENTERPRISE: PricingTiersEnterprise = {
  name: "Enterprise",
  description: "Customised to suit your needs.",
  cta: { label: "Contact sales" },
  featuresLabel: "Everything in Scale, plus:",
  features: [
    { label: <><b>Unlimited</b> build retention</>, icon: <ClockCounterClockwiseIcon weight="fill" /> },
    { label: <><b>Unlimited</b> downloads/month</>, icon: <CloudArrowDownIcon weight="fill" /> },
    { label: "Custom billing", icon: <ReceiptIcon weight="fill" /> },
    { label: "Custom features", icon: <SparkleIcon weight="fill" /> },
    { label: "Optional self-host infra", icon: <HandPalmIcon weight="fill" /> },
    { label: "Guaranteed response SLA", icon: <ClockIcon weight="fill" /> },
    { label: "Team training & Code reviews", icon: <CodeBlockIcon weight="fill" /> },
  ],
};

const DEFAULT_BILLING_LABELS: Record<PricingTiersBilling, React.ReactNode> = {
  monthly: "Monthly",
  yearly: "Yearly",
};

const BILLING_CYCLES: PricingTiersBilling[] = ["monthly", "yearly"];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Layered 4% shadows from the reference design; they read as a soft lift, not a drop shadow.
const PANEL_SHADOW =
  "shadow-[0_6px_6px_-3px_rgba(0,0,0,0.02),0_3px_3px_-1.5px_rgba(0,0,0,0.02),0_1px_1px_-0.5px_rgba(0,0,0,0.03),0_12px_12px_-3px_rgba(0,0,0,0.04)]";

// Below @2xl the layout is the single-column mobile spec, @2xl–@5xl is a compact
// three-column layout for narrow containers, and @5xl+ is the full desktop spec.
const PANEL_SPACING = "px-9 pb-9 pt-8 @2xl:px-5 @2xl:pb-5 @2xl:pt-5 @5xl:px-9 @5xl:pb-9 @5xl:pt-8";
const BODY_SPACING = "px-9 pb-9 @2xl:px-5 @2xl:pb-5 @5xl:px-9 @5xl:pb-9";
const COLUMN_WIDTH = "mx-auto w-full max-w-[360px] px-4 @2xl:max-w-[calc(var(--pricing-tiers-width)+2rem)]";
const CARD_WIDTH = 360;
const CARD_GAP = 24;

const DISPLAY_FONT = "font-(family-name:--pricing-tiers-display)";
const MONO_LABEL =
  "font-(family-name:--pricing-tiers-mono) text-[11px]/4 font-medium tracking-[0.33px] uppercase";

// In dark mode the plain tiers take the reference's own dark-surface treatment
// (translucent fill, inset highlights) and the featured tier is lifted a step.
const TONES = {
  light: {
    card: "bg-[#373737]/4 dark:bg-white/[0.035]",
    panel: cn(
      "bg-white/88",
      PANEL_SHADOW,
      "dark:bg-white/5 dark:shadow-[inset_0_4px_8px_0_rgba(255,255,255,0.03),inset_0_2px_4px_0_rgba(255,255,255,0.03),inset_0_1px_1px_0_rgba(255,255,255,0.04),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.06)]",
    ),
    name: "text-[#141414] dark:text-[#ededed]",
    muted: "text-[#656565] dark:text-[#8f8f8f]",
    price: "text-[#141414] dark:text-[#ededed]",
    divider: "text-[#161616]/12 dark:text-white/10",
    icon: "text-[#a4a4a4] dark:text-[#5c5c5c]",
    feature:
      "text-[#656565] [&_b]:text-[#141414] [&_strong]:text-[#141414] dark:text-[#8f8f8f] dark:[&_b]:text-[#ededed] dark:[&_strong]:text-[#ededed]",
  },
  dark: {
    card: "bg-[#141414] dark:bg-[#1f1f1f] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),0_24px_48px_-24px_rgba(0,0,0,0.8)]",
    panel:
      "bg-white/8 shadow-[inset_0_4px_8px_0_rgba(255,255,255,0.04),inset_0_2px_4px_0_rgba(255,255,255,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.04),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.06)] dark:bg-white/9",
    name: "text-white/88 dark:text-white/92",
    muted: "text-[#a4a4a4]",
    price: "text-white/88 dark:text-white/92",
    divider: "text-white/12",
    icon: "text-[#707070] dark:text-[#7a7a7a]",
    feature: "text-[#999999] [&_b]:text-white/88 [&_strong]:text-white/88 dark:text-[#a4a4a4] dark:[&_b]:text-white/92 dark:[&_strong]:text-white/92",
  },
} as const;

type Tone = keyof typeof TONES;
type ActionVariant = "light" | "primary" | "gray";

const ACTION_BASE =
  "relative isolate block w-full cursor-pointer rounded-full p-[13px] text-center text-sm/[22px] font-medium tracking-[-0.14px] outline-none transition-[box-shadow,background-color] duration-200 ease-[cubic-bezier(0.6,0.6,0,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0335fc] @2xl:p-[10px] @5xl:p-[13px]";

// The sheen sits between the button's fill and its label.
const ACTION_SHEEN =
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-linear-to-b before:transition-opacity before:duration-[450ms] before:ease-[cubic-bezier(0.6,0.6,0,1)]";

const ACTION_VARIANTS: Record<ActionVariant, string> = {
  light: cn(
    "bg-white/96 text-[#141414]",
    "shadow-[0_8px_8px_-3px_rgba(0,0,0,0.04),0_3px_3px_-1.5px_rgba(0,0,0,0.04),0_2px_2px_-1px_rgba(0,0,0,0.03),0_1px_1px_-0.5px_rgba(0,0,0,0.03),0_0.5px_0.5px_0_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]",
    "hover:shadow-[0_16px_16px_-8px_rgba(0,0,0,0.08),0_3px_3px_-1.5px_rgba(0,0,0,0.04),0_2px_2px_-1px_rgba(0,0,0,0.03),0_1px_1px_-0.5px_rgba(0,0,0,0.03),0_0.5px_0.5px_0_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]",
    "active:shadow-[0_8px_8px_-3px_rgba(0,0,0,0.02),0_3px_3px_-1.5px_rgba(0,0,0,0.02),0_2px_2px_-1px_rgba(0,0,0,0.02),0_1px_1px_-0.5px_rgba(0,0,0,0.02),0_0.5px_0.5px_0_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.03)]",
    // Dark mode uses the reference's dark-surface button: translucent fill, lit from inside.
    "dark:bg-white/4 dark:text-[#ededed]",
    "dark:shadow-[inset_0_-4px_12px_-4px_rgba(255,255,255,0.08),inset_0_1px_3px_0_rgba(255,255,255,0.06),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.12),0_8px_8px_-3px_rgba(9,1,20,0.06),0_3px_3px_-1.5px_rgba(8,1,20,0.06),0_2px_2px_-1px_rgba(8,1,20,0.04),0_1px_1px_-0.5px_rgba(8,1,20,0.03)]",
    "dark:hover:bg-white/10 dark:hover:shadow-[inset_0_-4px_12px_-4px_rgba(255,255,255,0.08),inset_0_1px_3px_0_rgba(255,255,255,0.06),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.12),0_8px_8px_-3px_rgba(9,1,20,0.06),0_3px_3px_-1.5px_rgba(8,1,20,0.06),0_2px_2px_-1px_rgba(8,1,20,0.04),0_1px_1px_-0.5px_rgba(8,1,20,0.03)]",
    "dark:active:bg-white/2 dark:active:shadow-[inset_0_4px_8px_0_rgba(18,7,43,0.16),inset_0_3px_6px_0_rgba(18,7,43,0.06),inset_0_0.5px_0.5px_0_rgba(18,7,43,0.12),0_8px_8px_-3px_rgba(9,1,20,0.06),0_3px_3px_-1.5px_rgba(8,1,20,0.06)]",
    "dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:-z-10 dark:before:rounded-[inherit] dark:before:bg-linear-to-b dark:before:from-white/16 dark:before:to-white/8 dark:active:before:opacity-0",
  ),
  primary: cn(
    "bg-[#0335fc] bg-linear-to-b from-white/12 to-white/6",
    // Same channel values in Display P3 for the more vivid blue on wide-gamut screens.
    "supports-[color:color(display-p3_0_0_0)]:bg-[color:color(display-p3_0.0118_0.2067_0.9861)]",
    "shadow-[inset_0_1px_2px_-0.5px_rgba(255,255,255,0.12),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.16),inset_0_8px_24px_-4px_rgba(255,255,255,0.16),0_8px_8px_-3px_rgba(9,1,20,0.03),0_5px_5px_-2.5px_rgba(9,1,20,0.03),0_3px_3px_-1.5px_rgba(8,1,20,0.03),0_2px_2px_-1px_rgba(8,1,20,0.03),0_1px_1px_-0.5px_rgba(8,1,20,0.03),0_0.5px_0.5px_0_rgba(8,1,20,0.03)]",
    "active:shadow-[inset_0_1px_2px_-0.5px_rgba(0,27,130,0.16),inset_0_0.5px_0.5px_0_rgba(0,27,130,0.16),inset_0_8px_24px_-4px_rgba(0,27,130,0.16),0_8px_8px_-3px_rgba(9,1,20,0.03),0_5px_5px_-2.5px_rgba(9,1,20,0.03),0_3px_3px_-1.5px_rgba(8,1,20,0.03),0_2px_2px_-1px_rgba(8,1,20,0.03),0_1px_1px_-0.5px_rgba(8,1,20,0.03),0_0.5px_0.5px_0_rgba(8,1,20,0.03)]",
    ACTION_SHEEN,
    "before:from-white before:to-white/50 before:opacity-12 hover:before:opacity-24 active:before:opacity-6",
  ),
  gray: cn(
    "bg-[#333333]",
    "shadow-[inset_0_1px_2px_-0.5px_rgba(255,255,255,0.36),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.18),inset_0_8px_24px_-4px_rgba(255,255,255,0.25),0_8px_8px_-3px_rgba(0,0,0,0.1),0_3px_3px_-1.5px_rgba(0,0,0,0.1),0_2px_2px_-1px_rgba(0,0,0,0.08),0_1px_1px_-0.5px_rgba(0,0,0,0.06),0_0.5px_0.5px_0_rgba(0,0,0,0.06)]",
    "active:bg-[#292929] active:shadow-[inset_0_4px_8px_0_rgba(0,0,0,0.2),inset_0_3px_6px_0_rgba(0,0,0,0.15),inset_0_0.5px_0.5px_0_rgba(0,0,0,0.1),0_8px_8px_-3px_rgba(0,0,0,0.1),0_3px_3px_-1.5px_rgba(0,0,0,0.1),0_2px_2px_-1px_rgba(0,0,0,0.08)]",
    ACTION_SHEEN,
    "before:from-white/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 active:before:opacity-0",
    // Inverts to a light pill on dark surfaces, like the light tiers' buttons do in light mode.
    "dark:bg-[#ededed]",
    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),inset_0_-1px_0_0_rgba(0,0,0,0.08),0_8px_8px_-3px_rgba(0,0,0,0.3),0_3px_3px_-1.5px_rgba(0,0,0,0.25),0_1px_1px_-0.5px_rgba(0,0,0,0.2)]",
    "dark:active:bg-[#dedede] dark:active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.14),0_1px_1px_-0.5px_rgba(0,0,0,0.2)]",
    "dark:before:from-white/70 dark:before:to-white/0",
  ),
};

// A direction of 0 (reduced motion) turns the roll into a plain crossfade.
const ROLL: Variants = {
  enter: (direction: number) => ({ y: direction * 14, opacity: 0, filter: direction ? "blur(4px)" : "blur(0px)" }),
  center: { y: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({ y: direction * -14, opacity: 0, filter: direction ? "blur(4px)" : "blur(0px)" }),
};

const ROLL_TRANSITION = { duration: 0.32, ease: EASE_OUT };

function revealProps(enabled: boolean, delay: number) {
  if (!enabled) return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  };
}

export function PricingTiers({
  badge = "Pricing",
  title = (
    <>
      Choose a plan
      <br /> that fits your needs
    </>
  ),
  description = (
    <>
      All of our plans include a <b>7-day free trial</b>.
    </>
  ),
  tiers = DEFAULT_PRICING_TIERS,
  enterprise = DEFAULT_PRICING_TIERS_ENTERPRISE,
  billing,
  defaultBilling = "yearly",
  onBillingChange,
  billingLabels = DEFAULT_BILLING_LABELS,
  yearlyDiscountLabel = "-20%",
  currency = "$",
  locale = "en-US",
  periodLabel = "/ Month",
  animateIn = true,
  className,
  style,
  ...props
}: PricingTiersProps) {
  const [internalBilling, setInternalBilling] = React.useState<PricingTiersBilling>(defaultBilling);
  const activeBilling = billing ?? internalBilling;
  const hasNumericPrice = tiers.some((tier) => typeof tier.price !== "string");
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  // Three tiers is the reference layout. Fewer sit side by side, four make a 2x2 grid.
  const columns = tiers.length === 4 ? 2 : Math.min(Math.max(tiers.length, 1), 3);
  const layoutVars = {
    "--pricing-tiers-columns": columns,
    "--pricing-tiers-width": `${columns * CARD_WIDTH + (columns - 1) * CARD_GAP}px`,
  } as React.CSSProperties;

  const selectBilling = (next: PricingTiersBilling) => {
    if (next === activeBilling) return;
    if (billing === undefined) setInternalBilling(next);
    onBillingChange?.(next);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        className={cn(
          "@container relative isolate w-full py-14 text-[#141414] @5xl:py-[120px] dark:text-[#ededed]",
          // Through a variable, so a bg-* class in className replaces the surface in both themes.
          "bg-[color:var(--pricing-tiers-bg)] [--pricing-tiers-bg:#ffffff] dark:[--pricing-tiers-bg:#0a0a0a]",
          "[--pricing-tiers-display:'Aeonik_Pro',var(--font-geist-sans,'Geist'),ui-sans-serif,system-ui,sans-serif]",
          "[--pricing-tiers-mono:'Geist_Mono',var(--font-geist-mono,'Geist_Mono'),ui-monospace,SFMono-Regular,Menlo,monospace]",
          className,
        )}
        style={{ ...layoutVars, ...style }}
        {...props}
      >
        {badge || title || description ? (
          <div className="flex flex-col items-center text-center">
            {badge ? (
              <div className={cn("mb-3 rounded-full bg-[#373737]/4 px-3.5 py-1 text-[#656565] dark:bg-white/6 dark:text-[#8f8f8f]", MONO_LABEL)}>
                {badge}
              </div>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "mb-9 px-4 text-[42px]/[46px] font-medium tracking-[-0.66px] text-[#141414] @3xl:text-[64px]/[72px] @3xl:tracking-[-0.96px] @5xl:mb-14 dark:text-[#ededed]",
                  DISPLAY_FONT,
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mb-9 max-w-[628px] px-3.5 text-base/[26px] text-[#656565] @3xl:mb-[72px] [&_b]:font-bold [&_b]:text-[#141414] [&_strong]:font-bold [&_strong]:text-[#141414] dark:text-[#8f8f8f] dark:[&_b]:text-[#ededed] dark:[&_strong]:text-[#ededed]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {hasNumericPrice ? (
          <div className="mb-9 flex justify-center px-4 @5xl:mb-14">
            <BillingSwitch
              value={activeBilling}
              onChange={selectBilling}
              labels={billingLabels}
              discountLabel={yearlyDiscountLabel}
            />
          </div>
        ) : null}

        <div
          className={cn(
            "grid grid-cols-1 gap-4 @2xl:grid-cols-[repeat(var(--pricing-tiers-columns),minmax(0,360px))] @2xl:justify-center @2xl:gap-2.5 @5xl:gap-6",
            COLUMN_WIDTH,
          )}
        >
          {tiers.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billing={activeBilling}
              currency={currency}
              formatter={formatter}
              periodLabel={periodLabel}
              {...revealProps(animateIn, index * 0.06)}
            />
          ))}
        </div>

        {enterprise ? (
          <motion.div
            className={cn("mt-6 @2xl:mt-2.5 @5xl:mt-6", COLUMN_WIDTH)}
            {...revealProps(animateIn, tiers.length * 0.06)}
          >
            <EnterpriseRow enterprise={enterprise} stacked={columns === 1} />
          </motion.div>
        ) : null}
      </section>
    </MotionConfig>
  );
}

interface BillingSwitchProps {
  value: PricingTiersBilling;
  onChange: (value: PricingTiersBilling) => void;
  labels: Record<PricingTiersBilling, React.ReactNode>;
  discountLabel: React.ReactNode | null;
}

function BillingSwitch({ value, onChange, labels, discountLabel }: BillingSwitchProps) {
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = BILLING_CYCLES.indexOf(value);
    const last = BILLING_CYCLES.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        next = current === 0 ? last : current - 1;
        break;
      case "ArrowRight":
      case "ArrowDown":
        next = current === last ? 0 : current + 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(BILLING_CYCLES[next]);
    optionRefs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      onKeyDown={onKeyDown}
      className="relative flex w-full max-w-[326px] rounded-[10px] bg-[#373737]/4 p-[3px] dark:bg-white/6"
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-[3px] top-[3px] h-[calc(100%-6px)] w-[calc(50%-3px)] rounded-[6px] bg-white",
          "shadow-[0_1px_1px_-0.5px_rgba(0,0,0,0.03),0_3px_3px_-1.5px_rgba(0,0,0,0.02),0_6px_6px_-3px_rgba(0,0,0,0.04),0_12px_12px_-3px_rgba(0,0,0,0.06)]",
          "dark:bg-[#262626] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_1px_1px_-0.5px_rgba(0,0,0,0.3),0_3px_3px_-1.5px_rgba(0,0,0,0.25),0_6px_6px_-3px_rgba(0,0,0,0.3),0_12px_12px_-3px_rgba(0,0,0,0.35)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
          value === "yearly" && "translate-x-full",
        )}
      />
      {BILLING_CYCLES.map((cycle, index) => {
        const active = cycle === value;
        return (
          <button
            key={cycle}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(cycle)}
            className={cn(
              "relative min-w-0 flex-1 cursor-pointer rounded-xl px-3 py-2.5 text-center text-sm/[21px] outline-none transition-colors duration-300 ease-[cubic-bezier(0.6,0.6,0,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0335fc]",
              active
                ? "font-medium text-[#141414] dark:text-[#ededed]"
                : "text-[#656565] hover:text-[#141414] dark:text-[#8f8f8f] dark:hover:text-[#ededed]",
            )}
          >
            {labels[cycle]}
            {cycle === "yearly" && discountLabel != null ? (
              <span className="ml-1 rounded-full bg-[#e1ecff] px-2 py-1 text-xs/[18px] font-medium text-[#0335fc] dark:bg-[#0335fc]/22 dark:text-[#8ea6ff]">
                {discountLabel}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface TierCardProps extends React.ComponentProps<typeof motion.article> {
  tier: PricingTier;
  billing: PricingTiersBilling;
  currency: string;
  formatter: Intl.NumberFormat;
  periodLabel: React.ReactNode;
}

function TierCard({ tier, billing, currency, formatter, periodLabel, className, ...props }: TierCardProps) {
  const tone: Tone = tier.featured ? "dark" : "light";
  const styles = TONES[tone];
  const fixedLabel = typeof tier.price === "string" ? tier.price : null;
  const amount = typeof tier.price === "string" ? null : tier.price[billing];

  return (
    <motion.article className={cn("flex flex-col rounded-3xl p-1", styles.card, className)} {...props}>
      <header className={cn("mb-8 rounded-[20px] @2xl:mb-5 @5xl:mb-8", PANEL_SPACING, styles.panel)}>
        <h3
          className={cn(
            "mb-3 text-2xl/8 font-medium tracking-[-0.24px] @2xl:mb-2 @2xl:text-xl/7 @5xl:mb-3 @5xl:text-2xl/8",
            DISPLAY_FONT,
            styles.name,
          )}
        >
          {tier.name}
        </h3>
        {tier.description ? (
          <p className={cn("text-sm/[22px] @2xl:text-[13px]/5 @5xl:text-sm/[22px]", styles.muted)}>
            {tier.description}
          </p>
        ) : null}
      </header>

      <div className={BODY_SPACING}>
        <div className="mb-6 flex items-end gap-[9px] @2xl:mb-4 @5xl:mb-6">
          <span
            className={cn(
              "relative inline-flex text-5xl/[52px] font-medium tracking-[-0.72px] [font-feature-settings:'ss02','ss05','ss10','ss11'] @2xl:text-[34px]/10 @5xl:text-5xl/[52px]",
              DISPLAY_FONT,
              styles.price,
            )}
          >
            {amount === null ? (
              fixedLabel
            ) : (
              <RollingValue amount={amount} text={`${currency}${formatter.format(amount)}`} />
            )}
          </span>
          {amount === null ? null : (
            <motion.span
              layout="position"
              transition={ROLL_TRANSITION}
              className={cn("mb-2 text-sm/[22px] @2xl:mb-1.5 @2xl:text-[13px]/5 @5xl:mb-2 @5xl:text-sm/[22px]", styles.muted)}
            >
              {periodLabel}
            </motion.span>
          )}
        </div>

        <PricingTiersButton action={tier.cta} variant={tier.featured ? "primary" : "light"} />

        <DottedRule className={cn("my-[31px] @2xl:my-5 @5xl:my-[31px]", styles.divider)} />

        {tier.featuresLabel ? (
          <div className={cn("mb-6 @2xl:mb-4 @5xl:mb-6", MONO_LABEL, styles.muted)}>{tier.featuresLabel}</div>
        ) : null}

        <FeatureList features={tier.features} tone={tone} />
      </div>
    </motion.article>
  );
}

interface EnterpriseRowProps {
  enterprise: PricingTiersEnterprise;
  /** Keep the narrow-container layout, e.g. under a single 360px tier. */
  stacked: boolean;
}

function EnterpriseRow({ enterprise, stacked }: EnterpriseRowProps) {
  const styles = TONES.light;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[20px] p-1",
        styles.card,
        !stacked && "@2xl:flex-row @2xl:gap-2.5 @5xl:gap-6",
      )}
    >
      <div className={cn("rounded-[18px]", !stacked && "@2xl:w-1/3", PANEL_SPACING, styles.panel)}>
        <h3
          className={cn(
            "mb-3 text-2xl/8 font-medium tracking-[-0.24px] @2xl:mb-2 @2xl:text-xl/7 @5xl:mb-3 @5xl:text-2xl/8",
            DISPLAY_FONT,
            styles.name,
          )}
        >
          {enterprise.name}
        </h3>
        {enterprise.description ? (
          <p
            className={cn(
              "text-sm/[22px] @2xl:text-[13px]/5 @5xl:text-sm/[22px]",
              !stacked && "@2xl:mb-4 @5xl:mb-6",
              styles.muted,
            )}
          >
            {enterprise.description}
          </p>
        ) : null}
        {stacked ? null : (
          <PricingTiersButton action={enterprise.cta} variant="gray" className="hidden @2xl:block" />
        )}
      </div>

      <div className={cn("p-9 @2xl:p-5 @5xl:p-9", !stacked && "@2xl:w-2/3")}>
        <PricingTiersButton action={enterprise.cta} variant="gray" className={cn(!stacked && "@2xl:hidden")} />
        <DottedRule
          className={cn("my-[31px]", stacked ? "@2xl:my-5 @5xl:my-[31px]" : "@2xl:hidden", styles.divider)}
        />
        {enterprise.featuresLabel ? (
          <div className={cn("mb-6", stacked ? "@2xl:mb-4 @5xl:mb-6" : "@2xl:hidden", MONO_LABEL, styles.muted)}>
            {enterprise.featuresLabel}
          </div>
        ) : null}
        <FeatureList features={enterprise.features} tone="light" columns={!stacked} />
      </div>
    </div>
  );
}

function RollingValue({ amount, text }: { amount: number; text: string }) {
  const reduceMotion = useReducedMotion();
  const [previous, setPrevious] = React.useState(amount);
  const [direction, setDirection] = React.useState(1);

  // Roll up when the price rises and down when it drops, like an odometer.
  if (amount !== previous) {
    setDirection(amount > previous ? 1 : -1);
    setPrevious(amount);
  }

  const offset = reduceMotion ? 0 : direction;

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={offset}>
      <motion.span
        key={text}
        custom={offset}
        variants={ROLL}
        initial="enter"
        animate="center"
        exit="exit"
        transition={ROLL_TRANSITION}
        className="inline-block"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

interface PricingTiersButtonProps {
  action: PricingTiersAction;
  variant: ActionVariant;
  className?: string;
}

function PricingTiersButton({ action, variant, className }: PricingTiersButtonProps) {
  const classes = cn(ACTION_BASE, ACTION_VARIANTS[variant], className);
  const label = (
    <span
      className={cn(
        "flex items-center justify-center gap-1",
        variant !== "light" && "bg-linear-to-b from-white to-white/80 bg-clip-text text-transparent",
        variant === "gray" && "dark:bg-none dark:text-[#141414]",
      )}
    >
      {action.label}
    </span>
  );

  if (action.href !== undefined) {
    return (
      <a href={action.href} onClick={action.onClick} className={classes}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={classes}>
      {label}
    </button>
  );
}

function DottedRule({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={cn("block h-0.5 w-full overflow-visible", className)} fill="none">
      <line
        x1="0.75"
        x2="100%"
        y1="1.25"
        y2="1.25"
        stroke="currentColor"
        strokeDasharray="0.01 6"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

interface FeatureListProps {
  features: PricingTiersFeature[];
  tone: Tone;
  /** Two columns from @2xl, as in the enterprise row. */
  columns?: boolean;
}

function FeatureList({ features, tone, columns = false }: FeatureListProps) {
  const styles = TONES[tone];

  return (
    <ul
      className={cn(
        columns
          ? "grid grid-cols-1 gap-x-1 gap-y-4 @2xl:grid-cols-2 @2xl:gap-y-3 @5xl:gap-y-4"
          : "flex flex-col gap-4 @2xl:gap-3 @5xl:gap-4",
      )}
    >
      {features.map((feature, index) => (
        <li key={index} className={cn("flex gap-3 @2xl:gap-2 @5xl:gap-3", styles.icon)}>
          {feature.icon ? (
            <span
              aria-hidden
              className="flex size-[22px] shrink-0 items-center justify-center @2xl:size-[18px] @5xl:size-[22px] [&>svg]:size-full"
            >
              {feature.icon}
            </span>
          ) : null}
          <span
            className={cn(
              "text-sm/[22px] @2xl:text-[13px]/[18px] @5xl:text-sm/[22px]",
              "[&_b]:font-medium [&_b]:tracking-[-0.14px] [&_strong]:font-medium [&_strong]:tracking-[-0.14px]",
              styles.feature,
            )}
          >
            {feature.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default PricingTiers;
