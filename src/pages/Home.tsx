import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal from '../components/Reveal'
import { BentoField, InteractiveCard } from '../components/BentoField'
import Hero from './home/Hero'
import Questions from './home/Questions'
import Engine from './home/Engine'
import ServiceStack from './home/ServiceStack'
import CostCapability from './home/CostCapability'

const different = [
  ['Experienced practitioners', 'Led by a founder who has built and run these centres.'],
  ['One integrated team', 'Setup, build and run under one delivery model.'],
  ['Clear accountability', 'One senior lead and defined milestones.'],
  ['Designed around you', 'Your operating objectives shape the centre.'],
]
const journey = [
  ['Exploring', 'Find out if a GCC fits and which model to look at first.', 'Take the Readiness Check', '/plan-your-gcc/readiness-check'],
  ['Setting up', 'Assess feasibility and plan the build.', 'Request a Business Case', '/plan-your-gcc/business-case'],
  ['Already running a centre', 'Optimise, stabilise or scale a centre you run today, whether or not you plan to expand.', 'Book a Strategy Session', '/plan-your-gcc/strategy-session'],
]
const india = [
  ['Talent availability', 'Deep pools of engineering, AI/ML, R&D, finance, analytics and operations talent.'],
  ['A large GCC ecosystem', 'Established centres, peers and specialists close at hand.'],
  ['Government policies favouring GCCs', 'National and state support for GCCs in India.'],
]

export default function Home() {
  return (
    <>
      <Hero />

      <section className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">What makes Finism different</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1]">
              Building new or already running a centre, <em>we help it keep delivering.</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid border-t border-hairline md:grid-cols-4">
            {different.map(([t, d], n) => (
              <Reveal key={t} delay={n * 0.08} className="border-hairline py-8 pr-6 md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0">
                <span className="text-xs text-purple">0{n + 1}</span>
                <h3 className="mt-3 text-2xl font-medium">{t}</h3>
                <p className="mt-2 text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-4">
            <p className="max-w-3xl text-sm text-muted"><span className="text-deep">Challenges we solve:</span> fragmented delivery, unclear accountability, difficulty scaling, and centres that are not delivering what was planned.</p>
          </Reveal>
        </div>
      </section>

      <Engine />
      <ServiceStack />
      <CostCapability />

      <Questions />

      <section className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal><p className="eyebrow">Where are you on the journey?</p></Reveal>
          <BentoField cols={3} className="mt-8 grid gap-4 md:grid-cols-3">
            {journey.map(([t, d, a, to], n) => (
              <Reveal key={t} delay={n * 0.1}>
                <InteractiveCard className="group flex flex-col border border-hairline bg-white p-8 hover:border-purple/40 hover:shadow-[0_24px_50px_-28px_rgba(109,63,192,.5)]">
                  <h3 className="text-[1.9rem] font-medium leading-tight">{t}</h3>
                  <p className="mt-3 flex-1 text-muted">{d}</p>
                  <Link to={to} className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-purple">
                    {a} <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
                  </Link>
                </InteractiveCard>
              </Reveal>
            ))}
          </BentoField>
        </div>
      </section>

      <section className="bg-pale px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Why India</p>
            <h2 className="mt-5 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1]">Where the talent, the ecosystem and <em>the support</em> already are.</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-hairline md:grid-cols-3">
            {india.map(([t, d], n) => (
              <Reveal key={t} delay={n * 0.1} className="bg-white p-8">
                <h3 className="text-2xl font-medium">{t}</h3>
                <p className="mt-3 text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="max-w-2xl text-muted"><span className="text-deep">Enterprise-grade delivery, sized to your scale.</span> Enterprises, mid and small-scale companies and PE-backed portfolios get the same senior attention, and the flexibility to adapt as they grow. Start from your situation, not your label.</p>
            <Link to="/solutions/who-we-help" className="mt-4 inline-block text-[15px] font-medium text-purple">Find your situation →</Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink px-6 py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.08] !text-white">
              Ready to build a centre that keeps delivering<motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.5 }} className="ml-1 inline-block h-[0.22em] w-[0.22em] rounded-full bg-purple align-baseline" />
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              {journey.map(([, , a, to]) => (
                <Link key={to} to={to} className="rounded-full border border-white/25 px-6 py-3.5 text-[15px] font-medium transition-colors hover:bg-white hover:text-ink">{a}</Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
