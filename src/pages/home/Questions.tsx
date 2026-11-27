import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ease } from '../../components/Reveal'
import { usePinSteps } from '../../components/usePinSteps'

const qs = [
  ['Talent and capacity', 'Can we access the talent and capacity we need?'],
  ['Business case', 'Does the business case justify the investment?'],
  ['Control and quality', 'How do we keep control and service quality?'],
  ['Integration', 'How will it fit our existing business?'],
  ['Success after launch', 'What does success look like next year?'],
]

const Intro = () => (
  <div>
    <p className="eyebrow">Why companies build a GCC</p>
    <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1]">
      Five questions every leadership team asks, and <em>what they must get right.</em>
    </h2>
    <p className="mt-6 max-w-md text-muted">We connect each to what happens at setup, stabilisation and scale.</p>
  </div>
)

// Phones and reduced motion: all five questions in a plain list, no pinning, nothing to fight while scrolling.
function QuestionsList() {
  return (
    <section className="bg-pale px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <Intro />
        <ol className="mt-10 divide-y divide-hairline border-y border-hairline">
          {qs.map(([label, q], n) => (
            <li key={label} className="py-6">
              <span className="font-sans text-sm text-purple">0{n + 1}</span>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.16em] text-purple">{label}</p>
              <p className="mt-2 font-sans text-2xl leading-snug text-deep">{q}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Questions() {
  const reduce = useReducedMotion()
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)'); const s = () => setNarrow(mq.matches)
    mq.addEventListener('change', s); return () => mq.removeEventListener('change', s)
  }, [])
  return reduce ? <QuestionsList /> : narrow ? <QuestionsPhone /> : <QuestionsPinned />
}

const ease3 = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (p: number, a: number, b: number) => ease3(clamp01((p - a) / (b - a)))

// Phones: the same story, driven by scroll position (sticky, no pinning library): each question rises in, holds, and gives way to the next.
function PhoneItem({ p, i, label, q }: { p: MotionValue<number>; i: number; label: string; q: string }) {
  const n = qs.length
  const opacity = useTransform(p, (v) => Math.min(i === 0 ? 1 : win(v, i / n - 0.02, i / n + 0.05), i === n - 1 ? 1 : 1 - win(v, (i + 1) / n - 0.05, (i + 1) / n + 0.01)))
  const y = useTransform(p, (v) => (i === 0 ? 0 : (1 - win(v, i / n - 0.02, i / n + 0.05)) * 28) - (i === n - 1 ? 0 : win(v, (i + 1) / n - 0.05, (i + 1) / n + 0.01) * 18))
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <span className="font-sans text-6xl font-medium leading-none text-purple/25">0{i + 1}</span>
      <p className="mt-3 font-sans text-xs uppercase tracking-[0.16em] text-purple">{label}</p>
      <p className="mt-2 font-sans text-[1.7rem] leading-[1.15] text-deep">{q}</p>
    </motion.div>
  )
}
function PhoneSeg({ p, i }: { p: MotionValue<number>; i: number }) {
  const n = qs.length
  const scaleX = useTransform(p, (v) => win(v, i / n, (i + 1) / n))
  return <li className="relative h-1 flex-1 overflow-hidden rounded-full bg-hairline"><motion.i style={{ scaleX }} className="absolute inset-0 origin-left bg-purple" /></li>
}
function QuestionsPhone() {
  const root = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: root, offset: ['start start', 'end end'] })
  return (
    <div ref={root} style={{ height: `${qs.length * 65 + 60}vh` }} className="bg-pale">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-6 pb-8 pt-24">
        <p className="eyebrow">Why companies build a GCC</p>
        <h2 className="mt-3 text-[1.55rem] font-normal leading-[1.12]">Five questions every leadership team asks, and <em>what they must get right.</em></h2>
        <div className="relative mt-8 h-[16rem]">{qs.map(([label, q], i) => <PhoneItem key={label} p={p} i={i} label={label} q={q} />)}</div>
        <ol className="mt-4 flex gap-1.5" aria-label="Progress">{qs.map((_, i) => <PhoneSeg key={i} p={p} i={i} />)}</ol>
      </div>
    </div>
  )
}

// Pinned section: scrolling steps through the five questions every leadership team asks.
function QuestionsPinned() {
  const root = useRef<HTMLElement>(null)
  const { i, bar } = usePinSteps(root, qs.length)

  return (
    <section ref={root} className="bg-pale">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-[0.9fr_1.1fr]">
        <Intro />

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
