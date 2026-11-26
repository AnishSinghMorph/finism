import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

// Pulls its child a few px toward the cursor (mouse only). Springs, no React state.
export default function Magnetic({ children, reach = 7, className = '' }: { children: ReactNode; reach?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const sp = { stiffness: 220, damping: 16, mass: 0.4 }
  const x = useSpring(useMotionValue(0), sp), y = useSpring(useMotionValue(0), sp)
  return (
    <motion.div
      ref={ref} style={{ x, y }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`inline-flex ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current!.getBoundingClientRect()
        x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * reach); y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * reach)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >{children}</motion.div>
  )
}
