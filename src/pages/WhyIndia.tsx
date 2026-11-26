import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Reveal from '../components/Reveal'
import { india } from '../content'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const W = 440 // viewBox width
const P = 220 // wavelength; sliding a wave by exactly P loops seamlessly
const EMPTY = 318, FULL = 18 // water-line y: below the digits / above them (viewBox height 300)

const wave = (amp: number, phase: number) => {
  let d = `M ${-P * 2} 0`
  for (let x = -P * 2; x <= W + P * 2; x += 10) d += ` L ${x} ${(amp * Math.sin(((x + phase) / P) * Math.PI * 2)).toFixed(2)}`
  return `${d} L ${W + P * 2} 700 L ${-P * 2} 700 Z`
}

// A big numeral that fills with rippling purple water as its section scrolls into view (and drains on the way back).
function WaterNumber({ n }: { n: number }) {
  const root = useRef<SVGSVGElement>(null)
  const id = `water-${n}`

  useGSAP(() => {
    const svg = root.current!
    const row = svg.closest('[data-row]')
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('.wa, .wb', { y: EMPTY })
      gsap.to('.wa, .wb', { y: FULL, ease: 'none', scrollTrigger: { trigger: row, start: 'top 60%', end: 'center 30%', scrub: 1 } })
      // two waves drifting in opposite directions so the surface never looks like a repeating pattern
      gsap.to('.wa', { x: -P, duration: 3.2, ease: 'none', repeat: -1 })
      gsap.to('.wb', { x: P, duration: 4.6, ease: 'none', repeat: -1 })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => { gsap.set('.wa, .wb', { y: FULL }) })
    return () => mm.revert()
  }, { scope: root })

  return (
    <svg ref={root} viewBox={`0 0 ${W} 300`} aria-hidden className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6D3FC0" />
          <stop offset="1" stopColor="#3B1F70" />
        </linearGradient>
        <clipPath id={id}>
          <path className="wa" d={wave(9, 0)} />
          <path className="wb" d={wave(6, 90)} />
        </clipPath>
      </defs>
      <text x={W} y="275" textAnchor="end" fontSize="330" fontWeight="500" className="font-sans" fill="#EAE9F4">0{n + 1}</text>
      <text x={W} y="275" textAnchor="end" fontSize="330" fontWeight="500" className="font-sans" fill={`url(#${id}-g)`} clipPath={`url(#${id})`}>0{n + 1}</text>
    </svg>
  )
}

export default function WhyIndia() {
  return (
    <>
      <PageHero eyebrow="Why GCC / Why India" title={<>Where the talent, the ecosystem and <em>the support</em> already are.</>} intro="Three reasons companies place their centres in India." />
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          {india.map(([t, d], n) => (
            <div key={t} data-row className="relative grid min-h-[60vh] items-center border-t border-hairline md:grid-cols-[1fr_1fr]">
              <div aria-hidden className="pointer-events-none mt-10 w-40 md:absolute md:right-0 md:top-1/2 md:mt-0 md:w-[min(44vw,440px)] md:-translate-y-1/2">
                <WaterNumber n={n} />
              </div>
              <Reveal className="relative py-12 md:py-16">
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.1]">{t}</h2>
                <p className="mt-5 max-w-md text-lg text-muted">{d}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Tell us where you are and we will plan your location." label="Book a Strategy Session" to="/plan-your-gcc/strategy-session" />
    </>
  )
}
