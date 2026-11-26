import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { brain, matrix } from '../../content'

// CAPABILITY ENGINE. One scroll-driven sequence on a dark stage:
//   six separate modules orbit inward -> lines connect them -> they merge into one core -> the core becomes the GCC Brain
//   (a node graph with data moving along it) -> the core swells to fill the screen and hands over to the next section.
// Everything derives from scroll progress `p` (0..1). Motion values only; no React state while scrolling.
// Units are container-width percentages (cqw), so the whole stage scales with the viewport.

const names = matrix.map((m) => m[0])
const frags = matrix.map((m) => m[1])
const RX = 36, RY = 21 // orbit radii (cqw)
const c01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const win = (p: number, a: number, b: number) => ease(c01((p - a) / (b - a)))

function layout(p: number, i: number) {
  const a = win(p, 0, 0.38), b = win(p, 0.38, 0.55)
  const ang = ((-90 + i * 60 + a * 55) * Math.PI) / 180
  const r = lerp(1, 0.46, a) * (1 - b)
  const depth = (Math.sin(ang) + 1) / 2 // orbiting in 3D: lower on screen reads as nearer
  return {
    x: Math.cos(ang) * RX * r, y: Math.sin(ang) * RY * r,
    s: lerp(1, 0.7, a) * (0.9 + 0.2 * depth) * (1 - 0.7 * b),
    o: (1 - b) * (0.7 + 0.3 * depth), z: Math.round(depth * 10),
  }
}

// ring 1: the six capabilities as brain nodes; ring 2: supporting nodes that make the system denser
const ring1 = names.map((_, i) => { const a = ((-90 + i * 60) * Math.PI) / 180; return [Math.cos(a) * 25, Math.sin(a) * 15] })
const ring2 = Array.from({ length: 12 }, (_, j) => { const a = ((-75 + j * 30) * Math.PI) / 180; return [Math.cos(a) * 38, Math.sin(a) * 24] })

function Module({ i, p }: { i: number; p: MotionValue<number> }) {
  const L = useTransform(p, (v) => layout(v, i))
  const x = useTransform(L, (l) => `${l.x}cqw`), y = useTransform(L, (l) => `${l.y}cqw`)
  const scale = useTransform(L, (l) => l.s), opacity = useTransform(L, (l) => l.o), zIndex = useTransform(L, (l) => l.z)
  const frag = useTransform(p, (v) => win(v, 0.06, 0.2) * (1 - win(v, 0.3, 0.38))) // data fragment shows briefly
  return (
    <motion.div style={{ x, y, scale, opacity, zIndex }} className="absolute left-1/2 top-1/2 w-[17cqw] -translate-x-1/2 -translate-y-1/2 rounded-[1.1cqw] border border-white/15 bg-white/[.07] p-[1.2cqw] text-white">
      <span className="block text-[0.9cqw] tracking-[0.18em] text-white/50">0{i + 1}</span>
      <span className="mt-[0.4cqw] block font-sans text-[1.5cqw] font-medium leading-tight">{names[i]}</span>
      <motion.span style={{ opacity: frag }} className="mt-[0.7cqw] flex items-center gap-[0.6cqw] text-[0.95cqw] leading-snug text-purple-200">
        <i className="h-[0.5cqw] w-[0.5cqw] shrink-0 rounded-full bg-[#cdb8ff]" />{frags[i]}
      </motion.span>
    </motion.div>
  )
}

function Stage({ p }: { p: MotionValue<number> }) {
  const mods = names.map((_, i) => { // eslint-disable-line react-hooks/rules-of-hooks
    const L = useTransform(p, (v) => layout(v, i)) // eslint-disable-line react-hooks/rules-of-hooks
    return { x: useTransform(L, (l) => l.x), y: useTransform(L, (l) => l.y) } // eslint-disable-line react-hooks/rules-of-hooks
  })
  const lineO = useTransform(p, (v) => win(v, 0.1, 0.28) * (1 - win(v, 0.4, 0.52)))
  const coreS = useTransform(p, (v) => win(v, 0.36, 0.5) * lerp(1, 60, win(v, 0.88, 1)))
  const coreR = useTransform(p, (v) => `${lerp(2.2, 7, win(v, 0.52, 0.62))}cqw`)
  const logoO = useTransform(p, (v) => win(v, 0.4, 0.5) * (1 - win(v, 0.52, 0.6)))
  const brainLabelO = useTransform(p, (v) => win(v, 0.58, 0.66) * (1 - win(v, 0.84, 0.88)))
  const brainO = useTransform(p, (v) => win(v, 0.52, 0.62) * (1 - win(v, 0.86, 0.92)))
  const fill = useTransform(p, [0.85, 0.93], ['#6D3FC0', '#F4F1FB'])

  return (
    <div className="relative mx-auto aspect-[16/10] w-[min(94vw,1100px)] [container-type:inline-size]">
      {/* connections between modules: they appear as the modules close in, and are replaced by the brain graph */}
      <svg aria-hidden viewBox="-50 -31.25 100 62.5" className="absolute inset-0 h-full w-full">
        <motion.g style={{ opacity: lineO }} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".12">
          {mods.map((m, i) => <motion.line key={`c${i}`} x1={0} y1={0} x2={m.x} y2={m.y} />)}
          {mods.map((m, i) => <motion.line key={`r${i}`} x1={m.x} y1={m.y} x2={mods[(i + 1) % 6].x} y2={mods[(i + 1) % 6].y} />)}
        </motion.g>
        <Brain p={p} opacity={brainO} />
      </svg>

      {mods.map((_, i) => <Module key={i} i={i} p={p} />)}

      {/* the core: one module that is all six, then the brain, then the next section's colour */}
      <motion.div style={{ scale: coreS, borderRadius: coreR, backgroundColor: fill }} className="absolute left-1/2 top-1/2 z-20 grid h-[14cqw] w-[14cqw] -translate-x-1/2 -translate-y-1/2 place-items-center shadow-[0_0_0_1cqw_rgb(109_63_192/.18)]">
        <motion.span style={{ opacity: logoO }} className="absolute flex items-baseline gap-[0.3cqw] font-sans text-[2.4cqw] font-medium text-white">
          <i className="h-[0.5cqw] w-[0.5cqw] rounded-full bg-white" />f&#305;n&#305;sm
        </motion.span>
        <motion.span style={{ opacity: brainLabelO }} className="absolute text-center font-sans text-[1.7cqw] font-medium leading-tight text-white">GCC<br />Brain</motion.span>
      </motion.div>
    </div>
  )
}

