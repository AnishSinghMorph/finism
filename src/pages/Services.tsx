import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal from '../components/Reveal'
import Blueprint from './services/Blueprint'
import { matrix, stages } from '../content'

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Solutions / Services" title={<>Finism across the whole <em>GCC lifecycle.</em></>} intro="Three stages, six capabilities. Each stage ends in an outcome you can measure." />

      <Blueprint />

      <section className="bg-pale px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {stages.map((st, n) => (
            <Reveal key={st.n} delay={n * 0.1}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-8">
                <p className="eyebrow">Stage {st.n}</p>
                <h2 className="mt-3 text-3xl font-medium">{st.title}</h2>
                <p className="mt-4 flex-1 text-muted">{st.body}</p>
                <p className="mt-6 border-t border-hairline pt-5 text-deep"><span className="text-purple">Outcome:</span> {st.outcome}</p>
                <Link to={st.to} className="mt-6 inline-flex w-fit rounded-full bg-purple px-5 py-3 text-[15px] font-medium text-white">{st.cta} →</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hidden px-6 pt-28 md:block">
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
