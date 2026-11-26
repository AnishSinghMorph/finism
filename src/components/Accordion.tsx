import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from './Reveal'

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {items.map((it, n) => {
        const on = open === n
        return (
          <div key={it.q}>
            <h3>
              <button
                aria-expanded={on} aria-controls={`faq-${n}`}
                onClick={() => setOpen(on ? null : n)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-sans text-xl text-deep transition-colors hover:text-purple md:text-2xl"
              >
                {it.q}
                <motion.span aria-hidden animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.25, ease }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline text-xl leading-none text-purple">+</motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`faq-${n}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                  <p className="max-w-3xl pb-6 text-lg leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
