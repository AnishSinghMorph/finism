import { motion } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal, { ease } from '../components/Reveal'
import { models } from '../content'

export default function OperatingModels() {
  return (
    <>
      <PageHero eyebrow="Solutions / Operating models" title={<>Choose the model that <em>fits your objectives.</em></>} intro="No model is best for everyone. Compare them on control, speed and investment." />
      <section className="px-6">
        <div className="mx-auto max-w-6xl border-t border-hairline">
          {models.map((m, n) => (
            <Reveal key={m.name} delay={n * 0.04}>
              <div className="grid gap-4 border-b border-hairline py-8 md:grid-cols-[1.1fr_1.6fr_1.1fr_1.1fr] md:items-center md:gap-8">
                <h3 className="text-2xl font-medium">{m.name}</h3>
                <p className="text-muted">{m.how}</p>
                <p className="text-sm text-ink"><span className="mb-1 block text-xs uppercase tracking-[0.16em] text-muted">Best for</span>{m.best}</p>
                <div>
                  <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted">Control · {m.label}</span>
                  <div className="flex gap-1.5" role="img" aria-label={`Control: ${m.label}`}>
                    {[1, 2, 3, 4, 5].map((k) => (
                      <motion.span
                        key={k}
                        initial={{ scaleY: 0.2, opacity: 0.4 }} whileInView={{ scaleY: 1, opacity: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.5, ease, delay: 0.15 + k * 0.07 }}
                        className={`h-3 flex-1 origin-bottom rounded-full ${k <= m.control ? 'bg-purple' : m.rising && k <= 5 ? 'bg-purple/20' : m.varies ? 'bg-purple/15' : 'bg-hairline'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which fits? Answer three questions and see a likely shortlist." label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
