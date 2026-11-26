import PageHero from '../components/PageHero'
import Accordion from '../components/Accordion'
import CtaBand from '../components/CtaBand'
import { faq } from '../content'

export default function Faq() {
  return (
    <>
      <PageHero eyebrow="Insights / FAQ" title={<>Building a GCC, <em>answered plainly.</em></>} intro="Straight answers to the questions teams ask before they start." />
      <section className="px-6">
        <div className="mx-auto max-w-4xl"><Accordion items={faq} /></div>
      </section>
      <CtaBand title="Still have a question? Tell us where you are and what you are trying to build. We will prepare an initial business assessment at no cost, based on the information you share." label="Request a Business Case" to="/plan-your-gcc/business-case" />
    </>
  )
}
