"use client";

import Container from "@/components/container";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Headset,
  MapTrifold,
  Hammer,
  Globe,
  Rocket,
  CaretRight,
} from "@phosphor-icons/react";
import IsometricBox01 from "@/assets/svgs/isometric-box-01";
import IsometricBoxes02 from "@/assets/svgs/isometric-boxes-02";
import * as React from "react";
import { cn } from "@/lib/utils";

const DEFAULT_TEAM_AVATARS = [
  "/avatars/aizen.jpg",
  "/avatars/batmaaanji.jpg",
  "/avatars/johan.jpg",
  "/avatars/shinji.jpg",
  "/avatars/andha-aizen.jpg",
  "/avatars/pinky-aizen.jpg",
];

const PIPELINE_STEPS = [
  { id: "01", label: "CALL", Icon: Headset },
  { id: "02", label: "PLAN", Icon: MapTrifold },
  { id: "03", label: "BUILD", Icon: Hammer },
  { id: "04", label: "DEPLOY", Icon: Globe },
  { id: "05", label: "LAUNCH", Icon: Rocket },
];

export interface WhyUsBentoProps {
  className?: string;
  teamAvatars?: (string | any)[];
}

export function WhyUsBento({
  className,
  teamAvatars = DEFAULT_TEAM_AVATARS,
}: WhyUsBentoProps) {
  return (
    <section className={cn("py-12 md:py-20 lg:py-24 relative z-10 w-full", className)}>
      <Container className="flex flex-col gap-16 md:gap-24">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 auto-rows-70">
          {/* 01: AI & Automation (Wide) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-2 row-span-1 rounded-xl bg-white dark:bg-neutral-900 backdrop-blur-md p-8 sm:p-10 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-center shadow-[0_0_0_2px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(221,221,221,1)] dark:shadow-none dark:border dark:border-neutral-800"
          >
            {/* Visual: Isometric Box on the right */}
            <div className="absolute right-4 md:-right-10 top-1/2 -translate-y-1/2 w-48 md:w-90 z-20 hidden sm:block pointer-events-none">
              <IsometricBox01 className="w-full h-auto" />
            </div>

            <div className="relative z-30 w-full sm:w-1/2 md:w-3/5">
              <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3 relative overflow-hidden flex flex-wrap">
                <span className="flex">
                  {"AI & Automation".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-100%" },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
                <span className="absolute inset-0 flex text-red-500 pointer-events-none" aria-hidden>
                  {"AI & Automation".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: 0 },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
                We build AI agents and automated workflows to handle data,
                pipelines, and repetitive tasks, freeing your team to focus on
                what matters.
              </p>
            </div>
          </motion.div>

          {/* 02: Senior Talent (Tall & Dark) */}
          <div className="col-span-1 md:col-span-1 row-span-1 md:row-span-2 rounded-xl border-[1.5px] border-transparent bg-black p-8 sm:p-10 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between text-white">
            {/* Visual: Stacked Cards */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-65 sm:min-h-70 mb-12 translate-x-4">
              <div className="relative w-full max-w-65 aspect-4/3 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 ease-out">
                {/* Back card 4 (Bottom-most) */}
                <div className="absolute inset-0 bg-neutral-500 rounded-xl border border-neutral-600/50 transform -rotate-12 -translate-x-6 translate-y-6 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-20deg] group-hover:-translate-x-10 group-hover:translate-y-10" />
                {/* Back card 3 */}
                <div className="absolute inset-0 bg-neutral-400 rounded-xl border border-neutral-500/50 transform -rotate-9 -translate-x-4 translate-y-4 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-15deg] group-hover:-translate-x-7 group-hover:translate-y-7" />
                {/* Back card 2 */}
                <div className="absolute inset-0 bg-neutral-300 rounded-xl border border-neutral-400/50 transform -rotate-6 -translate-x-2 translate-y-2 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-10deg] group-hover:-translate-x-5 group-hover:translate-y-5" />
                {/* Back card 1 (Just behind front) */}
                <div className="absolute inset-0 bg-neutral-200 rounded-xl border border-neutral-300/50 transform -rotate-3 -translate-x-1 translate-y-1 shadow-xl transition-all duration-300 ease-out group-hover:-rotate-5 group-hover:-translate-x-2.5 group-hover:translate-y-2.5" />

                {/* Front card */}
                <div
                  className="absolute inset-0 bg-neutral-50 rounded-xl p-5 sm:p-6 flex flex-col justify-between text-black shadow-2xl border border-white/50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(0,0,0,0.005) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.01) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                >
                  {/* Minimal Logo / Top left */}
                  <div className="flex gap-0.5">
                    <div className="w-2.5 h-3.5 bg-black rounded-sm" />
                    <div className="w-1.5 h-3.5 bg-black rounded-sm" />
                    <div className="w-2.5 h-3.5 bg-black/30 rounded-sm" />
                  </div>

                  {/* Main Text */}
                  <div className="font-mono text-[22px] sm:text-[26px] font-bold leading-[1.1] tracking-tight mt-auto mb-4">
                    Idea.
                    <br />
                    Architecture.
                    <br />
                    Production.
                  </div>

                  {/* Terminal prompt */}
                  <div className="font-mono text-[9px] sm:text-[10px] text-neutral-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>&gt; READY TO EXECUTE</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                From Idea to Production
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Bring us your idea. We&apos;ll map, build, and deploy it
                end-to-end, then stay on to support you post-launch.
              </p>
            </div>
            {/* Watermark Number */}
            <div className="absolute -right-8 -bottom-16 text-[16rem] font-bold text-neutral-900/40 pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              02
            </div>
          </div>

          {/* 03: Built by Experienced Engineers (Square) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-xl shadow-[0_0_0_2px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(221,221,221,1)] dark:shadow-none bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 p-8 sm:p-10 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-between"
          >
            {/* Stacked avatars */}
            <div className="flex items-center relative z-10 mb-4 h-12">
              {teamAvatars.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-neutral-900 shadow-sm"
                  style={{
                    marginLeft: i === 0 ? 0 : "-12px",
                    zIndex: teamAvatars.length - i,
                  }}
                  variants={{
                    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
                    hover: {
                      x: i * 16,
                      y: i % 2 === 0 ? -6 : 6,
                      rotate: (i - 2) * 8,
                      scale: 1.15,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    bounce: 0,
                  }}
                >
                  <Image
                    src={src}
                    alt="team member"
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                Built by Experienced Engineers
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
                Work directly with senior engineers across AI, backend, and
                Solana from kickoff to launch. No rotating benches.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-10 text-[10rem] font-bold text-neutral-100/40 dark:text-neutral-800/40 pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              03
            </div>
          </motion.div>

          {/* 04: No Handoffs (Square) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-xl shadow-[0_0_0_2px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(221,221,221,1)] dark:shadow-none bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 p-8 sm:p-10 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-between"
          >
            {/* Pipeline visual */}
            <div className="relative z-10 w-full">
              <div className="flex items-start justify-between">
                {PIPELINE_STEPS.map(({ id, label, Icon }, i) => (
                  <React.Fragment key={id}>
                    {/* Step node */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <Icon size={24} weight="fill" className="text-black dark:text-white" />
                        {/* Glow ring on last step only */}
                        {i === PIPELINE_STEPS.length - 1 && (
                          <span className="absolute -inset-1.5 rounded-full bg-black/10 dark:bg-white/20 animate-ping" />
                        )}
                      </div>
                      <span className="text-[8px] text-neutral-800 dark:text-neutral-300 font-mono font-bold tracking-widest">
                        {label}
                      </span>
                    </div>

                    {/* Arrow between steps */}
                    {i < PIPELINE_STEPS.length - 1 && (
                      <motion.div
                        className="mt-1.5"
                        variants={{
                          initial: { color: "#d4d4d4", transition: { duration: 0.2 } },
                          hover: { 
                            color: ["#d4d4d4", "#000000", "#d4d4d4"],
                            transition: {
                              duration: 1.2,
                              times: [0, 0.1, 1],
                              repeat: Infinity,
                              delay: i * 0.3,
                            }
                          }
                        }}
                      >
                        <CaretRight size={12} weight="fill" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                No Handoffs
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
                One team, start to finish. The engineers on your very first call
                are the exact ones shipping your product.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-10 text-[10rem] font-bold text-neutral-100/40 dark:text-neutral-800/40 pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              04
            </div>
          </motion.div>

          {/* 05: Complex Engineering (Wide Bottom) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-3 row-span-1 md:row-span-1 min-h-75 rounded-xl bg-white dark:bg-neutral-900 backdrop-blur-md p-8 sm:p-10 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-center shadow-[0_0_0_2px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(221,221,221,1)] dark:shadow-none dark:border dark:border-neutral-800"
          >
            {/* Visual: Isometric Layered Boxes on the right */}
            <div className="absolute right-4 md:right-12 lg:right-24 bottom-0 w-48 md:w-80 lg:w-96 z-20 hidden sm:block pointer-events-none">
              <IsometricBoxes02 className="w-full h-auto drop-shadow-xs" />
            </div>

            <div className="relative z-30 w-full sm:w-1/2 md:w-3/5">
              <h3 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3">
                Deep Engineering
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed md:max-w-xl">
                Web, mobile, backend, AI, and smart contracts. One cohesive team
                that goes deep on complex engineering.
              </p>
            </div>
            
            {/* Watermark Number */}
            <div className="absolute -right-8 -bottom-16 text-[14rem] font-bold text-neutral-100/40 dark:text-neutral-800/40 pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none z-10">
              05
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default WhyUsBento;
