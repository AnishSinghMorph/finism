import { useEffect, useRef, type ReactNode } from 'react'

// Experimental card physics. One rAF loop per field (no React state): springs drive transform, corner radii,
// grid column weights and two lagging "ghost" layers. The loop sleeps as soon as everything has settled.
//   <BentoField cols={3} className="grid gap-4 md:grid-cols-3"> ...<InteractiveCard>...</InteractiveCard> </BentoField>

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v))
type S = { x: number; v: number }
const SPEC = {
  tx: [240, 22], ty: [240, 22], sc: [300, 24], sx: [200, 18], sy: [200, 18], // body follows the pointer fast
  rx: [140, 13], ry: [140, 13], rz: [110, 11], skx: [100, 10], sky: [100, 10], // cloth: slower, so it lags and overshoots a little
  r0: [160, 18], r1: [160, 18], r2: [160, 18], r3: [160, 18], // corner radii (liquid edge)
} as const
type Key = keyof typeof SPEC
const KEYS = Object.keys(SPEC) as Key[]
const REST: Record<Key, number> = { tx: 0, ty: 0, sc: 1, sx: 1, sy: 1, rx: 0, ry: 0, rz: 0, skx: 0, sky: 0, r0: 1, r1: 1, r2: 1, r3: 1 }
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
const RADIUS = 140 // proximity reach (px) around a card
const GHOSTS = [0.11, 0.24] // seconds behind the body

type Card = { wrap: HTMLElement; body: HTMLElement; ghosts: HTMLElement[]; item: HTMLElement; r: number; s: Record<Key, S>; hist: { t: number; tf: string; x: number; y: number; sc: number }[] }

function step(s: S, target: number, [k, c]: readonly [number, number], dt: number) {
  s.v += (-k * (s.x - target) - c * s.v) * dt
  s.x += s.v * dt
}

