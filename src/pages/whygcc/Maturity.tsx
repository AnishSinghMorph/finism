import { Link } from 'react-router-dom'
import { motion, useTransform, type MotionValue } from 'motion/react'
import Photo from '../../components/Photo'
import Magnetic from '../../components/Magnetic'
import { matrix } from '../../content'

// GCC MATURITY. One system seen through three ages: Set up (sparse, assembling, restless) -> Stabilise (a dense, locked,
// calm lattice) -> Scale (the same system grows outward and takes on more). It never resets: every position is a continuous
// function of scroll, so scrolling back un-matures it. Units: 100 x 80 stage (1 unit = 1cqw). Motion values only.
//   f = whole-section progress (0..1); cardP = re-timed card progress, used to sync the buyer-question rows with their nodes.

const c01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const win = (f: number, a: number, b: number) => ease(c01((f - a) / (b - a)))
const back = (t: number, c1 = 1.1) => { const u = c01(t) - 1; return 1 + (c1 + 1) * u * u * u + c1 * u * u } // eases out with a small settle
const CX = 50, CY = 40

// how the whole system breathes in and out: compress to the centre, expand, then (finale) resolve to one point
const spread = (f: number) => {
  const k = f < 0.575 ? 1 - 0.88 * win(f, 0.5, 0.575) : lerp(0.12, 1, back(win(f, 0.575, 0.69)))
  return k * (1 - 0.94 * win(f, 0.9, 0.98))
}

type P = [number, number]
type Node = { id: string; org: P; lat: P; grown: P; r: number; show: [number, number]; q?: number; label?: string; far?: boolean }
const core: Node = { id: 'core', org: [CX, CY], lat: [CX, CY], grown: [CX, CY], r: 2.4, show: [0, 0.01] }
const qn: Node[] = [
  { id: 'talent', org: [50, 14], lat: [50, 26], grown: [50, 23], r: 1.5, show: [0, 0.06], q: 0, label: 'Talent' },
  { id: 'business', org: [24, 34], lat: [34, 40], grown: [33, 40], r: 1.5, show: [0.02, 0.08], q: 1, label: 'Business case' },
  { id: 'integration', org: [30, 60], lat: [50, 54], grown: [50, 57], r: 1.5, show: [0.04, 0.1], q: 3, label: 'Integration' },
  { id: 'success', org: [70, 60], lat: [66, 40], grown: [67, 40], r: 1.5, show: [0.04, 0.1], q: 4, label: 'Success' },
]
const corners: Node[] = ([[34, 26, 33, 23], [66, 26, 67, 23], [34, 54, 33, 57], [66, 54, 67, 57]] as number[][]).map(([x, y, gx, gy], i) => ({ id: `c${i}`, org: [CX, CY], lat: [x, y], grown: [gx, gy], r: 1.1, show: [0.28 + i * 0.02, 0.4 + i * 0.02] }))
const edge: Node[] = ([[34, 26, 16, 23], [34, 40, 16, 40], [34, 54, 16, 57], [66, 26, 84, 23], [66, 40, 84, 40], [66, 54, 84, 57]] as number[][]).map(([x, y, gx, gy], i) => ({ id: `e${i}`, org: [x, y], lat: [x, y], grown: [gx, gy], r: 1.1, show: [0.6 + i * 0.01, 0.72 + i * 0.01] }))
const hexAng = [-90, -30, 30, 90, 150, 210]
const hexAt = (rx: number, ry: number, a: number): P => [CX + Math.cos((a * Math.PI) / 180) * rx, CY + Math.sin((a * Math.PI) / 180) * ry]
const near: P[] = [[50, 26], [66, 26], [66, 54], [50, 54], [34, 54], [34, 26]]
const outer: Node[] = hexAng.map((a, i) => ({ id: `o${i}`, org: near[i], lat: near[i], grown: hexAt(43, 34, a), r: 1.4, show: [0.68 + i * 0.01, 0.8 + i * 0.01], label: matrix[i][0], far: true }))
const sats: Node[] = [-60, 0, 60, 120, 180, 240].map((a, i) => ({ id: `s${i}`, org: near[i], lat: near[i], grown: hexAt(48, 38, a), r: 0.6, show: [0.74 + i * 0.01, 0.84 + i * 0.01], far: true }))
const nodes = [core, ...qn, ...corners, ...edge, ...outer, ...sats]
const byId = Object.fromEntries(nodes.map((n, i) => [n.id, i]))

