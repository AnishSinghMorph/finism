// dock: the dot is left empty; the 3D dot travels down the page and lands here.
// Brand rule: one purple dot (~2.4x a full stop) sitting on the baseline, dotless i's, no terminal mark.
export default function Logo({ reverse = false, className = '', dock = false }: { reverse?: boolean; className?: string; dock?: boolean }) {
  return (
    <span
      aria-label="Finism"
      className={`inline-flex items-baseline gap-[0.18em] font-sans font-medium tracking-tight ${reverse ? 'text-white' : 'text-ink'} ${className}`}
    >
      <span aria-hidden id={dock ? 'dot-end' : undefined} className={`inline-block h-[0.2em] w-[0.2em] rounded-full ${dock ? '' : 'bg-purple'}`} />
      <span aria-hidden>f&#305;n&#305;sm</span>
    </span>
  )
}