export function BentoField({ children, cols = 3, className = '' }: { children: ReactNode; cols?: number; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const field = root.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const wide = window.matchMedia('(min-width: 768px)')

    const cards: Card[] = [...field.querySelectorAll<HTMLElement>('[data-ic]')].map((wrap) => {
      let item = wrap
      while (item.parentElement && item.parentElement !== field) item = item.parentElement
      return {
        wrap, item, body: wrap.querySelector<HTMLElement>('[data-body]')!, ghosts: [...wrap.querySelectorAll<HTMLElement>('[data-ghost]')],
        r: Number(wrap.dataset.r) || 24, hist: [],
        s: Object.fromEntries(KEYS.map((k) => [k, { x: REST[k], v: 0 }])) as Record<Key, S>,
      }
    })
    const colSprings: S[] = Array.from({ length: cols }, () => ({ x: 1, v: 0 }))

    let pointer: { x: number; y: number } | null = null
    let last = { x: 0, y: 0, t: 0 }
    let pv = { x: 0, y: 0 } // smoothed pointer velocity, px/s
    let active = -1, touch = -1, raf = 0, prev = 0

    const wake = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(frame) } }

    function frame(now: number) {
      const dt = Math.min(0.033, Math.max(0.001, (now - prev) / 1000)); prev = now
      const mouse = fine.matches && pointer
      const rects = cards.map((c) => c.wrap.getBoundingClientRect())

      // which card is active: sticky, so the growing card doesn't flicker at its own edge
      if (mouse && pointer) {
        const inside = (r: DOMRect, m: number) => pointer!.x > r.left - m && pointer!.x < r.right + m && pointer!.y > r.top - m && pointer!.y < r.bottom + m
        if (!(active >= 0 && inside(rects[active], 14))) active = rects.findIndex((r) => inside(r, 0))
      } else active = -1
      const focus = active >= 0 ? active : touch

      pv.x += ((pointer ? (pointer.x - last.x) / dt : 0) - pv.x) * 0.25
      pv.y += ((pointer ? (pointer.y - last.y) / dt : 0) - pv.y) * 0.25
      if (pointer) last = { x: pointer.x, y: pointer.y, t: now }
      if (!mouse) { pv.x *= 0.8; pv.y *= 0.8 }

      let moving = false
      cards.forEach((c, i) => {
        const r = rects[i], w = r.width, h = r.height, cx = r.left + w / 2, cy = r.top + h / 2
        const isFocus = i === focus
        const T = { ...REST }
        if (mouse && pointer) {
          const nx = clamp((pointer.x - cx) / (w / 2)), ny = clamp((pointer.y - cy) / (h / 2))
          const d = Math.hypot(Math.max(r.left - pointer.x, 0, pointer.x - r.right), Math.max(r.top - pointer.y, 0, pointer.y - r.bottom))
          const near = i === active ? 1 : Math.pow(clamp(1 - d / RADIUS, 0, 1), 2) * 0.5 // proximity, 0..1
          T.tx = nx * w * 0.022 * near; T.ty = ny * h * 0.012 * near
          T.ry = nx * 3.2 * near; T.rx = -ny * 3.2 * near
          T.skx = clamp(-pv.x * 0.0016, -2.2, 2.2) * near; T.sky = clamp(pv.y * 0.001, -1.6, 1.6) * near
          T.rz = clamp(pv.x * 0.0012, -1.4, 1.4) * near
          T.sx = 1 + 0.014 * Math.abs(nx) * near; T.sy = 1 + 0.014 * Math.abs(ny) * near // stretches toward the pointer
          T.sc = i === active ? 1.03 : 1 + 0.012 * near
          CORNERS.forEach(([a, b], k) => { T[`r${k}` as Key] = 1 + 0.3 * ((nx * a + ny * b) / 2) * near }) // corners nearest the pointer swell
          if (active >= 0 && i !== active) { // neighbours give way
            T.sc = 0.985; T.tx = clamp((cx - pointer.x) / w, -1, 1) * 6; T.ty = clamp((cy - pointer.y) / h, -1, 1) * 3
          }
        } else if (touch >= 0) { T.sc = isFocus ? 1.025 : 0.985 }

        const sp = c.s
        KEYS.forEach((k) => { step(sp[k], T[k], SPEC[k], dt); if (Math.abs(sp[k].x - T[k]) > 0.004 || Math.abs(sp[k].v) > 0.04) moving = true })

        const tf = `translate3d(${sp.tx.x.toFixed(2)}px,${sp.ty.x.toFixed(2)}px,0) perspective(900px) rotateX(${sp.rx.x.toFixed(3)}deg) rotateY(${sp.ry.x.toFixed(3)}deg) rotate(${sp.rz.x.toFixed(3)}deg) skew(${sp.skx.x.toFixed(3)}deg,${sp.sky.x.toFixed(3)}deg) scale(${(sp.sc.x * sp.sx.x).toFixed(4)},${(sp.sc.x * sp.sy.x).toFixed(4)})`
        c.body.style.transform = tf
        c.body.style.borderRadius = [0, 1, 2, 3].map((k) => (c.r * sp[`r${k}` as Key].x).toFixed(1) + 'px').join(' ')
        c.item.style.zIndex = isFocus ? '2' : ''

        // trail: ghosts replay the body's transform from a moment ago; they only show while the two differ
        c.hist.push({ t: now, tf, x: sp.tx.x, y: sp.ty.x, sc: sp.sc.x })
        while (c.hist.length > 2 && now - c.hist[1].t > 450) c.hist.shift()
        c.ghosts.forEach((g, gi) => {
          const target = now - GHOSTS[gi] * 1000
          let past = c.hist[0]
          for (const p of c.hist) if (p.t <= target) past = p
          const diff = Math.abs(past.x - sp.tx.x) + Math.abs(past.y - sp.ty.x) + Math.abs(past.sc - sp.sc.x) * 140
          g.style.transform = past.tf
          g.style.borderRadius = c.body.style.borderRadius
          g.style.opacity = clamp(diff * 0.05, 0, gi ? 0.4 : 0.6).toFixed(3)
        })
      })

      // bento: the focused column grows, the others yield
      if (wide.matches && fine.matches) {
        const fc = focus >= 0 ? focus % cols : -1
        colSprings.forEach((s, ci) => { const t = fc < 0 ? 1 : ci === fc ? 1.16 : 0.92; step(s, t, [150, 20], dt); if (Math.abs(s.x - t) > 0.0008 || Math.abs(s.v) > 0.01) moving = true })
        field.style.gridTemplateColumns = colSprings.map((s) => `minmax(0,${s.x.toFixed(4)}fr)`).join(' ')
      }

      raf = 0
      if (moving) raf = requestAnimationFrame(frame)
      else if (!mouse && focus < 0) settle()
    }

    function settle() {
      cards.forEach((c) => { c.body.style.transform = ''; c.body.style.borderRadius = ''; c.item.style.zIndex = ''; c.hist = []; c.ghosts.forEach((g) => (g.style.opacity = '0')) })
      field.style.gridTemplateColumns = ''
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const b = field.getBoundingClientRect(), m = RADIUS
      const near = e.clientX > b.left - m && e.clientX < b.right + m && e.clientY > b.top - m && e.clientY < b.bottom + m
      if (near) { if (!pointer) last = { x: e.clientX, y: e.clientY, t: performance.now() }; pointer = { x: e.clientX, y: e.clientY }; wake() }
      else if (pointer) { pointer = null; wake() }
    }
    const onScroll = () => { if (pointer) wake() }
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      const hit = cards.findIndex((c) => c.wrap.contains(e.target as Node))
      touch = hit === touch ? -1 : hit
      wake()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerup', onTap)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerup', onTap)
      cancelAnimationFrame(raf)
      settle()
    }
  }, [cols])

  return <div ref={root} className={className}>{children}</div>
}

// The card itself: a static wrapper (measured), two ghost layers (trail) and the body (the thing that moves).
export function InteractiveCard({ children, className = '', radius = 24 }: { children: ReactNode; className?: string; radius?: number }) {
  const ghost = 'pointer-events-none absolute inset-0 border border-purple/30 bg-purple/[0.08] opacity-0'
  return (
    <div data-ic data-r={radius} className="relative h-full">
      <div data-ghost aria-hidden className={ghost} style={{ borderRadius: radius }} />
      <div data-ghost aria-hidden className={`${ghost} blur-[2px]`} style={{ borderRadius: radius }} />
      <div data-body className={`relative h-full will-change-transform ${className}`} style={{ borderRadius: radius }}>{children}</div>
    </div>
  )
}
