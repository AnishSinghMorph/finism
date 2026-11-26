import { useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Pins `root` and steps through `count` items as the user scrolls. Returns the active index and a ref for a progress bar.
export function usePinSteps(root: RefObject<HTMLElement | null>, count: number, screens = 3) {
  const bar = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * screens}`, pin: true,
      onUpdate: (s) => {
        setI(Math.min(count - 1, Math.floor(s.progress * count)))
        if (bar.current) bar.current.style.scale = `1 ${s.progress}`
      },
    })
  }, { scope: root })
  return { i, bar }
}
