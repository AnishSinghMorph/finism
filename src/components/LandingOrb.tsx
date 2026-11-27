import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils as M, type Mesh, type ShaderMaterial } from 'three'

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

// True while the landing page's anchors exist: the glass orb steps aside and this one takes over.
export const landing = { on: false }

// The landing orb is one disc drawn by a shader, reproducing the Figma artwork exactly:
//   hero look   : a black sphere with a radial purple gradient that only reaches the rim (#3B1F70 -> #6D3FC0) plus a soft #5B3899 halo
//   circle look : the finism circle, a vertical #3B1F70 -> #6D3FC0 gradient
// uMorph blends one into the other as the sphere shrinks, so it reads as a single object changing size and character.
const vert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const frag = `
varying vec2 vUv; uniform float uMorph; uniform float uPx; uniform float uShine;
void main() {
  vec2 p = (vUv - 0.5) * 2.0 * 1.35;
  float d = length(p);
  vec3 mid = vec3(0.2314, 0.1216, 0.4392), top = vec3(0.4275, 0.2471, 0.7529);
  float t = length(p - vec2(0.0, 0.6128)) / 1.6128;
  vec3 hero = t < 0.7812 ? vec3(0.0) : t < 0.9202 ? mix(vec3(0.0), mid, (t - 0.7812) / 0.1390) : mix(mid, top, clamp((t - 0.9202) / 0.0798, 0.0, 1.0));
  vec3 circ = mix(mid, top, clamp((1.0 - p.y) * 0.5, 0.0, 1.0));
  // once it is a small ball it turns into a glossy 3D sphere: lit from the upper left, with a soft specular highlight and rim light
  vec3 n = normalize(vec3(p.x, p.y, sqrt(max(0.0, 1.0 - d * d))));
  vec3 L = normalize(vec3(-0.5, 0.62, 0.6));
  float diff = clamp(dot(n, L), 0.0, 1.0);
  vec3 shaded = mix(mid * 0.7, top * 1.12, smoothstep(0.0, 0.95, diff));
  float rim = pow(1.0 - n.z, 3.0);
  shaded += rim * 0.3 * vec3(0.66, 0.55, 0.95);
  circ = mix(circ, shaded, uShine);
  vec3 body = mix(hero, circ, uMorph);
  float aa = 1.5 / max(uPx, 1.0);
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, d);
  float halo = (1.0 - smoothstep(0.80, 1.22, d)) * (1.0 - uMorph);
  float spec = pow(clamp(dot(normalize(L + vec3(0.0, 0.0, 1.0)), n), 0.0, 1.0), 42.0);
  float glint = smoothstep(0.1, 0.0, length(p - vec2(-0.36, 0.42)) - 0.07);
  body += uShine * (spec * 0.75 + glint * 0.55) * vec3(1.0, 0.97, 1.0);
  vec3 col = mix(vec3(0.3569, 0.2196, 0.6), body, disc);
  gl_FragColor = vec4(col, max(disc, halo * 0.92));
}`

export default function LandingOrb() {
  const mesh = useRef<Mesh>(null)
  const mat = useRef<ShaderMaterial>(null)

  useFrame(({ size }) => {
    const m = mesh.current, sm = mat.current
    if (!m || !sm) return
    if (document.getElementById('journey-root')) { m.visible = false; return } // the desktop journey has its own orbs
    const H = document.getElementById('orb-hero')?.getBoundingClientRect()
    const T = document.getElementById('orb-core')?.getBoundingClientRect()
    if (!H || !T) { landing.on = false; m.visible = false; return }
    landing.on = true

    const { width: vw, height: vh } = size
    const sy = window.scrollY
    const Hr = H.width / 2, Tr = T.width / 2
    const Hc = { x: H.left + Hr, y: H.top + Hr }, Tc = { x: T.left + Tr, y: T.top + Tr }

    // 1. hero -> core: the sphere sinks and shrinks (exponentially, so it feels like distance) onto the finism circle
    const dScroll = Math.max(1, Tc.y + sy - vh * 0.5)
    const e = smooth(clamp(sy / dScroll))
    let r = Hr * Math.pow(Tr / Hr, e)
    let x = M.lerp(Hc.x, Tc.x, e), y = M.lerp(Hc.y, Tc.y, e)

    // 2. the circle stays with its section, then shrinks into a small dot riding the right edge
    const p = clamp(sy / Math.max(1, document.documentElement.scrollHeight - vh))
    const lane = { x: vw - 28, y: vh * (0.22 + 0.56 * p) }
    const laneR = vw < 768 ? 0 : 7
    const e2 = smooth(clamp((sy - dScroll - vh * 0.6) / (vh * 0.9)))
    x = M.lerp(x, lane.x, e2); y = M.lerp(y, lane.y, e2); r = M.lerp(r, laneR, e2)

    // 3. at the bottom of the page it docks on the dot of the big finism logo
    const end = document.getElementById('dot-end')?.getBoundingClientRect()
    if (end) {
      const left = document.documentElement.scrollHeight - vh - sy
      const d = smooth(clamp(1 - left / (vh * 0.7)))
      x = M.lerp(x, end.left + end.width / 2, d); y = M.lerp(y, end.top + end.height / 2, d); r = M.lerp(r, end.width / 2, d)
    }

    m.visible = r > 0.4
    m.position.set(x - vw / 2, -(y - vh / 2), 0)
    m.scale.set(r * 1.35, r * 1.35, 1)
    sm.uniforms.uMorph.value = Math.max(smooth(clamp((e - 0.04) / 0.8)), e2)
    sm.uniforms.uPx.value = r
    sm.uniforms.uShine.value = e2
  })

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} transparent depthTest={false} uniforms={{ uMorph: { value: 0 }, uPx: { value: 100 }, uShine: { value: 0 } }} />
    </mesh>
  )
}