// links: [a, b, kind, index]
type LinkK = 'solid' | 'prov' | 'stab' | 'scale' | 'outer' | 'sat'
const links: [string, string, LinkK][] = [
  ['core', 'talent', 'solid'], ['core', 'business', 'solid'],
  ['core', 'success', 'prov'], ['core', 'integration', 'prov'], ['talent', 'business', 'prov'],
  ['c0', 'talent', 'stab'], ['talent', 'c1', 'stab'], ['business', 'c0', 'stab'], ['c1', 'success', 'stab'], ['success', 'c3', 'stab'], ['business', 'c2', 'stab'], ['c2', 'integration', 'stab'], ['integration', 'c3', 'stab'],
  ['e0', 'c0', 'scale'], ['e1', 'business', 'scale'], ['e2', 'c2', 'scale'], ['e3', 'c1', 'scale'], ['e4', 'success', 'scale'], ['e5', 'c3', 'scale'], ['e0', 'e1', 'scale'], ['e1', 'e2', 'scale'], ['e3', 'e4', 'scale'], ['e4', 'e5', 'scale'],
  ['o0', 'talent', 'outer'], ['o1', 'c1', 'outer'], ['o2', 'c3', 'outer'], ['o3', 'integration', 'outer'], ['o4', 'c2', 'outer'], ['o5', 'c0', 'outer'],
  ['s0', 'o0', 'sat'], ['s1', 'o1', 'sat'], ['s2', 'o2', 'sat'], ['s3', 'o3', 'sat'], ['s4', 'o4', 'sat'], ['s5', 'o5', 'sat'],
]

// a buyer-question row is "in emphasis" while the card is part-way through its stage: five slots across each card's visit
const bump = (P: number, k: number) => { let best = 0; for (const s of [0, 1, 2]) best = Math.max(best, 1 - Math.min(1, Math.abs(P * 2 - s - (-0.4 + 0.2 * k)) / 0.11)); return best }

function useNodeMV(f: MotionValue<number>, n: Node) {
  const xy = useTransform(f, (v) => {
    const st = back(win(v, 0.22, 0.44), 0.8), gr = back(win(v, 0.575, 0.7)), k = spread(v)
    const x = lerp(lerp(n.org[0], n.lat[0], st), n.grown[0], gr), y = lerp(lerp(n.org[1], n.lat[1], st), n.grown[1], gr)
    return [CX + (x - CX) * k, CY + (y - CY) * k]
  })
  const x = useTransform(xy, (a) => a[0]), y = useTransform(xy, (a) => a[1])
  const o = useTransform(f, (v) => win(v, n.show[0], n.show[1]) * (n.far ? 1 - win(v, 0.84, 0.9) : 1) * (n.id === 'core' ? 1 : 1 - win(v, 0.9, 0.96)))
  return { x, y, o }
}

function Dot({ n, mv, em, fs }: { fs: number; n: Node; mv: { x: MotionValue<number>; y: MotionValue<number>; o: MotionValue<number> }; em?: MotionValue<number> }) {
  const r = useTransform(em ?? mv.o, (e) => n.r * (1 + (em ? 0.4 * e : 0)))
  const label = useTransform(em ?? mv.o, (e) => (em ? 0.5 + 0.5 * e : 0.7))
  const labelO = useTransform([mv.o, label] as MotionValue<number>[], ([a, b]: number[]) => a * b)
  const ly = n.far ? 3.2 : 3.4
  return (
    <g>
      <motion.circle cx={mv.x} cy={mv.y} r={r} fill="#fff" stroke="#6D3FC0" strokeWidth=".16" style={{ opacity: mv.o }} />
      <motion.circle cx={mv.x} cy={mv.y} r={useTransform(r, (v) => v * 0.55)} fill="#6D3FC0" style={{ opacity: mv.o }} />
      {n.label && <motion.text x={mv.x} y={useTransform(mv.y, (v) => v + (n.far && v < CY ? -ly : ly + 0.6))} textAnchor="middle" fontSize={fs} fill="#241640" style={{ opacity: labelO }}>{n.label}</motion.text>}
    </g>
  )
}

