export const defaultTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: defaultTransition },
} as const;

export const softScale = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: defaultTransition },
} as const;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
} as const;

export const cardHover = {
  y: -4,
  scale: 1.01,
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
} as const;

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.12, ease: [0.16, 1, 0.3, 1] },
} as const;

export const viewportOnce = {
  once: true,
  amount: 0.18,
} as const;
