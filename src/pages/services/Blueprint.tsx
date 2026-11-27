import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Photo, { photos } from '../../components/Photo'
import Magnetic from '../../components/Magnetic'
import { matrix, stages } from '../../content'

// THE GCC BLUEPRINT. A pinned, scroll-driven construction: an empty blueprint -> strategy (foundation) -> setup (frame)
// -> talent -> workspace -> infrastructure -> operations -> governance -> a complete GCC -> it collapses into one compact
// core that becomes the call to action. Scroll progress `p` (0..1) is the only clock; scrolling back un-builds it.
// Units: container-width percentages (cqw) on a 100 x 62.5 stage, so everything scales together. Motion values only.

const c01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const win = (p: number, a: number, b: number) => ease(c01((p - a) / (b - a)))
const CX = 50, CY = 31.25
// Desktop is a 100 x 62.5 stage. Phones get a tall stage (y stretched by sy) with larger modules (k) so it stays legible.
// (Set once per render by <Blueprint>; only one exists at a time.)
const DESK = { sy: 1, k: 1, H: 62.5, big: 3.2 }
const PHONE = { sy: 1.9, k: 2, H: 118.75, big: 2.6 }
let G = DESK
const Y = (v: number) => v * G.sy
const cyv = () => CY * G.sy

type Key = 'talent' | 'workspace' | 'infrastructure' | 'operations' | 'consulting' | 'governance'
type Mod = { k: Key; row: number; x: number; y: number; from: [number, number, number]; w: [number, number]; photo?: keyof typeof photos; big?: boolean; up?: boolean }
const mods: Mod[] = [
  { k: 'consulting', row: 4, x: 50, y: 54.5, from: [0, 16, 0.9], w: [0.1, 0.2], up: true },
  { k: 'talent', row: 0, x: 50, y: 8, from: [0, -16, 0.9], w: [0.42, 0.5], photo: 'team' },
  { k: 'workspace', row: 1, x: 22, y: 18, from: [0, 0, 1], w: [0.38, 0.52], photo: 'workspace', big: true },
  { k: 'infrastructure', row: 2, x: 22, y: 45, from: [-26, 10, 0.9], w: [0.52, 0.6], photo: 'servers', up: true },
  { k: 'operations', row: 3, x: 78, y: 18, from: [26, -8, 0.9], w: [0.6, 0.68], photo: 'operations' },
  { k: 'governance', row: 5, x: 78, y: 45, from: [26, 12, 0.9], w: [0.68, 0.76], up: true },
]

function layout(v: number, m: Mod) {
  const c = win(v, 0.82, 0.92) // collapse
  let x: number, y: number, s: number, o: number, b: number
  if (m.big) { // the workspace image arrives huge, then becomes its module: one object changing role
    const fade = win(v, m.w[0], m.w[0] + 0.03), travel = win(v, 0.44, m.w[1])
    x = (CX - m.x) * (1 - travel); y = (cyv() - Y(m.y)) * (1 - travel); s = lerp(G.big, 1, travel); o = fade; b = lerp(4, 0, fade)
  } else {
    const e = win(v, m.w[0], m.w[1])
    x = m.from[0] * (1 - e); y = m.from[1] * (1 - e); s = lerp(m.from[2], 1, e); o = e; b = lerp(4, 0, e)
  }
  return { x: x * (1 - c) + (CX - m.x) * c, y: y * (1 - c) + (cyv() - Y(m.y)) * c, s: s * (1 - 0.75 * c), o: o * (1 - c), b }
}

const useW = (p: MotionValue<number>, a: number, b: number) => useTransform(p, (v) => win(v, a, b))

