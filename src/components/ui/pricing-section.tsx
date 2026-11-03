"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, type Transition } from "framer-motion";
import {
  Bell,
  ChartBar,
  ChartLineUp,
  DeviceMobile,
  Eye,
  Folder,
  Headphones,
  Lightbulb,
  Monitor,
  SlidersHorizontal,
  Smiley,
  Sparkle,
  SquaresFour,
  Star,
  Tag,
  Toolbox,
  UsersThree,
} from "@phosphor-icons/react";

export type BillingCycle = "monthly" | "annually";

export interface PricingFeature {
  label: string;
  /** Any icon element, e.g. <ChartLineUp weight="fill" />. Sized to 16px. */
  icon?: React.ReactNode;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  /** Numeric prices per month for each cycle, or a label such as "Custom". */
  price: { monthly: number; annually: number } | string;
  /** Any CSS color. Tints the card border, glow, and plan icon. */
  accent?: string;
  /** Strength of the accent wash, 0–1. Darker accents such as blue need more. */
  glow?: number;
  /** Highlights the card and gives it the primary call to action. */
  featured?: boolean;
  badge?: string;
  cta: { label: string; href?: string; onClick?: () => void };
  features: PricingFeature[];
}

export interface PricingSectionProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title"> {
  badge?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  plans?: PricingPlan[];
  /** Controlled billing cycle. */
  billing?: BillingCycle;
  defaultBilling?: BillingCycle;
  onBillingChange?: (billing: BillingCycle) => void;
  billingLabels?: Record<BillingCycle, string>;
  /** Small chip next to the annual option, e.g. "-20%". Hidden by default. */
  annualDiscountLabel?: string | null;
  currency?: string;
  periodLabel?: string;
  featuresLabel?: string;
  footnote?: React.ReactNode;
}

export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    description: "For beginners to explore our platform and start their investment journey.",
    price: { monthly: 0, annually: 0 },
    accent: "#4f6bff",
    glow: 1,
    cta: { label: "Start for Free" },
    features: [
      { label: "Track up to 5 stocks", icon: <ChartLineUp weight="fill" /> },
      { label: "Access to real-time stock prices", icon: <Monitor weight="fill" /> },
      { label: "Mobile access for tracking on-the-go", icon: <DeviceMobile weight="fill" /> },
      { label: "Basic investment insights", icon: <Lightbulb weight="fill" /> },
      { label: "Limited watchlist management", icon: <Eye weight="fill" /> },
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "For active investors who want advanced tools to grow their portfolio.",
    price: { monthly: 80, annually: 64 },
    accent: "#b4b4bb",
    featured: true,
    badge: "Popular",
    cta: { label: "Start Free 7 Days Trial" },
    features: [
      { label: "Track unlimited stocks", icon: <ChartLineUp weight="fill" /> },
      { label: "Advanced analytics and reporting", icon: <ChartBar weight="fill" /> },
      { label: "Custom alerts for price movements", icon: <Bell weight="fill" /> },
      { label: "Expert-curated stock picks", icon: <SlidersHorizontal weight="fill" /> },
      { label: "Priority support assistance", icon: <Headphones weight="fill" /> },
      { label: "Export data to CSV/PDF", icon: <Folder weight="fill" /> },
    ],
  },
  {
    id: "advance",
    name: "Advance Plan",
    description: "For institutions or high-net-worth individuals seeking tailored solutions.",
    price: "Custom",
    accent: "#34b553",
    cta: { label: "Contact Us" },
    features: [
      { label: "Dedicated account manager", icon: <Smiley weight="fill" /> },
      { label: "Customizable investment tools", icon: <Toolbox weight="fill" /> },
      { label: "Integration with third-party apps", icon: <SquaresFour weight="fill" /> },
      { label: "Advanced AI-driven insights", icon: <Sparkle weight="fill" /> },
      { label: "Team collaboration tools", icon: <UsersThree weight="fill" /> },
    ],
  },
];

