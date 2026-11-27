import { useEffect, useState } from 'react'
import Desktop from './landing/Desktop'
import Mobile from './landing/Mobile'

// Landing page, built from the Figma design (node 36:4). Desktop uses the design's 1920 canvas; below 1024px a stacked layout.
function useWide() {
  const [wide, setWide] = useState(() => matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = matchMedia('(min-width: 1024px)'); const s = () => setWide(mq.matches)
    mq.addEventListener('change', s); return () => mq.removeEventListener('change', s)
  }, [])
  return wide
}

export default function Home() {
  return useWide() ? <Desktop /> : <Mobile />
}
