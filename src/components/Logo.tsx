// Brand rule: one purple dot (~2.4x a full stop) sitting on the baseline, dotless i's, no terminal mark.
export default function Logo({ reverse = false, className = '' }: { reverse?: boolean; className?: string }) {
  return (
    <span
      aria-label="Finism"
      className={`inline-flex items-baseline gap-[0.18em] font-sans font-medium tracking-tight ${reverse ? 'text-white' : 'text-ink'} ${className}`}
    >
      <span aria-hidden className="inline-block h-[0.2em] w-[0.2em] rounded-full bg-purple" />
      <span aria-hidden>f&#305;n&#305;sm</span>
    </span>
  )
}
