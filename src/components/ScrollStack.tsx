import { createContext, useContext, useEffect, useRef, useState, Children, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'

// Sticky section, layered cards. Scroll progress is the only source of truth: each card derives a continuous
// position `pos` (0 = active, <0 = waiting behind, >0 = left behind above) and everything is interpolated from it.
// Motion values only, so nothing re-renders while scrolling.

type Mode = 'full' | 'soft' | 'list' // desktop / tablet (gentler) / phone or reduced motion (plain list)
type Ctx = { progress: MotionValue<number>; n: number; mode: Mode }
const Stack = createContext<Ctx>(null!)
const CardPos = createContext<MotionValue<number>>(null!)

function useMode(): Mode {
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<Mode>('full')
  useEffect(() => {
    const md = matchMedia('(min-width: 768px)'), lg = matchMedia('(min-width: 1024px)')
    const sync = () => setMode(!md.matches ? 'list' : lg.matches ? 'full' : 'soft') // only on breakpoint change, never on scroll
    sync(); md.addEventListener('change', sync); lg.addEventListener('change', sync)
    return () => { md.removeEventListener('change', sync); lg.removeEventListener('change', sync) }
  }, [])
  return reduce ? 'list' : mode
}

export function ScrollCardSection({ children, labels, className = '' }: { children: ReactNode; labels: string[]; className?: string }) {
  const n = Children.count(children)
  const mode = useMode()
  const root = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })

  if (mode === 'list') {
    return (
      <Stack.Provider value={{ progress: scrollYProgress, n, mode }}>
        <div className={`mx-auto grid max-w-3xl gap-5 ${className}`}>{children}</div>
      </Stack.Provider>
    )
  }
  return (
    <Stack.Provider value={{ progress: scrollYProgress, n, mode }}>
      {/* tall track drives the animation; the sticky child keeps the stack on screen */}
      <div ref={root} style={{ height: `${(n - 1) * 90 + 100}vh` }} className={className}>
        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
          <div className="relative h-full w-full">{children}</div>
          <Dots labels={labels} />
        </div>
      </div>
    </Stack.Provider>
  )
}

function Dots({ labels }: { labels: string[] }) {
  const { progress, n } = useContext(Stack)
  return (
    <ol aria-hidden className="pointer-events-none absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-5 text-xs uppercase tracking-[0.16em]">
      {labels.map((l, i) => <Dot key={l} label={l} i={i} progress={progress} n={n} />)}
    </ol>
  )
}
function Dot({ label, i, progress, n }: { label: string; i: number; progress: MotionValue<number>; n: number }) {
  const pos = useTransform(progress, (v) => v * (n - 1) - i)
  const opacity = useTransform(pos, [-1, 0, 1], [0.35, 1, 0.35])
  const bar = useTransform(pos, [-1, 0, 1], [0.15, 1, 0.15])
  return (
    <motion.li style={{ opacity }} className="text-purple">
      <motion.span style={{ scaleX: bar }} className="mb-2 block h-px origin-left bg-purple" />
      {label}
    </motion.li>
  )
}

// A block inside a card that drifts a touch more than the shell (depth 1..3), so heading, text and preview settle in sequence.
export function Layer({ depth = 1, className = '', children }: { depth?: number; className?: string; children: ReactNode }) {
  const { mode } = useContext(Stack)
  if (mode === 'list') return <div className={className}>{children}</div>
  return <LayerMotion depth={depth} className={className}>{children}</LayerMotion>
}
function LayerMotion({ depth, className, children }: { depth: number; className: string; children: ReactNode }) {
  const pos = useContext(CardPos), { mode } = useContext(Stack)
  const k = mode === 'soft' ? 0.6 : 1
  const y = useTransform(pos, [-1, 0, 1], [12 * depth * k, 0, -8 * depth * k])
  const opacity = useTransform(pos, [-0.7 + 0.08 * depth, 0, 1], [0.55, 1, 1])
  return <motion.div style={{ y, opacity }} className={className}>{children}</motion.div>
}

export function ScrollCard({ index, children, className = '' }: { index: number; children: ReactNode; className?: string }) {
  const { progress, n, mode } = useContext(Stack)
  const shell = 'rounded-[2rem] border border-hairline bg-white shadow-[0_40px_80px_-44px_rgba(36,22,64,.4)]'
  if (mode === 'list') return <article className={`${shell} ${className}`}>{children}</article>
  return <FullCard index={index} progress={progress} n={n} soft={mode === 'soft'} className={shell} inner={className}>{children}</FullCard>
}

function FullCard({ index, progress, n, soft, className, inner, children }: { inner: string; index: number; progress: MotionValue<number>; n: number; soft: boolean; className: string; children: ReactNode }) {
  // Spinner: the cards sit on an imaginary drum. Scrolling turns it, so the front card tips away (blurring out)
  // while the next one tips in from below (blurring in).
  const k = soft ? 0.6 : 1
  const pos = useTransform(progress, (v) => v * (n - 1) - index)
  const P = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]
  const rotateX = useTransform(pos, P, [-85, -75, -42, 0, 42, 75, 85].map((v) => v * k))
  const y = useTransform(pos, P, [150, 90, 40, 0, -40, -90, -150].map((v) => v * k))
  const scale = useTransform(pos, P, [0.85, 0.9, 0.96, 1, 0.96, 0.9, 0.85])
  const opacity = useTransform(pos, P, [0, 0.2, 0.7, 1, 0.7, 0.2, 0])
  const blurPx = useTransform(pos, P, [14, 10, 4.5, 0, 4.5, 10, 14].map((v) => (soft ? v * 0.5 : v)))
  const filter = useTransform(blurPx, (b) => (b < 0.05 ? 'none' : `blur(${b.toFixed(2)}px)`))
  const z = useTransform(pos, (v) => Math.round(200 - Math.abs(v) * 100 + (v < 0 ? 40 : 0)))

  // pointer material: ±1.5° and a barely-there highlight, only on a fine pointer
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sp = { stiffness: 140, damping: 18 }
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-1.5, 1.5]), sp)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [1.5, -1.5]), sp)
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [4, -4]), sp) // content drifts opposite to the shell
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), sp)

  return (
    <motion.div style={{ zIndex: z }} className="pointer-events-none absolute inset-0 grid place-items-center px-6">
      <motion.div style={{ y, scale, opacity, filter, rotateX, transformPerspective: 1400 }} className="pointer-events-auto w-[min(92vw,58rem)] will-change-transform">
        <motion.div
          style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse') return
            const r = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width, yy = (e.clientY - r.top) / r.height
            mx.set(x - 0.5); my.set(yy - 0.5)
            e.currentTarget.style.setProperty('--hx', `${x * 100}%`); e.currentTarget.style.setProperty('--hy', `${yy * 100}%`)
          }}
          onPointerLeave={() => { mx.set(0); my.set(0) }}
          className={`group relative overflow-hidden ${className}`}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--hx,50%) var(--hy,50%), rgba(109,63,192,.07), transparent 65%)' }} />
          <motion.div style={{ x: bgX, y: bgY }} className={`relative ${inner}`}>
            <CardPos.Provider value={pos}>{children}</CardPos.Provider>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
