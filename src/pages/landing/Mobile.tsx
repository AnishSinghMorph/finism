import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Magnetic from '../../components/Magnetic'
import { rich } from '../../components/rich'
import { A as IMG } from './assets'
import { R, Scaled, u, FIG_SHADOW } from './u'
import { diffs, questions, journeyCopy, india } from './copy'

// Phones and tablets: the same story as the desktop design, stacked. Anchors for the 3D orb keep the same ids.
const glass = 'backdrop-blur-[8.7px] bg-[rgba(109,63,192,.4)] border-[1.5px] border-solid border-white/[.38]'
const rise = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -8% 0px' }, transition: { duration: 0.7 } }

function Pill({ to, label, fill, color, arrow }: { to: string; label: string; fill: string; color: string; arrow: string }) {
  return (
    <Magnetic><Link to={to} className={`inline-flex h-[53px] items-center justify-center gap-3 rounded-full px-6 font-sans text-[15px] font-bold ${fill}`} style={{ color }}>{label}<img alt="" src={arrow} className="h-6 w-6" /></Link></Magnetic>
  )
}
const bandPos = ['50% 78%', '50% 60%', '50% 50%', '50% 50%', '50% 62%']
const bands = [IMG.bandTalent, IMG.bandBusiness, IMG.bandControl, IMG.bandIntegration, IMG.bandSuccess]

