"use client";

import React from "react";

export interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export default function IsometricBoxes02({ className = "", ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Bottom Base Box */}
      <g>
        <polygon points="160,80 270,140 160,200 50,140" fill="currentColor" className="text-neutral-100 dark:text-neutral-900" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="50,140 160,200 160,215 50,155" fill="currentColor" className="text-neutral-300 dark:text-neutral-950" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="160,200 270,140 270,155 160,215" fill="currentColor" className="text-neutral-200 dark:text-neutral-800" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Middle Layer Box */}
      <g>
        <polygon points="160,50 240,95 160,140 80,95" fill="currentColor" className="text-neutral-200 dark:text-neutral-850" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="80,95 160,140 160,165 80,120" fill="currentColor" className="text-neutral-400 dark:text-neutral-950" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="160,140 240,95 240,120 160,165" fill="currentColor" className="text-neutral-300 dark:text-neutral-900" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Top Main Box */}
      <g>
        <polygon points="160,20 210,50 160,80 110,50" fill="currentColor" className="text-neutral-50 dark:text-neutral-800" stroke="currentColor" strokeWidth="1.5" />
        <path d="M135,35 L185,65 M185,35 L135,65" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.3" className="text-neutral-400" />
        <polygon points="110,50 160,80 160,110 110,80" fill="currentColor" className="text-neutral-300 dark:text-neutral-900" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="160,80 210,50 210,80 160,110" fill="currentColor" className="text-neutral-200 dark:text-neutral-950" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Floating Accent Gem / Node */}
      <circle cx="160" cy="18" r="4" fill="currentColor" className="text-red-500 animate-pulse" />
    </svg>
  );
}
