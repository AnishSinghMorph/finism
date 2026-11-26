import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EquirectangularReflectionMapping, MathUtils as M, SRGBColorSpace, TextureLoader, type DirectionalLight, type Mesh, type MeshPhysicalMaterial, type Texture } from 'three'

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const bez = (a: number, b: number, c: number, d: number, t: number) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d }
// Size of the orb as the hero scrolls away (t = 0..1): large, then 1 -> .65 -> .3 -> .12 of its hero size.
const sizeAt = (t: number) => t < 0.25 ? 1 : t < 0.55 ? M.lerp(1, 0.65, (t - 0.25) / 0.3) : t < 0.8 ? M.lerp(0.65, 0.3, (t - 0.55) / 0.25) : M.lerp(0.3, 0.12, (t - 0.8) / 0.2)

// Position of the main orb, shared with the single satellite (the satellite foreshadows the orb's final small size).
const shared = { x: 0, y: 0, r: 0, hero: false, hide: false, rn: 9, lane: { x: 0, y: 0 }, t: 0, arc: 1 }

// One orb in a fixed full-screen canvas (1 world unit = 1 css px). One continuous journey, all driven by scroll:
//   hero   : sits at #dot-hero, large                                   (t 0 - .25)
//   leaves : curves out of the hero toward the right-hand lane, 1 -> .12 (t .25 - 1)
//   lane   : rides the right edge as a small node
//   engine : swings in to the centre of the Capability Engine (#engine-stage), where it is the hub the modules orbit,
//            fades into the core when it forms, and returns to the lane when the engine ends
//   footer : docks on the logo dot (#dot-end)
function Orb() {
  const mesh = useRef<Mesh>(null)
  const cur = useRef<{ x: number; y: number; r: number } | null>(null)

  useFrame(({ size, pointer, clock }, dt) => {
    const m = mesh.current
    if (!m) return
    const { width: vw, height: vh } = size
    const sy = window.scrollY
    const p = clamp(sy / Math.max(1, document.documentElement.scrollHeight - vh))
    const lane = { x: vw - 28, y: vh * (0.22 + 0.56 * p) }
    shared.lane = lane
    const arc = vw < 768 ? 0 : vw < 1100 ? 0.5 : 1 // tablet: shorter swing, phone: straight line
    shared.arc = arc
    const time = clock.elapsedTime

    let x = lane.x, y = lane.y, r = 9
    shared.t = 0
    shared.hero = !!document.getElementById('dot-hero') // the small moons belong to the home hero only
    const intro = smooth(clamp((time - 0.5) / 1.8)) // on arrival the orb rises into place, like a sun clearing the towers
    mats.forEach((mt) => { mt.envMapRotation.y = sy * 0.0022 + time * 0.05 }) // the reflected street slides past as it travels

    const hero = document.getElementById('dot-hero')?.getBoundingClientRect()
    if (hero) {
      const r0 = hero.width * (vw < 768 ? 0.36 : 0.34)
      const rn = r0 * 0.12
      shared.rn = rn
      const t = clamp(sy / (vh * 1.25))
      shared.t = t
      const e = smooth(clamp((t - 0.25) / 0.75))
      // starts on the hero anchor (barely answers the cursor, gentle idle drift), never riding up under the nav
      const ax = Math.min(hero.left + hero.width / 2 + pointer.x * 6 + Math.sin(time * 0.5) * 3, vw - r0 * 1.15 - 8) // straddles the photo's right edge, never past the screen
      const ay = Math.max(hero.top + hero.height / 2 - pointer.y * 4 + Math.sin(time * 0.6) * 3, vh * 0.32)
      const dx = lane.x - ax
      x = bez(ax, ax + dx * 0.3, lane.x - dx * 0.05, lane.x, e)
      y = bez(ay, ay + 40 * arc, lane.y + 150 * arc, lane.y, e) // one long diagonal sweep up and out to the right, no bounce
      r = r0 * sizeAt(t) * (1 + 0.015 * Math.sin(time * 1.1)) * intro // very small breathing
      y += (1 - intro) * 70 * (1 - e)
    }

    // Capability Engine: arrive at its centre, be the hub, fold into the core, leave again
    const eng = document.querySelector('[data-engine]')?.getBoundingClientRect()
    const stage = document.getElementById('engine-stage')?.getBoundingClientRect()
    if (eng && stage) {
      const u = smooth(clamp(1 - eng.top / vh))
      const q = clamp(-eng.top / Math.max(1, eng.height - vh))
      const back = smooth(clamp((q - 0.9) / 0.1))
      const w = u * (1 - back)
      const fold = smooth(clamp((q - 0.36) / 0.14)) * (1 - back) // the core appears and takes over
      x = M.lerp(x, stage.left + stage.width / 2, w)
      y = M.lerp(y, stage.top + stage.height / 2 - Math.sin(Math.PI * u) * vh * 0.06 * arc, w)
      r = M.lerp(r, 9, w) * (1 - fold)
    }

    const end = document.getElementById('dot-end')?.getBoundingClientRect()
    if (end) {
      // docks fully at the very bottom of the page, wherever the footer happens to sit
      const left = document.documentElement.scrollHeight - vh - sy
      const e = smooth(clamp(1 - left / (vh * 0.7)))
      x = M.lerp(x, end.left + end.width / 2, e)
      y = M.lerp(y, end.top + end.height / 2, e)
      r = M.lerp(r, end.width / 2, e)
    }

    // Pages mark regions (e.g. the Why GCC card stack) where the dot must not float over content.
    shared.hide = false
    document.querySelectorAll('[data-no-dot]').forEach((el) => {
      const q = el.getBoundingClientRect()
      if (q.top < vh && q.bottom > 0) { r = 0; shared.hide = true }
    })

    const c = (cur.current ??= { x, y, r })
    c.x = M.damp(c.x, x, 14, dt)
    c.y = M.damp(c.y, y, 14, dt)
    c.r = M.damp(c.r, r, 14, dt)
    shared.x = c.x; shared.y = c.y; shared.r = c.r
    m.position.set(c.x - vw / 2, -(c.y - vh / 2), 0)
    m.scale.setScalar(Math.max(0.01, c.r))
    m.visible = c.r > 0.4
    m.rotation.y += dt * 0.12
    m.rotation.x = Math.sin(time * 0.2) * 0.1
  })

  return <mesh ref={mesh}><Glass /></mesh>
}