// ---------- modules ----------
function Glyph({ k }: { k: Key }) {
  return (
    <svg aria-hidden viewBox="0 0 120 70" className="absolute inset-0 h-full w-full">
      {k === 'consulting' ? (
        <g fill="none" stroke="#cdb8ff" strokeWidth="1.2">
          <path d="M14 35 C 34 35, 34 18, 56 18 S 84 12, 96 12" strokeOpacity=".4" /><path d="M14 35 C 34 35, 34 18, 56 18 S 84 35, 96 35" stroke="#a78bfa" strokeWidth="2" />
          <path d="M14 35 C 34 35, 34 54, 56 54 S 84 58, 96 58" strokeOpacity=".4" />
          <circle cx="14" cy="35" r="4" fill="#6D3FC0" /><circle cx="96" cy="35" r="3" fill="#fff" /><circle cx="96" cy="12" r="2.5" fill="#fff" fillOpacity=".5" /><circle cx="96" cy="58" r="2.5" fill="#fff" fillOpacity=".5" />
        </g>
      ) : (
        <g fill="none" stroke="#cdb8ff">
          <ellipse cx="60" cy="35" rx="40" ry="26" strokeOpacity=".35" /><ellipse cx="60" cy="35" rx="24" ry="15" strokeOpacity=".6" strokeDasharray="2 3" />
          {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60 - 90) * Math.PI / 180; return <circle key={i} cx={60 + Math.cos(a) * 40} cy={35 + Math.sin(a) * 26} r="2.4" fill="#fff" stroke="none" /> })}
          <circle cx="60" cy="35" r="7" fill="#6D3FC0" stroke="none" />
        </g>
      )}
    </svg>
  )
}

function Module({ m, p, stage }: { m: Mod; p: MotionValue<number>; stage: RefObject<HTMLDivElement | null> }) {
  const L = useTransform(p, (v) => layout(v, m))
  const x = useTransform(L, (l) => `${l.x}cqw`), y = useTransform(L, (l) => `${l.y}cqw`)
  const scale = useTransform(L, (l) => l.s), opacity = useTransform(L, (l) => l.o)
  const filter = useTransform(L, (l) => (l.b < 0.1 ? 'none' : `blur(${l.b.toFixed(1)}px)`))
  const live = useTransform(p, (v) => (v > 0.76 && v < 0.84 ? 'auto' : 'none'))
  const wipe = useTransform(p, (v) => `inset(0 ${(1 - (m.big ? win(v, 0.385, 0.44) : win(v, m.w[0] + 0.02, m.w[1] + 0.03))) * 100}% 0 0)`) // the photograph is drawn into its plane
  const [name, strat, setup, oper] = matrix[m.row]

  const on = (el: HTMLElement | null, yes: boolean) => {
    if (!el || !stage.current) return
    if (yes) { stage.current.dataset.focus = m.k; el.setAttribute('data-on', '') } else { delete stage.current.dataset.focus; el.removeAttribute('data-on') }
  }
  return (
    <motion.div
      style={{ x, y, scale, opacity, filter, left: `${m.x}cqw`, top: `${Y(m.y)}cqw`, zIndex: m.big ? 30 : 10, pointerEvents: live, width: `${18 * G.k}cqw` }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div
        style={{ height: `${(G.k > 1 ? 9.4 : 11.5) * G.k}cqw`, borderRadius: `${G.k}cqw` }}
        className="bp-mod relative overflow-hidden border border-white/25 bg-[#2d1a52] shadow-[0_2cqw_3cqw_-1.5cqw_rgb(0_0_0/.55)] [translate:calc(var(--px,0)*.5cqw)_calc(var(--py,0)*.4cqw)]"
        onPointerEnter={(e) => on(e.currentTarget, true)}
        onPointerLeave={(e) => { on(e.currentTarget, false); e.currentTarget.style.setProperty('--px', '0'); e.currentTarget.style.setProperty('--py', '0') }}
        onPointerMove={(e) => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5)); e.currentTarget.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5)) }}
      >
        {m.photo ? (
          <motion.div style={{ clipPath: wipe }} className="absolute inset-[-4%] [translate:calc(var(--px,0)*-.7cqw)_calc(var(--py,0)*-.5cqw)]">
            <div className="h-full w-full [clip-path:polygon(5%_0,100%_0,95%_100%,0_100%)]"><Photo photo={m.photo} sizes="30vw" className="saturate-[.8]" /></div>
          </motion.div>
        ) : <Glyph k={m.k} />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-deep/20 to-transparent" />
        <div aria-hidden className="absolute rounded-[.5cqw] border border-white/15" style={{ inset: `${0.8 * G.k}cqw` }} />
        <div className="absolute text-white" style={{ left: `${1.2 * G.k}cqw`, right: `${1.2 * G.k}cqw`, bottom: `${G.k}cqw` }}>
          <span className="block tracking-[0.18em] text-white/60" style={{ fontSize: `${0.85 * G.k}cqw` }}>0{m.row + 1}</span>
          <span className="block font-sans font-medium leading-tight" style={{ fontSize: `${1.5 * G.k}cqw` }}>{name}</span>
        </div>
      </div>
      <div className={`bp-panel absolute left-0 z-40 w-full rounded-[.8cqw] border border-white/20 bg-ink/95 p-[1cqw] leading-snug text-white/85 ${m.up ? 'bottom-full mb-[.8cqw]' : 'top-full mt-[.8cqw]'}`} style={{ fontSize: `${1 * G.k * (G.k > 1 ? 1.3 : 1)}cqw`, padding: `${G.k}cqw` }}>
        {[['Strategy', strat], ['Setup', setup], ['Operate', oper]].map(([l, t]) => (
          <p key={l} className="mb-[.5cqw] last:mb-0"><span className="mr-[.6cqw] uppercase tracking-[.14em] text-[#cdb8ff]" style={{ fontSize: `${0.85 * G.k}cqw` }}>{l}</span>{t}</p>
        ))}
      </div>
    </motion.div>
  )
}