const DEFAULT_BILLING_LABELS: Record<BillingCycle, string> = {
  monthly: "Bill Monthly",
  annually: "Bill Annually",
};

const BILLING_CYCLES: BillingCycle[] = ["monthly", "annually"];

// Short, stiff springs keep every switch under ~250ms so the UI feels instant.
const SNAPPY: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 };
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Masks an element down to a 1px ring so its background becomes a gradient border.
const RING_MASK: React.CSSProperties = {
  padding: 1,
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PricingSection({
  badge = "Pricing",
  title = "Plans and Pricing",
  description = "Choose a plan that fits your investment goals, whether you're just starting or scaling your portfolio.",
  plans = DEFAULT_PRICING_PLANS,
  billing,
  defaultBilling = "monthly",
  onBillingChange,
  billingLabels = DEFAULT_BILLING_LABELS,
  annualDiscountLabel = null,
  currency = "$",
  periodLabel = "/month",
  featuresLabel = "Stand out features",
  footnote = "Start your journey risk free - No credit card needed",
  className,
  ...props
}: PricingSectionProps) {
  const [internalBilling, setInternalBilling] = React.useState<BillingCycle>(defaultBilling);
  const activeBilling = billing ?? internalBilling;

  const setBilling = React.useCallback(
    (next: BillingCycle) => {
      if (billing === undefined) setInternalBilling(next);
      onBillingChange?.(next);
    },
    [billing, onBillingChange],
  );

  return (
    <MotionConfig reducedMotion="user">
      <section
        className={cx(
          // Theme tokens consumed by the card layers below.
          "[--ps-lit:#18181b] dark:[--ps-lit:#ffffff] [--ps-edge-top:rgba(0,0,0,0.1)] [--ps-edge-bottom:rgba(0,0,0,0.055)] [--ps-glow:22%] [--ps-glow-soft:8%] [--ps-dot:rgba(0,0,0,0.035)] [--ps-orb:rgba(0,0,0,0.022)]",
          "dark:[--ps-edge-top:rgba(255,255,255,0.035)] dark:[--ps-edge-bottom:rgba(255,255,255,0.018)] dark:[--ps-glow:48%] dark:[--ps-glow-soft:17%] dark:[--ps-dot:rgba(255,255,255,0.03)] dark:[--ps-orb:rgba(255,255,255,0.025)]",
          "@container relative isolate w-full overflow-hidden bg-[#fafafa] px-4 py-16 text-zinc-950 sm:px-6 sm:py-20 dark:bg-black dark:text-white",
          className,
        )}
        {...props}
      >
        {/* Top spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(50%_70%_at_50%_0%,rgba(0,0,0,0.045),transparent_75%)] dark:bg-[radial-gradient(50%_70%_at_50%_0%,rgba(255,255,255,0.075),transparent_75%)]"
        />
        {/* Film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-multiply dark:opacity-[0.045] dark:mix-blend-normal"
          style={{ backgroundImage: NOISE }}
        />

        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="flex flex-col items-center text-center"
          >
            {badge && (
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 text-[10px] font-medium uppercase tracking-[0.06em] text-zinc-600 shadow-sm dark:border-white/10 dark:bg-[#1e1e1e] dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Tag weight="fill" className="size-3 text-zinc-400" aria-hidden />
                {badge}
              </span>
            )}
            <h2 className="mt-5 bg-gradient-to-b from-zinc-950 to-zinc-700 bg-clip-text text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-transparent [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.08))] @xl:text-5xl @4xl:text-[60px] dark:from-white dark:to-[#d0d0d0] dark:[filter:drop-shadow(0_3px_6px_rgba(0,0,0,0.7))]">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-[480px] text-sm @4xl:max-w-[520px] leading-[1.55] text-zinc-500 @4xl:text-[15px] dark:text-[#a6a5a6]">
                {description}
              </p>
            )}
          </motion.header>

          <BillingToggle
            value={activeBilling}
            onChange={setBilling}
            labels={billingLabels}
            discountLabel={annualDiscountLabel}
          />

          <div className="mt-9 grid w-full max-w-sm grid-cols-1 items-start gap-5 @[36rem]:max-w-none @[36rem]:grid-cols-3 @[36rem]:gap-3 @4xl:gap-6">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={index}
                billing={activeBilling}
                currency={currency}
                periodLabel={periodLabel}
                featuresLabel={featuresLabel}
              />
            ))}
          </div>

          {footnote && (
            <p className="mt-11 text-center text-[13px] text-zinc-500 @4xl:text-sm dark:text-[#8b8b8d]">{footnote}</p>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}

function BillingToggle({
  value,
  onChange,
  labels,
  discountLabel,
}: {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  labels: Record<BillingCycle, string>;
  discountLabel?: string | null;
}) {
  const pillId = React.useId();
  const refs = React.useRef<Record<BillingCycle, HTMLButtonElement | null>>({ monthly: null, annually: null });

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const index = BILLING_CYCLES.indexOf(value);
    const next =
      event.key === "Home"
        ? BILLING_CYCLES[0]
        : event.key === "End"
          ? BILLING_CYCLES[BILLING_CYCLES.length - 1]
          : BILLING_CYCLES[
              (index + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) + BILLING_CYCLES.length) %
                BILLING_CYCLES.length
            ];
    onChange(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Billing cycle"
      onKeyDown={onKeyDown}
      className="mt-8 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:border-white/[0.06] dark:bg-[#1c1c1c] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.04)]"
    >
      {BILLING_CYCLES.map((cycle) => {
        const active = cycle === value;
        return (
          <button
            key={cycle}
            ref={(node) => {
              refs.current[cycle] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            // Commit on press, not release, so the pill starts moving instantly.
            onPointerDown={(event) => {
              if (event.button === 0 && event.pointerType === "mouse") onChange(cycle);
            }}
            onClick={() => onChange(cycle)}
            className={cx(
              "relative inline-flex h-[26px] items-center gap-1.5 rounded-full px-3 text-[11px] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-white/40",
              active
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={SNAPPY}
                className="absolute inset-0 rounded-full border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#323234,#252527)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_6px_rgba(0,0,0,0.5)]"
              />
            )}
            <span className="relative">{labels[cycle]}</span>
            {cycle === "annually" && discountLabel && (
              <span className="relative rounded-full bg-emerald-500/15 px-1.5 py-px text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {discountLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PricingCard({
  plan,
  index,
  billing,
  currency,
  periodLabel,
  featuresLabel,
}: {
  plan: PricingPlan;
  index: number;
  billing: BillingCycle;
  currency: string;
  periodLabel: string;
  featuresLabel: string;
}) {
  const accent = plan.accent ?? "#a1a1aa";
  // Border light from the top-left corner. Three stops with no plateau give a
  // smooth falloff; the featured card gets a soft near-white wash, the others
  // a muted wash of their accent.
  const light = plan.featured
    ? "color-mix(in oklab, var(--accent) 12%, var(--ps-lit))"
    : "var(--accent)";
  const strength = plan.featured ? [80, 42] : [40, 24];
  // Strongest at the top-left corner, gone by ~60% across the top and ~40%
  // down the side. Values measured off the reference screenshots.
  const borderLight = `radial-gradient(60% 38% at 0% 0%, color-mix(in oklab, ${light} ${strength[0]}%, transparent) 0%, color-mix(in oklab, ${light} ${strength[1]}%, transparent) 45%, transparent 100%)`;

  // Cursor spotlight via CSS variables: no React re-render on pointer move.
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.06 * index }}
      onPointerMove={onPointerMove}
      style={{ "--accent": accent } as React.CSSProperties}
      className={cx(
        "group/card relative isolate flex flex-col overflow-hidden rounded-3xl p-6 @[36rem]:rounded-[20px] @[36rem]:p-4 @4xl:rounded-3xl @4xl:p-7",
        "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(0,0,0,0.18)]",
        // Dark outer hairline + faint inner top highlight read as a soft bevel.
        "dark:shadow-[0_0_0_1px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.025),0_30px_60px_-28px_rgba(0,0,0,0.85)]",
        plan.featured
          ? "dark:bg-[linear-gradient(180deg,#1e1e20,#1b1b1d)]"
          : "dark:bg-[linear-gradient(180deg,#1c1c1e,#19191b)]",
      )}
    >
      {/* Accent wash across the top, weighted to the left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: plan.glow ?? 0.72,
          background:
            "radial-gradient(90% 130px at 16% 0%, color-mix(in oklab, var(--accent) var(--ps-glow), transparent) 0%, color-mix(in oklab, var(--accent) var(--ps-glow-soft), transparent) 50%, transparent 100%)",
        }}
      />
      {/* Halftone dots inside the glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, var(--ps-dot) 0.7px, transparent 1.1px)",
          backgroundSize: "3px 3px",
          WebkitMaskImage: "radial-gradient(55% 32% at 0% 0%, #000, transparent 80%)",
          maskImage: "radial-gradient(55% 32% at 0% 0%, #000, transparent 80%)",
        }}
      />
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--accent) 10%, transparent), transparent 70%)",
        }}
      />
      {/* Half-lit orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[7%] top-3 -z-10 aspect-square w-[33%] rounded-full border border-[var(--ps-orb)]"
        style={{
          background: "linear-gradient(90deg, var(--ps-orb), color-mix(in oklab, var(--ps-orb) 60%, transparent) 50%, transparent 50%)",
        }}
      />
      {/* Gradient border: a top-lit hairline with a soft corner light that
          brightens slightly on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-85 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          ...RING_MASK,
          background: `${borderLight}, linear-gradient(180deg, var(--ps-edge-top), var(--ps-edge-bottom))`,
        }}
      />

      <div className="flex h-[22px] items-center justify-between">
        <PlanIcon />
        {plan.badge && (
          <span className="inline-flex h-[22px] items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-zinc-700 dark:border-white/[0.12] dark:bg-[linear-gradient(180deg,#333335,#2a2a2c)] dark:text-[#f2f2f4] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_6px_rgba(0,0,0,0.4)]">
            <Star weight="fill" className="size-2.5 text-zinc-500 dark:text-zinc-300" aria-hidden />
            {plan.badge}
          </span>
        )}
      </div>

      <h3 className="mt-7 text-base font-medium tracking-[0.005em] text-zinc-950 @[36rem]:mt-5 @[36rem]:text-sm @4xl:mt-7 @4xl:text-base dark:text-white">
        {plan.name}
      </h3>

      <Price price={plan.price} billing={billing} currency={currency} periodLabel={periodLabel} />

      <p className="mt-4 min-h-[2lh] text-sm leading-[1.55] text-zinc-500 @[36rem]:text-xs @4xl:text-[13.5px] dark:text-[#9c9c9e]">
        {plan.description}
      </p>

      <PlanCta plan={plan} />

      <div className="mt-8 flex items-center gap-3 @[36rem]:mt-6 @4xl:mt-8" aria-hidden>
        <span className="h-px flex-1 bg-zinc-200 dark:bg-white/[0.08]" />
        <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.02em] text-zinc-400 dark:text-[#757477]">
          {featuresLabel}
        </span>
        <span className="h-px flex-1 bg-zinc-200 dark:bg-white/[0.08]" />
      </div>

      <ul
        className="mt-7 space-y-[18px] @[36rem]:mt-5 @[36rem]:space-y-3 @4xl:mt-7 @4xl:space-y-[18px]"
        aria-label={`${plan.name} features`}
      >
        {plan.features.map(({ label, icon }) => (
          <li
            key={label}
            className="flex items-start gap-3 text-sm leading-5 text-zinc-800 @[36rem]:gap-2 @[36rem]:text-xs @[36rem]:leading-4 @4xl:gap-3 @4xl:text-[13.5px] @4xl:leading-5 dark:text-[#ececed]"
          >
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-zinc-400 @[36rem]:mt-0 @4xl:mt-0.5 dark:text-[#7a7a7e] [&>svg]:size-4"
            >
              {icon ?? <Sparkle weight="fill" />}
            </span>
            {label}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function PlanIcon() {
  return (
    <span
      aria-hidden
      className="relative block size-[22px] rounded-[5px]"
      style={{
        // Gel tile lit from the top-left: pale highlight fading to a saturated
        // lower-right, a crisp top rim, a small drop shadow and a faint halo.
        background:
          "radial-gradient(130% 130% at 28% 22%, color-mix(in oklab, var(--accent) 48%, white) 0%, color-mix(in oklab, var(--accent) 60%, white) 36%, color-mix(in oklab, var(--accent) 88%, white) 66%, color-mix(in oklab, var(--accent) 92%, black) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 1px color-mix(in oklab, var(--accent) 50%, black), 0 0 10px color-mix(in oklab, var(--accent) 30%, transparent), 0 4px 10px rgba(0,0,0,0.6)",
      }}
    />
  );
}

function Price({
  price,
  billing,
  currency,
  periodLabel,
}: {
  price: PricingPlan["price"];
  billing: BillingCycle;
  currency: string;
  periodLabel: string;
}) {
  const numberClass =
    "text-[40px] font-normal leading-none tracking-[-0.02em] @[36rem]:text-[30px] @4xl:text-[40px]";

  if (typeof price === "string") {
    return (
      <p className={cx("mt-5 flex h-10 items-baseline text-zinc-950 dark:text-white", numberClass)}>{price}</p>
    );
  }

  const amount = price[billing];
  // Annual is cheaper, so the new number rolls up; switching back rolls it down.
  const direction = billing === "annually" ? 1 : -1;

  return (
    <p className="mt-5 flex h-10 items-baseline text-zinc-950 dark:text-white">
      <span className={numberClass}>{currency}</span>
      <span className={cx("relative inline-flex overflow-hidden tabular-nums", numberClass)}>
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.span
            key={amount}
            custom={direction}
            variants={{
              enter: (d: number) => ({ y: `${d * 60}%`, opacity: 0, filter: "blur(4px)" }),
              center: { y: "0%", opacity: 1, filter: "blur(0px)" },
              exit: (d: number) => ({ y: `${d * -60}%`, opacity: 0, filter: "blur(4px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="inline-block"
          >
            {amount.toLocaleString("en-US")}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-0.5 text-base text-zinc-500 @[36rem]:text-sm @4xl:text-base dark:text-[#8f9193]">
        {periodLabel}
      </span>
    </p>
  );
}

function PlanCta({ plan }: { plan: PricingPlan }) {
  const className = cx(
    "mt-8 inline-flex h-[38px] w-full items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium outline-none transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] @[36rem]:mt-6 @[36rem]:text-xs @4xl:mt-8 @4xl:text-sm",
    "focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#1c1c1e]",
    plan.featured
      ? "bg-zinc-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.2)] dark:bg-[linear-gradient(180deg,#f7f7f7_0%,#e9e9e9_55%,#cdcdcd_100%)] dark:text-[#111] dark:shadow-[inset_0_1px_0_#fff,inset_0_-1px_0_rgba(0,0,0,0.12),0_4px_16px_-6px_rgba(255,255,255,0.3)] dark:hover:brightness-105"
      : "border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-white/[0.07] dark:bg-[linear-gradient(180deg,#373739,#313133)] dark:text-[#f4f4f5] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.45)]",
  );

  if (plan.cta.href) {
    return (
      <a href={plan.cta.href} onClick={plan.cta.onClick} className={className}>
        {plan.cta.label}
      </a>
    );
  }

  return (
    <button type="button" onClick={plan.cta.onClick} className={className}>
      {plan.cta.label}
    </button>
  );
}

export default PricingSection;
