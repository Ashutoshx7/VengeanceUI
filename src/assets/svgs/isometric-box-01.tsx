"use client";

import React from "react";

export interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export default function IsometricBox01({ className = "", ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Glow / Backdrop filter */}
      <g opacity="0.15">
        <polygon points="120,20 210,70 120,120 30,70" fill="currentColor" className="text-neutral-400 dark:text-neutral-600" />
      </g>
      
      {/* Top Face */}
      <polygon
        points="120,30 200,75 120,120 40,75"
        fill="currentColor"
        className="text-neutral-100 dark:text-neutral-800"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Top Grid Lines */}
      <path
        d="M80,52.5 L160,97.5 M160,52.5 L80,97.5 M100,41.25 L180,86.25 M140,41.25 L60,86.25"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.3"
        className="text-neutral-400 dark:text-neutral-500"
      />

      {/* Left Face */}
      <polygon
        points="40,75 120,120 120,180 40,135"
        fill="currentColor"
        className="text-neutral-200 dark:text-neutral-900"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Right Face */}
      <polygon
        points="120,120 200,75 200,135 120,180"
        fill="currentColor"
        className="text-neutral-300 dark:text-neutral-950"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Accent edge highlight */}
      <path
        d="M120,30 L200,75 M120,30 L40,75 M120,30 L120,120"
        stroke="currentColor"
        strokeWidth="2"
        className="text-neutral-400 dark:text-neutral-600"
      />
    </svg>
  );
}
