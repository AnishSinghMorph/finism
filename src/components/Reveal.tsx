import { motion } from 'motion/react'
import type { ReactNode } from 'react'

// Fade-up on enter. One easing curve for the whole site so motion feels consistent.
export const ease = [0.22, 1, 0.36, 1] as const

export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}
