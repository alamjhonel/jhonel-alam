import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

/**
 * Fade/slide a block into view. Animates once on mount with an optional
 * delay. We deliberately don't use whileInView here — the
 * IntersectionObserver can re-fire on layout changes (e.g. when the
 * mobile menu / terminal / cert modal open and the body scroll lock
 * toggles), causing visible "glitch" re-animations on mobile.
 */
export default function Reveal({ children, delay = 0, y = 16, className = '', as = 'div' }) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
