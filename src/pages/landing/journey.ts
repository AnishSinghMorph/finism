// THE ORB JOURNEY: one object, one timeline. Everything on the landing page that moves with the orb is a pure function of
// `P`, the page y (in design units, the Figma's 1920 canvas) at the middle of the viewport. The DOM (surface, rings, cards,
// pulses) and the 3D orbs read the same functions, so they can never disagree.

export const view = { u: 1, vhd: 1080, holds: true } // pixels per design unit, viewport height in design units, whether holds are active
// HOLDS: stretches of scroll during which the page stays put while the story keeps moving, so each scene plays out with its
// section fully on screen. A hold of `len` design units adds exactly `len` to the page and to the timeline, so P (real scroll
// position) is the timeline everywhere; `at` is where in the design (page y at the viewport centre) the section is centred.
export const HOLDS = [{ at: 1650, len: 620 }, { at: 2830, len: 560 }, { at: 3700, len: 520 }, { at: 4760, len: 900 }] as const
export const HOLD_TOTAL = HOLDS.reduce((a, h) => a + h.len, 0)
export function holdPx(scrollY: number) {
  if (!view.holds) return 0
  let h = 0, before = 0
  for (const k of HOLDS) { const s0 = (k.at - view.vhd / 2 + before) * view.u; h += Math.min(k.len * view.u, Math.max(0, scrollY - s0)); before += k.len }
  return h
}
export const toP = (scrollY: number) => scrollY / view.u + view.vhd / 2

const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const sm = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const win = (P: number, a: number, b: number) => sm(cl((P - a) / (b - a)))
const lin = (P: number, a: number, b: number) => cl((P - a) / (b - a))

// ---- beats (page y of the viewport centre) ----
const top = () => view.vhd / 2 // P at scroll 0
export const CORE = { x: 960, y: 1712 } // centre of the finism circle
export const LAND = 1450 // the finism circle is complete (and pulses) by here, well before the section is mid-screen
export const CARD_P = [1700, 1830, 1960, 2090] as const // activation of 01, 04, 02, 03 (centre -> card)
export const CARD_ORDER = [0, 3, 1, 2] as const // the design's cards: 01 top-left, 02 bottom-left, 03 bottom-right, 04 top-right
const COLLAPSE = [2290, 2400] as const // cards pulled in, orbit contracts, circle shrinks back to the orb
const STRETCH = [2400, 2700] as const // orbit becomes a horizontal trajectory
export const SCAN = [3480, 3980] as const // the orb scans the five question cards (during the hold at the question section)
const TRAV = [2400, 3450] as const // the orb travels from the core to the first question card, the trajectory line with it
const SEAM = 2951 // y of the seam between the text and image bands of the question cards (the trajectory)
export const SCANNER_FADE = 4060
export const CORE_OUT = [2395, 2425] as const // the circle hands over to the orb here

// ---- the hero surface (the giant sphere's bowl) ----
const H = { cx: 960, cy: -257, R: 1141.5 }

export function surface(P: number) {
  const m = win(P, top() + 380, LAND) // bowl -> ring (finished before the section is on screen)
  const c = win(P, COLLAPSE[0], COLLAPSE[1]) // ring contracts around the orb
  const s = win(P, STRETCH[0], STRETCH[1]) // ring -> horizontal line
  const R = lerp(lerp(H.R, 277, m), 100, c)
  const cy = lerp(lerp(H.cy, CORE.y, m), SEAM, sm(lin(P, TRAV[0], TRAV[1])))
  const stretchY = 1 + 0.32 * Math.sin(Math.PI * m) // the bowl stretches downward on its way
  const sx = lerp(1, 4.6, s), sy = lerp(1, 0.07, s)
  return {
    cx: H.cx, cy, R, sx, sy, stretchY,
    hero: 1 - win(P, top() + 640, LAND - 60), // hero look fades as the ring takes over
    ring: win(P, top() + 640, LAND - 60) * (1 - win(P, STRETCH[0] + 80, STRETCH[1])),
    line: win(P, STRETCH[0] + 120, STRETCH[1]) * (1 - win(P, SCANNER_FADE, SCANNER_FADE + 220)),
    rot: P * 0.004, // the orbit turns extremely slowly
  }
}

