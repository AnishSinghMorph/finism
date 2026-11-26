import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ease } from '../../components/Reveal'
import Photo from '../../components/Photo'
import Magnetic from '../../components/Magnetic'
import { rich } from '../../components/rich'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const chips = [
  { text: 'Fragmented delivery', pos: 'left-0 top-[14%]', rot: -7, fly: [-90, -60] },
  { text: 'Unclear accountability', pos: 'right-0 top-[8%]', rot: 5, fly: [90, -80] },
  { text: 'Difficulty scaling', pos: 'left-[2%] bottom-[18%]', rot: 4, fly: [-110, 60] },
  { text: 'Not delivering what was planned', pos: 'right-0 bottom-[10%]', rot: -5, fly: [100, 70] },
]
const stages = [
  ['01', 'Start', 'Define what matters.'],
  ['02', 'Build', 'Turn intent into capability.'],
  ['03', 'Operate', 'Make it work every day.'],
  ['04', 'Evolve', 'Improve for what comes next.'],
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  // cinematic depth: the photo, the network over it and the chips each answer the pointer a little differently
  const sp = { stiffness: 60, damping: 18 }
  const mx = useMotionValue(0), my = useMotionValue(0)
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), sp), imgY = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), sp)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  useGSAP(() => {
    gsap.from('.hero-line', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15 })
    gsap.from('.hero-fade', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.7 })
    gsap.from('.chip', { opacity: 0, scale: 0.85, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.12, delay: 0.9 })
    // Entrance (.chip) and scroll drift (.chip-fly wrapper) live on different elements so they never fight over opacity;
    // scrubbing back up restores the chips exactly.
    gsap.utils.toArray<HTMLElement>('.chip-fly').forEach((el, i) => {
      gsap.to(el, {
        x: chips[i].fly[0], y: chips[i].fly[1], rotation: chips[i].rot * 2.2, opacity: 0.0,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
    })
  }, { scope: root })

  return (
    <section ref={root} className="relative overflow-hidden px-6 pb-16 pt-36 md:pt-40">
      <div aria-hidden className="absolute inset-0 -z-0 opacity-70" style={{ backgroundImage: 'linear-gradient(var(--color-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent)' }} />
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow hero-fade">Global Capability Centres</p>
          <h1 className="mt-5 text-[clamp(2.4rem,5vw,4.1rem)] font-medium leading-[1.04]">
            <span className="block overflow-hidden pb-1"><span className="hero-line block">Build your Global</span></span>
            <span className="block overflow-hidden pb-1"><span className="hero-line block">Capability Centre.</span></span>
            <span className="block overflow-hidden pb-2"><span className="hero-line block"><em>Right, first time.</em></span></span>
          </h1>
          <p className="hero-fade mt-7 max-w-xl text-lg leading-relaxed text-muted">
            A launch is a milestone. A centre that keeps delivering business value is the outcome. Finism designs it around your operating objectives and stays accountable from first decision to scale.
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/plan-your-gcc/readiness-check" className="group inline-flex items-center gap-2 rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">Plan a new GCC <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span></Link>
            </Magnetic>
            <Magnetic>
              <Link to="/plan-your-gcc/strategy-session" className="inline-flex rounded-full border border-hairline bg-white/60 px-6 py-3.5 text-[15px] font-medium text-deep hover:border-purple">Optimise an existing centre</Link>
            </Magnetic>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-[4/5] w-full max-w-[500px]"
          onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }}
          onPointerLeave={() => { mx.set(0); my.set(0) }}
        >
          {/* architecture, graded toward the brand purple and faded into the page at the foot */}
          <div id="dot-frame" aria-hidden className="pointer-events-none absolute inset-x-[4%] bottom-0 top-[4%]" />
          <div className="hero-fade absolute inset-0"><motion.div style={{ x: imgX, y: imgY }} className="absolute inset-x-[4%] bottom-0 top-[4%]">
            <motion.div style={{ y: photoY }} className="relative h-full overflow-hidden rounded-[2rem] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]">
              <Photo photo="towers" priority sizes="(min-width:768px) 480px, 90vw" className="scale-[1.12] saturate-[.8]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-deep/30 to-purple/25 mix-blend-multiply" />
            </motion.div>
          </motion.div></div>
          <div id="dot-hero" className="absolute left-[83%] top-[33%] aspect-square w-[42%]">
            {!rich && (
              <div
                className="absolute inset-[22%] rounded-full shadow-[inset_-18px_-26px_50px_rgba(36,22,64,.45)]"
                style={{ background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,.55), transparent 26%), radial-gradient(circle at 50% 45%, #7d51d4, #6D3FC0 48%, #3B1F70 100%)' }}
              />
            )}
          </div>
          {chips.map((c) => (
            <div key={c.text} className={`chip-fly absolute max-w-[82%] ${c.pos}`}>
              <span style={{ rotate: `${c.rot}deg` }} className="chip flex items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2.5 text-[13px] text-ink shadow-[0_10px_30px_-14px_rgba(59,31,112,.35)]">
                <span className="h-1.5 w-1.5 rounded-full bg-purple" />{c.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.ul
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } } }}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-2 border-t border-hairline md:grid-cols-4"
      >
        {stages.map(([n, t, d]) => (
          <motion.li key={n} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }} className="border-hairline py-6 pr-4 md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0">
            <span className="text-xs text-purple">{n}</span>
            <p className="mt-1 font-sans text-xl text-deep">{t}</p>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
