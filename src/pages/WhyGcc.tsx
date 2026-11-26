import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { buyerQs, lifecycle } from '../content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Hover: the card tilts away from the cursor (the edge nearest the pointer sinks back). Border: flowing water shimmer.
// Scroll zoom is done by GSAP on an outer wrapper, so it never fights this Motion transform.
function TiltCard({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const spring = { stiffness: 180, damping: 18 }
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), spring)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), spring)

  return (
    <motion.div
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      className="group relative h-full rounded-3xl p-[1.5px]"
    >
      <div aria-hidden className="water-border absolute inset-0 rounded-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
      <div aria-hidden className="water-border absolute inset-0 -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
      <div className="relative h-full rounded-[calc(1.5rem-1.5px)] bg-white p-8 md:p-10">{children}</div>
    </motion.div>
  )
}

export default function WhyGcc() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.zoom').forEach((el, i) => {
        gsap.fromTo(el, { scale: 0.86, y: 70, opacity: 0.15 }, {
          scale: 1, y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: `top ${96 - i * 4}%`, end: `top ${56 - i * 4}%`, scrub: 0.7 },
        })
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <>
      <PageHero eyebrow="Why GCC" title={<>A launch is a milestone. <em>Sustained business value</em> is the outcome.</>} intro="Buyers want talent, a sound business case, control, integration and results that last. Explore how each is handled through the lifecycle." />
      <section ref={root} data-no-dot className="bg-pale px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {lifecycle.map((stage, n) => (
            <div key={stage} className="zoom">
              <TiltCard>
                <span className="font-sans text-7xl font-medium leading-none text-purple/25">0{n + 1}</span>
                <h2 className="mt-2 text-4xl font-medium">{stage}</h2>
                <dl className="mt-6 divide-y divide-hairline">
                  {buyerQs.map((b) => (
                    <div key={b.label} className="py-3">
                      <dt className="text-xs uppercase tracking-[0.14em] text-purple">{b.label}</dt>
                      <dd className="mt-1 text-ink">{b.at[n]}</dd>
                    </div>
                  ))}
                </dl>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="See how it plays out for your centre." label="Take the Readiness Check" to="/plan-your-gcc/readiness-check" />
    </>
  )
}
