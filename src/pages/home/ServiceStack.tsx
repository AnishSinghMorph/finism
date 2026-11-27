import type { ReactNode } from 'react'
import { ScrollCard, ScrollCardSection, Layer, ParallaxLayer } from '../../components/ScrollStack'
import Photo from '../../components/Photo'
import { matrix } from '../../content'

type Kind = 'talent' | 'workspace' | 'infrastructure' | 'operations' | 'consulting' | 'governance'
const kinds: Kind[] = ['talent', 'workspace', 'infrastructure', 'operations', 'consulting', 'governance']
const tags: Record<Kind, string[]> = {
  talent: [], workspace: ['Selection', 'Fit-out', 'Branded space'], infrastructure: ['IT set-up', 'Network', 'Procurement'],
  operations: ['Payroll', 'Filings', 'Reporting'], consulting: [], governance: [],
}

const Tag = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`rounded-full border border-white/30 bg-ink/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-sm ${className}`}>{children}</span>
)

// A photo, graded toward the brand purple, with thin data lines and labels laid over it.
function PhotoVisual({ kind, photo }: { kind: Kind; photo: 'workspace' | 'servers' | 'operations' }) {
  return (
    <div className="relative h-48 overflow-hidden rounded-[1.4rem] md:h-full md:min-h-[21rem]">
      <ParallaxLayer className="absolute inset-0"><Photo photo={photo} sizes="(min-width:768px) 32rem, 90vw" className="saturate-[.85]" /></ParallaxLayer>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-deep/25 to-transparent" />
      <div className="absolute inset-0 bg-purple/15 mix-blend-multiply" />
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M8 78 C 30 60, 44 82, 62 56 S 88 40, 94 22" fill="none" stroke="white" strokeOpacity=".55" strokeWidth=".35" vectorEffect="non-scaling-stroke" strokeDasharray="2 3" />
        {[[8, 78], [62, 56], [94, 22]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.1" fill="white" />)}
      </svg>
      <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">{tags[kind].map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </div>
  )
}

const frame = 'relative h-48 overflow-hidden rounded-[1.4rem] bg-ink md:h-full md:min-h-[21rem]'
const grid = <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

function TalentVisual() {
  const pts = [[200, 70], [110, 120], [290, 115], [60, 210], [170, 205], [250, 215], [340, 200], [135, 50], [330, 60]]
  const links = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [0, 7], [0, 8], [4, 5], [3, 4]]
  return (
    <div className={frame}>{grid}
      <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" aria-hidden>
        {links.map(([a, b]) => <line key={`${a}${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#cdb8ff" strokeOpacity=".45" strokeWidth="1" />)}
        {pts.map(([x, y], i) => (
          <g key={i} className="pulse" style={{ animationDelay: `${i * 0.7}s` }}>
            <circle cx={x} cy={y - 8} r={i === 0 ? 7 : 5} fill={i === 0 ? '#6D3FC0' : '#F4F1FB'} />
            <path d={`M${x - 11} ${y + 12} a11 9 0 0 1 22 0`} fill={i === 0 ? '#6D3FC0' : '#F4F1FB'} fillOpacity={i === 0 ? 1 : 0.85} />
          </g>
        ))}
        <circle cx="200" cy="70" r="26" fill="none" stroke="#6D3FC0" strokeOpacity=".6" />
      </svg>
      <div className="absolute bottom-4 left-4 flex gap-2"><Tag>Hiring</Tag><Tag>Onboarding</Tag></div>
    </div>
  )
}

function ConsultingVisual() {
  const L: [number, number, string][] = [[300, 50, 'Business case'], [300, 110, 'Operating model'], [300, 170, 'Blueprint'], [300, 230, 'Roadmap']]
  return (
    <div className={frame}>{grid}
      <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" strokeWidth="1.2">
          <path d="M60 140 C 110 140, 110 80, 170 80 S 250 50, 280 50" stroke="#ffffff" strokeOpacity=".25" />
          <path d="M60 140 C 110 140, 110 80, 170 80 S 250 110, 280 110" stroke="#6D3FC0" strokeWidth="2.2" />
          <path d="M60 140 C 110 140, 110 200, 170 200 S 250 170, 280 170" stroke="#ffffff" strokeOpacity=".25" />
          <path d="M60 140 C 110 140, 110 200, 170 200 S 250 230, 280 230" stroke="#ffffff" strokeOpacity=".25" />
        </g>
        <circle cx="60" cy="140" r="9" fill="#6D3FC0" /><circle cx="170" cy="80" r="5" fill="#cdb8ff" /><circle cx="170" cy="200" r="5" fill="#ffffff" fillOpacity=".5" />
        {L.map(([x, y, t], i) => (
          <g key={t}><circle cx={x - 12} cy={y} r="5" fill={i === 1 ? '#6D3FC0' : '#ffffff'} fillOpacity={i === 1 ? 1 : 0.5} /><text x={x} y={y + 4} fill="#fff" fillOpacity={i === 1 ? 1 : 0.6} fontSize="12" fontFamily="Inter, sans-serif">{t}</text></g>
        ))}
      </svg>
    </div>
  )
}

function GovernanceVisual() {
  const outer = Array.from({ length: 6 }, (_, i) => { const a = (-90 + i * 60) * Math.PI / 180; return [200 + Math.cos(a) * 118, 140 + Math.sin(a) * 100] })
  return (
    <div className={frame}>{grid}
      <svg viewBox="0 0 400 280" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx="200" cy="140" rx="118" ry="100" fill="none" stroke="#fff" strokeOpacity=".2" />
        <ellipse cx="200" cy="140" rx="70" ry="60" fill="none" stroke="#cdb8ff" strokeOpacity=".4" strokeDasharray="3 5" />
        {outer.map(([x, y], i) => <line key={i} x1="200" y1="140" x2={x} y2={y} stroke="#cdb8ff" strokeOpacity=".4" />)}
        {outer.map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r="5" fill="#F4F1FB" className="pulse" style={{ animationDelay: `${i * 0.6}s` }} />)}
        <circle cx="200" cy="140" r="26" fill="#6D3FC0" />
        <circle cx="200" cy="140" r="36" fill="none" stroke="#6D3FC0" strokeOpacity=".5" />
      </svg>
      <div className="absolute bottom-4 left-4 flex gap-2"><Tag>One accountable lead</Tag><Tag>Control tower</Tag></div>
    </div>
  )
}

function Visual({ kind }: { kind: Kind }) {
  if (kind === 'workspace') return <PhotoVisual kind={kind} photo="workspace" />
  if (kind === 'infrastructure') return <PhotoVisual kind={kind} photo="servers" />
  if (kind === 'operations') return <PhotoVisual kind={kind} photo="operations" />
  return kind === 'talent' ? <TalentVisual /> : kind === 'consulting' ? <ConsultingVisual /> : <GovernanceVisual />
}

const stageLabels = ['Strategy', 'Setup', 'Operate']

// Six service lines as a sticky stack: scroll brings each card to the front, the others settle behind.
export default function ServiceStack() {
  return (
    <section data-no-dot className="bg-pale">
      <div className="mx-auto max-w-6xl px-6 pt-24 md:pb-4">
        <p className="eyebrow">Six service lines</p>
        <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] font-normal leading-[1.1]">One partner who owns it all, <em>from first decision to scale.</em></h2>
      </div>
      <ScrollCardSection variant="stack" step={78} labels={matrix.map((m) => m[0])} className="px-6 py-10 md:px-0 md:py-0">
        {matrix.map((m, n) => (
          <ScrollCard key={m[0]} index={n} className="grid gap-6 p-5 md:grid-cols-[1fr_1.05fr] md:gap-10 md:p-8">
            <div className="flex flex-col py-2 md:py-4 md:pl-3">
              <Layer depth={1}>
                <span className="font-sans text-sm text-purple">0{n + 1} / 06</span>
                <h3 className="mt-2 text-[clamp(1.9rem,3.2vw,2.6rem)] font-medium leading-tight">{m[0]}</h3>
              </Layer>
              <Layer depth={2} className="mt-6">
                <dl className="divide-y divide-hairline">
                  {stageLabels.map((l, i) => (
                    <div key={l} className="py-3 first:pt-0">
                      <dt className="text-xs uppercase tracking-[0.14em] text-purple">{l}</dt>
                      <dd className="mt-1 text-ink">{m[i + 1]}</dd>
                    </div>
                  ))}
                </dl>
              </Layer>
            </div>
            <Layer depth={3} className="md:h-full"><Visual kind={kinds[n]} /></Layer>
          </ScrollCard>
        ))}
      </ScrollCardSection>
    </section>
  )
}
