"use client";
import React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

import AnimatedButton from "@/components/ui/animated-button";
import { FlipText } from "@/components/ui/flip-text";
import { NeutralHeroBackground } from "@/components/mine/landing-page/neutral-hero-background";

export const HeroSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      {/* Background - Neutral Theme Adapts to Light/Dark */}
      <NeutralHeroBackground className="z-0" />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center z-30 relative max-w-4xl"
        >
          {/* Badge - Adaptive Zinc/White Monochrome */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-100 mb-8 backdrop-blur-sm shadow-sm"
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-black dark:text-white">
                <path d="M22 2L12 22L2 2" />
              </svg>
            </motion.div>
            <span className="tracking-widest uppercase text-zinc-500 dark:text-zinc-400">Vengeance UI 2.0</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-400 dark:from-white dark:via-white dark:to-zinc-500 drop-shadow-sm">
              Build beautiful interfaces
            </h1>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-black dark:text-white drop-shadow-2xl">
              <FlipText delay={0.8} together={true} className="text-zinc-700 dark:text-zinc-300">
                with precision and speed
              </FlipText>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light"
          >
            A curated collection of beautifully crafted React components.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-center"
          >
            <Link href="/docs/components-overview">
              <AnimatedButton className="text-sm px-8 py-4">
                Browse Components
              </AnimatedButton>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
