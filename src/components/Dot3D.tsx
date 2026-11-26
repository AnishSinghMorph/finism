import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MathUtils as M, type Mesh } from 'three'

// Shared between the main orb and the satellites that gather into it.
const shared = { x: 0, y: 0, g: 0, hide: false }
// satellite i is on its way in while this runs 0 -> 1 (staggered over the gather progress g); pulse() is the orb's small swell as it lands
const tOf = (g: number, i: number) => clamp((g - i * 0.1) / 0.5)
const pulse = (g: number, i: number) => Math.sin(Math.PI * clamp(((g - i * 0.1) / 0.5 - 1) / 0.25))
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

// One sphere, in a fixed full-screen canvas (1 world unit = 1 css px).
// Phase 1: fills the hero anchor (#dot-hero) and leans toward the cursor.
// Phase 2: shrinks to a small dot riding the right edge, its height tracking page scroll.
// Phase 3: lands on the footer full stop (#dot-end).
function Orb() {
  const mesh = useRef<Mesh>(null)
  const cur = useRef<{ x: number; y: number; r: number } | null>(null)

  useFrame(({ size, pointer, clock }, dt) => {
    const m = mesh.current
    if (!m) return
    const { width: vw, height: vh } = size
    const p = clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - vh))

    let x = vw - 28, y = vh * (0.22 + 0.56 * p), r = 9

    const hero = document.getElementById('dot-hero')?.getBoundingClientRect()
    shared.g = 0
    if (hero) {
      // Scroll first gathers the satellites into the orb (g, tied 1:1 to scroll); only then does the orb leave the hero.
      const fh = document.getElementById('dot-frame')?.getBoundingClientRect().height ?? hero.height * 2.4
      const g = clamp(window.scrollY / (fh * 0.85))
      const h = 1 - smooth(clamp((window.scrollY - 0.5 * fh) / (0.6 * fh)))
      shared.g = g
      // gentle idle drift so it stays alive on touch screens, where there is no cursor to follow
      const t = clock.elapsedTime
      x = M.lerp(x, hero.left + hero.width / 2 + pointer.x * 22 + Math.sin(t * 0.7) * 5, h)
      y = M.lerp(y, hero.top + hero.height / 2 - pointer.y * 16 + Math.sin(t * 0.9) * 5, h)
      r = M.lerp(r, hero.width * (vw < 768 ? 0.36 : 0.26) * (1 + 0.05 * SATS.reduce((a, _, i) => a + pulse(g, i), 0)), h) // bigger share on phones; swells a touch as each sphere lands
    }
    const end = document.getElementById('dot-end')?.getBoundingClientRect()
    if (end) {
      // docks fully at the very bottom of the page, wherever the footer happens to sit
      const left = document.documentElement.scrollHeight - vh - window.scrollY
      const e = smooth(clamp(1 - left / (vh * 0.7)))
      x = M.lerp(x, end.left + end.width / 2, e)
      y = M.lerp(y, end.top + end.height / 2, e)
      r = M.lerp(r, end.width / 2, e)
    }

    // Pages mark regions (e.g. the Why GCC card track) where the dot must not float over content.
    shared.hide = false
    document.querySelectorAll('[data-no-dot]').forEach((el) => {
      const q = el.getBoundingClientRect()
      if (q.top < vh && q.bottom > 0) { r = 0; shared.hide = true }
    })

    const c = (cur.current ??= { x, y, r })
    c.x = M.damp(c.x, x, 14, dt)
    c.y = M.damp(c.y, y, 14, dt)
    c.r = M.damp(c.r, r, 14, dt)
    shared.x = c.x; shared.y = c.y
    m.position.set(c.x - vw / 2, -(c.y - vh / 2), 0)
    m.scale.setScalar(Math.max(0.01, c.r))
    m.visible = c.r > 0.4
    m.rotation.y += dt * 0.15
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial color="#6D3FC0" roughness={0.45} metalness={0} />
    </mesh>
  )
}

// Small spheres ringed around the hero photo (fx, fy: position on the photo frame, fr: radius as a share of its width).
// As the page scrolls they stream into the main orb and disappear into it.
const SATS = [[0.46, -0.01, 0.026], [1.0, 0.4, 0.032], [0.93, 0.76, 0.02], [0.28, 1.0, 0.028], [0.0, 0.16, 0.018]]
function Satellites() {
  const refs = useRef<(Mesh | null)[]>([])
  const cur = useRef<{ x: number; y: number; r: number }[]>([])
  useFrame(({ size, clock }, dt) => {
    const { width: vw, height: vh } = size
    const f = document.getElementById('dot-frame')?.getBoundingClientRect()
    SATS.forEach(([fx, fy, fr], i) => {
      const m = refs.current[i]
      if (!m) return
      let x = shared.x, y = shared.y, r = 0
      if (f && !shared.hide) {
        const t = clock.elapsedTime + i * 1.7
        const ax = f.left + f.width * fx + Math.sin(t * 0.6) * 4, ay = f.top + f.height * fy + Math.cos(t * 0.5) * 4
        const e = smooth(tOf(shared.g, i))
        // spiral in: a curved path (not a straight line) that ends exactly on the orb
        const dx = shared.x - ax, dy = shared.y - ay, d = Math.hypot(dx, dy) || 1
        const arc = Math.sin(Math.PI * e) * f.width * 0.14 * (i % 2 ? 1 : -1)
        x = M.lerp(ax, shared.x, e) - (dy / d) * arc; y = M.lerp(ay, shared.y, e) + (dx / d) * arc
        r = e >= 0.995 ? 0 : f.width * fr * (1 - 0.5 * e)
      }
      const c = (cur.current[i] ??= { x, y, r })
      c.x = M.damp(c.x, x, 16, dt); c.y = M.damp(c.y, y, 16, dt); c.r = M.damp(c.r, r, 16, dt)
      m.position.set(c.x - vw / 2, -(c.y - vh / 2), 0)
      m.scale.setScalar(Math.max(0.01, c.r))
      m.visible = c.r > 0.4
    })
  })
  return <>{SATS.map((_, i) => (
    <mesh key={i} ref={(el) => { refs.current[i] = el }}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial color="#6D3FC0" roughness={0.45} />
    </mesh>
  ))}</>
}

export default function Dot3D() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 600], zoom: 1, near: 1, far: 1200 }}
      dpr={[1, 1.5]}
      eventSource={document.body}
      eventPrefix="client"
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'fixed', inset: 0, zIndex: 40, pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-200, 300, 400]} intensity={2.4} />
      <directionalLight position={[300, -200, 200]} intensity={0.7} color="#cdb8ff" />
      <Orb />
      <Satellites />
    </Canvas>
  )
}
