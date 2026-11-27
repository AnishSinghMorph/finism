import { useEffect, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { rich } from '../../components/rich'
import { A as IMG } from './assets'
import { A, R, u, FIG_SHADOW } from './u'
import { CORE, CARD_P, CARD_ORDER, CORE_OUT, LAND, MARK, NODE, SCANNER_FADE, SCAN, jPhoto, jState, linesA, orbs, qLayout, scanA, sm, surface, view, win, holdPx, HOLD_TOTAL } from './journey'

// DOM that moves with the orb journey. Everything is a pure function of P (journey.ts); nothing here re-renders on scroll.
// With reduced motion (`rich` false) the functions are not evaluated and the static design shows.

export function useP(): MotionValue<number> {
  const { scrollY } = useScroll()
  return useTransform(scrollY, (y) => y / view.u + view.vhd / 2)
}
// P -> value, or the static fallback when motion is reduced
export function useJ<T>(P: MotionValue<number>, fn: (p: number) => T, still: T): MotionValue<T> {
  return useTransform(P, (p) => (rich ? fn(p) : still))
}
export function useViewSync(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current!
    const set = () => { view.u = el.clientWidth / 1920; view.vhd = window.innerHeight / view.u; view.holds = rich }
    set(); const ro = new ResizeObserver(set); ro.observe(el); window.addEventListener('resize', set)
    return () => { ro.disconnect(); window.removeEventListener('resize', set) }
  }, [root])
}
const px = (v: number) => `calc(var(--u) * ${v})`

// ---------- the hero's bowl, which stretches downward and becomes the orbit, then a horizontal trajectory ----------
export function Surface({ P }: { P: MotionValue<number> }) {
  const S = (p: number) => surface(p)
  const x = useJ(P, (p) => `${(S(p).cx - 1141.5) * view.u}px`, '0px')
  const y = useJ(P, (p) => `${(S(p).cy - S(p).R) * view.u}px`, '0px')
  const sx = useJ(P, (p) => (S(p).R / 1141.5) * S(p).sx, 1), sy = useJ(P, (p) => (S(p).R / 1141.5) * S(p).stretchY * S(p).sy, 1)
  const hero = useJ(P, (p) => S(p).hero, 1), ring = useJ(P, (p) => S(p).ring, 0), rot = useJ(P, (p) => S(p).rot, 0)
  const line = useJ(P, (p) => S(p).line, 0)
  const lineY = useJ(P, () => 2951 * view.u, 2951 * view.u)
  return (
    <>
      <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ width: px(2283), height: px(2283), x, y, scaleX: sx, scaleY: sy, transformOrigin: '50% 0' }}>
        <motion.img alt="" src={IMG.heroGlow} className="absolute max-w-none" style={{ left: px(-210.8), top: px(-210.8), width: px(2704.6), height: px(2704.6), opacity: hero }} />
        <motion.img alt="" src={IMG.heroSphere} className="absolute inset-0 h-full w-full max-w-none" style={{ opacity: hero }} />
        <motion.div className="absolute inset-0" style={{ opacity: ring, rotate: rot }}><img alt="" src={IMG.ringDashed} className="h-full w-full max-w-none" /></motion.div>
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute left-0 z-[45] w-full" style={{ top: lineY, height: 2, opacity: line, background: 'linear-gradient(90deg, transparent, rgba(169,141,221,.7) 18%, rgba(109,63,192,.85) 50%, rgba(169,141,221,.7) 82%, transparent)' }} />
    </>
  )
}

// ---------- the finism circle: it is the orb once the orb has landed in it ----------
export function CoreCircle({ P }: { P: MotionValue<number> }) {
  const op = useJ(P, (p) => win(p, LAND - 50, LAND) * (1 - win(p, CORE_OUT[0], CORE_OUT[1])), 1)
  const scale = useJ(P, (p) => (1 + 0.06 * Math.sin(Math.PI * win(p, LAND, LAND + 90))) * (1 - 0.74 * win(p, 2290, 2395)), 1)
  const bright = useJ(P, (p) => `brightness(${1 + 0.3 * Math.sin(Math.PI * win(p, LAND, LAND + 90))})`, 'none')
  const logo = useJ(P, (p) => win(p, LAND - 30, LAND + 20) * (1 - win(p, 2290, 2330)), 1)
  const shock = useJ(P, (p) => win(p, LAND + 2, LAND + 130), 1)
  return (
    <>
      <motion.div aria-hidden id="orb-core" className="pointer-events-none absolute" style={{ left: px(770), top: px(1525), width: px(374), height: px(374), opacity: op, scale, filter: bright }}>
        <img alt="" src={IMG.circleCore} className="absolute max-w-none" style={{ left: px(-1), top: px(-5), width: px(398), height: px(388) }} />
      </motion.div>
      <A x={881} y={1690} w={152} h={43}><motion.img alt="" src={IMG.logoCore} className="h-full w-full max-w-none" style={{ opacity: logo, scale }} /></A>
      {rich && (
        <motion.div aria-hidden className="pointer-events-none absolute rounded-full border-2 border-[#a98ddd]" style={{ left: px(CORE.x - 187), top: px(CORE.y - 187), width: px(374), height: px(374), scale: useTransform(shock, (t) => 0.5 + 1.7 * t), opacity: useTransform(shock, (t) => (t > 0 && t < 1 ? 0.55 * (1 - t) : 0)) }} />
      )}
    </>
  )
}

