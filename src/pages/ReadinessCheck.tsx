import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import PageHero from '../components/PageHero'
import { ease } from '../components/Reveal'
import { readiness, type Answers } from '../readiness'

const qs: { key: keyof Answers; title: string; opts: [string, string][] }[] = [
  { key: 'stage', title: 'Where are you today?', opts: [['exploring', 'Exploring whether a GCC fits'], ['planning', 'Planning to set one up'], ['running', 'Already running a centre']] },
  { key: 'size', title: 'How large do you expect the centre to be?', opts: [['small', 'Under 50 people'], ['mid', '50 to 150'], ['large', '150 or more']] },
  { key: 'focus', title: 'What matters most right now?', opts: [['talent', 'Talent and capacity'], ['case', 'The business case'], ['control', 'Control and service quality']] },
]

export default function ReadinessCheck() {
  const [a, setA] = useState<Partial<Answers>>({})
  const [step, setStep] = useState(0)
  const done = step >= qs.length
  const res = done ? readiness(a as Answers) : null
  const pick = (k: keyof Answers, v: string) => { setA((p) => ({ ...p, [k]: v })); setStep((s) => s + 1) }
  const q = qs[step]

  return (
    <>
      <PageHero eyebrow="Plan your GCC / Readiness Check" title={<>Find your <em>starting point.</em></>} intro="Three questions, about five minutes. Already running a centre? Choose that option and go straight to a Strategy Session. You see which operating model to look at first, what to settle before you commit, and the next step that suits you." />
      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[26rem] rounded-3xl border border-hairline p-8 md:p-10">
            <div className="mb-8 flex gap-2" aria-label={`Question ${Math.min(step + 1, 3)} of 3`}>
              {qs.map((_, n) => <span key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n < step ? 'bg-purple' : n === step ? 'bg-purple/40' : 'bg-hairline'}`} />)}
            </div>
            <AnimatePresence mode="wait">
              {!done && q ? (
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease }}>
                  <p className="eyebrow">Question {step + 1} of 3</p>
                  <h2 className="mt-3 text-3xl font-medium">{q.title}</h2>
                  <div className="mt-8 grid gap-3">
                    {q.opts.map(([v, l]) => (
                      <motion.button key={v} whileHover={{ x: 6 }} whileTap={{ scale: 0.98 }} onClick={() => pick(q.key, v)} className="group flex items-center justify-between rounded-2xl border border-hairline px-6 py-5 text-left text-lg text-deep transition-colors hover:border-purple hover:bg-pale">
                        {l}<span aria-hidden className="text-purple opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </motion.button>
                    ))}
                  </div>
                  {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-6 text-sm text-muted hover:text-purple">← Back</button>}
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
                  <p className="eyebrow">Your answers</p>
                  <ul className="mt-4 space-y-2 text-lg text-deep">
                    {qs.map((qq) => <li key={qq.key}>{qq.opts.find(([v]) => v === a[qq.key])?.[1]}</li>)}
                  </ul>
                  <button onClick={() => { setA({}); setStep(0) }} className="mt-8 text-sm text-purple underline">Start again</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-3xl bg-pale p-8 md:p-10" aria-live="polite">
            <p className="eyebrow">Your preliminary result</p>
            <AnimatePresence mode="wait">
              {!res ? (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-lg text-muted">Answer the three questions to see it.</motion.p>
              ) : (
                <motion.div key="res" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
                  {res.review ? (
                    <>
                      <h3 className="mt-4 text-3xl font-medium">Review the centre you run today.</h3>
                      <p className="mt-3 text-muted">You already run a centre, so we start from what exists. No business case first.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-4 text-sm uppercase tracking-[0.14em] text-purple">Models to look at first</h3>
                      <ol className="mt-3 space-y-2">
                        {res.models.map((m, n) => <li key={m} className="font-sans text-2xl text-deep"><span className="mr-3 text-base text-purple">{n + 1}</span>{m}</li>)}
                      </ol>
                      {res.note && <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-ink">{res.note}</p>}
                    </>
                  )}
                  <p className="mt-6 text-sm text-muted"><span className="text-deep">Settle first:</span> {res.settle}</p>
                  <div className="mt-6 flex flex-col gap-2">
                    {res.next.map((n, i) => (
                      <Link key={n.to} to={n.to} className={`rounded-full px-6 py-3.5 text-center text-[15px] font-medium ${i === 0 ? 'bg-purple text-white' : 'border border-purple/30 text-purple'}`}>{n.label}</Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-8 text-xs text-muted">Preliminary, subject to detailed validation. Detailed scope, pricing and implementation planning need further discovery.</p>
          </div>
        </div>
      </section>
    </>
  )
}
