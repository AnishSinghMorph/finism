import PageHero from '../components/PageHero'
import IntakeForm from '../components/IntakeForm'

export default function BusinessCase() {
  return (
    <>
      <PageHero eyebrow="Plan your GCC / Business Case" title={<>Test whether the case <em>justifies the investment.</em></>} intro="Free, built by a Finism practitioner. You receive an initial assessment of potential costs, staffing considerations and financial feasibility, based on the information provided and stated assumptions." />
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-2xl">
          <IntakeForm
            subject="Business Case request"
            doneTitle="Your request is ready to send."
            doneBody="A Finism practitioner will walk you through the assessment on a call. Estimates are indicative; detailed scope, pricing and implementation planning need further discovery."
            steps={[
              { title: 'About your company', fields: [
                { name: 'website', label: 'Company website', type: 'url', required: true, placeholder: 'yourcompany.com' },
                { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@yourcompany.com' },
              ] },
              { title: 'About the centre', fields: [
                { name: 'size', label: 'Planned size', type: 'choice', required: true, options: ['Under 50', '50 to 150', '150 or more'] },
                { name: 'brief', label: 'Short brief', type: 'textarea', required: true, hint: 'What do you want the centre to do?', placeholder: 'Functions, timing, anything we should know.' },
              ] },
            ]}
          />
        </div>
      </section>
    </>
  )
}