// ---------- four capabilities around the core: pulses from the centre activate them one at a time; then everything is pulled in ----------
const RING_DOT = [[718, 1577], [737, 1877], [1136, 1926], [1217, 1607]]
export function Operating({ P, children }: { P: MotionValue<number>; children: (act: MotionValue<number>[]) => ReactNode }) {
  const c = useJ(P, (p) => win(p, 2290, 2400), 0)
  const acts = [0, 1, 2, 3].map((i) => {
    const k = CARD_ORDER.indexOf(i as 0 | 1 | 2 | 3), at = CARD_P[k]
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useJ(P, (p) => win(p, at - 30, at + 30) * (k === 3 ? 1 : 1 - win(p, at + 110, at + 150)), 0)
  })
  const scale = useTransform(c, (v) => 1 - 0.7 * v), opacity = useTransform(c, (v) => 1 - v)
  return (
    <motion.div className="absolute left-0 top-0 z-[45] h-full w-full" style={{ scale, opacity, transformOrigin: `calc(var(--u) * ${CORE.x}) calc(var(--u) * ${CORE.y})`, pointerEvents: 'none' }}>
      <div className="pointer-events-auto">{children(acts)}</div>
      {rich && [0, 1, 2, 3].map((i) => <Pulse key={i} P={P} i={i} />)}
    </motion.div>
  )
}
function Pulse({ P, i }: { P: MotionValue<number>; i: number }) {
  const k = CARD_ORDER.indexOf(i as 0 | 1 | 2 | 3), at = CARD_P[k]
  const t = useJ(P, (p) => (p - (at - 120)) / 90, -1)
  const x = useTransform(t, (v) => (CORE.x + (RING_DOT[i][0] - CORE.x) * Math.min(1, Math.max(0, v)) - 8) * view.u)
  const y = useTransform(t, (v) => (CORE.y + (RING_DOT[i][1] - CORE.y) * Math.min(1, Math.max(0, v)) - 8) * view.u)
  const opacity = useTransform(t, (v) => (v > 0 && v < 1.05 ? Math.sin(Math.PI * Math.min(1, v)) : 0))
  return <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0 rounded-full" style={{ width: px(16), height: px(16), x, y, opacity, background: 'radial-gradient(circle, #fff 0%, #a98ddd 45%, rgba(109,63,192,0) 72%)' }} />
}
// clockwise entrance: the cards come out of the core one after another (01, 04, 03, 02), sweeping round into place
export const ENTER_ORDER = [0, 3, 2, 1] as const
export function useEnter(P: MotionValue<number>, i: number, cx: number, cy: number) {
  const k = ENTER_ORDER.indexOf(i as 0 | 1 | 2 | 3), a = LAND + 10 + k * 55
  const e = useJ(P, (p) => win(p, a, a + 120), 1)
  const pos = useTransform(e, (t) => {
    const ang = -(1 - t) * 1.15 // swings clockwise into place
    const vx = (cx - CORE.x) * t, vy = (cy - CORE.y) * t
    return { x: (vx * Math.cos(ang) - vy * Math.sin(ang) + CORE.x - cx) * view.u, y: (vx * Math.sin(ang) + vy * Math.cos(ang) + CORE.y - cy) * view.u }
  })
  return {
    x: useTransform(pos, (v) => v.x), y: useTransform(pos, (v) => v.y),
    scale: useTransform(e, (t) => 0.3 + 0.7 * t), opacity: useTransform(e, (t) => Math.min(1, t * 2.2)),
  }
}
export function RingDot({ P, i, x, y }: { P: MotionValue<number>; i: number; x: number; y: number }) {
  const st = useEnter(P, i, x + 8, y + 8)
  return <motion.div className="absolute" style={{ left: px(x), top: px(y), width: px(16), height: px(16), ...st }}><img alt="" src={IMG.ringDot} className="h-full w-full max-w-none" /></motion.div>
}
export function cardActStyle(act: MotionValue<number>) {
  return {
    y: useTransform(act, (a) => `calc(var(--u) * ${-9 * a})`), // eslint-disable-line react-hooks/rules-of-hooks
    scale: useTransform(act, (a) => 1 + 0.016 * a), // eslint-disable-line react-hooks/rules-of-hooks
    boxShadow: useTransform(act, (a) => `${FIG_SHADOW}, 0 0 0 ${1.5 * a}px rgba(169,141,221,${0.85 * a}), 0 ${18 * a}px ${40 * a}px rgba(109,63,192,${0.5 * a})`), // eslint-disable-line react-hooks/rules-of-hooks
    filter: useTransform(act, (a) => `brightness(${1 + 0.05 * a}) contrast(${1 + 0.1 * a})`), // eslint-disable-line react-hooks/rules-of-hooks
  }
}

