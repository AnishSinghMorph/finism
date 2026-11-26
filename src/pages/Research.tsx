import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'

// Placeholder items until Finism supplies research and event details.
const items = [
  ['Original research', 'Placeholder: title and summary of the first Finism research report.', 'Coming soon'],
  ['Invite-only roundtable', 'Placeholder: topic, date and format of the next leadership roundtable.', 'By invitation'],
  ['Event', 'Placeholder: upcoming event details.', 'Coming soon'],
]

export default function Research() {
  return (
    <>
      <PageHero eyebrow="Insights / Research and events" title={<>Original research and <em>invite-only roundtables.</em></>} intro="What is new from Finism." />
      <section className="px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {items.map(([t, d, tag], n) => (
            <Reveal key={t} delay={n * 0.1}>
              <div className="h-full rounded-3xl border border-hairline p-8">
                <span className="rounded-full bg-pale px-3 py-1 text-xs text-purple">{tag}</span>
                <h2 className="mt-5 text-2xl font-medium">{t}</h2>
                <p className="mt-3 text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Want to be invited to future roundtables?" label="Book a Strategy Session" to="/plan-your-gcc/strategy-session" />
    </>
  )
}