// ---------- structure layers (SVG) ----------
function Draw({ p, a, b, d, className = '', stroke = '#fff', sw = 0.12, op = 0.35, dash, forKey }: { p: MotionValue<number>; a: number; b: number; d: string; className?: string; stroke?: string; sw?: number; op?: number; dash?: string; forKey?: string }) {
  const pathLength = useW(p, a, b)
  const opacity = useTransform(pathLength, (v) => (v > 0 ? op : 0))
  return <g data-for={forKey}><motion.path d={d} style={{ pathLength, opacity }} fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash} className={className} /></g>
}

const talentPts = [[44, 17], [50, 16], [56, 17], [47, 21], [53, 21], [41, 22], [59, 22], [50, 24], [45, 25], [55, 25], [38, 19], [62, 19]]
const talentLinks = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 6], [3, 7], [4, 7], [7, 8], [7, 9], [5, 10], [6, 11], [0, 10], [2, 11]]
const routePath = (m: Mod) => (m.x === 50 ? `M${m.x} ${Y(m.y)} L${CX} ${cyv()}` : `M${m.x} ${Y(m.y)} Q${CX} ${Y(m.y)} ${CX} ${cyv()}`)
const ringLinks = (): [Mod['k'], Mod['k'], string][] => [
  ['workspace', 'infrastructure', `M22 ${Y(18)} L22 ${Y(45)}`], ['operations', 'governance', `M78 ${Y(18)} L78 ${Y(45)}`],
  ['talent', 'workspace', `M50 ${Y(8)} Q22 ${Y(8)} 22 ${Y(18)}`], ['talent', 'operations', `M50 ${Y(8)} Q78 ${Y(8)} 78 ${Y(18)}`],
  ['consulting', 'infrastructure', `M50 ${Y(54.5)} Q22 ${Y(54.5)} 22 ${Y(45)}`], ['consulting', 'governance', `M50 ${Y(54.5)} Q78 ${Y(54.5)} 78 ${Y(45)}`],
]

function TalentNode({ p, i }: { p: MotionValue<number>; i: number }) {
  const fx = talentPts[i][0], fy = Y(talentPts[i][1])
  const e = useW(p, 0.3 + i * 0.006, 0.42 + i * 0.004)
  const cx = useTransform(e, (t) => lerp(CX + (fx - CX) * 6, fx, t)), cy = useTransform(e, (t) => lerp(cyv() + (fy - cyv()) * 6, fy, t))
  return <motion.circle cx={cx} cy={cy} r={0.55} fill="#F4F1FB" style={{ opacity: e }} />
}
function TalentLink({ p, a, b }: { p: MotionValue<number>; a: number; b: number }) {
  const o = useW(p, 0.42, 0.5)
  const x1 = talentPts[a][0], y1 = Y(talentPts[a][1]), x2 = talentPts[b][0], y2 = Y(talentPts[b][1])
  return <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cdb8ff" strokeWidth=".1" style={{ opacity: useTransform(o, (v) => v * 0.55) }} />
}