// ---------- the questions row: the orb is the scanner; the cards respond to it ----------
export function useScanState(P: MotionValue<number>, set: (i: number) => void) {
  useMotionValueEvent(P, 'change', (p) => {
    if (!rich) return
    const a = scanA(p)
    set(p > SCAN[0] - 60 && p < SCANNER_FADE + 100 ? Math.round(a) : 1)
  })
}
export function RowShift({ P, children }: { P: MotionValue<number>; children: ReactNode }) {
  const x = useJ(P, (p) => `${-qLayout(p).shift * view.u}px`, '0px')
  const dim = useJ(P, (p) => (p > SCAN[0] - 60 && p < SCANNER_FADE + 100 ? 0.62 : 1), 1)
  return <motion.div className="flex h-full w-max items-center" style={{ x, ['--dim' as string]: dim }}>{children}</motion.div>
}

// ---------- the journey: the orb marker moves between Exploring and Setting Up; the big card's imagery follows ----------
export function JourneyRail({ P }: { P: MotionValue<number> }) {
  const o = useJ(P, (p) => win(p, 4700, 4880) * (1 - win(p, 5420, 5560)), 0)
  const fill = useJ(P, (p) => jState(p), 0)
  return (
    <A z={false} x={MARK.x - 1} y={MARK.e} w={2} h={MARK.s - MARK.e}>
      <motion.div className="absolute inset-0 rounded-full bg-[#6d3fc0]/25" style={{ opacity: o }} />
      <motion.div className="absolute inset-x-0 top-0 origin-top rounded-full bg-[#6d3fc0]/60" style={{ height: '100%', scaleY: fill, opacity: o }} />
    </A>
  )
}
export function JourneyPhotos({ P, base }: { P: MotionValue<number>; base: string }) {
  const a = useJ(P, (p) => jPhoto(p).a, 0), b = useJ(P, (p) => jPhoto(p).b, 0)
  const ex = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=70'
  const se = 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1800&q=70'
  const img = 'absolute max-w-none object-cover'
  const st = { left: px(-17.5), bottom: 0, width: px(1044), height: px(696) }
  return (
    <>
      <img alt="" src={base} loading="lazy" className={img} style={st} />
      <motion.img alt="" src={ex} loading="lazy" className={img} style={{ ...st, opacity: a }} />
      <motion.img alt="" src={se} loading="lazy" className={img} style={{ ...st, opacity: b }} />
    </>
  )
}
export function tabActive(P: MotionValue<number>, which: 0 | 1) {
  return useJ(P, (p) => { const j = jState(p), on = win(p, 3440, 3520) * (1 - win(p, 4120, 4260)); return on * (which === 0 ? 1 - j : j) }, 0) // eslint-disable-line react-hooks/rules-of-hooks
}

// ---------- India: one orb became three nodes; faint connections form between them ----------
export function NodeLines({ P }: { P: MotionValue<number> }) {
  const o = useJ(P, (p) => linesA(p), 0)
  const pairs = [[0, 1], [0, 2], [1, 2]]
  return (
    <A z={false} x={0} y={0} w={1920} h={6230} className="pointer-events-none">
      <svg aria-hidden viewBox="0 0 1920 6230" className="h-full w-full">
        {pairs.map(([a, b]) => <motion.line key={`${a}${b}`} x1={NODE[a].x} y1={NODE[a].y} x2={NODE[b].x} y2={NODE[b].y} stroke="#a98ddd" strokeWidth="1.6" strokeDasharray="4 7" style={{ opacity: useTransform(o, (v) => 0.55 * v) }} />)}
      </svg>
    </A>
  )
}

// small helper for the first closing pill: a soft glow when the orb settles beside it
export function ctaGlow(P: MotionValue<number>) {
  return useJ(P, (p) => { const t = win(p, 7660, 7760); return `0 0 0 ${5 * t}px rgba(255,209,102,${0.25 * t}), 0 0 ${30 * t}px rgba(255,209,102,${0.4 * t})` }, 'none') // eslint-disable-line react-hooks/rules-of-hooks
}
void sm; void orbs; void R; void u

// the whole canvas is carried down by the holds so a scene stays on screen while its beats play
export function useCanvasShift() {
  const { scrollY } = useScroll()
  return useTransform(scrollY, (sy) => holdPx(sy))
}
export { HOLD_TOTAL }

// the Exploring / Setting Up cards arrive in a messy pile and sort themselves out into the layout as the section comes in
export function useSort(P: MotionValue<number>, which: 0 | 1) {
  const m = useJ(P, (p) => 1 - sm(win(p, 4420, 4860)), 0)
  const d = which === 0 ? { x: 210, y: 150, r: -9 } : { x: 170, y: -190, r: 7 }
  return {
    x: useTransform(m, (v) => d.x * v * view.u), y: useTransform(m, (v) => d.y * v * view.u),
    rotate: useTransform(m, (v) => d.r * v), scale: useTransform(m, (v) => 1 - 0.12 * v),
    opacity: useTransform(m, (v) => 1 - 0.6 * v),
  }
}
