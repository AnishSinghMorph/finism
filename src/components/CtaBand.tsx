import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function CtaBand({ title, label, to }: { title: string; label: string; to: string }) {
  return (
    <section className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-3xl bg-pale px-8 py-10 md:px-12">
        <p className="max-w-xl font-sans text-2xl text-deep">{title}</p>
        <Link to={to} className="rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white transition-transform hover:-translate-y-0.5">{label}</Link>
      </Reveal>
    </section>
  )
}
