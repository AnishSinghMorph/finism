import { Link } from 'react-router-dom'
import Logo from './Logo'
import { cta, nav } from '../routes'
import { rich } from './rich'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo reverse className="text-3xl" />
          <p className="mt-6 max-w-xs font-sans text-xl text-white/80">
            Made to build. Made to last<span id="dot-end" className={`ml-0.5 inline-block h-2.5 w-2.5 rounded-full ${rich ? '' : 'bg-purple'}`} />
          </p>
        </div>
        {nav.map((g) => (
          <div key={g.label}>
            <p className="eyebrow !text-white/50">{g.label}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {(g.children ?? [{ label: g.label, to: g.to }]).map((c) => (
                <li key={c.to}><Link className="hover:text-white" to={c.to}>{c.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
        <span>Finism Solutions Pvt Ltd · contact@finismsolutions.com · © 2026</span>
        <Link to={cta.to} className="text-white/80 hover:text-white">{cta.label} ↗</Link>
      </div>
    </footer>
  )
}
