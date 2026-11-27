import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { type Mesh, type ShaderMaterial } from 'three'
import { landing } from './LandingOrb'
import { holdPx, orbs, view } from '../pages/landing/journey'

// The orbs of the landing journey (see pages/landing/journey.ts): up to three glossy spheres drawn as shaded discs.
// The ball has real weight: it is lit from the upper left, shows a soft specular highlight and rim light, its surface marking
// turns as it rolls (uSpin), and it squashes on contact. `glow` is a brief brightness pulse at moments of contact.
const vert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = `
varying vec2 vUv; uniform float uPx; uniform float uSpin; uniform float uGlow; uniform float uAlpha; uniform float uGlass; uniform float uTime;
void main() {
  vec2 p = (vUv - 0.5) * 2.0 * 1.12;
  float d = length(p);
  float aa = 1.5 / max(uPx, 1.0);
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  vec3 n = normalize(vec3(p.x, p.y, sqrt(max(0.0, 1.0 - d * d))));
  // the surface turns: rotate the normal about the view axis and read a faint banded marking off it
  float c = cos(uSpin), s = sin(uSpin);
  vec2 q = mat2(c, -s, s, c) * n.xy;
  float band = smoothstep(0.35, 0.0, abs(q.y - 0.18 * sin(q.x * 3.0)) - 0.07) * 0.11;
  vec3 mid = vec3(0.2314, 0.1216, 0.4392), top = vec3(0.4275, 0.2471, 0.7529), hi = vec3(0.66, 0.55, 0.95);
  vec3 L = normalize(vec3(-0.5 + 0.05 * sin(uTime * 0.4), 0.62, 0.6)); // the light drifts very slightly
  float diff = clamp(dot(n, L), 0.0, 1.0);
  vec3 col = mix(mid * 0.62, top * 1.1, smoothstep(0.0, 0.95, diff));
  col += band * hi;
  col += pow(1.0 - n.z, 3.0) * 0.32 * hi;
  float spec = pow(clamp(dot(normalize(L + vec3(0.0, 0.0, 1.0)), n), 0.0, 1.0), 44.0);
  float glint = smoothstep(0.1, 0.0, length(p - vec2(-0.34, 0.4)) - 0.07);
  col += (spec * 0.7 + glint * 0.5) * vec3(1.0, 0.97, 1.0);
  col += uGlow * 0.35 * (hi + 0.2);
  float rim = smoothstep(0.62, 1.0, d);
  col = mix(col, mix(vec3(0.78, 0.7, 1.0), col, 0.4), uGlass * 0.6);
  float a = mix(1.0, mix(0.2, 0.7, rim), uGlass); // glassmorphic: see-through centre, frosted rim, so the arrow shows through
  gl_FragColor = vec4(col, disc * uAlpha * a);
}`

function Ball({ i }: { i: number }) {
  const mesh = useRef<Mesh>(null)
  const mat = useRef<ShaderMaterial>(null)
  useFrame(({ size, clock }) => {
    const m = mesh.current, sm = mat.current
    if (!m || !sm) return
    const root = document.getElementById('journey-root')
    if (!root) { m.visible = false; return }
    if (i === 0) landing.on = true
    view.holds = true
    view.u = root.clientWidth / 1920; view.vhd = size.height / view.u
    const sy = window.scrollY, P = sy / view.u + view.vhd / 2
    const o = orbs(P)[i]
    if (!o || o.vis < 0.01 || o.r < 0.5) { m.visible = false; return }
    const u = view.u, r = o.r * u
    m.visible = true
    m.position.set(o.x * u - size.width / 2, -(o.y * u + holdPx(sy) - sy - size.height / 2), 0)
    m.scale.set(r * 1.12 * o.sx, r * 1.12 * o.sy, 1)
    sm.uniforms.uPx.value = r; sm.uniforms.uSpin.value = o.spin; sm.uniforms.uGlow.value = o.glow
    sm.uniforms.uAlpha.value = o.vis; sm.uniforms.uGlass.value = o.glass ?? 0; sm.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} transparent depthTest={false}
        uniforms={{ uPx: { value: 100 }, uSpin: { value: 0 }, uGlow: { value: 0 }, uAlpha: { value: 1 }, uGlass: { value: 0 }, uTime: { value: 0 } }} />
    </mesh>
  )
}

export default function JourneyOrb() {
  return <><Ball i={0} /><Ball i={1} /><Ball i={2} /></>
}
