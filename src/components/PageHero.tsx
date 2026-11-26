import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ease } from './Reveal'

export default function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro: string }) {
  return (
    <section className="px-6 pb-16 pt-40">
      <motion.div
        className="mx-auto max-w-6xl"
        initial="h" animate="s"
        variants={{ s: { transition: { staggerChildren: 0.1 } } }}
      >
        {[
          <p key="e" className="eyebrow">{eyebrow}</p>,
          <h1 key="t" className="mt-5 max-w-4xl text-[clamp(2.4rem,5vw,4.1rem)] font-medium leading-[1.05]">{title}</h1>,
          <p key="i" className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>,
        ].map((el, i) => (
          <motion.div key={i} variants={{ h: { opacity: 0, y: 24 }, s: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>{el}</motion.div>
        ))}
      </motion.div>
    </section>
  )
}
