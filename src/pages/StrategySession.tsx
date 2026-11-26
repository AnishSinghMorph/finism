import PageHero from '../components/PageHero'
import IntakeForm from '../components/IntakeForm'

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function StrategySession() {
  return (
    <>
      <PageHero eyebrow="Plan your GCC / Strategy Session" title={<>Decide how to build, optimise <em>or scale your centre.</em></>} intro="30 to 45 minutes with a senior Finism practitioner: a view on model, location, risks and your first 90 days." />
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl">
          <IntakeForm
            subject="Strategy Session request"
            doneTitle="Your request is ready to send."
            doneBody="We will reply with times that suit your time zone. After the session you receive a proposal, or a reference call once references are approved."
            steps={[
              { title: 'Where are you?', fields: [
                { name: 'situation', label: 'Your situation', type: 'choice', required: true, options: ['Exploring', 'Planning a new centre', 'Running a centre today'] },
                { name: 'context', label: 'Short qualifier', type: 'textarea', required: true, hint: 'What are you trying to decide?', placeholder: 'A sentence or two is enough.' },
              ] },
              { title: 'When suits you?', fields: [
                { name: 'name', label: 'Your name', type: 'text', required: true },
                { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@yourcompany.com' },
                { name: 'time', label: `Preferred time (${tz})`, type: 'choice', required: true, options: ['Morning', 'Afternoon', 'Evening'] },
              ] },
            ]}
          />
        </div>
      </section>
    </>
  )
}
