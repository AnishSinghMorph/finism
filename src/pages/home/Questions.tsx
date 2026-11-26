import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from '../../components/Reveal'
import { usePinSteps } from '../../components/usePinSteps'

const qs = [
  ['Talent and capacity', 'Can we access the talent and capacity we need?'],
  ['Business case', 'Does the business case justify the investment?'],
  ['Control and quality', 'How do we keep control and service quality?'],
  ['Integration', 'How will it fit our existing business?'],
  ['Success after launch', 'What does success look like next year?'],
]

// Pinned section: scrolling steps through the five questions every leadership team asks.
export default function Questions() {
  const root = useRef<HTMLElement>(null)
  const { i, bar } = usePinSteps(root, qs.length)

  return (
    <section ref={root} className="bg-pale">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Why companies build a GCC</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1]">
            Five questions every leadership team asks, and <em>what they must get right.</em>
          </h2>
          <p className="mt-6 max-w-md text-muted">We connect each to what happens at setup, stabilisation and scale.</p>
        </div>

        <div className="flex gap-8">
          <div className="relative w-px shrink-0 bg-hairline">
            <div ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-purple" />
          </div>
          <div className="min-h-[18rem] flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }}>
                <span className="font-sans text-8xl font-medium leading-none text-purple/25">0{i + 1}</span>
                <p className="mt-4 font-sans text-sm uppercase tracking-[0.16em] text-purple">{qs[i][0]}</p>
                <p className="mt-3 font-sans text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.15] text-deep">{qs[i][1]}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-10 flex gap-2" aria-label="Progress">
              {qs.map((_, n) => <li key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n <= i ? 'bg-purple' : 'bg-hairline'}`} />)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