function Brain({ p, opacity }: { p: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.g style={{ opacity }}>
      {ring2.map(([x, y], j) => <BrainNode key={`b${j}`} p={p} from={0.68 + j * 0.01} x={x} y={y} r={0.55} link={ring1[Math.round(j / 2) % 6]} />)}
      {ring1.map(([x, y], i) => <BrainNode key={`a${i}`} p={p} from={0.56 + i * 0.015} x={x} y={y} r={1.1} label={names[i]} link={[0, 0]} pulse />)}
    </motion.g>
  )
}
function BrainNode({ p, from, x, y, r, link, label, pulse }: { p: MotionValue<number>; from: number; x: number; y: number; r: number; link: number[]; label?: string; pulse?: boolean }) {
  const o = useTransform(p, (v) => win(v, from, from + 0.06))
  const d = `M${link[0]} ${link[1]} L${x} ${y}`
  return (
    <motion.g style={{ opacity: o }}>
      <path d={d} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".12" fill="none" />
      <circle cx={x} cy={y} r={r} fill={label ? '#F4F1FB' : '#cdb8ff'} />
      {label && <text x={x} y={y + (y < 0 ? -2.3 : 3.4)} textAnchor="middle" fontSize="1.6" fill="#fff" fillOpacity=".85" fontFamily="Nunito Sans, sans-serif">{label}</text>}
      {pulse && ( // a bead of data travelling from the core out to the node
        <circle r=".5" fill="#fff">
          <animateMotion dur={`${3 + (from % 0.05) * 20}s`} repeatCount="indefinite" path={d} />
        </circle>
      )}
    </motion.g>
  )
}

const captions = [
  { a: -0.06, b: 0.32, t: 'Six capabilities.', s: 'Usually six vendors, six timelines, nobody accountable.' },
  { a: 0.3, b: 0.56, t: 'One connected system.', s: 'Setup, build and run under one delivery model.' },
  { a: 0.56, b: 0.86, t: 'The GCC Brain.', s: brain[2][1] },
]
function Caption({ p, a, b, t, s }: { p: MotionValue<number>; a: number; b: number; t: string; s: string }) {
  const o = useTransform(p, (v) => Math.min(win(v, a, a + 0.05), 1 - win(v, b - 0.05, b)))
  const y = useTransform(p, (v) => (1 - win(v, a, a + 0.06)) * 14 - win(v, b - 0.05, b) * 10)
  return (
    <motion.div style={{ opacity: o, y }} className="absolute inset-x-0 top-0">
      <h2 className="text-[clamp(1.9rem,3.6vw,3rem)] font-normal leading-[1.1] !text-white">{t}</h2>
      <p className="mt-3 max-w-sm text-white/60">{s}</p>
    </motion.div>
  )
}

function useStatic() {
  const reduce = useReducedMotion()
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)'); const s = () => setNarrow(mq.matches); s()
    mq.addEventListener('change', s); return () => mq.removeEventListener('change', s)
  }, [])
  return reduce || narrow
}

export default function Engine() {
  const root = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const still = useStatic()
  const captionO = useTransform(p, (v) => 1 - win(v, 0.84, 0.9))

  if (still) { // phones / reduced motion: the finished system, no choreography
    return (
      <section data-no-dot className="bg-ink px-6 py-20 text-white">
        <p className="eyebrow !text-white/50">The capability engine</p>
        <h2 className="mt-4 text-[clamp(2rem,8vw,2.6rem)] font-normal leading-[1.1]">Six capabilities. <em>One connected system.</em></h2>
        <div className="mx-auto mt-10 w-full max-w-md [container-type:inline-size]">
          <svg aria-hidden viewBox="-50 -31.25 100 62.5" className="h-auto w-full">
            {ring1.map(([x, y], i) => <g key={i}><path d={`M0 0 L${x} ${y}`} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".2" /><circle cx={x} cy={y} r="1.6" fill="#F4F1FB" /></g>)}
            <circle r="7" fill="#6D3FC0" /><text textAnchor="middle" y="1" fontSize="3" fill="#fff" fontFamily="Nunito Sans, sans-serif">GCC Brain</text>
          </svg>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-white/80">{names.map((n) => <li key={n} className="rounded-xl border border-white/15 px-3 py-2">{n}</li>)}</ul>
      </section>
    )
  }

  return (
    <div ref={root} style={{ height: '520vh' }} data-no-dot>
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden bg-ink">
        <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / .04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .04) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
        <motion.div style={{ opacity: captionO }} className="absolute left-[max(1.5rem,calc(50%-34rem))] top-28 z-30 h-40 w-[min(26rem,40vw)]">
          <p className="eyebrow !text-white/50 mb-4">The capability engine</p>
          <div className="relative">{captions.map((c) => <Caption key={c.t} p={p} {...c} />)}</div>
        </motion.div>
        <Stage p={p} />
      </div>
    </div>
  )
}