function Edge({ a, b, kind, i, mvs, f }: { a: string; b: string; kind: LinkK; i: number; mvs: ReturnType<typeof useNodeMV>[]; f: MotionValue<number> }) {
  const A = mvs[byId[a]], B = mvs[byId[b]]
  const draw = useTransform(f, (v) => {
    switch (kind) {
      case 'solid': return win(v, 0.02 + i * 0.03, 0.14 + i * 0.03)
      case 'prov': return 0.45 * win(v, 0.06 + i * 0.03, 0.18 + i * 0.03) * (1 - win(v, 0.26, 0.4)) + win(v, 0.26 + i * 0.015, 0.4)
      case 'stab': return win(v, 0.28 + i * 0.012, 0.42 + i * 0.012)
      case 'scale': return win(v, 0.6 + i * 0.008, 0.72 + i * 0.008)
      case 'outer': return win(v, 0.7 + i * 0.01, 0.8 + i * 0.01)
      default: return win(v, 0.76 + i * 0.01, 0.84 + i * 0.01)
    }
  })
  const o = useTransform(f, (v) => {
    const res = 1 - win(v, 0.9, 0.96)
    return res * (kind === 'outer' || kind === 'sat' ? 1 - win(v, 0.84, 0.9) : 1) * (kind === 'sat' ? 0.5 : kind === 'prov' ? 0.7 : 0.6)
  })
  const opacity = useTransform([draw, o] as MotionValue<number>[], ([d, k]: number[]) => (d > 0.001 ? k : 0))
  return <motion.line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#6D3FC0" strokeWidth={kind === 'solid' || kind === 'stab' ? 0.18 : 0.13} strokeDasharray={kind === 'prov' || kind === 'sat' ? '0.8 1' : undefined} style={{ pathLength: draw, opacity }} />
}

