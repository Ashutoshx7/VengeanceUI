"use client";

import StatsCounter from "@/components/ui/stats-counter";

const stats = [
  { value: 250, suffix: "+", label: "Components" },
  { value: 12000, suffix: "+", label: "Downloads" },
  { value: 99, suffix: "%", label: "Satisfaction" },
];

export function StatsCounterDemo() {
  return (
    <div className="grid grid-cols-3 gap-6 py-6 px-4 w-full max-w-md">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1">
          <div className="text-3xl md:text-4xl font-bold text-white">
            <StatsCounter value={stat.value} suffix={stat.suffix} duration={2} />
          </div>
          <span className="text-xs text-zinc-400 text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
