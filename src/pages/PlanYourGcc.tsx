import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { offers } from '../content'

const rows: [string, 'job' | 'give' | 'get' | 'next'][] = [['Its job', 'job'], ['You provide', 'give'], ['You receive', 'get'], ['What happens next', 'next']]

export default function PlanYourGcc() {
  return (
    <>
      <PageHero eyebrow="Plan your GCC" title={<>Three ways to start. <em>Each has one clear job.</em></>} intro="Choose by where you are. Each one tells you what we need, what you get and what happens next." />
      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {offers.map((o, n) => (
            <Reveal key={o.name} delay={n * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="flex h-full flex-col rounded-3xl border border-hairline p-8 hover:border-purple/40 hover:shadow-[0_24px_50px_-28px_rgba(109,63,192,.5)]">
                <span className="text-xs text-purple">0{n + 1}</span>
                <h2 className="mt-2 text-3xl font-medium">{o.name}</h2>
                <p className="mt-1 text-sm text-muted">{o.meta}</p>
                <dl className="mt-6 flex-1 divide-y divide-hairline">
                  {rows.map(([label, k]) => (
                    <div key={k} className="py-4">
                      <dt className="text-xs uppercase tracking-[0.14em] text-purple">{label}</dt>
                      <dd className="mt-1 text-ink">{o[k]}</dd>
                    </div>
                  ))}
                </dl>
                <Link to={o.to} className="mt-6 inline-flex justify-center rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">{o.cta}</Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-6xl">
          <p className="max-w-3xl text-muted"><span className="text-deep">Order:</span> most new-build buyers start with the Readiness Check. Already running a centre? Go straight to a Strategy Session, with no business case first. All estimates are indicative; detailed scope, pricing and implementation planning need further discovery.</p>
        </Reveal>
      </section>
    </>
  )
}