// the five buyer-question symbols, hung on their nodes
function Glyphs({ f, mvs, em }: { f: MotionValue<number>; mvs: ReturnType<typeof useNodeMV>[]; em: MotionValue<number>[] }) {
  const T = mvs[byId.talent], B = mvs[byId.business], S = mvs[byId.success], I = mvs[byId.integration], K = mvs[0]
  const fade = (v: number) => 1 - win(v, 0.9, 0.96)
  const talentIn = useTransform(f, (v) => win(v, 0.04, 0.18)), bizIn = useTransform(f, (v) => win(v, 0.08, 0.2) * fade(v))
  const trail = useTransform(f, (v) => win(v, 0.16, 0.34)), trail2 = useTransform(f, (v) => win(v, 0.62, 0.74))
  const t1O = useTransform(trail, (v) => (v > 0.001 ? 1 : 0)), t2O = useTransform(trail2, (v) => (v > 0.001 ? 1 : 0)) // a zero-length round-capped path would still draw a dot
  const bridge = useTransform(f, (v) => win(v, 0.26, 0.42))
  const ringDash = useTransform(f, (v) => 0.4 * win(v, 0.08, 0.2) * (1 - win(v, 0.26, 0.4))), ringSolid = useTransform(f, (v) => win(v, 0.26, 0.42))
  const ringR = useTransform(f, (v) => Math.max(3.4, 9.5 * spread(v))), ringO = useTransform(f, (v) => fade(v))
  const ringStroke = useTransform(em[2], (e) => 0.16 + 0.22 * e)
  const talentO = useTransform([talentIn, T.o, em[0]] as MotionValue<number>[], ([a, b, e]: number[]) => a * b * (0.6 + 0.4 * e))
  const offs: P[] = [[-4, -2.5], [4, -2.5], [-3.2, 2.8], [3.4, 2.6]]
  return (
    <g>
      {/* talent and capacity: people arrive from outside and join the network */}
      <motion.g style={{ x: T.x, y: T.y, opacity: talentO }}>
        {offs.map(([x, y], i) => <TalentDot key={i} x={x} y={y} k={talentIn} i={i} />)}
      </motion.g>
      {/* business case: a small measurement structure */}
      <motion.g style={{ x: B.x, y: B.y, opacity: useTransform([bizIn, em[1]] as MotionValue<number>[], ([a, e]: number[]) => a * (0.6 + 0.4 * e)) }}>
        {[2, 3.4, 5].map((h, i) => <motion.rect key={i} x={3 + i * 2} y={2 - h} width={1.3} height={h} fill="#6D3FC0" style={{ scaleY: bizIn, transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
      </motion.g>
      {/* control and quality: a ring around the core, dashed while incomplete, solid when governed */}
      <g data-ring>
        <motion.circle cx={K.x} cy={K.y} r={ringR} fill="none" stroke="#6D3FC0" strokeDasharray="1 1.1" style={{ pathLength: ringDash, opacity: ringO, rotate: -90, transformBox: 'fill-box', transformOrigin: 'center', strokeWidth: ringStroke }} />
        <motion.circle cx={K.x} cy={K.y} r={ringR} fill="none" stroke="#6D3FC0" style={{ pathLength: ringSolid, opacity: ringO, rotate: -90, transformBox: 'fill-box', transformOrigin: 'center', strokeWidth: ringStroke }} />
      </g>
      {/* integration: bridges between system areas */}
      <motion.g style={{ x: I.x, y: I.y, opacity: useTransform([I.o, em[3]] as MotionValue<number>[], ([a, e]: number[]) => a * (0.55 + 0.45 * e)) }}>
        <motion.path d="M-9 -1 Q0 -6.5 9 -1" fill="none" stroke="#6D3FC0" strokeWidth=".2" style={{ pathLength: bridge }} />
      </motion.g>
      {/* success after launch: a forward trajectory that keeps climbing as the system scales */}
      <motion.g style={{ x: S.x, y: S.y, opacity: useTransform([S.o, em[4]] as MotionValue<number>[], ([a, e]: number[]) => a * (0.55 + 0.45 * e)) }}>
        <motion.path d="M1 -1 L5 -3 L9 -3.6 L14 -8" fill="none" stroke="#6D3FC0" strokeWidth=".24" strokeLinecap="round" style={{ pathLength: trail, opacity: t1O }} />
        <motion.path d="M14 -8 L19 -12.5 M19 -12.5 L16.6 -12 M19 -12.5 L18.8 -10" fill="none" stroke="#6D3FC0" strokeWidth=".24" strokeLinecap="round" style={{ pathLength: trail2, opacity: t2O }} />
      </motion.g>
    </g>
  )
}
function TalentDot({ x, y, k, i }: { x: number; y: number; k: MotionValue<number>; i: number }) {
  const m = useTransform(k, (t) => 1 + (1 - back(t)) * 4) // people fly in from beyond the stage, then settle
  const cx = useTransform(m, (v) => x * v), cy = useTransform(m, (v) => y * v)
  return <g><motion.line x1={0} y1={0} x2={cx} y2={cy} stroke="#6D3FC0" strokeWidth=".14" strokeOpacity=".6" /><motion.circle cx={cx} cy={cy} r={0.65 + (i % 2) * 0.1} fill="#6D3FC0" /></g>
}

export default function Maturity({ cardP, f, phone = false }: { cardP: MotionValue<number>; f: MotionValue<number>; phone?: boolean }) {
  const mvs = nodes.map((n) => useNodeMV(f, n)) // eslint-disable-line react-hooks/rules-of-hooks
  const em = [0, 1, 2, 3, 4].map((k) => useTransform(cardP, (P) => bump(P, k))) // eslint-disable-line react-hooks/rules-of-hooks
  const amp = useTransform(f, (v) => lerp(1.5, 0.15, win(v, 0.18, 0.46)) * (v > 0.575 ? lerp(1, 2, win(v, 0.6, 0.7)) * (1 - win(v, 0.8, 0.9)) : 1)) // restless -> calm -> a little alive -> still
  const shift = useTransform(f, (v) => (phone ? '0vw' : `${-18 * win(v, 0.9, 0.97)}vw`))
  const coreR = useTransform(f, (v) => lerp(1.2, 2.4, win(v, 0, 0.2)) * lerp(1, 1.5, win(v, 0.9, 0.98)))
  const coreRing = useTransform(f, (v) => win(v, 0.02, 0.2))
  const coreRingR = useTransform(coreR, (r) => r + 1.2)
  const tile = {
    x: useTransform(f, [0.62, 0.66, 0.74, 0.78, 0.86], [67, 67, 50, 50, 24].map((v) => `${v}cqw`)),
    y: useTransform(f, [0.62, 0.66, 0.74, 0.78, 0.86], [57, 57, 40, 40, 68].map((v) => `${v}cqw`)),
    scale: useTransform(f, [0.62, 0.66, 0.74, 0.78, 0.86], [0.3, 0.3, 2.6, 2.6, 1]),
    opacity: useTransform(f, (v) => win(v, 0.62, 0.66) * (1 - win(v, 0.88, 0.94))),
  }
  const tileLink = useTransform(f, (v) => win(v, 0.82, 0.9) * (1 - win(v, 0.9, 0.95)))
  const ctaO = useTransform(f, (v) => win(v, 0.95, 1)), ctaY = useTransform(ctaO, (v) => `${(1 - v) * 3}cqw`)
  const ctaEv = useTransform(f, (v) => (v > 0.97 ? 'auto' : 'none'))

  return (
    <div className={phone ? 'pointer-events-none absolute inset-x-0 top-[4.2rem] flex justify-center' : 'pointer-events-none absolute inset-y-0 right-0 flex w-[64%] items-center justify-center'}>
      <motion.div
        style={{ x: shift, '--amp': amp } as never}
        className={`relative aspect-[100/80] [container-type:inline-size] ${phone ? 'w-full' : 'w-[min(100%,calc((100svh-9rem)*1.25))]'}`}
      >
        <svg aria-hidden viewBox="0 0 100 80" className="mat absolute inset-0 h-full w-full overflow-visible">
          <g>{links.map(([a, b, k]) => <Edge key={`${a}-${b}`} a={a} b={b} kind={k} i={links.filter((l) => l[2] === k).findIndex((l) => l[0] === a && l[1] === b)} mvs={mvs} f={f} />)}</g>
          <motion.line x1={mvs[byId.o4].x} y1={mvs[byId.o4].y} x2={24} y2={68} stroke="#6D3FC0" strokeWidth=".13" strokeDasharray=".8 1" style={{ opacity: tileLink }} />
          <Glyphs f={f} mvs={mvs} em={em} />
          {nodes.slice(1).map((n, i) => <g key={n.id} className="mat-drift" style={{ animationDelay: `${-i * 0.9}s` }}><Dot n={n} mv={mvs[i + 1]} em={n.q !== undefined ? em[n.q] : undefined} fs={phone ? 2.6 : 1.7} /></g>)}
          {/* the core: hollow at first, then the strongest point in the system */}
          <motion.circle cx={mvs[0].x} cy={mvs[0].y} r={coreRingR} fill="none" stroke="#6D3FC0" strokeWidth=".15" strokeOpacity=".5" style={{ opacity: coreRing }} />
          <motion.circle cx={mvs[0].x} cy={mvs[0].y} r={coreR} fill="#6D3FC0" style={{ opacity: useTransform(f, (v) => 0.25 + 0.75 * win(v, 0.02, 0.2)) }} />
          <text x={CX} y={CY + 0.75} textAnchor="middle" fontSize={phone ? 2.6 : 1.8} fill="#fff" className="font-sans" fontWeight="500" style={{ pointerEvents: 'none' }}>GCC</text>
        </svg>

        <motion.div style={tile} className="absolute left-0 top-0 h-[14cqw] w-[22cqw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1cqw] border border-purple/30 shadow-[0_2cqw_4cqw_-2cqw_rgb(36_22_64/.35)]">
          <Photo photo="workspace" sizes="40vw" className="saturate-[.85]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        </motion.div>

        <motion.div style={{ opacity: ctaO, y: ctaY, pointerEvents: ctaEv }} className={`absolute left-1/2 z-20 -translate-x-1/2 text-center ${phone ? 'top-[52cqw] w-[92cqw]' : 'top-[50cqw] w-[70cqw]'}`}>
          <p className={`font-sans font-normal leading-tight text-deep ${phone ? 'text-[5.6cqw]' : 'text-[3.2cqw]'}`}>See how it plays out for your centre.</p>
          <div className="mt-[2cqw]"><Magnetic><Link to="/plan-your-gcc/readiness-check" className="group inline-flex items-center gap-2 rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">Take the Readiness Check <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span></Link></Magnetic></div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// phones / tablets / reduced motion: the same three ages as small static diagrams (vertical stack of cards carries the story)
export function StageGlyph({ stage, className = '' }: { stage: 0 | 1 | 2; className?: string }) {
  const grid3: P[] = [[30, 14], [50, 14], [70, 14], [30, 30], [50, 30], [70, 30], [30, 46], [50, 46], [70, 46]]
  const sparse: P[] = [[50, 10], [26, 26], [50, 30], [34, 48], [66, 46]]
  return (
    <svg aria-hidden viewBox="0 0 100 58" className={`h-24 w-full ${className}`}>
      {stage === 0 && <g stroke="#6D3FC0" strokeWidth=".6" fill="none"><path d="M50 10 L50 30 M26 26 L50 30" /><path d="M50 30 L34 48 M50 30 L66 46" strokeDasharray="2 3" strokeOpacity=".55" /></g>}
      {stage === 1 && <g stroke="#6D3FC0" strokeWidth=".6" fill="none">{[0, 1, 2].map((i) => <g key={i}><path d={`M30 ${14 + i * 16} H70`} /><path d={`M${30 + i * 20} 14 V46`} /></g>)}<circle cx="50" cy="30" r="9" strokeOpacity=".5" /></g>}
      {stage === 2 && <g stroke="#6D3FC0" strokeWidth=".5" fill="none">{[0, 1, 2].map((i) => <path key={i} d={`M12 ${14 + i * 16} H88`} />)}{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${14 + i * 18} 14 V46`} />)}<ellipse cx="50" cy="30" rx="46" ry="27" strokeOpacity=".4" strokeDasharray="2 3" /></g>}
      {(stage === 0 ? sparse : stage === 1 ? grid3 : [14, 32, 50, 68, 86].flatMap((x) => [14, 30, 46].map((y): P => [x, y]))).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={stage === 2 ? 1.8 : 2.4} fill={x === 50 && y === 30 ? '#6D3FC0' : '#fff'} stroke="#6D3FC0" strokeWidth=".6" />)}
    </svg>
  )
}

// a few faint nodes and lines beside the hero: the beginning of a system, not a finished one
export function HeroSeed() {
  const pts: P[] = [[50, 12], [22, 34], [50, 38], [74, 56]]
  return (
    <svg aria-hidden viewBox="0 0 100 70" className="pointer-events-none absolute right-6 top-28 hidden w-[34%] max-w-[26rem] md:block">
      <g stroke="#6D3FC0" strokeWidth=".35" fill="none"><path d="M50 12 L50 38" strokeOpacity=".4" /><path d="M22 34 L50 38" strokeOpacity=".3" /><path d="M50 38 L74 56" strokeOpacity=".25" strokeDasharray="1.5 2.2" /></g>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 2 ? 2.6 : 1.5} fill={i === 2 ? '#6D3FC0' : '#fff'} fillOpacity={i === 2 ? 0.55 : 1} stroke="#6D3FC0" strokeOpacity=".5" strokeWidth=".35" className="pulse" style={{ animationDelay: `${i * 1.4}s` }} />)}
    </svg>
  )
}
