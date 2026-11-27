import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import Magnetic from '../../components/Magnetic'
import { rich } from '../../components/rich'
import { A as IMG } from './assets'
import { A, R, u, fs, FIG_SHADOW, useUnit } from './u'
import { diffs, questions, journeyCopy, india } from './copy'

// Desktop landing, built on the Figma's 1920 x 6230 canvas (see u.tsx). Anchors for the 3D orb:
//   #orb-hero  the giant sphere (its lower arc glows in the hero)    #orb-core  the finism circle in "What makes Finism different"
//   #dot-end   the dot of the big finism logo in the footer, where the orb finally docks

const glass = 'backdrop-blur-[8.7px] bg-[rgba(109,63,192,.4)] border-[1.5px] border-solid border-white/[.38]'
const chipShadow = '0 184px 52px rgba(0,0,0,0), 0 118px 47px rgba(0,0,0,.01), 0 66px 40px rgba(0,0,0,.05), 0 29px 29px rgba(0,0,0,.09), 0 7px 16px rgba(0,0,0,.1)'

function Chip({ cx, cy, w, rot, text, dot, depth }: { cx: number; cy: number; w: number; rot: number; text: string; dot: string; depth: number }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, -depth]) // the problem tags drift away as the hero is left behind
  const o = useTransform(scrollY, [0, 700], [1, 0])
  return (
    <A x={cx - w / 2} y={cy - 27.5} w={w} h={55}>
      <motion.div style={{ y, opacity: o, rotate: rot, boxShadow: chipShadow, borderRadius: u(34.5), paddingLeft: u(30), gap: u(12) }} className={`${glass} flex h-full w-full items-center`}>
        <img alt="" src={dot} style={{ width: u(9), height: u(9) }} />
        <span className="whitespace-nowrap font-body font-normal text-white" style={{ fontSize: fs(20) }}>{text}</span>
      </motion.div>
    </A>
  )
}

function Pill({ to, x, y, w, label, fill, labelColor, arrow, size = 14, gap = 11 }: { to: string; x: number; y: number; w: number; label: string; fill: string; labelColor: string; arrow: string; size?: number; gap?: number }) {
  return (
    <A x={x} y={y} w={w} h={53} reveal>
      <Magnetic className="h-full w-full">
        <Link to={to} className={`flex h-full w-full items-center justify-center rounded-full font-sans font-bold ${fill}`} style={{ color: labelColor, fontSize: fs(size), gap: u(gap) }}>
          {label}<img alt="" src={arrow} style={{ width: u(24), height: u(24) }} />
        </Link>
      </Magnetic>
    </A>
  )
}

function QCard({ q, active, onActivate, index }: { q: (typeof questions)[number]; active: boolean; onActivate: () => void; index: number }) {
  const band = [IMG.bandTalent, IMG.bandBusiness, IMG.bandControl, IMG.bandIntegration, IMG.bandSuccess][index]
  const pos = ['50% 78%', '50% 60%', '50% 50%', '50% 50%', '50% 62%'][index]
  return (
    <Link
      to={q.to} onMouseEnter={onActivate} onFocus={onActivate} aria-label={q.label}
      className="relative block shrink-0 overflow-hidden bg-white transition-[width,height,box-shadow] duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)]"
      style={{ width: u(active ? 460 : 379), height: u(active ? 657 : 541), borderRadius: u(20), boxShadow: active ? FIG_SHADOW : 'none' }}
    >
      <div className="absolute inset-x-0 top-0 bg-white transition-[height] duration-[600ms]" style={{ height: u(active ? 467 : 385) }}>
        <p className="absolute font-sans font-medium uppercase text-deep transition-all duration-[600ms]" style={{ left: u(active ? 61 : 50), top: u(active ? 112 : 92), fontSize: fs(active ? 20 : 16) }}>{q.label}</p>
        <p className="absolute font-body font-medium text-black transition-all duration-[600ms]" style={{ left: u(active ? 61 : 50), top: u(active ? 162 : 133), width: u(active ? 337 : 278), fontSize: fs(active ? 42 : 36, 20), lineHeight: 1.176 }}>{q.q}</p>
        {active ? (
          <>
            <img alt="" src={IMG.arrowCircleBig} className="absolute" style={{ left: u(352), top: u(389.6), width: u(46.1), height: u(46.1) }} />
            <img alt="" src={IMG.arrowGlyphBig} className="absolute" style={{ left: u(369), top: u(406.8), width: u(12.1), height: u(12.1) }} />
          </>
        ) : (
          <>
            <img alt="" src={IMG.arrowCircle} className="absolute" style={{ left: u(290), top: u(321), width: u(38), height: u(38) }} />
            <img alt="" src={IMG.arrowWhite} className="absolute" style={{ left: u(297), top: u(328), width: u(24), height: u(24) }} />
          </>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 overflow-hidden transition-[height] duration-[600ms]" style={{ height: u(active ? 190 : 156), borderBottomLeftRadius: u(20), borderBottomRightRadius: u(20) }}>
        <img alt="" src={band} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: pos }} />
      </div>
    </Link>
  )
}

