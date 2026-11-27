import { lazy, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { useSmoothScroll } from './components/useSmoothScroll'
import { pages } from './routes'
import { guides } from './content'
import { rich } from './components/rich'
import Home from './pages/Home'
import Stub from './pages/Stub'

const Services = lazy(() => import('./pages/Services'))
const OperatingModels = lazy(() => import('./pages/OperatingModels'))
const WhoWeHelp = lazy(() => import('./pages/WhoWeHelp'))
const WhyGcc = lazy(() => import('./pages/WhyGcc'))
const WhyIndia = lazy(() => import('./pages/WhyIndia'))
const WhyFinism = lazy(() => import('./pages/WhyFinism'))
const Insights = lazy(() => import('./pages/Insights'))
const Faq = lazy(() => import('./pages/Faq'))
const Research = lazy(() => import('./pages/Research'))
const Guide = lazy(() => import('./pages/Guide'))
const PlanYourGcc = lazy(() => import('./pages/PlanYourGcc'))
const ReadinessCheck = lazy(() => import('./pages/ReadinessCheck'))
const BusinessCase = lazy(() => import('./pages/BusinessCase'))
const StrategySession = lazy(() => import('./pages/StrategySession'))

// Built pages by path; everything else in `pages` still renders a stub.
const built: Record<string, React.ComponentType> = {
  '/solutions/services': Services,
  '/solutions/operating-models': OperatingModels,
  '/solutions/who-we-help': WhoWeHelp,
  '/why-gcc': WhyGcc,
  '/why-gcc/why-india': WhyIndia,
  '/why-finism': WhyFinism,
  '/insights': Insights,
  '/insights/faq': Faq,
  '/insights/research': Research,
  '/plan-your-gcc': PlanYourGcc,
  '/plan-your-gcc/readiness-check': ReadinessCheck,
  '/plan-your-gcc/business-case': BusinessCase,
  '/plan-your-gcc/strategy-session': StrategySession,
}

const Dot3D = lazy(() => import('./components/Dot3D'))

export default function App() {
  useSmoothScroll()
  const location = useLocation()

  // New route: back to top and let ScrollTrigger re-measure.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
    // ponytail: client-side titles only; add pre-rendering if per-page SEO snippets matter.
    const t = pages.find((p) => p.path === location.pathname)?.title ?? guides.find((g) => location.pathname.endsWith(g.slug))?.title
    document.title = t ? `${t} — Finism` : 'Finism — Build your Global Capability Centre. Right, the first time.'
  }, [location.pathname])

  return (
    <>
      <Nav />
      {/* No exit animation: unmounting the old page before the new one mounts leaves <main> empty and the footer jumps to the top. */}
      <motion.main
        key={location.pathname}
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            {pages.map((p) => { const Page = built[p.path]; return <Route key={p.path} path={p.path} element={Page ? <Page /> : <Stub title={p.title} />} /> })}
            <Route path="/insights/guides/:slug" element={<Guide />} />
            <Route path="*" element={<Stub title="Page not found" />} />
          </Routes>
        </Suspense>
      </motion.main>
      {location.pathname !== '/' && <Footer />}
      {rich && <Suspense fallback={null}><Dot3D /></Suspense>}
    </>
  )
}