function Structure({ p }: { p: MotionValue<number> }) {
  const c = useW(p, 0.84, 0.92)
  const scale = useTransform(c, (v) => lerp(1, 0.22, v)), opacity = useTransform(c, (v) => 1 - v)
  const plate = useW(p, 0.08, 0.2)
  const plateS = useTransform(plate, (v) => lerp(0.6, 1, v))
  const planeA = useW(p, 0.38, 0.5), planeB = useW(p, 0.5, 0.62)
  const planeAx = useTransform(planeA, (v) => (1 - v) * -30), planeBy = useTransform(planeB, (v) => (1 - v) * 12)
  const sig = useTransform(p, (v) => win(v, 0.6, 0.7) * (1 - 0.75 * win(v, 0.78, 0.84)))
  const ring = useW(p, 0.68, 0.78)
  return (
    <motion.g style={{ scale, opacity, transformBox: 'fill-box', transformOrigin: 'center' }}>
      {/* strategy: a foundation plate */}
      <motion.g style={{ opacity: plate, scale: plateS, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x="19" y={Y(9)} width="62" height={Y(44)} rx="1.5" fill="rgb(255 255 255 / .035)" stroke="#fff" strokeOpacity=".25" strokeWidth=".15" />
        <rect x="23" y={Y(13)} width="54" height={Y(36)} rx="1" fill="none" stroke="#cdb8ff" strokeOpacity=".3" strokeWidth=".12" strokeDasharray="1 1.4" />
      </motion.g>
      {/* setup: a structural frame grows around it */}
      <Draw p={p} a={0.2} b={0.3} d={`M9 ${Y(9)} V${Y(3)} H17`} op={0.7} sw={0.22} /><Draw p={p} a={0.21} b={0.31} d={`M83 ${Y(3)} H91 V${Y(9)}`} op={0.7} sw={0.22} />
      <Draw p={p} a={0.22} b={0.32} d={`M91 ${Y(53)} V${Y(59)} H83`} op={0.7} sw={0.22} /><Draw p={p} a={0.23} b={0.33} d={`M17 ${Y(59)} H9 V${Y(53)}`} op={0.7} sw={0.22} />
      <Draw p={p} a={0.24} b={0.34} d={`M9 ${Y(9)} V${Y(53)}`} op={0.22} dash="1 1.2" /><Draw p={p} a={0.24} b={0.34} d={`M91 ${Y(9)} V${Y(53)}`} op={0.22} dash="1 1.2" />
      {/* workspace: architectural planes slide in and lock */}
      <motion.polygon points={`6,${Y(22)} 36,${Y(22)} 32,${Y(42)} 2,${Y(42)}`} fill="rgb(255 255 255 / .04)" stroke="#fff" strokeOpacity=".2" strokeWidth=".12" style={{ x: planeAx, opacity: planeA }} data-for="workspace" />
      <motion.polygon points={`30,${Y(50)} 70,${Y(50)} 74,${Y(56)} 26,${Y(56)}`} fill="rgb(255 255 255 / .04)" stroke="#fff" strokeOpacity=".2" strokeWidth=".12" style={{ y: planeBy, opacity: planeB }} />
      {/* talent: nodes arrive from beyond the edges and assemble */}
      <g data-for="talent">{talentLinks.map(([a, b]) => <TalentLink key={`${a}-${b}`} p={p} a={a} b={b} />)}{talentPts.map((_, i) => <TalentNode key={i} p={p} i={i} />)}</g>
      {/* infrastructure: routes draw themselves */}
      {mods.map((m) => <Draw key={m.k} p={p} a={m.w[1] - 0.02} b={m.w[1] + 0.06} d={routePath(m)} stroke="#cdb8ff" sw={0.16} op={0.75} className="[filter:drop-shadow(0_0_.35px_#a78bfa)]" forKey={m.k} />)}
      {ringLinks().map(([a, b, d]) => <Draw key={d} p={p} a={0.54} b={0.64} d={d} stroke="#cdb8ff" sw={0.12} op={0.4} dash="0.8 1" forKey={`${a} ${b}`} />)}
      {/* operations: signals travel the routes */}
      <motion.g style={{ opacity: sig }}>
        {mods.map((m, i) => (
          <g key={m.k} data-for={m.k}><circle r=".5" fill="#fff"><animateMotion dur={`${3 + (i % 3) * 0.7}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={routePath(m)} keyPoints="1;0" keyTimes="0;1" calcMode="linear" /></circle></g>
        ))}
      </motion.g>
      {/* governance: a control ring closes around everything */}
      <motion.ellipse cx={CX} cy={cyv()} rx="47" ry={29.5 * G.sy} fill="none" stroke="#a78bfa" strokeWidth=".22" style={{ pathLength: ring, opacity: useTransform(ring, (v) => (v > 0 ? 0.8 : 0)) }} data-for="governance" />
      <motion.circle cx={CX} cy={cyv()} r={9.5 * G.k * 0.8} fill="none" stroke="#a78bfa" strokeWidth=".15" strokeDasharray="1 1" style={{ pathLength: ring, opacity: useTransform(ring, (v) => (v > 0 ? 0.7 : 0)) }} data-for="governance" />
    </motion.g>
  )
}

// the compact system the blueprint collapses into
function Mini({ p }: { p: MotionValue<number> }) {
  const o = useW(p, 0.88, 0.95)
  const pts = [0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60 - 90) * Math.PI / 180; return [CX + Math.cos(a) * 9 * G.k * 0.75, Y(26) + Math.sin(a) * 5.6 * G.sy * 0.85] })
  return (
    <motion.g style={{ opacity: o }}>
      <ellipse cx={CX} cy={Y(26)} rx={9 * G.k * 0.75} ry={5.6 * G.sy * 0.85} fill="none" stroke="#cdb8ff" strokeOpacity=".4" strokeWidth=".14" />
      {pts.map(([x, y], i) => <g key={i}><line x1={CX} y1={Y(26)} x2={x} y2={y} stroke="#cdb8ff" strokeOpacity=".5" strokeWidth=".14" /><circle cx={x} cy={y} r=".9" fill="#F4F1FB" className="pulse" style={{ animationDelay: `${i * 0.8}s` }} /></g>)}
      <circle cx={CX} cy={Y(26)} r={2 * G.k * 0.8} fill="#6D3FC0" />
    </motion.g>
  )
}

// ---------- text ----------
function Caption({ p, a, b, t, s }: { p: MotionValue<number>; a: number; b: number; t: string; s: string }) {
  const o = useTransform(p, (v) => Math.min(win(v, a, a + 0.04), 1 - win(v, b - 0.04, b)))
  const y = useTransform(p, (v) => (1 - win(v, a, a + 0.05)) * 12 - win(v, b - 0.04, b) * 8)
  return (
    <motion.div style={{ opacity: o, y }} className="absolute inset-x-0 top-0">
      <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.1] !text-white">{t}</h2>
      <p className="mt-2 max-w-md text-sm text-white/60">{s}</p>
    </motion.div>
  )
}

function Rail({ p }: { p: MotionValue<number> }) {
  const prog = useW(p, 0.08, 0.76)
  const bar = useTransform(prog, (v) => v), dot = useTransform(prog, (v) => `${v * 100}cqw`)
  const opacity = useTransform(p, (v) => 1 - win(v, 0.84, 0.9))
  const marks = [['Strategy', 0.08, 0.22], ['Setup', 0.22, 0.58], ['Operate', 0.58, 0.82]] as const
  return (
    <motion.div style={{ opacity }} aria-hidden className="absolute bottom-6 left-1/2 w-[min(80vw,40rem)] -translate-x-1/2 [container-type:inline-size]">
      <div className="relative h-px bg-white/20">
        <motion.div style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-[#a78bfa]" />
        <motion.i style={{ x: dot }} className="absolute -top-[3px] left-0 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-white" />
      </div>
      <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.18em]">
        {marks.map(([l, a, b]) => <RailLabel key={l} p={p} l={l} a={a} b={b} />)}
      </div>
    </motion.div>
  )
}
function RailLabel({ p, l, a, b }: { p: MotionValue<number>; l: string; a: number; b: number }) {
  const opacity = useTransform(p, (v) => 0.3 + 0.7 * Math.min(win(v, a - 0.02, a + 0.02), 1 - win(v, b - 0.02, b + 0.02)))
  return <motion.span style={{ opacity }} className="text-white">{l}</motion.span>
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)'); const s = () => setNarrow(mq.matches)
    mq.addEventListener('change', s); return () => mq.removeEventListener('change', s)
  }, [])
  return narrow
}

const cta = { label: 'Take the Readiness Check', to: '/plan-your-gcc/readiness-check' }

// phones / reduced motion: the finished blueprint as a vertical build, no pinning
function BlueprintStatic() {
  return (
    <section data-no-dot className="bg-ink px-6 py-20 text-white">
      <p className="eyebrow !text-white/50">The GCC blueprint</p>
      <h2 className="mt-4 max-w-xl text-[clamp(2rem,6vw,3rem)] font-normal leading-[1.1] !text-white">Strategy, setup, operate: <em>one system, built in order.</em></h2>
      <ol className="relative mx-auto mt-12 max-w-2xl space-y-8 border-l border-white/20 pl-8">
        {[...mods].sort((a, b) => a.w[0] - b.w[0]).map((m) => (
          <li key={m.k} className="relative">
            <span aria-hidden className="absolute -left-[2.45rem] top-2 h-3 w-3 rounded-full bg-[#a78bfa]" />
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[.05]">
              {m.photo && <div className="aspect-[16/8]"><Photo photo={m.photo} sizes="90vw" className="saturate-[.8]" /></div>}
              <div className="p-5">
                <h3 className="font-sans text-2xl font-medium !text-white">{matrix[m.row][0]}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  {stages.map((st, i) => <div key={st.n}><dt className="text-xs uppercase tracking-[0.14em] text-[#cdb8ff]">{st.title}</dt><dd className="text-white/80">{matrix[m.row][i + 1]}</dd></div>)}
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-14 text-center">
        <p className="font-sans text-2xl text-white">One partner who owns it all.</p>
        <Link to={cta.to} className="mt-6 inline-flex rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">{cta.label} →</Link>
      </div>
    </section>
  )
}

export default function Blueprint(): ReactNode {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const still = !!useReducedMotion()
  const narrow = useNarrow()
  G = narrow ? PHONE : DESK
  const k = G.k

  // perspective: the blueprint starts laid back and settles flat as it completes
  const tilt = useTransform(p, (v) => lerp(14, 0, win(v, 0, 0.78)))
  const lift = useTransform(p, (v) => `${lerp(3, 0, win(v, 0, 0.78)) * (narrow ? 0.5 : 1)}cqw`)
  const gridO = useTransform(p, (v) => lerp(0.35, 0.7, win(v, 0, 0.3)))
  const axes = useW(p, 0, 0.07)
  const axesO = useTransform(p, (v) => (0.5 - 0.3 * win(v, 0.1, 0.3)) * (1 - win(v, 0.84, 0.92)))
  const dotO = useTransform(p, (v) => 1 - win(v, 0.08, 0.16))
  const coreS = useTransform(p, (v) => lerp(0.05, 1, win(v, 0.08, 0.22)) * (1 - 0.5 * win(v, 0.84, 0.92)))
  const coreO = useTransform(p, (v) => win(v, 0.08, 0.14) * (1 - win(v, 0.86, 0.92)))
  const ctaO = useW(p, 0.92, 0.99), ctaY = useTransform(ctaO, (v) => `${(1 - v) * 3}cqw`)
  const ctaLive = useTransform(p, (v) => (v > 0.95 ? 'auto' : 'none'))
  const final = useTransform(p, (v) => Math.min(win(v, 0.76, 0.8), 1 - win(v, 0.82, 0.86)))
  const finalY = useTransform(final, (v) => `${(1 - v) * 1.2}cqw`)

  if (still) return <BlueprintStatic />

  return (
    <div ref={root} style={{ height: narrow ? '640vh' : '860vh' }} data-no-dot>
      <div className="sticky top-0 grid h-[100svh] place-items-end overflow-hidden bg-ink pb-16 [perspective:1800px]">
        <div className="absolute left-6 top-20 z-30 h-28 w-[calc(100vw-3rem)] md:left-[max(1.5rem,calc(50%-34rem))] md:top-24 md:w-[min(34rem,42vw)]">
          <p className="eyebrow mb-3 !text-white/50">The GCC blueprint</p>
          <div className="relative">
            <Caption p={p} a={-0.1} b={0.09} t="An idea." s="A faint grid and one point. This is where every GCC starts." />
            <Caption p={p} a={0.09} b={0.22} t="Strategy." s={stages[0].body} />
            <Caption p={p} a={0.22} b={0.58} t="Setup." s={stages[1].body} />
            <Caption p={p} a={0.58} b={0.76} t="Operate." s={stages[2].body} />
          </div>
        </div>

        <motion.div ref={stage} style={{ rotateX: tilt, y: lift, transformPerspective: 1800, aspectRatio: `100 / ${G.H}` }} className={`bp relative [container-type:inline-size] ${narrow ? 'mb-4 w-[94vw]' : 'mb-10 w-[min(86vw,calc((100svh-13rem)*1.6))]'}`}>
          <motion.div aria-hidden style={{ opacity: gridO, backgroundImage: 'linear-gradient(rgb(255 255 255 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .06) 1px, transparent 1px)', backgroundSize: '3.125cqw 3.125cqw', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} className="absolute -inset-[10%]" />
          <svg aria-hidden viewBox={`0 0 100 ${G.H}`} className="absolute inset-0 h-full w-full overflow-visible">
            <motion.path d={`M6 ${cyv()} H94`} stroke="#fff" strokeWidth=".1" strokeDasharray="1 1.2" style={{ pathLength: axes, opacity: axesO }} fill="none" />
            <motion.path d={`M50 ${Y(3)} V${Y(59)}`} stroke="#fff" strokeWidth=".1" strokeDasharray="1 1.2" style={{ pathLength: axes, opacity: axesO }} fill="none" />
            <motion.circle cx={CX} cy={cyv()} r={0.8 * k} fill="#fff" style={{ opacity: dotO }} className="pulse" />
            <Structure p={p} />
            <Mini p={p} />
          </svg>

          <motion.div style={{ scale: coreS, opacity: coreO, width: `${13 * k}cqw`, height: `${9 * k}cqw`, borderRadius: `${1.4 * k}cqw` }} className="bp-core absolute left-1/2 top-1/2 z-20 grid -translate-x-1/2 -translate-y-1/2 place-items-center bg-purple text-white shadow-[0_0_0_.6cqw_rgb(109_63_192/.18)]">
            <span className="text-center font-sans font-medium leading-none" style={{ fontSize: `${2.2 * k}cqw` }}>GCC<span className="block font-normal tracking-[.2em] text-white/70" style={{ fontSize: `${0.85 * k}cqw`, marginTop: `${0.5 * k}cqw` }}>CORE</span></span>
          </motion.div>

          {mods.map((m) => <Module key={m.k} m={m} p={p} stage={stage} />)}

          <motion.p style={{ opacity: final, y: finalY, fontSize: `${2.4 * (k > 1 ? 1.7 : 1)}cqw` }} className="pointer-events-none absolute left-1/2 top-[60%] z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-[2cqw] py-[.7cqw] font-sans text-white">One partner who owns it all.</motion.p>

          <motion.div style={{ opacity: ctaO, y: ctaY, pointerEvents: ctaLive }} className="absolute left-1/2 top-[56%] z-30 w-max -translate-x-1/2 text-center">
            <p className="font-sans font-normal leading-tight text-white" style={{ fontSize: `${3 * (k > 1 ? 1.8 : 1)}cqw` }}>Ready to build?</p>
            <div className="mt-[1.6cqw]"><Magnetic><Link to={cta.to} className="group inline-flex items-center gap-2 rounded-full bg-purple px-6 py-3.5 text-[15px] font-medium text-white">{cta.label} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span></Link></Magnetic></div>
          </motion.div>
        </motion.div>
        <Rail p={p} />
      </div>
    </div>
  )
}
