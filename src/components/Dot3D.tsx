import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MathUtils as M, type Mesh } from 'three'

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
    if (hero) {
      const h = smooth(clamp(1 + hero.top / (hero.height * 0.55)))
      // gentle idle drift so it stays alive on touch screens, where there is no cursor to follow
      const t = clock.elapsedTime
      x = M.lerp(x, hero.left + hero.width / 2 + pointer.x * 22 + Math.sin(t * 0.7) * 5, h)
      y = M.lerp(y, hero.top + hero.height / 2 - pointer.y * 16 + Math.sin(t * 0.9) * 5, h)
      r = M.lerp(r, hero.width * (vw < 768 ? 0.36 : 0.26), h) // bigger share of the box on phones
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
    const quiet = document.querySelector('[data-no-dot]')?.getBoundingClientRect()
    if (quiet && quiet.top < vh && quiet.bottom > 0) r = 0

    const c = (cur.current ??= { x, y, r })
    c.x = M.damp(c.x, x, 14, dt)
    c.y = M.damp(c.y, y, 14, dt)
    c.r = M.damp(c.r, r, 14, dt)
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
    </Canvas>
  )
}
