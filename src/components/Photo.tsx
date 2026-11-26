import { useEffect, useRef } from 'react'

// Remote editorial photography (Unsplash CDN, resized on the fly). Each id is used once on the site.
export const photos = {
  towers: { id: '1486406146926-c627a92ad1ab', alt: 'Glass office towers seen from street level, converging toward the sky' },
  workspace: { id: '1497366216548-37526070297c', alt: 'A long, quiet office corridor with glass partitions and warm lighting' },
  servers: { id: '1558494949-ef010cbdcc31', alt: 'Server racks with dense network cabling and indicator lights' },
  operations: { id: '1568992687947-868a62a9f521', alt: 'An open operations floor with rows of engineers at shared desks' },
}
const src = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=68`

// While the file loads the photo sits slightly enlarged, soft and transparent; once decoded it eases down to its normal size.
export default function Photo({ photo, sizes = '(min-width:1024px) 50vw, 90vw', priority = false, className = '' }: { photo: keyof typeof photos; sizes?: string; priority?: boolean; className?: string }) {
  const { id, alt } = photos[photo]
  const wrap = useRef<HTMLDivElement>(null), img = useRef<HTMLImageElement>(null)
  const show = () => wrap.current?.setAttribute('data-ready', '')
  useEffect(() => { if (img.current?.complete && img.current.naturalWidth) show() }, []) // already cached
  return (
    <div ref={wrap} className="h-full w-full scale-[1.12] opacity-0 blur-[6px] transition-[opacity,scale,filter] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] data-[ready]:scale-100 data-[ready]:opacity-100 data-[ready]:blur-none motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none">
      <img
        ref={img} onLoad={show}
        src={src(id, 1200)}
        srcSet={[480, 800, 1200, 1800].map((w) => `${src(id, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        width={1200} height={800}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </div>
  )
}
