"use client";

import * as React from "react";
import Container from "@/components/container";
import { cn } from "@/lib/utils";

export interface TeamRevealMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  imagePosition?: string;
  expertise: string;
}

export interface TeamRevealGridProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title"> {
  title?: string;
  members?: readonly TeamRevealMember[];
  className?: string;
}

const DEFAULT_MEMBERS: readonly TeamRevealMember[] = [
  {
    id: "subh",
    name: "Aizen",
    role: "Web3 Lead",
    image: "/avatars/aizen.jpg",
    imagePosition: "center top",
    expertise: "Mastermind architect. Controls grand protocol vision and high-speed execution.",
  },
  {
    id: "narsi",
    name: "Batman",
    role: "Infrastructure Engineer",
    image: "/avatars/batmaaanji.jpg",
    imagePosition: "center top",
    expertise: "Infrastructure sentinel. Operates in the dark to guarantee zero downtime.",
  },
  {
    id: "ashwani",
    name: "Johan",
    role: "Backend Engineer",
    image: "/avatars/johan.jpg",
    imagePosition: "center top",
    expertise: "Backend architect. Builds silent, ultra-precise distributed database systems.",
  },
  {
    id: "ujjwal",
    name: "Shinji",
    role: "AI/ML Engineer",
    image: "/avatars/shinji.jpg",
    imagePosition: "center 30%",
    expertise: "Inverted AI engineer. Flips complex neural models and pipelines inside out.",
  },
  {
    id: "naman",
    name: "Kaname",
    role: "AI Platform Engineer",
    image: "/avatars/andha-aizen.jpg",
    imagePosition: "center top",
    expertise: "DevOps specialist. Monitors cloud telemetry and logs without needing to look.",
  },
  {
    id: "ashutoshx7",
    name: "Ashutoshx7",
    role: "Design Engineer",
    image: "/avatars/rohit.png",
    imagePosition: "center top",
    expertise: "UI/UX craftsman. Shapes expressive design systems with bold aesthetics.",
  },
];

export function TeamRevealGrid({
  title = "Meet the Team",
  members = DEFAULT_MEMBERS,
  className,
  ...props
}: TeamRevealGridProps) {
  return (
    <section className={cn("py-16 md:py-24 relative z-10 w-full", className)} {...props}>
      <Container className="flex flex-col items-center">
        {/* Header */}
        <h2 className="mb-12 md:mb-16 text-center text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          <span className="relative inline-block">
            <span className="relative z-10">{title}</span>
            <svg
              className="absolute -bottom-4 left-0 w-full h-3 md:h-4 text-red-500"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 2 12 Q 35 2 95 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 5 15 Q 40 18 98 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-x-24 md:gap-y-20">
          {members.map((member, index) => (
            <div key={member.id ?? `${member.name}-${index}`} className="relative">
              {/* Invisible spacer to reserve static layout height */}
              <div
                aria-hidden="true"
                className="invisible flex flex-col items-center text-center"
              >
                <div className="rounded-xl p-1 mb-4 w-30 h-30 md:w-38 md:h-38" />
                <h3 className="text-xl font-bold tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium">{member.role}</p>
              </div>

              {/* Hoverable Card */}
              <div
                tabIndex={0}
                className="group absolute inset-x-0 top-0 z-0 flex flex-col items-center text-center cursor-pointer outline-none hover:z-30 focus-visible:z-30"
              >
                {/* Outer Frame (Frame 1) */}
                <div className="rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 p-1.5 bg-neutral-100/80 dark:bg-neutral-900/80 mb-4 shadow-sm">
                  {/* Inner Frame (Frame 2) */}
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
                    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-500 ease-out grayscale group-hover:grayscale-0"
                        style={{ objectPosition: member.imagePosition ?? "center top" }}
                      />
                    </div>

                    {/* Smooth Grid Rows Reveal */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[grid-template-rows]">
                      <div className="overflow-hidden">
                        <p className="w-28 md:w-36 mx-auto px-1.5 pt-2 pb-2 text-[11px] leading-snug text-neutral-600 dark:text-neutral-300 text-center">
                          {member.expertise}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div className="mt-14 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Component design by{" "}
          <a
            href="https://x.com/rohitmehta_twt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-900 dark:text-neutral-200 underline underline-offset-4 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            @rohitmehta_twt
          </a>
        </div>
      </Container>
    </section>
  );
}

export default TeamRevealGrid;