// ---- the five question cards (scanner) ----
export const Q = { x0: 200, w: 379, wActive: 460, gap: 20, h: 541, hActive: 657 }
// 0..4: which card the orb is at; it dwells on each, then moves on
export function scanA(P: number) {
  const t = lin(P, SCAN[0], SCAN[1]) * 4
  const k = Math.min(3, Math.floor(t)), f = t - k
  return k + (f < 0.28 ? 0 : f > 0.72 ? 1 : sm((f - 0.28) / 0.44))
}
export const qAct = (P: number, i: number) => (P < SCAN[0] - 60 || P > SCAN[1] + 160 ? 0 : cl(1 - Math.abs(scanA(P) - i) / 0.4))
export function qLayout(P: number) {
  const a = scanA(P)
  const shift = lerp(0, 540, sm(cl(a / 4)))
  const scanning = P > SCAN[0] - 60 && P < SCANNER_FADE + 200
  const ws = [0, 1, 2, 3, 4].map((i) => (i === (scanning ? Math.round(a) : 1) ? Q.wActive : Q.w))
  let x = Q.x0 - shift
  const centres = ws.map((w) => { const c = x + w / 2; x += w + Q.gap; return c })
  return { shift, ws, centres, a }
}

// ---- the journey (Exploring -> Setting Up) ----
const JOUR = { mark: 4880, hold: 5400 } // orb reaches the rail at `mark`; the hold at the journey section ends at `hold`
export const MARK = { x: 701, e: 3625, s: 3954 }
export const jState = (P: number) => win(P, 5000, 5300) // 0 Exploring .. 1 Setting Up
export const jPhoto = (P: number) => ({ a: win(P, 4900, 4980) * (1 - win(P, 5200, 5260)), b: win(P, 5240, 5320) * (1 - win(P, 5460, 5560)) })

// ---- India: one orb becomes three nodes, then they reunite ----
const IND = { arrive: 6460, pause: 6500, split: 6460, lines: 6800, merge1: 6900, merge2: 7150, cta: 7260, ctaEnd: 7900, foot: [7650, 7810] as const }
export const NODE = [{ x: 766.5, y: 4547.5 }, { x: 1279.5, y: 4545.5 }, { x: 1279.5, y: 4806.5 }]
const TALENT_C = { x: 960, y: 4745 }
const FOOT = { x: 1350.1, y: 5916.4, r: 13.1 }
export const linesA = (P: number) => win(P, IND.lines, IND.lines + 120) * (1 - win(P, IND.merge1 - 40, IND.merge1 + 40))
export { win }

export type OrbS = { x: number; y: number; r: number; sx: number; sy: number; spin: number; vis: number; glow: number; glass?: number }
const none: OrbS = { x: 0, y: 0, r: 0, sx: 1, sy: 1, spin: 0, vis: 0, glow: 0 }

// position along a curve: eased, with a perpendicular bow so the motion arcs instead of travelling in a line
function arc(a: { x: number; y: number }, b: { x: number; y: number }, t: number, bow: number) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1
  const off = Math.sin(Math.PI * t) * bow
  return { x: lerp(a.x, b.x, t) - (dy / len) * off, y: lerp(a.y, b.y, t) + (dx / len) * off }
}


