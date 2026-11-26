import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Accordion from '../components/Accordion'
import CtaBand from '../components/CtaBand'
import { guides, popularQs } from '../content'

export default function Insights() {
  return (
    <>
      <PageHero eyebrow="Insights" title={<>Learn before <em>you decide.</em></>} intro="Plain-language guides, answers and research. No forms, no sales pitch." />
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal><p className="eyebrow">Guides</p></Reveal>
          <div className="mt-6 border-t border-hairline">
            {guides.map((g, n) => (
              <Reveal key={g.slug} delay={n * 0.04}>
                <Link to={`/insights/guides/${g.slug}`} className="group flex items-center justify-between gap-6 border-b border-hairline py-6 transition-colors hover:bg-pale/60 md:px-4">
                  <span className="flex items-baseline gap-6"><span className="text-xs text-purple">0{n + 1}</span><span className="font-sans text-2xl text-deep transition-colors group-hover:text-purple md:text-3xl">{g.title}</span></span>
                  <span aria-hidden className="text-purple transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-24">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {[
            ['FAQ', 'What a GCC is, size and fit, cost and payback, models, and how to choose a partner.', 'Read the FAQ', '/insights/faq'],
            ['Research and events', 'Original research and invite-only roundtables.', 'See what is new', '/insights/research'],
          ].map(([t, d, a, to], n) => (
            <Reveal key={t} delay={n * 0.1}>
              <Link to={to} className="group block h-full rounded-3xl bg-pale p-8 transition-shadow hover:shadow-[0_24px_50px_-28px_rgba(109,63,192,.5)]">
                <h2 className="text-3xl font-medium">{t}</h2>
                <p className="mt-3 text-muted">{d}</p>
                <span className="mt-8 inline-block text-[15px] font-medium text-purple">{a} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1.5">→</span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pt-24">
        <div className="mx-auto max-w-4xl">
          <Reveal><h2 className="mb-8 text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1]">Popular <em>questions.</em></h2></Reveal>
          <Accordion items={popularQs} />
          <Link to="/insights/faq" className="mt-6 inline-block text-[15px] font-medium text-purple">See all questions →</Link>
        </div>
      </section>
      <CtaBand title="Ready for a view on your own situation?" label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
