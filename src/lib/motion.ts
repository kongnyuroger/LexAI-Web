import type { Transition, Variants } from 'framer-motion'

/** Standard premium ease — fast start, gentle settle. Matches --ease-premium in CSS. */
export const easePremium: Transition['ease'] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easePremium } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: easePremium } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easePremium } },
}

/** Apply to a parent; children with `variants={fadeUp}` will stagger in. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/** Subtle lift used on interactive cards. Spread onto <motion.div whileHover={cardHover}> */
export const cardHover = { y: -3, transition: { duration: 0.2, ease: easePremium } }