export default function Mobile() {
  return (
    <div className="landing overflow-x-clip bg-pale">
      {/* hero: black, with the giant sphere's arc rising behind the tags */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-black to-[#140c26] px-6 pb-14 pt-28 text-center">
        <div id="orb-hero" aria-hidden className="pointer-events-none absolute" style={{ width: '230vw', height: '230vw', left: '-65vw', bottom: '26vw' }}>
          {!rich && <img alt="" src={IMG.heroSphere} className="h-full w-full" />}
        </div>
        <h1 className="sr-only">Build your GCC. Right, first time.</h1>
        <img alt="" src={IMG.headline} className="relative z-[45] mx-auto w-[84%] max-w-md" />
        <p className="relative z-[45] mx-auto mt-6 max-w-md font-body text-[17px] leading-snug text-white">Finism builds and scales GCCs around your operating objectives—and stays accountable for long-term value.</p>
        <div className="relative z-[45] mt-7"><Pill to="/plan-your-gcc/readiness-check" label="Plan a new GCC" fill="bg-white" color="#3b1f70" arrow={IMG.arrowInk} /></div>
        <div className="relative z-[45] mx-auto mt-12 flex max-w-sm flex-wrap justify-center gap-3">
          {[['Fragmented delivery', -4], ['Unclear accountability', 2], ['Difficulty scaling', -2]].map(([t, r]) => (
            <span key={t as string} style={{ rotate: `${r}deg` }} className={`${glass} inline-flex items-center gap-2.5 rounded-full px-5 py-3 font-body text-[15px] text-white`}><img alt="" src={IMG.chipDotB} className="h-2 w-2" />{t}</span>
          ))}
        </div>
        <p className="relative z-[45] mx-auto mt-28 max-w-md font-body text-[15px] font-medium leading-snug text-muted">Challenges we solve: fragmented delivery, unclear accountability, difficulty scaling, and centres that are not delivering what was planned.</p>
      </section>

      {/* what makes Finism different */}
      <section className="relative bg-ink px-6 pb-16 pt-16 text-center" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .06) 1px, transparent 1px)', backgroundSize: '36px 36px', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <motion.h2 {...rise} className="relative z-[45] !font-sans text-[34px] font-medium !tracking-normal leading-[1.2]"><span className="!text-white">What makes </span><br /><span className="!text-purple">Finism different.</span></motion.h2>
        <div className="relative mx-auto mt-12 aspect-square w-[78%] max-w-[340px]">
          <img alt="" src={IMG.ringDashed} className="absolute -inset-[24%] z-[45] h-[148%] w-[148%] max-w-none" />
          <div id="orb-core" aria-hidden className="pointer-events-none absolute inset-0">{!rich && <img alt="" src={IMG.circleCore} className="h-full w-full" />}</div>
          <img alt="Finism" src={IMG.logoCore} className="absolute left-1/2 top-1/2 z-[45] w-[40%] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-[45] mt-24 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {diffs.map((d, i) => (
            <motion.div key={d.t} {...rise} transition={{ duration: 0.7, delay: i * 0.06 }} className="rounded-[20px] bg-white p-5" style={{ boxShadow: FIG_SHADOW }}>
              <p className="font-sans text-base text-deep">{d.n}</p>
              <p className="mt-5 font-sans text-base font-bold text-black">{d.t}</p>
              <p className="mt-1 font-body text-[13px] font-medium leading-snug text-muted">{d.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* why companies build a GCC: swipe row */}
      <section className="pb-4 pt-16">
        <motion.h2 {...rise} className="px-6 text-center !font-sans text-[32px] font-medium !tracking-normal leading-[1.2]"><span className="!text-black">Why companies build a GCC, </span><span className="!text-deep">and what they must get right</span></motion.h2>
        <p className="mx-auto mt-4 max-w-sm px-6 text-center font-body text-base text-muted">Five questions every leadership team asks. We connect each to what happens at setup, stabilisation and scale.</p>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-10">
          {questions.map((q, i) => (
            <Link key={q.label} to={q.to} className="relative flex h-[460px] w-[78vw] max-w-[340px] shrink-0 snap-center flex-col overflow-hidden rounded-[20px] bg-white" style={{ boxShadow: FIG_SHADOW }}>
              <div className="relative flex-1 p-6">
                <p className="font-sans text-sm font-medium uppercase text-deep">{q.label}</p>
                <p className="mt-4 font-body text-[28px] font-medium leading-[1.18] text-black">{q.q}</p>
                <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-deep"><img alt="" src={IMG.arrowWhite} className="h-6 w-6" /></span>
              </div>
              <img alt="" src={bands[i]} loading="lazy" className="h-[130px] w-full object-cover" style={{ objectPosition: bandPos[i] }} />
            </Link>
          ))}
        </div>
      </section>

      {/* journey */}
      <section className="px-6 pb-16 pt-6">
        <motion.h2 {...rise} className="text-center !font-sans text-[34px] font-medium !tracking-normal leading-[1.2]"><span className="!text-black">Where are you on </span><span className="!text-deep">the journey?</span></motion.h2>
        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
          <Scaled w={491} h={309} className="group overflow-hidden"><motion.div {...rise} className="absolute inset-0 overflow-hidden" style={{ borderRadius: u(21), background: 'rgba(109,63,192,.2)' }}>
            <Link to="/plan-your-gcc/readiness-check" className="absolute inset-0 z-10" aria-label={journeyCopy[0].link} />
            <R x={46} y={50} className="font-sans font-medium text-black" style={{ fontSize: u(36) }}>{journeyCopy[0].t}</R>
            <R x={46} y={109} w={304} className="font-sans font-medium text-black" style={{ fontSize: u(20) }}>{journeyCopy[0].d}</R>
            <R x={46} y={242} className="flex items-center whitespace-nowrap font-sans font-medium text-muted" style={{ fontSize: u(20), gap: u(15) }}>{journeyCopy[0].link}<img alt="" src={IMG.arrowRightMuted} style={{ width: u(24), height: u(24) }} /></R>
            <R x={350} y={117} w={304} h={304}><img alt="" src={IMG.globeGroup} className="h-full w-full max-w-none" /></R>
            <R x={430} y={92.7} w={60.7} h={38.1} style={{ transform: 'rotate(-13.1deg)' }}><img alt="" src={IMG.globeVector} className="h-full w-full max-w-none" /></R>
          </motion.div></Scaled>
          <Scaled w={491} h={309} className="group overflow-hidden"><motion.div {...rise} className="absolute inset-0 overflow-hidden" style={{ borderRadius: u(21), background: 'rgba(255,209,102,.2)' }}>
            <Link to="/plan-your-gcc/business-case" className="absolute inset-0 z-10" aria-label={journeyCopy[1].link} />
            <R x={46} y={50} className="font-sans font-medium text-deep" style={{ fontSize: u(36) }}>{journeyCopy[1].t}</R>
            <R x={46} y={109} w={240} className="font-sans font-medium text-deep" style={{ fontSize: u(20) }}>{journeyCopy[1].d}</R>
            <R x={46} y={242} className="flex items-center whitespace-nowrap font-sans font-medium text-muted" style={{ fontSize: u(20), gap: u(18) }}>{journeyCopy[1].link}<img alt="" src={IMG.arrowRightMuted} style={{ width: u(24), height: u(24) }} /></R>
            <R x={351} y={75} w={203.7} h={232.2} className="flex items-center justify-center"><div className="border border-solid border-[#b2c6ca] bg-[#ede1c6]" style={{ width: u(153.2), height: u(196.1), borderRadius: u(9), transform: 'rotate(-16.95deg)' }} /></R>
            <R x={386.6} y={119.1} w={148.4} h={206.5} className="flex items-center justify-center"><div className="border border-solid border-[#b2c6ca] bg-[#fff1cf]" style={{ width: u(132.6), height: u(196.1), borderRadius: u(9), transform: 'rotate(4.77deg)' }} /></R>
            <R x={417} y={174.3} w={87.1} h={80.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docOutline} className="h-full w-full max-w-none" /></R>
            <R x={414.5} y={257} w={98.4} h={21.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docLines} className="h-full w-full max-w-none" /></R>
            <R x={414.5} y={275} w={98.4} h={21.2} style={{ transform: 'rotate(4.77deg)' }}><img alt="" src={IMG.docLines} className="h-full w-full max-w-none" /></R>
          </motion.div></Scaled>
          <motion.div {...rise} className="relative min-h-[420px] overflow-hidden rounded-[20px] border border-solid border-[#ffd166] bg-[#fff5df]">
            <img alt="" src={IMG.journeyPhoto} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(0deg, rgb(0,0,0) 6%, rgba(0,0,0,0) 62%)' }} />
            <Link to="/plan-your-gcc/strategy-session" className="absolute inset-x-0 bottom-0 p-6" aria-label={journeyCopy[2].link}>
              <p className="font-sans text-[30px] font-medium text-white">{journeyCopy[2].t}</p>
              <p className="mt-2 font-sans text-base font-medium text-white">{journeyCopy[2].d}</p>
              <p className="mt-4 flex items-center gap-3 font-sans text-base font-medium text-[#ffd166]">{journeyCopy[2].link}<img alt="" src={IMG.arrowRightWhite} className="h-6 w-6" /></p>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* why India + closing */}
      <section className="relative bg-ink px-6 pb-12 pt-14" style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
        <motion.h2 {...rise} className="!font-sans text-[34px] font-medium !tracking-normal !text-white">Why India?</motion.h2>
        <div className="mx-auto mt-8 grid max-w-xl gap-4">
          <motion.div {...rise} className="aspect-[495/400] overflow-hidden rounded-[21px] bg-[#d9d9d9]"><img alt="A person typing on a laptop" src={IMG.indiaPhoto} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: '70% 50%' }} /></motion.div>
          <Scaled w={495} h={300}><motion.div {...rise} className="absolute inset-0" style={{ borderRadius: u(21), backgroundImage: 'linear-gradient(134.3deg, rgb(59,31,112) 7.22%, rgb(109,63,192) 70.66%, rgb(169,141,221) 98.12%)' }}>
            <R x={30} y={30} w={45} h={45}><img alt="" src={IMG.dotWhite} className="h-full w-full" /></R>
            <R x={30} y={170} className="whitespace-nowrap font-sans font-bold text-white" style={{ fontSize: u(36) }}>{india[0].t}</R>
            <R x={30} y={225} w={400} className="font-sans font-medium text-white" style={{ fontSize: u(20) }}>{india[0].d}</R>
          </motion.div></Scaled>
          {[1, 2].map((k) => (
            <Scaled key={k} w={491} h={241}><motion.div {...rise} className="absolute inset-0 border-2 border-solid border-[#7a57c8]" style={{ borderRadius: u(21) }}>
              <R x={28} y={28} w={45} h={45}><img alt="" src={IMG.dotPurple} className="h-full w-full" /></R>
              <R x={28} y={110} className="whitespace-nowrap font-sans font-bold text-white" style={{ fontSize: u(36) }}>{india[k].t}</R>
              <R x={28} y={167} w={400} className="font-sans font-medium text-white" style={{ fontSize: u(20) }}>{india[k].d}</R>
            </motion.div></Scaled>
          ))}
        </div>
        <motion.h2 {...rise} className="mt-14 !font-sans text-[30px] font-medium !tracking-normal leading-[1.2]"><span className="!text-white">Enterprise-grade delivery, sized </span><span className="!text-purple">to your scale</span></motion.h2>
        <p className="mt-4 font-body text-base font-medium leading-snug text-muted">Enterprises, mid and small-scale companies and PE-backed portfolios get the same senior attention, and the flexibility to adapt as they grow. Start from your situation, not your label.</p>
        <div className="mt-12 border-t border-white/15 pt-12">
          <motion.h2 {...rise} className="!font-sans text-[32px] font-medium !tracking-normal leading-[1.2] !text-[#f9f8f5]">Ready to build a center that keeps delivering?</motion.h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <Pill to="/plan-your-gcc/readiness-check" label="Readiness Check" fill="bg-[#ffd166]" color="#000" arrow={IMG.arrowDark} />
            <Pill to="/plan-your-gcc/business-case" label="Business Case" fill="border border-solid border-white" color="#fff" arrow={IMG.arrowWhite} />
            <Pill to="/plan-your-gcc/strategy-session" label="Strategy Session" fill="border border-solid border-white" color="#fff" arrow={IMG.arrowWhite} />
          </div>
        </div>
        <div className="relative ml-auto mt-16 w-[66%] max-w-[300px]">
          <img alt="Finism" src={IMG.logoBig} className="w-full" />
          <div id="dot-end" aria-hidden className="pointer-events-none absolute rounded-full" style={{ left: 0, top: '74%', width: '6.84%', aspectRatio: '1', background: rich ? undefined : 'linear-gradient(135deg,#3b1f70,#6d3fc0 70%,#a98ddd)' }} />
        </div>
        <nav className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
          {[['Solutions', '/solutions/services'], ['Why GCC', '/why-gcc'], ['Why Finism', '/why-finism'], ['Insights', '/insights']].map(([l, to]) => <Link key={l} to={to} className="font-body text-[13px] font-medium text-[#f9f8f5]">{l}</Link>)}
          <Link to="/plan-your-gcc" className="ml-auto rounded-full bg-[#ffd166] px-5 py-3 font-sans text-sm font-bold text-black">Plan Your GCC ↗</Link>
        </nav>
        <p className="mt-8 font-body text-xs leading-relaxed text-[#d4d4d4]">Made to build. Made to last. • Finism Solutions Pvt Ltd • Contact: contact@finismsolutions.com© 2026</p>
      </section>
    </div>
  )
}
