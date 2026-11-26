import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Logo from './Logo'
import { cta, nav } from '../routes'

export default function Nav() {
  const [open, setOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenu(false), [pathname])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-6 py-3 transition-colors duration-300 ${
          scrolled ? 'border-hairline bg-white/80 shadow-[0_8px_30px_-12px_rgba(59,31,112,.25)] backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
        aria-label="Primary"
        onMouseLeave={() => setOpen(null)}
      >
        <Link to="/" className="text-2xl" aria-label="Finism home"><Logo /></Link>
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)} onFocus={() => setOpen(item.label)}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `relative block rounded-full px-4 py-2 text-sm transition-colors hover:text-purple ${isActive ? 'text-purple' : 'text-ink'}`}
              >
                {item.label}{item.children && <span aria-hidden className="ml-1 text-[10px]">▾</span>}
              </NavLink>
              <AnimatePresence>
                {item.children && open === item.label && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-hairline bg-white p-2 shadow-xl"
                  >
                    {item.children.map((c) => (
                      <li key={c.to}>
                        <Link to={c.to} onClick={() => setOpen(null)} className="block rounded-xl px-3 py-2 text-sm hover:bg-pale hover:text-purple">{c.label}</Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to={cta.to} className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-2.5 text-sm font-medium text-white">
              {cta.label} <span aria-hidden>↗</span>
            </Link>
          </motion.div>
          <button aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)} className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-white md:hidden">
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-deep transition-all duration-300 ${menu ? 'top-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-deep transition-all duration-300 ${menu ? 'top-1/2 -rotate-45' : 'bottom-0'}`} />
            </span>
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-h-[calc(100vh-6rem)] max-w-6xl overflow-y-auto rounded-3xl border border-hairline bg-white p-6 shadow-xl md:hidden"
          >
            {nav.map((g) => (
              <div key={g.label} className="border-b border-hairline py-4 last:border-0">
                <p className="eyebrow">{g.label}</p>
                <ul className="mt-2">
                  {(g.children ?? [{ label: g.label, to: g.to }]).map((c) => (
                    <li key={c.to}><Link to={c.to} className="block py-1.5 font-sans text-xl text-deep">{c.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