// polished purple glass. It reflects the hero photograph itself (the same Unsplash image, used as an environment map),
// so the orb looks like a real object standing in that street, and the reflection slides as the page scrolls.
const ENV_URL = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1024&q=60'
let envTex: Texture | null = null, envLoading = false
const mats = new Set<MeshPhysicalMaterial>()
function ensureEnv() {
  if (envTex || envLoading) return
  envLoading = true
  new TextureLoader().setCrossOrigin('anonymous').load(ENV_URL, (t) => {
    t.mapping = EquirectangularReflectionMapping; t.colorSpace = SRGBColorSpace; envTex = t
    mats.forEach((m) => { m.envMap = t; m.needsUpdate = true })
  })
}
function Glass() {
  const mat = useRef<MeshPhysicalMaterial>(null)
  useEffect(() => {
    const m = mat.current!
    mats.add(m)
    if (envTex) { m.envMap = envTex; m.needsUpdate = true } else ensureEnv()
    return () => { mats.delete(m) }
  }, [])
  return (
    <>
      <sphereGeometry args={[1, 96, 96]} />
      <meshPhysicalMaterial ref={mat} color="#6D3FC0" roughness={0.26} metalness={0.05} clearcoat={0.9} clearcoatRoughness={0.12} envMapIntensity={0.9} />
    </>
  )
}

// Three small moons (different sizes, speeds and orbits): each circles the orb on a tilted orbit (it passes behind it and in front of it).
// When the page scrolls it peels off and travels the orb's route, a little ahead, already at the small size the orb is
// heading for; it hands over to the orb exactly at the lane and disappears.
function Satellite({ phase, speed, rad, moon, delay }: { phase: number; speed: number; rad: number; moon: number; delay: number }) {
  const mesh = useRef<Mesh>(null)
  const cur = useRef<{ x: number; y: number; r: number } | null>(null)
  useFrame(({ size, clock }, dt) => {
    const m = mesh.current
    if (!m) return
    const { width: vw, height: vh } = size
    const time = clock.elapsedTime
    let x = shared.x, y = shared.y, r = 0, z = 0
    if (shared.hero && !shared.hide && shared.t < 1 && shared.r > 1) {
      const a = time * speed + phase
      const R = shared.r * rad
      const ax = shared.x + Math.cos(a) * R, ay = shared.y + Math.sin(a) * R * 0.38 - Math.cos(a) * R * 0.12 // tilted ellipse
      z = Math.sin(a) > 0 ? shared.r + 30 : -(shared.r + 30)
      const es = smooth(clamp((shared.t - 0.12 - delay) / (0.88 - delay)))
      const L = shared.lane, k = shared.arc
      x = bez(ax, ax + 30, L.x, L.x, es)
      y = bez(ay, ay + 140 * k, L.y + 170 * k, L.y, es)
      r = M.lerp(Math.max(shared.r * moon, 4), shared.rn, es) * smooth(clamp((time - 1.4 - phase * 0.15) / 1)) // appears after the orb has risen
      if (es > 0.05) z = 0
    }
    const c = (cur.current ??= { x, y, r })
    c.x = M.damp(c.x, x, 14, dt); c.y = M.damp(c.y, y, 14, dt); c.r = M.damp(c.r, r, 14, dt)
    m.position.set(c.x - vw / 2, -(c.y - vh / 2), z)
    m.scale.setScalar(Math.max(0.01, c.r))
    m.visible = c.r > 0.4
  })
  return <mesh ref={mesh}><Glass /></mesh>
}

// The key light drifts slowly so the highlight glides across the glass.
function Lights() {
  const key = useRef<DirectionalLight>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    key.current?.position.set(-200 + Math.sin(t * 0.3) * 70, 300 + Math.cos(t * 0.25) * 50, 400)
  })
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight ref={key} position={[-200, 300, 400]} intensity={2.4} />
      <directionalLight position={[300, -200, 200]} intensity={0.7} color="#cdb8ff" />
    </>
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
      <Lights />
      <Orb />
      <Satellite phase={1.2} speed={0.55} rad={2.1} moon={0.17} delay={0} />
      <Satellite phase={3.9} speed={-0.38} rad={2.7} moon={0.1} delay={0.04} />
      <Satellite phase={5.6} speed={0.8} rad={1.75} moon={0.12} delay={0.08} />
    </Canvas>
  )
}
