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
// Geometry in cqw. Desktop is a 16:10 stage; phones get a tall stage with larger modules so everything stays legible.
// (Set once per render by <Engine>; only one Engine exists at a time.)
const DESK = { RX: 36, RY: 21, H: 62.5, k: 1, r1: [25, 15], r2: [38, 24] }
const PHONE = { RX: 29, RY: 46, H: 120, k: 2.1, r1: [23, 38], r2: [34, 54] }
let G = DESK
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
    x: Math.cos(ang) * G.RX * r, y: Math.sin(ang) * G.RY * r,
    s: lerp(1, 0.7, a) * (0.9 + 0.2 * depth) * (1 - 0.7 * b),
    o: (1 - b) * (0.7 + 0.3 * depth), z: Math.round(depth * 10),
  }
}

// ring 1: the six capabilities as brain nodes; ring 2: supporting nodes that make the system denser
const rings = () => ({
  ring1: names.map((_, i) => { const a = ((-90 + i * 60) * Math.PI) / 180; return [Math.cos(a) * G.r1[0], Math.sin(a) * G.r1[1]] }),
  ring2: Array.from({ length: 12 }, (_, j) => { const a = ((-75 + j * 30) * Math.PI) / 180; return [Math.cos(a) * G.r2[0], Math.sin(a) * G.r2[1]] }),
})

