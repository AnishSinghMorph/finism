import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { ScrollCard, ScrollCardSection, Layer } from '../components/ScrollStack'
import { buyerQs, lifecycle } from '../content'

// Three lifecycle stages as a sticky stack: scroll position drives which card is in front (see ScrollStack).
export default function WhyGcc() {
  return (
    <>
      <PageHero eyebrow="Why GCC" title={<>A launch is a milestone. <em>Sustained business value</em> is the outcome.</>} intro="Buyers want talent, a sound business case, control, integration and results that last. Explore how each is handled through the lifecycle." />
      <section data-no-dot className="bg-pale px-0 py-10 md:py-0">
        <ScrollCardSection labels={[...lifecycle]} className="px-6 md:px-0">
          {lifecycle.map((stage, n) => (
            <ScrollCard key={stage} index={n} className="grid gap-8 p-8 md:grid-cols-[0.8fr_1.4fr] md:gap-12 md:p-12">
              <div className="flex flex-col justify-between">
                <Layer depth={1}>
                  <span className="font-sans text-7xl font-medium leading-none text-purple/25">0{n + 1}</span>
                  <h2 className="mt-3 text-4xl font-medium md:text-5xl">{stage}</h2>
                </Layer>
                <Layer depth={2}><p className="mt-6 max-w-[16rem] text-muted">How each of the five buyer questions is handled at this stage.</p></Layer>
              </div>
              <Layer depth={3}>
                <dl className="divide-y divide-hairline">
                  {buyerQs.map((b) => (
                    <div key={b.label} className="py-3 first:pt-0 last:pb-0">
                      <dt className="text-xs uppercase tracking-[0.14em] text-purple">{b.label}</dt>
                      <dd className="mt-1 text-ink">{b.at[n]}</dd>
                    </div>
                  ))}
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