export default function Desktop() {
  const root = useUnit()
  const [active, setActive] = useState(1)

  return (
    <div ref={root} className="landing relative w-full overflow-x-clip bg-pale" style={{ height: u(6230), ['--u' as string]: 'calc(100vw / 1920)' }}>
      {/* ---------- backgrounds (below the 3D orb) ---------- */}
      <A z={false} y={4260} h={1970} w={1920} className="rounded-t-[40px] bg-ink" style={{ borderTopLeftRadius: u(40), borderTopRightRadius: u(40) }} />
      <img alt="" src={IMG.diffBg} className="absolute left-0 w-full max-w-none" style={{ top: u(499), height: u(1693) }} />
      <A z={false} y={4} w={1920} h={1791} style={{ backgroundImage: 'linear-gradient(180deg, rgb(0,0,0) 57.733%, rgb(16,10,29) 66.3%, rgb(24,15,43) 76.132%, rgba(31,19,56,.84) 82.324%, rgba(36,22,64,.33) 88.16%)' }} />
      {/* the giant sphere: the 3D orb draws it; these static layers are the same artwork for reduced motion / before the canvas loads */}
      <div id="orb-hero" aria-hidden className="pointer-events-none absolute" style={{ left: u(-182), top: u(-1399), width: u(2283), height: u(2283) }} />
      {!rich && (
        <>
          <img alt="" src={IMG.heroGlow} className="absolute max-w-none" style={{ left: u(-392.8), top: u(-1609.8), width: u(2704.6), height: u(2704.6) }} />
          <img alt="" src={IMG.heroSphere} className="absolute max-w-none" style={{ left: u(-182), top: u(-1399), width: u(2283), height: u(2283) }} />
        </>
      )}

      {/* ---------- hero ---------- */}
      <A x={684.77} y={259.3} w={551.79} h={163.95}><h1 className="sr-only">Build your GCC. Right, first time.</h1><img alt="" src={IMG.headline} className="h-full w-full max-w-none" /></A>
      <A x={632} y={470} w={656} className="text-center font-body font-normal text-white" style={{ fontSize: fs(24), lineHeight: 'normal' }}>
        Finism builds and scales GCCs around your operating objectives—and stays accountable for long-term value.
      </A>
      <Pill to="/plan-your-gcc/readiness-check" x={865} y={559} w={190} label="Plan a new GCC" fill="bg-white" labelColor="#3b1f70" arrow={IMG.arrowInk} size={16} gap={12} />
      <Chip cx={336.07} cy={694.68} w={268} rot={-5.7} text="Fragmented delivery" dot={IMG.chipDotA} depth={90} />
      <Chip cx={1632.5} cy={674.5} w={279} rot={-1.05} text="Unclear accountability" dot={IMG.chipDotB} depth={70} />
      <Chip cx={1326.5} cy={827.5} w={227} rot={7.07} text="Difficulty scaling" dot={IMG.chipDotB} depth={110} />
      <A x={528} y={977} w={865} className="text-center font-body font-medium text-muted" style={{ fontSize: fs(24), lineHeight: 'normal' }}>
        Challenges we solve: fragmented delivery, unclear accountability, difficulty scaling, and centres that are not delivering what was planned.
      </A>

      {/* ---------- what makes Finism different ---------- */}
      <A x={765} y={1233} w={390} reveal className="text-center">
        <h2 className="!font-sans font-medium !tracking-normal" style={{ fontSize: fs(48, 30), lineHeight: 1.264 }}>
          <span className="!text-white">What makes </span><br /><span className="!text-purple">Finism different.</span>
        </h2>
      </A>
      <div id="orb-core" aria-hidden className="pointer-events-none absolute" style={{ left: u(770), top: u(1525), width: u(374), height: u(374) }}>
        {!rich && <img alt="" src={IMG.circleCore} className="absolute max-w-none" style={{ left: u(-1), top: u(-5), width: u(398), height: u(388) }} />}
      </div>
      <A x={683} y={1435} w={554} h={554} reveal><img alt="" src={IMG.ringDashed} className="h-full w-full max-w-none" /></A>
      <A x={881} y={1690} w={152} h={43}><img alt="" src={IMG.logoCore} className="h-full w-full max-w-none" /></A>
      {diffs.map((d, i) => (
        <A key={d.t} x={d.x} y={d.y} w={256} h={120} reveal delay={i * 0.08} className="bg-white" style={{ borderRadius: u(20), boxShadow: FIG_SHADOW }}>
          <R x={16} y={12} className="font-sans font-normal text-deep" style={{ fontSize: fs(16) }}>{d.n}</R>
          <R x={16} y={51} className="whitespace-nowrap font-sans font-bold text-black" style={{ fontSize: fs(16) }}>{d.t}</R>
          <R x={16} y={76} w={d.tw} className="font-body font-medium text-muted" style={{ fontSize: fs(12, 11), lineHeight: 0.972 + 0.2 }}>{d.d}</R>
        </A>
      ))}
      {[[710, 1569], [729, 1869], [1209, 1599], [1128, 1918]].map(([x, y]) => <A key={`${x}${y}`} x={x} y={y} w={16} h={16}><img alt="" src={IMG.ringDot} className="h-full w-full max-w-none" /></A>)}

      {/* ---------- why companies build a GCC ---------- */}
      <A x={622} y={2289} w={676} reveal className="text-center">
        <h2 className="!font-sans font-medium !tracking-normal" style={{ fontSize: fs(48, 30), lineHeight: 1.264 }}>
          <span className="!text-black">Why companies build a GCC, </span><br /><span className="!text-deep">and what they must get right</span>
        </h2>
      </A>
      <A x={511} y={2426} w={898} reveal className="text-center font-body font-normal text-muted" style={{ fontSize: fs(20), lineHeight: 'normal' }}>
        Five questions every leadership team asks. We connect each to what happens at setup, stabilisation and scale.
      </A>
      <A x={0} y={2414.5} w={1920} h={820} className="no-scrollbar overflow-x-auto overflow-y-hidden">
        <div className="flex h-full w-max items-center" style={{ paddingLeft: u(200), paddingRight: u(200), gap: u(20) }} onMouseLeave={() => undefined}>
          {questions.map((q, i) => <QCard key={q.label} q={q} index={i} active={active === i} onActivate={() => setActive(i)} />)}
        </div>
      </A>

      {/* ---------- where are you on the journey ---------- */}
      <A x={752} y={3305} w={417} reveal className="text-center">
        <h2 className="!font-sans font-medium !tracking-normal" style={{ fontSize: fs(50, 32), lineHeight: 'normal' }}>
          <span className="!text-black">Where are you on </span><br /><span className="!text-deep">the journey?</span>
        </h2>
      </A>
      <A x={200} y={3471} w={491} h={309} reveal className="group overflow-hidden" style={{ borderRadius: u(21), background: 'rgba(109,63,192,.2)' }}>
        <Link to="/plan-your-gcc/readiness-check" className="absolute inset-0" aria-label={journeyCopy[0].link} />
        <R x={46} y={50} className="font-sans font-medium text-black" style={{ fontSize: fs(36, 26) }}>{journeyCopy[0].t}</R>
        <R x={46} y={109} w={304} className="font-sans font-medium text-black" style={{ fontSize: fs(20) }}>{journeyCopy[0].d}</R>
        <R x={46} y={242} className="flex items-center whitespace-nowrap font-sans font-medium text-muted" style={{ fontSize: fs(20), gap: u(15) }}>{journeyCopy[0].link}<img alt="" src={IMG.arrowRightMuted} style={{ width: u(24), height: u(24) }} className="transition-transform duration-300 group-hover:translate-x-1.5" /></R>
        <R x={350} y={117} w={304} h={304} className="transition-transform duration-700 group-hover:-translate-y-2"><img alt="" src={IMG.globeGroup} className="h-full w-full max-w-none" /></R>
        <R x={430} y={92.7} w={60.7} h={38.1} style={{ transform: 'rotate(-13.1deg)' }}><img alt="" src={IMG.globeVector} className="h-full w-full max-w-none" /></R>
      </A>
      <A x={200} y={3800} w={491} h={309} reveal delay={0.1} className="group overflow-hidden" style={{ borderRadius: u(21), background: 'rgba(255,209,102,.2)' }}>
        <Link to="/plan-your-gcc/business-case" className="absolute inset-0" aria-label={journeyCopy[1].link} />
        <R x={46} y={50} className="font-sans font-medium text-deep" style={{ fontSize: fs(36, 26) }}>{journeyCopy[1].t}</R>
        <R x={46} y={109} w={240} className="font-sans font-medium text-deep" style={{ fontSize: fs(20) }}>{journeyCopy[1].d}</R>
        <R x={46} y={242} className="flex items-center whitespace-nowrap font-sans font-medium text-muted" style={{ fontSize: fs(20), gap: u(18) }}>{journeyCopy[1].link}<img alt="" src={IMG.arrowRightMuted} style={{ width: u(24), height: u(24) }} className="transition-transform duration-300 group-hover:translate-x-1.5" /></R>
        <div className="transition-transform duration-700 group-hover:-translate-y-2">
          <R x={351} y={75} w={203.7} h={232.2} className="flex items-center justify-center"><div className="border border-solid border-[#b2c6ca] bg-[#ede1c6]" style={{ width: u(153.2), height: u(196.1), borderRadius: u(9), transform: 'rotate(-16.95deg)' }} /></R>
          <R x={386.6} y={119.1} w={148.4} h={206.5} className="flex items-center justify-center"><div className="border border-solid border-[#b2c6ca] bg-[#fff1cf]" style={{ width: u(132.6), height: u(196.1), borderRadius: u(9), transform: 'rotate(4.77deg)' }} /></R>
          <R x={417} y={174.3} w={87.1} h={80.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docOutline} className="h-full w-full max-w-none" /></R>
          <R x={414.5} y={257} w={98.4} h={21.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docLines} className="h-full w-full max-w-none" /></R>
          <R x={414.5} y={275} w={98.4} h={21.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docLines} className="h-full w-full max-w-none" /></R>
        </div>
      </A>
      <A x={711} y={3471} w={1009} h={636} reveal delay={0.05} className="group overflow-hidden border border-solid border-[#ffd166] bg-[#fff5df]" style={{ borderRadius: u(20) }}>
        <Link to="/plan-your-gcc/strategy-session" className="absolute inset-0 z-10" aria-label={journeyCopy[2].link} />
        <img alt="" src={IMG.journeyPhoto} loading="lazy" className="absolute max-w-none object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" style={{ left: u(-17.5 + 0), bottom: 0, width: u(1044), height: u(696) }} />
        <div className="absolute left-0" style={{ bottom: u(-25), width: u(1009), height: u(746), backgroundImage: 'linear-gradient(17.74deg, rgb(0,0,0) 8.5625%, rgba(0,0,0,0) 48.217%)' }} />
        <R x={46} y={396} w={452} className="font-sans font-medium text-white" style={{ fontSize: fs(40, 28) }}>{journeyCopy[2].t}</R>
        <R x={46} y={464} w={488} className="font-sans font-medium text-white" style={{ fontSize: fs(24) }}>{journeyCopy[2].d}</R>
        <R x={46} y={562} className="flex items-center whitespace-nowrap font-sans font-medium text-[#ffd166]" style={{ fontSize: fs(20), gap: u(17) }}>{journeyCopy[2].link}<img alt="" src={IMG.arrowRightWhite} style={{ width: u(24), height: u(24) }} className="transition-transform duration-300 group-hover:translate-x-1.5" /></R>
      </A>

      {/* ---------- why India ---------- */}
      <A x={200} y={4368} reveal><h2 className="!font-sans font-medium !tracking-normal !text-white" style={{ fontSize: fs(50, 32), lineHeight: 'normal' }}>Why India?</h2></A>
      <A x={200} y={4495} w={495} h={502} reveal className="overflow-hidden bg-[#d9d9d9]" style={{ borderRadius: u(21) }}>
        <img alt="A person typing on a laptop" src={IMG.indiaPhoto} loading="lazy" className="absolute max-w-none object-cover" style={{ left: u(-225), top: 0, width: u(756), height: u(503) }} />
      </A>
      <A x={714} y={4495} w={495} h={502} reveal delay={0.08} style={{ borderRadius: u(21), backgroundImage: 'linear-gradient(134.3deg, rgb(59,31,112) 7.22%, rgb(109,63,192) 70.66%, rgb(169,141,221) 98.12%)' }}>
        <R x={30} y={30} w={45} h={45}><img alt="" src={IMG.dotWhite} className="h-full w-full" /></R>
        <R x={30} y={269} className="whitespace-nowrap font-sans font-bold text-white" style={{ fontSize: fs(36, 26) }}>{india[0].t}</R>
        <R x={30} y={341} w={320} className="font-sans font-medium text-white" style={{ fontSize: fs(20) }}>{india[0].d}</R>
      </A>
      {[0, 1].map((k) => (
        <A key={k} x={1229} y={k ? 4756 : 4495} w={491} h={241} reveal delay={0.16 + k * 0.08} className="border-2 border-solid border-[#7a57c8]" style={{ borderRadius: u(21) }}>
          <R x={28} y={28} w={45} h={45}><img alt="" src={IMG.dotPurple} className="h-full w-full" /></R>
          <R x={28} y={k ? 108 : 114} w={398} className="font-sans font-bold text-white" style={{ fontSize: fs(36, 26), lineHeight: k ? 'normal' : 0.862 }}>{india[k + 1].t}</R>
          <R x={28} y={k ? 167 : 167} w={k ? 304 : 398} className="font-sans font-medium text-white" style={{ fontSize: fs(20) }}>{india[k + 1].d}</R>
        </A>
      ))}
      <A x={200} y={5097} w={1115} reveal><h2 className="!font-sans font-medium !tracking-normal" style={{ fontSize: fs(50, 30), lineHeight: 'normal' }}><span className="!text-white">Enterprise-grade delivery, sized </span><span className="!text-purple">to your scale</span></h2></A>
      <A x={200} y={5184} w={1236} className="font-body font-medium text-muted" style={{ fontSize: fs(24), lineHeight: 'normal' }}>
        Enterprises, mid and small-scale companies and PE-backed portfolios get the same senior attention, and the flexibility to adapt as they grow. Start from your situation, not your label.
      </A>
      <A z={false} x={0} y={5370} w={1921} h={1}><img alt="" src={IMG.divider} className="w-full max-w-none" /></A>
      <A x={200} y={5465} w={1115} reveal><h2 className="!font-sans font-medium !tracking-normal !text-[#f9f8f5]" style={{ fontSize: fs(50, 30), lineHeight: 'normal' }}>Ready to build a center that <br />keeps delivering?</h2></A>
      <Pill to="/plan-your-gcc/readiness-check" x={200} y={5619} w={217} label="Readiness Check" fill="bg-[#ffd166]" labelColor="#000" arrow={IMG.arrowDark} gap={12} />
      <Pill to="/plan-your-gcc/business-case" x={439} y={5619} w={217} label="Business Case" fill="border border-solid border-white" labelColor="#fff" arrow={IMG.arrowWhite} gap={12} />
      <Pill to="/plan-your-gcc/strategy-session" x={678} y={5619} w={217} label="Strategy Session" fill="border border-solid border-white" labelColor="#fff" arrow={IMG.arrowWhite} gap={12} />

      {/* footer */}
      <A x={1337} y={5824} w={383} h={107}><img alt="Finism" src={IMG.logoBig} className="h-full w-full max-w-none" /></A>
      <div id="dot-end" aria-hidden className="pointer-events-none absolute rounded-full" style={{ left: u(1337), top: u(5824 + 79.2), width: u(26.2), height: u(26.4), background: rich ? undefined : 'linear-gradient(135deg,#3b1f70,#6d3fc0 70%,#a98ddd)' }} />
      <A z={false} x={0} y={6120} w={1921} h={1}><img alt="" src={IMG.divider} className="w-full max-w-none" /></A>
      {[['Solutions', 1189, '/solutions/services'], ['Why GCC', 1273, '/why-gcc'], ['Why Finism', 1359, '/why-finism'], ['Insights', 1455, '/insights']].map(([l, x, to]) => (
        <A key={l as string} x={x as number} y={6026}><Link to={to as string} className="font-body font-medium text-[#f9f8f5] hover:text-white" style={{ fontSize: fs(12, 11) }}>{l}</Link></A>
      ))}
      <Pill to="/plan-your-gcc" x={1531} y={6007} w={189} label="Plan Your GCC" fill="bg-[#ffd166]" labelColor="#000" arrow={IMG.arrowDark} gap={10} />
      <A x={199} y={6143} className="whitespace-nowrap font-body font-normal text-[#d4d4d4]" style={{ fontSize: fs(12, 11), lineHeight: u(40) }}>
        Made to build. Made to last. • Finism Solutions Pvt Ltd • Contact: contact@finismsolutions.com© 2026
      </A>
    </div>
  )
}
