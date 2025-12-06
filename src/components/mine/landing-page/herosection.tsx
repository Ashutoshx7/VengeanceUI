"use client";
import { Button } from "@/components/ui/button";
import AnimatedButton from "@/components/ui/animated-button";
import { FlipText } from "@/components/ui/flip-text";
import { ArrowRight, Sparkles } from "lucide-react";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export const HeroSection = () => {
  const container = useRef(null);
  return (
    <div className="relative grid lg:grid-cols-2 grid-cols-1 pt-32 pb-20 min-h-screen w-full gap-12 lg:gap-16 items-center">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 dark:from-black dark:via-black dark:to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-start justify-center space-y-6 max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 dark:bg-black/50 border border-border/50 text-sm text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Vengeance UI Components</span>
        </motion.div>

        <h1 className="text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-foreground">
          Build beautiful interfaces
          <FlipText
            className="block mt-2 ml-2 text-muted-foreground font-normal text-4xl lg:text-5xl"
            delay={0.5}
          >
            with precision and speed
          </FlipText>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-light">
          A carefully crafted React component library for building modern, responsive web applications.
          Every component is designed with attention to detail.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link href={"https://pixelperfect.mintlify.app/"}>
            <AnimatedButton
              className="group font-normal"
              whileHover={{ scale: 1.05 }}
            >
              Explore Components
            </AnimatedButton>
          </Link>
          <Button
            variant={"outline"}
            size="lg"
            className="font-normal"
          >
            Custom Components
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        ref={container}
        className="relative hidden lg:block"
      >
        <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 shadow-sm">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 rounded-xl bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />

          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 h-32 w-32 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center text-sm text-muted-foreground"
            drag
            dragConstraints={container}
            dragElastic={0.2}
          >
            <div className="text-center">
              <div className="text-xs font-medium mb-1">Component</div>
              <div className="text-xs opacity-60">Preview</div>
            </div>
          </motion.div>

          {/* Subtle corner accents */}
          <div className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        </div>
      </motion.div>
    </div>
  );
};
