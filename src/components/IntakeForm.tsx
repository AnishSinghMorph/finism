import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from './Reveal'

export type Field = { name: string; label: string; type: 'text' | 'email' | 'url' | 'textarea' | 'choice'; options?: string[]; required?: boolean; placeholder?: string; hint?: string }
type Props = { steps: { title: string; fields: Field[] }[]; subject: string; doneTitle: string; doneBody: string }

const MAIL = 'contact@finismsolutions.com'
const check = (f: Field, v: string) => {
  if (!v.trim()) return f.required ? 'Required' : ''
  if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return 'Enter a valid email'
  if (f.type === 'url' && !/^(https?:\/\/)?[^\s.]+\.\S{2,}$/.test(v)) return 'Enter a valid website'
  return ''
}

// ponytail: no backend yet. Submitting opens the visitor's mail client with the answers prefilled (works with zero infrastructure); swap for an API call when the client has one.
export default function IntakeForm({ steps, subject, doneTitle, doneBody }: Props) {
  const [step, setStep] = useState(0)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const cur = steps[step]
  const set = (k: string, v: string) => { setVals((p) => ({ ...p, [k]: v })); setErrs((p) => ({ ...p, [k]: '' })) }

  const next = () => {
    const e = Object.fromEntries(cur.fields.map((f) => [f.name, check(f, vals[f.name] ?? '')]).filter(([, m]) => m))
    setErrs(e)
    if (Object.keys(e).length) return
    if (step < steps.length - 1) return setStep(step + 1)
    const body = steps.flatMap((s) => s.fields).map((f) => `${f.label}: ${vals[f.name] ?? ''}`).join('\n')
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setDone(true)
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-pale p-8 md:p-12">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-purple text-white" aria-hidden>✓</span>
        <h2 className="mt-6 text-3xl font-medium">{doneTitle}</h2>
        <p className="mt-3 max-w-lg text-muted">{doneBody} If your email app did not open, write to <a className="text-purple underline" href={`mailto:${MAIL}`}>{MAIL}</a>.</p>
      </motion.div>
    )
  }

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); next() }} className="rounded-3xl border border-hairline p-8 md:p-12">
      <div className="mb-8 flex gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((_, n) => <span key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n <= step ? 'bg-purple' : 'bg-hairline'}`} />)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease }} className="space-y-6">
          <h2 className="text-2xl font-medium">{cur.title}</h2>
          {cur.fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium text-deep">{f.label}{f.required && <span className="text-purple"> *</span>}</label>
              {f.hint && <p className="mt-1 text-sm text-muted">{f.hint}</p>}
              {f.type === 'choice' ? (
                <div role="radiogroup" aria-label={f.label} className="mt-3 flex flex-wrap gap-2">
                  {f.options!.map((o) => (
                    <button type="button" key={o} role="radio" aria-checked={vals[f.name] === o} onClick={() => set(f.name, o)}
                      className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${vals[f.name] === o ? 'border-purple bg-purple text-white' : 'border-hairline hover:border-purple'}`}>{o}</button>
                  ))}
                </div>
              ) : f.type === 'textarea' ? (
                <textarea id={f.name} rows={4} value={vals[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} aria-invalid={!!errs[f.name]}
                  className="mt-2 w-full rounded-2xl border border-hairline px-4 py-3 outline-none transition-colors focus:border-purple" />
              ) : (
                <input id={f.name} type={f.type === 'url' ? 'text' : f.type} value={vals[f.name] ?? ''} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} aria-invalid={!!errs[f.name]}
                  className="mt-2 w-full rounded-full border border-hairline px-5 py-3 outline-none transition-colors focus:border-purple" />
              )}
              {errs[f.name] && <p role="alert" className="mt-2 text-sm text-red-600">{errs[f.name]}</p>}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 flex items-center justify-between">
        {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-muted hover:text-purple">← Back</button> : <span />}
        <button type="submit" className="rounded-full bg-purple px-7 py-3.5 text-[15px] font-medium text-white transition-transform hover:-translate-y-0.5">{step < steps.length - 1 ? 'Continue' : 'Send'}</button>
      </div>
    </form>
  )
}
