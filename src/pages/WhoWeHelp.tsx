import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal, { ease } from '../components/Reveal'
import { segments, situations } from '../content'

export default function WhoWeHelp() {
  const [a, setA] = useState(0)
  return (
    <>
      <PageHero eyebrow="Solutions / Who we help" title={<>Enterprise-grade delivery, <em>sized to your scale.</em></>} intro="For mid and small-scale companies, PE-backed portfolios and large enterprises. These groups overlap, so start from your situation." />
      <section className="px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Who we help">
            {segments.map((s, n) => (
              <button key={s.name} role="tab" aria-selected={n === a} onClick={() => setA(n)} className={`relative rounded-2xl px-6 py-5 text-left font-sans text-2xl transition-colors ${n === a ? 'text-deep' : 'text-deep/40 hover:text-deep'}`}>
                {n === a && <motion.span layoutId="seg" className="absolute inset-0 -z-10 rounded-2xl bg-pale" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {s.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={a} role="tabpanel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }} className="rounded-3xl border border-hairline p-8 md:p-10">
              <p className="eyebrow">Risk</p>
              <p className="mt-2 font-sans text-2xl text-deep">{segments[a].risk}</p>
              <p className="eyebrow mt-8">Need</p>
              <p className="mt-2 font-sans text-2xl text-deep">{segments[a].need}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="px-6 pt-28">
        <div className="mx-auto max-w-6xl">
          <Reveal><h2 className="text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1]">Find <em>your situation.</em></h2></Reveal>
          <div className="mt-10 overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-3 gap-6 border-b border-hairline pb-3 text-xs uppercase tracking-[0.16em] text-muted"><span>Your situation</span><span>Typical buyer</span><span>Also fits</span></div>
              {situations.map((r) => (
                <Reveal key={r[0]}><div className="grid grid-cols-3 gap-6 border-b border-hairline py-5"><span className="font-sans text-xl text-deep">{r[0]}</span><span>{r[1]}</span><span className="text-muted">{r[2]}</span></div></Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand title="Start from your situation, not your label." label="Plan Your GCC" to="/plan-your-gcc" />
    </>
  )
}
