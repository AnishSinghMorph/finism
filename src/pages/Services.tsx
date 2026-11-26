import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal, { ease } from '../components/Reveal'
import { usePinSteps } from '../components/usePinSteps'
import { matrix, stages } from '../content'

export default function Services() {
  const root = useRef<HTMLElement>(null)
  const { i, bar } = usePinSteps(root, stages.length, 2.4)
  const s = stages[i]
  return (
    <>
      <PageHero eyebrow="Solutions / Services" title={<>Finism across the whole <em>GCC lifecycle.</em></>} intro="Three stages, six capabilities. Each stage ends in an outcome you can measure." />

      <section ref={root} className="bg-pale">
        <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-[0.8fr_1.2fr]">
          <ol className="space-y-3" aria-label="Stages">
            {stages.map((st, n) => (
              <li key={st.n} className={`flex items-center gap-4 font-sans text-2xl transition-all duration-300 ${n === i ? 'translate-x-2 text-deep' : 'text-deep/30'}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-full border text-sm transition-colors ${n === i ? 'border-purple bg-purple text-white' : 'border-hairline'}`}>{st.n}</span>
                {st.title}
              </li>
            ))}
            <div className="relative ml-4 mt-6 h-px w-40 bg-hairline"><div ref={bar} className="absolute inset-0 origin-left bg-purple" style={{ scale: '0 1' }} /></div>
          </ol>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4, ease }} className="rounded-3xl bg-white p-8 md:p-12">
              <p className="eyebrow">Stage {s.n}</p>
              <h2 className="mt-3 text-4xl font-medium md:text-5xl">{s.title}</h2>
              <p className="mt-5 text-lg text-muted">{s.body}</p>
              <p className="mt-8 border-t border-hairline pt-6 text-lg text-deep"><span className="text-purple">Outcome:</span> {s.outcome}</p>
              <Link to={s.to} className="mt-8 inline-block rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">{s.cta} →</Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="px-6 pt-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Six capabilities</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1]">Six capabilities run across <em>all three stages.</em></h2>
          </Reveal>
          <div className="mt-12 overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-4 border-b border-hairline pb-3 text-xs uppercase tracking-[0.16em] text-muted">
                <span>Capability</span>{stages.map((st) => <span key={st.n}>{st.title}</span>)}
              </div>
              {matrix.map(([cap, ...cells]) => (
                <Reveal key={cap}>
                  <div className="group grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-4 border-b border-hairline py-5 transition-colors hover:bg-pale/60">
                    <span className="font-sans text-xl text-deep">{cap}</span>
                    {cells.map((c) => <span key={c} className="text-muted transition-colors group-hover:text-ink">{c}</span>)}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand title="Not sure where to start? Answer three questions." label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