function Module({ i, p, k }: { i: number; p: MotionValue<number>; k: number }) {
  const L = useTransform(p, (v) => layout(v, i))
  const x = useTransform(L, (l) => `${l.x}cqw`), y = useTransform(L, (l) => `${l.y}cqw`)
  const scale = useTransform(L, (l) => l.s), opacity = useTransform(L, (l) => l.o), zIndex = useTransform(L, (l) => l.z)
  const frag = useTransform(p, (v) => win(v, 0.06, 0.2) * (1 - win(v, 0.3, 0.38))) // data fragment shows briefly
  return (
    <motion.div style={{ x, y, scale, opacity, zIndex, width: `${17 * k}cqw`, borderRadius: `${1.1 * k}cqw`, padding: `${1.2 * k}cqw` }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-white/[.07] text-white">
      <span className="block tracking-[0.18em] text-white/50" style={{ fontSize: `${0.9 * k}cqw` }}>0{i + 1}</span>
      <span className="block font-sans font-medium leading-tight" style={{ fontSize: `${1.5 * k}cqw`, marginTop: `${0.4 * k}cqw` }}>{names[i]}</span>
      {k === 1 && (
        <motion.span style={{ opacity: frag }} className="mt-[0.7cqw] flex items-center gap-[0.6cqw] text-[0.95cqw] leading-snug text-purple-200">
          <i className="h-[0.5cqw] w-[0.5cqw] shrink-0 rounded-full bg-[#cdb8ff]" />{frags[i]}
        </motion.span>
      )}
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
  const cs = G.k > 1 ? 1.7 : 1 // the core is bigger on phones
  const coreR = useTransform(p, (v) => `${lerp(2.2, 7, win(v, 0.52, 0.62)) * cs}cqw`)
  const logoO = useTransform(p, (v) => win(v, 0.4, 0.5) * (1 - win(v, 0.52, 0.6)))
  const brainLabelO = useTransform(p, (v) => win(v, 0.58, 0.66) * (1 - win(v, 0.84, 0.88)))
  const brainO = useTransform(p, (v) => win(v, 0.52, 0.62) * (1 - win(v, 0.86, 0.92)))
  const fill = useTransform(p, [0.85, 0.93], ['#6D3FC0', '#F4F1FB'])

  return (
    <div id="engine-stage" style={{ aspectRatio: `100 / ${G.H}` }} className={`relative mx-auto [container-type:inline-size] ${G.k > 1 ? 'w-[92vw]' : 'w-[min(94vw,1100px)]'}`}>
      {/* connections between modules: they appear as the modules close in, and are replaced by the brain graph */}
      <svg aria-hidden viewBox={`-50 ${-G.H / 2} 100 ${G.H}`} className="absolute inset-0 h-full w-full">
        <motion.g style={{ opacity: lineO }} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".12">
          {mods.map((m, i) => <motion.line key={`c${i}`} x1={0} y1={0} x2={m.x} y2={m.y} />)}
          {mods.map((m, i) => <motion.line key={`r${i}`} x1={m.x} y1={m.y} x2={mods[(i + 1) % 6].x} y2={mods[(i + 1) % 6].y} />)}
        </motion.g>
        <Brain p={p} opacity={brainO} />
      </svg>

      {mods.map((_, i) => <Module key={i} i={i} p={p} k={G.k} />)}

      {/* the core: one module that is all six, then the brain, then the next section's colour */}
      <motion.div style={{ scale: coreS, borderRadius: coreR, backgroundColor: fill, width: `${14 * cs}cqw`, height: `${14 * cs}cqw` }} className="absolute left-1/2 top-1/2 z-20 grid -translate-x-1/2 -translate-y-1/2 place-items-center shadow-[0_0_0_1cqw_rgb(109_63_192/.18)]">
        <motion.span style={{ opacity: logoO, fontSize: `${2.4 * cs}cqw` }} className="absolute flex items-baseline gap-[0.3cqw] font-sans font-medium text-white">
          <i className="rounded-full bg-white" style={{ width: `${0.5 * cs}cqw`, height: `${0.5 * cs}cqw` }} />f&#305;n&#305;sm
        </motion.span>
        <motion.span style={{ opacity: brainLabelO, fontSize: `${1.7 * cs}cqw` }} className="absolute text-center font-sans font-medium leading-tight text-white">GCC<br />Brain</motion.span>
      </motion.div>
    </div>
  )
}

function Brain({ p, opacity }: { p: MotionValue<number>; opacity: MotionValue<number> }) {
  const { ring1, ring2 } = rings()
  const ph = G.k > 1
  return (
    <motion.g style={{ opacity }}>
      {ring2.map(([x, y], j) => <BrainNode key={`b${j}`} p={p} from={0.68 + j * 0.01} x={x} y={y} r={ph ? 0.9 : 0.55} link={ring1[Math.round(j / 2) % 6]} ph={ph} />)}
      {ring1.map(([x, y], i) => <BrainNode key={`a${i}`} p={p} from={0.56 + i * 0.015} x={x} y={y} r={ph ? 1.8 : 1.1} label={names[i]} link={[0, 0]} pulse ph={ph} />)}
    </motion.g>
  )
}
function BrainNode({ p, from, x, y, r, link, label, pulse, ph }: { ph: boolean; p: MotionValue<number>; from: number; x: number; y: number; r: number; link: number[]; label?: string; pulse?: boolean }) {
  const o = useTransform(p, (v) => win(v, from, from + 0.06))
  const d = `M${link[0]} ${link[1]} L${x} ${y}`
  return (
    <motion.g style={{ opacity: o }}>
      <path d={d} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".12" fill="none" />
      <circle cx={x} cy={y} r={r} fill={label ? '#F4F1FB' : '#cdb8ff'} />
      {label && <text x={x} y={y + (y < 0 ? (ph ? -3.4 : -2.3) : (ph ? 5 : 3.4))} textAnchor="middle" fontSize={ph ? 3 : 1.6} fill="#fff" fillOpacity=".85" fontFamily="Nunito Sans, sans-serif">{label}</text>}
      {pulse && ( // a bead of data travelling from the core out to the node
        <circle r={ph ? 0.8 : 0.5} fill="#fff">
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
      <h2 className="text-[clamp(1.6rem,3.6vw,3rem)] font-normal leading-[1.1] !text-white">{t}</h2>
      <p className="mt-2 max-w-sm text-sm text-white/60 md:mt-3 md:text-base">{s}</p>
    </motion.div>
  )
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)'); const s = () => setNarrow(mq.matches)
    mq.addEventListener('change', s); return () => mq.removeEventListener('change', s)
  }, [])
  return narrow
}

export default function Engine() {
  const root = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const still = !!useReducedMotion()
  const narrow = useNarrow()
  G = narrow ? PHONE : DESK
  const captionO = useTransform(p, (v) => 1 - win(v, 0.84, 0.9))

  if (still) { // reduced motion: the finished system, no choreography
    const { ring1 } = rings()
    return (
      <section data-no-dot className="bg-ink px-6 py-20 text-white">
        <p className="eyebrow !text-white/50">The capability engine</p>
        <h2 className="mt-4 text-[clamp(2rem,8vw,2.6rem)] font-normal leading-[1.1] !text-white">Six capabilities. <em className="!text-[#cdb8ff]">One connected system.</em></h2>
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
    <div ref={root} style={{ height: narrow ? '420vh' : '520vh' }} data-engine>
      <div className={`sticky top-0 grid h-[100svh] overflow-hidden bg-ink ${narrow ? 'place-items-end pb-6' : 'place-items-center'}`}>
        <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / .04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .04) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
        <motion.div style={{ opacity: captionO }} className="absolute left-6 top-20 z-30 h-28 w-[calc(100vw-3rem)] md:left-[max(1.5rem,calc(50%-34rem))] md:top-28 md:h-40 md:w-[min(26rem,40vw)]">
          <p className="eyebrow !text-white/50 mb-4">The capability engine</p>
          <div className="relative">{captions.map((c) => <Caption key={c.t} p={p} {...c} />)}</div>
        </motion.div>
        <Stage p={p} />
      </div>
    </div>
  )
}
