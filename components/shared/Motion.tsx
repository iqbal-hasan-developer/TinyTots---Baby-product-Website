"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/animations";

type MotionTag = "div" | "section" | "article";

type MotionProps<Tag extends MotionTag> = HTMLMotionProps<Tag> & {
  reduceTransform?: boolean;
};

function useMotionProps<Tag extends MotionTag>({
  reduceTransform = true,
  initial = "hidden",
  whileInView = "visible",
  viewport = viewportOnce,
  variants = fadeUp,
  ...props
}: MotionProps<Tag>) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion && reduceTransform) {
    return {
      ...props,
      initial: false,
      animate: undefined,
      whileInView: undefined,
      whileHover: undefined,
      whileTap: undefined,
      viewport: undefined,
      variants: undefined,
    };
  }

  return {
    ...props,
    initial,
    whileInView,
    viewport,
    variants,
  };
}

export function MotionDiv(props: MotionProps<"div">) {
  return <motion.div {...useMotionProps(props)} />;
}

export function MotionSection(props: MotionProps<"section">) {
  return <motion.section {...useMotionProps(props)} />;
}

export function MotionArticle(props: MotionProps<"article">) {
  return <motion.article {...useMotionProps(props)} />;
}
