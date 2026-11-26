import { useRef } from 'react'
import { motion } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal, { ease } from '../components/Reveal'
import { brain } from '../content'

const people = [
  ['Charu', 'Founder', 'Advisory, setup and run experience across global clients in multiple industries.'],
  ['Lamar', 'Senior Vice President, Client Partnerships', 'Profile to be added.'],
]
const exp = [
  ['Advisory', 'Business case, target operating model, brownfield transformation across governance, location and organisation.'],
  ['Setup and Build', 'Greenfield builds: HR and finance policy, employer branding, IT and workspace set-up, hiring, transition.'],
  ['Run', 'Steady-state operations across talent, HR, finance, workspace, IT and employer branding.'],
]
const perks = [['Faster', 'Weeks of work in days.'], ['More consistent', 'A proven method, not one person’s memory.'], ['Leaner', 'Less manual work, lower cost.']]

export default function WhyFinism() {
  const flow = useRef<HTMLDivElement>(null)
  return (
    <>
      <PageHero eyebrow="Why Finism" title={<>Practitioners who have <em>built and run GCCs.</em></>} intro="Leadership, experience and the method behind every build." />

      <section className="px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {people.map(([n, r, b], i) => (
            <Reveal key={n} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="h-full rounded-3xl border border-hairline p-8">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-pale font-sans text-2xl text-purple">{n[0]}</div>
                <h3 className="mt-6 text-3xl font-medium">{n}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-purple">{r}</p>
                <p className="mt-4 text-muted">{b}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-6xl">
          <Reveal><p className="eyebrow">Charu’s GCC experience</p></Reveal>
          <div className="mt-6 grid border-t border-hairline md:grid-cols-3">
            {exp.map(([t, d], n) => (
              <Reveal key={t} delay={n * 0.08} className="border-hairline py-8 pr-6 md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0">
                <h3 className="text-2xl font-medium">{t}</h3><p className="mt-2 text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-28 bg-ink px-6 py-28 text-white">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow !text-teal">How we work</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1] !text-white">The GCC Brain is the method <em className="!text-teal">behind everything we build.</em></h2>
            <p className="mt-6 max-w-2xl text-lg text-white/70">AI workflows draft the first version of each task in hours. A Finism practitioner checks and shapes every output with you. It is not a product you log into. It is how we work.</p>
          </Reveal>

          <div ref={flow} className="relative mt-16 grid gap-4 md:grid-cols-4">
            <svg aria-hidden className="absolute left-0 top-9 hidden h-1 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 1">
              <motion.line x1="4" x2="96" y1="0.5" y2="0.5" stroke="#2CC7C2" strokeWidth="0.5" vectorEffect="non-scaling-stroke" strokeDasharray="4 6"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: '-20%' }} transition={{ duration: 1.6, ease }} />
            </svg>
            {brain.map(([t, d], n) => (
              <Reveal key={t} delay={0.2 + n * 0.25}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-ink p-6">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-teal text-sm font-medium text-ink">{n + 1}</span>
                  <h3 className="mt-5 text-xl font-medium !text-white">{t}</h3>
                  <p className="mt-2 text-sm text-white/65">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
            {perks.map(([t, d]) => <div key={t}><p className="font-sans text-2xl text-teal">{t}</p><p className="mt-1 text-white/65">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-6 pt-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Previous work</p>
            <p className="mt-4 text-lg text-ink">Advisory, build and run delivered for global clients in retail, real estate services, insurance, food service and grocery.</p>
            <p className="mt-3 text-muted">Case studies will follow.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Partners</p>
            <p className="mt-4 font-sans text-2xl text-deep">Gopalan Workspace</p>
          </Reveal>
        </div>
      </section>
      <CtaBand title="Work directly with the people who have done it." label="Book a Strategy Session" to="/plan-your-gcc/strategy-session" />
    </>
  )
}
