"use client";

import React from "react";
import {
  motion,
  AnimatePresence,
  HTMLMotionProps,
  Variants,
} from "framer-motion";

// Custom editorial cubic bezier easing
export const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface FadeInViewProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  viewportMargin?: string;
}

export function FadeInView({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 20,
  once = true,
  viewportMargin = "-50px",
  ...props
}: FadeInViewProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0 };
      case "down":
        return { opacity: 0, y: -distance, x: 0 };
      case "left":
        return { opacity: 0, x: distance, y: 0 };
      case "right":
        return { opacity: 0, x: -distance, y: 0 };
      case "none":
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: viewportMargin as any }}
      transition={{
        duration,
        delay,
        ease: EDITORIAL_EASE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerGroupProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
  viewportMargin?: string;
}

export function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  viewportMargin = "-50px",
  ...props
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin as any }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className = "",
  distance = 20,
  duration = 0.5,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: EDITORIAL_EASE,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { motion, AnimatePresence };
