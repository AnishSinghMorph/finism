import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

const c01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)
const win = (p: number, a: number, b: number) => ease(c01((p - a) / (b - a)))

// The frame of reference shifts: "Cost" is dominant, then recedes into a small clause as "Capability" takes its place.
export default function CostCapability() {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: root, offset: ['start start', 'end end'] })

  const costS = useTransform(p, (v) => 1 - 0.8 * win(v, 0.08, 0.42)), costY = useTransform(p, (v) => -34 * win(v, 0.08, 0.42))
  const costO = useTransform(p, (v) => 1 - win(v, 0.18, 0.4))
  const clauseO = useTransform(p, (v) => win(v, 0.3, 0.46))
  const capS = useTransform(p, (v) => 0.55 + 0.45 * win(v, 0.22, 0.6)), capY = useTransform(p, (v) => 30 * (1 - win(v, 0.22, 0.6)))
  const capO = useTransform(p, (v) => win(v, 0.22, 0.5))
  const isO = useTransform(p, (v) => win(v, 0.55, 0.7)), isX = useTransform(p, (v) => -24 * (1 - win(v, 0.55, 0.72)))
  const subO = useTransform(p, (v) => win(v, 0.7, 0.85))

  if (reduce) {
    return (
      <section className="px-6 py-28 text-center">
        <p className="text-muted">Cost is no longer the pitch.</p>
        <h2 className="mt-4 text-[clamp(3rem,10vw,8rem)] font-medium leading-none">Capability <em>is.</em></h2>
      </section>
    )
  }
  return (
    <div ref={root} style={{ height: '260vh' }}>
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-6 text-center">
        <motion.p style={{ opacity: clauseO }} className="absolute top-[22%] font-sans text-lg text-muted md:text-2xl">Cost is no longer the pitch.</motion.p>
        <motion.h2 style={{ scale: costS, y: costY, opacity: costO }} className="absolute font-sans text-[clamp(5rem,22vw,17rem)] font-medium uppercase leading-none tracking-tight text-deep">Cost</motion.h2>
        <motion.h2 style={{ scale: capS, y: capY, opacity: capO }} className="absolute font-sans text-[clamp(2.6rem,10.5vw,9rem)] font-medium leading-none tracking-tight text-deep">
          Capability <motion.em style={{ opacity: isO, x: isX }} className="inline-block text-purple">is.</motion.em>
        </motion.h2>
        <motion.p style={{ opacity: subO }} className="absolute bottom-[18%] max-w-md text-muted">Finism builds the capability behind the centre, and stays accountable for it.</motion.p>
      </div>
    </div>
  )
}
