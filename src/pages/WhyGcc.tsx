import { motion, useTransform, type MotionValue } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { ScrollCard, ScrollCardSection, Layer, useCardPos, useStackMode } from '../components/ScrollStack'
import Maturity, { HeroSeed, StageGlyph } from './whygcc/Maturity'
import { buyerQs, lifecycle } from '../content'

const ages = ['Building', 'Connecting', 'Expanding'] // what the system is doing in each stage (the visual carries the same words)

// One buyer-question row. While its card is in front, the five rows take turns to come into emphasis; the matching node
// in the maturity system brightens in step (both read the same scroll position).
function Row({ k, label, text }: { k: number; label: string; text: string }) {
  const pos = useCardPos()
  return pos ? <RowLive pos={pos} k={k} label={label} text={text} /> : <RowBody label={label} text={text} />
}
function RowBody({ label, text }: { label: string; text: string }) {
  return <div className="py-3 first:pt-0 last:pb-0"><dt className="text-xs uppercase tracking-[0.14em] text-purple">{label}</dt><dd className="mt-0.5 text-ink md:mt-1">{text}</dd></div>
}
function RowLive({ pos, k, label, text }: { pos: MotionValue<number>; k: number; label: string; text: string }) {
  const e = useTransform(pos, (p) => Math.max(0, 1 - Math.abs(p - (-0.4 + 0.2 * k)) / 0.11))
  const opacity = useTransform(e, (v) => 0.62 + 0.38 * v), x = useTransform(e, (v) => v * 5), bar = useTransform(e, (v) => v)
  return (
    <motion.div style={{ opacity, x }} className="relative py-3 first:pt-0 last:pb-0">
      <motion.i aria-hidden style={{ scaleY: bar }} className="absolute -left-4 top-3 bottom-3 w-[2px] origin-center rounded-full bg-purple first:top-0 last:bottom-0" />
      <dt className="text-xs uppercase tracking-[0.14em] text-purple">{label}</dt><dd className="mt-0.5 text-ink md:mt-1">{text}</dd>
    </motion.div>
  )
}
function Glyph({ stage }: { stage: 0 | 1 | 2 }) {
  const m = useStackMode()
  return m === 'full' || m === 'phone' ? null : <StageGlyph stage={stage} className="mb-4" />
}

// Set up -> Stabilise -> Scale: the cards stay the mechanism; behind them one system matures (see whygcc/Maturity).
export default function WhyGcc() {
  return (
    <>
      <div className="relative">
        <HeroSeed />
        <PageHero eyebrow="Why GCC" title={<>A launch is a milestone. <em>Sustained business value</em> is the outcome.</>} intro="Buyers want talent, a sound business case, control, integration and results that last. Explore how each is handled through the lifecycle." />
      </div>
      <section data-no-dot className="bg-pale">
        <ScrollCardSection
          labels={[...lifecycle]} align="left" step={170} tail={130}
          timing={[[0, 0.35, 0.8, 1], [0, 0.25, 0.75, 1]]}
          backdrop={(cardP, full, mode) => <Maturity cardP={cardP} f={full} phone={mode === 'phone'} />}
        >
          {lifecycle.map((stage, n) => (
            <ScrollCard key={stage} index={n} className="p-5 md:p-9">
              <Glyph stage={n as 0 | 1 | 2} />
              <Layer depth={1}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="font-sans text-5xl font-medium leading-none text-purple/25 md:text-6xl">0{n + 1}</span>
                    <h2 className="mt-1 text-3xl font-medium md:text-4xl">{stage}</h2>
                  </div>
                  <span className="mb-1 rounded-full border border-purple/30 px-3 py-1 text-xs uppercase tracking-[0.14em] text-purple">{ages[n]}</span>
                </div>
              </Layer>
              <Layer depth={3}>
                <dl className="mt-4 divide-y divide-hairline pl-4 text-[15px] md:mt-6 md:text-base">
                  {buyerQs.map((b, k) => <Row key={b.label} k={k} label={b.label} text={b.at[n]} />)}
                </dl>
              </Layer>
            </ScrollCard>
          ))}
        </ScrollCardSection>
      </section>
      <CtaBand title="See how it plays out for your centre." label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