// a point fixed on the screen's right edge (f = fraction of the viewport height), in design units
const edge = (P: number, f: number) => { const sy = (P - view.vhd / 2) * view.u; return { x: 1920 - 18, y: (sy - holdPx(sy)) / view.u + f * view.vhd } }
export function orbs(P: number): OrbS[] {
  const time = performance.now() / 1000
  const base = { ...none }
  let o: OrbS
  if (P < 2360) {
    // no ball in the hero or the operating core: the circle is the core until it collapses (the hero ball was removed)
    return [{ ...none }]
  } else if (P < SCAN[0]) {
    // the system has collapsed back into the orb; it leaves along the new trajectory
    const t = lin(P, TRAV[0], TRAV[1])
    const to = edge(SCAN[0], 0.2)
    const p = arc({ x: CORE.x, y: CORE.y }, to, sm(t), 90)
    o = { ...base, ...p, r: lerp(48, 20, win(P, 2400, STRETCH[1])), vis: win(P, 2385, 2425), spin: t * 9 }
  } else if (P < SCANNER_FADE) {
    // question cards: the orb steps out of the way and rides the right-hand edge like a scroll indicator
    o = { ...base, ...edge(P, 0.2 + 0.6 * lin(P, SCAN[0], SCAN[1])), r: 10, vis: 1, spin: P * 0.02 }
  } else if (P < JOUR.mark) {
    // leaves the scanner for the journey rail
    const from = edge(SCANNER_FADE, 0.8)
    const p = arc(from, { x: MARK.x, y: MARK.e }, sm(lin(P, SCANNER_FADE, JOUR.mark)), -140)
    o = { ...base, ...p, r: lerp(20, 15, win(P, SCANNER_FADE, JOUR.mark)), vis: 1, spin: P * 0.02 }
  } else if (P < IND.arrive) {
    // journey marker: slow, deliberate. Exploring -> Setting Up along the rail, then on toward India
    const j = jState(P)
    const rail = { x: MARK.x, y: lerp(MARK.e, MARK.s, j) }
    const leave = win(P, JOUR.hold + 40, IND.arrive)
    const p = leave > 0 ? arc(rail, { x: TALENT_C.x, y: 4266 }, leave, -120) : rail
    o = { ...base, ...p, r: lerp(15, 16, leave), vis: 1, spin: P * 0.01 }
  } else if (P < IND.split) {
    // crosses into the dark purple section and dives into it (frosted while it is under the surface), ready to split
    const d = sm(lin(P, IND.arrive, IND.split))
    o = { ...base, x: TALENT_C.x, y: lerp(4266, TALENT_C.y - 40, d) + Math.sin(time * 1.1) * 2 * d, r: lerp(16, 20, d), vis: 1, spin: time * 0.05, glass: Math.sin(Math.PI * d) * 0.8 }
  } else {
    return india(P)
  }
  return [o]
}

function india(P: number): OrbS[] {
  const s = win(P, IND.split, IND.lines)
  const start = { x: TALENT_C.x, y: 4266 }
  const nodes = NODE.map((n, i) => { const p = arc(start, n, s, i === 0 ? -60 : i === 1 ? 80 : -80); return { x: p.x, y: p.y, r: lerp(16, 22.5, s) } })
  let [a, b, c] = nodes
  const meet = { x: 960, y: 4700 }
  const t = sm(lin(P, IND.merge1, IND.merge2)) // all three drift straight to one point together, at one pace
  if (t > 0) {
    const to = (n: { x: number; y: number }) => ({ x: lerp(n.x, meet.x, t), y: lerp(n.y, meet.y, t), r: 22.5 })
    a = to(NODE[0]); b = to(NODE[1]); c = to(NODE[2])
  }
  const together = P >= IND.merge2
  const m1 = win(P, IND.merge1, IND.merge2 - 60)
  let list: OrbS[]
  if (together) {
    const t = win(P, IND.cta, IND.ctaEnd)
    const meet = { x: 960, y: 4700 }
    const E = edge(P, 0.55)
    let p = arc(meet, E, t, 80)
    // final payoff: the orb becomes the dot of the footer's finism logo
    const end = 6230 + HOLD_TOTAL - view.vhd / 2 // P at the very bottom of the page; the logo comes on screen ~300 before it
    const f = win(P, end - 250, end - 10)
    p = { x: lerp(E.x, FOOT.x, f) * f + p.x * (1 - f), y: lerp(E.y, FOOT.y, f) * f + p.y * (1 - f) }
    list = [{ ...none, ...p, r: lerp(lerp(22.5, 10, t), FOOT.r, f), vis: 1, spin: P * 0.01 + t * 4, glow: Math.sin(Math.PI * lin(P, IND.merge2 + 100, IND.merge2 + 180)) * 0.7 }]
  } else {
    const dup = (n: { x: number; y: number; r: number }, v = 1): OrbS => ({ ...none, x: n.x, y: n.y, r: n.r, vis: v, spin: 0 })
    const gone = 1 - win(t, 0.85, 1) // b and c dissolve into the one orb as they arrive, never pop
    list = [dup(a), dup(b, gone), dup(c, gone)]
    void m1
  }
  return list
}
