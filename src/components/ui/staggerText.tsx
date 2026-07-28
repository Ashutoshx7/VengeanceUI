'use client'
import React from "react";
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const;

const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const item = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.6, ease: EASE },
  },
};

const TextAnimation = ({
  children,
  delay = 0,
  divideBy = "word",
}: {
  children: React.ReactNode;
  delay?: number;
  divideBy?: "word" | "letter";
}) => {
  if (typeof children !== "string") {
    if (typeof children === "number" || typeof children === "boolean") {
      children = String(children);
    } else {
      console.warn("TextAnimation only supports plain text/string children.");
      return <>{children}</>;
    }
  }

  const text = children as string;
  const parts =
    divideBy === "letter" ? text.split("") : text.split(" ");
  const stagger = divideBy === "letter" ? 0.02 : 0.05;

  return (
    <motion.span
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      style={{ display: "inline-block" }}
    >
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {divideBy === "word" && i > 0 && " "}
          <span
            className="inline-block overflow-hidden relative"
            style={{ verticalAlign: "top" }}
          >
            <motion.span
              variants={item}
              className="inline-block will-change-transform"
            >
              {divideBy === "letter" && part === " " ? "\u00A0" : part}
            </motion.span>
          </span>
        </React.Fragment>
      ))}
    </motion.span>
  );
};

export default TextAnimation;