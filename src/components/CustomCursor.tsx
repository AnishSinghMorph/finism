import { useEffect, useRef } from 'react'
import cursorArrow from '../assets/landing/cursor.svg'

// The site's own pointer: the white rounded arrow from the design, replacing the system cursor on mouse devices.
// It follows the pointer directly (no lag), presses in on click, lifts slightly over links and buttons, and steps aside
// (native cursor returns) over text fields. Touch devices and reduced-motion-free defaults are untouched.
export default function CustomCursor() {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const node = el.current!
    document.documentElement.classList.add('custom-cursor')
    let down = false, over = false, hidden = true
    const apply = (x: number, y: number) => {
      node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${down ? 0.88 : over ? 1.14 : 1})`
      node.style.opacity = hidden ? '0' : '1'
    }
    let lx = -100, ly = -100
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      lx = e.clientX; ly = e.clientY
      const t = e.target as Element | null
      hidden = !!t?.closest('input, textarea, select, [contenteditable="true"]')
      over = !!t?.closest('a, button, [role="button"], summary, label')
      apply(lx, ly)
    }
    const leave = () => { hidden = true; apply(lx, ly) }
    const dn = () => { down = true; apply(lx, ly) }
    const up = () => { down = false; apply(lx, ly) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', dn); window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', dn); window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={el} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-[opacity] duration-150" style={{ willChange: 'transform' }}>
      <img src={cursorArrow} alt="" width={24} height={26} className="-scale-x-100 select-none [filter:drop-shadow(0_1px_2px_rgba(36,22,64,.55))]" draggable={false} />
    </div>
  )
}
