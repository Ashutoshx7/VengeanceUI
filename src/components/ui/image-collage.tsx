"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CollageImage {
  src: string;
  x: number;
  y: number;
  rotate: number;
  alt?: string;
}

export interface ImageCollageProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CollageImage[];
  containerClassName?: string;
  imageClassName?: string;
}

export const ImageCollage = React.forwardRef<HTMLDivElement, ImageCollageProps>(
  (
    {
      images,
      className,
      containerClassName,
      imageClassName,
      onClick,
      onKeyDown,
      "aria-label": ariaLabel = "Toggle image collage layout",
      ...props
    },
    ref
  ) => {
    const [isOrganized, setIsOrganized] = useState(false);

    const toggleLayout = () => {
      setIsOrganized((prev) => !prev);
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-col items-center justify-center gap-12 select-none w-full min-h-[400px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
          className
        )}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-pressed={isOrganized}
        onClick={(event) => {
          toggleLayout();
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            toggleLayout();
          }
        }}
      >
        <div className="text-zinc-800 dark:text-zinc-200 text-xl font-medium tracking-tight">
          Click or press Enter to toggle the layout
        </div>
        
        <motion.div className={cn("h-40 flex items-center justify-center", containerClassName)}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-24 sm:w-32 shrink-0 aspect-[4/5]",
                !isOrganized && "shadow-lg",
                imageClassName
              )}
              initial={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", bounce: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: isOrganized ? 0 : img.x,
                y: isOrganized ? 0 : img.y,
                rotate: isOrganized ? 0 : img.rotate,
                zIndex: isOrganized ? 1 : i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt || `Collage image ${i}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }
);

ImageCollage.displayName = "ImageCollage";
