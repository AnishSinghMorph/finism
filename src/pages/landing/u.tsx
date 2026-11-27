import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, type MotionStyle } from 'motion/react'

// The desktop landing is laid out on the design's 1920-unit canvas: `--u` is the pixel size of one design unit
// (set from the page width), so every position and size in the Figma translates one-to-one at any width.
export const u = (n: number) => `calc(var(--u) * ${n})`
// Text: scales with the page but never below a readable floor.
export const fs = (n: number, min = Math.max(11, Math.round(n * 0.72))) => `max(${min}px, calc(var(--u) * ${n}))`
export const FIG_SHADOW = '0 63px 38px rgba(0,0,0,.05), 0 28px 28px rgba(0,0,0,.09), 0 7px 15px rgba(0,0,0,.1)'

export function useUnit(designWidth = 1920) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    const set = () => el.style.setProperty('--u', `${el.clientWidth / designWidth}px`)
    set()
    const ro = new ResizeObserver(set); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return ref
}

type Box = { x?: number; y?: number; w?: number; h?: number; z?: boolean; reveal?: boolean; delay?: number; id?: string; className?: string; style?: MotionStyle; children?: ReactNode }
// Absolutely positioned box in design units. z: sits above the 3D orb canvas (text, cards, logos).
export function A({ x = 0, y = 0, w, h, z = true, reveal = false, delay = 0, id, className = '', style, children }: Box) {
  const st: MotionStyle = { left: u(x), top: u(y), width: w != null ? u(w) : undefined, height: h != null ? u(h) : undefined, ...style }
  return (
    <motion.div
      id={id} className={`absolute ${z ? 'z-[45]' : ''} ${className}`} style={st}
      initial={reveal ? { opacity: 0, y: 28 } : false} whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}
// Same, for children of an already-positioned box (relative coordinates).
export function R({ x = 0, y = 0, w, h, className = '', style, children }: Omit<Box, 'z' | 'reveal' | 'delay' | 'id' | 'style'> & { style?: CSSProperties }) {
  return <div className={`absolute ${className}`} style={{ left: u(x), top: u(y), width: w != null ? u(w) : undefined, height: h != null ? u(h) : undefined, ...style }}>{children}</div>
}

// A box that carries a block of the design at its own design width (e.g. a 491-wide card): children use R/u as in the Figma.
export function Scaled({ w, h, className = '', style, children }: { w: number; h: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useUnit(w)
  return <div ref={ref} className={`relative w-full ${className}`} style={{ aspectRatio: `${w} / ${h}`, ['--u' as string]: `calc(100vw / ${w * 1.6})`, ...style }}>{children}</div>
}
