import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

/**
 * Fade/slide a block into view on scroll. No-op transform under reduced motion.
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
