import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'
import Stub from './Stub'
import { guides } from '../content'

// Placeholder guide template until Finism supplies the written guides.
export default function Guide() {
  const { slug } = useParams()
  const i = guides.findIndex((g) => g.slug === slug)
  if (i < 0) return <Stub title="Guide not found" />
  const g = guides[i], nxt = guides[(i + 1) % guides.length]
  return (
    <>
      <PageHero eyebrow={`Insights / Guide 0${i + 1}`} title={<>{g.title}<em>.</em></>} intro="Placeholder: a plain-language summary of this guide will go here." />
      <section className="px-6">
        <div className="mx-auto max-w-3xl space-y-12">
          {['What to know', 'What to decide', 'What to do next'].map((h) => (
            <Reveal key={h}>
              <h2 className="text-3xl font-medium">{h}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">Placeholder text. Finism will supply the written guide content for this section. It will be plain language, with no forms and no sales pitch.</p>
            </Reveal>
          ))}
          <Reveal><Link to={`/insights/guides/${nxt.slug}`} className="inline-block text-[15px] font-medium text-purple">Next guide: {nxt.title} →</Link></Reveal>
        </div>
      </section>
      <CtaBand title="Want this applied to your own situation?" label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
