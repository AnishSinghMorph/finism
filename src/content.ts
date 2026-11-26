// All page copy comes from the wireframe. Items marked DRAFT were filled in by us from the capability matrix and need client sign-off.
export const stages = [
  { n: '1', title: 'Strategy and Advisory', body: 'Feasibility, business case, readiness, location, operating model.', outcome: 'A case and model you can defend.', cta: 'Discuss Your GCC Strategy', to: '/plan-your-gcc/strategy-session' },
  { n: '2', title: 'Setup and Launch', body: 'Entity, talent, workspace, technology, security, compliance from day one.', outcome: 'A centre ready to operate.', cta: 'Plan Your GCC Setup', to: '/plan-your-gcc/business-case' },
  { n: '3', title: 'Operations and Scale', body: 'Finance, HR, filings, governance, attrition, vendor consolidation.', outcome: 'Sustained value that is governed. For existing centres too, whether or not you plan to expand.', cta: 'Discuss GCC Scaling', to: '/plan-your-gcc/strategy-session' },
]

export const matrix: [string, string, string, string][] = [
  ['Talent Acquisition', 'Workforce plan, pay benchmarks', 'Hiring, employer brand, onboarding', 'Ongoing hiring, attrition advisory'],
  ['Workspace', 'Location and space strategy', 'Selection, fit-out, branded space', 'Facility management, expansion'],
  ['Infrastructure', 'IT and security design', 'IT set-up, network, procurement', 'Support desk, vendor management'],
  ['Operations', 'Finance and tax model, entity design', 'Entity set-up, banking, policies', 'Payroll, filings, reporting'],
  ['GCC Consulting', 'Business case, operating model', 'Design Blueprint, programme management', 'Transformation roadmaps, Centre of Excellence'],
  ['Governance', 'Governance design', 'One accountable lead', 'Reporting and control tower'],
]

// control: 1 (lower) to 5 (highest). rising: control grows over time.
export const models = [
  { name: 'Employer of Record', how: 'Finism employs your team on your behalf and you direct the work. No entity needed.', best: 'Pilots and small teams', control: 1, label: 'Lower' },
  { name: 'Company-owned', how: 'Your own entity runs the centre. Finism sets it up and supports it.', best: 'Ready to own end to end', control: 5, label: 'Highest' },
  { name: 'Build-Operate-Transfer', how: 'Finism builds and runs the centre, then hands it over.', best: 'Scaling before owning', control: 2, rising: true, label: 'Rises over time' },
  { name: 'Managed GCC', how: 'Finism runs it day to day under your brand and governance.', best: 'Speed with limited in-house experience', control: 3, label: 'Moderate' },
  { name: 'Hybrid', how: 'A mix as you grow.', best: 'Companies in transition', control: 3, varies: true, label: 'Varies' },
]

export const segments = [
  { name: 'Mid and Small-Scale', risk: 'Fragmented delivery, unclear accountability and difficulty scaling.', need: 'Finism owns the build end to end, a low-capital start, a path to full ownership.' },
  { name: 'PE-Backed', risk: 'Missing the value story before exit.', need: 'A repeatable blueprint so each centre launches faster than the last.' },
  { name: 'Enterprise', risk: 'Fragmented delivery, unclear accountability and centres that struggle to scale.', need: 'Build fast at scale, or fix what is not working.' },
]
export const situations: [string, string, string][] = [
  ['Building a first centre', 'Mid and small-scale company', 'PE portfolio company, enterprise business unit'],
  ['Repeating the model across a portfolio', 'PE operating partner', 'Multi-division enterprise'],
  ['Scaling, consolidating or fixing centres', 'Enterprise', 'Fast-growing mid and small-scale company'],
]

export const lifecycle = ['Set up', 'Stabilise', 'Scale']
// DRAFT: wireframe leaves this table empty; derived from the capability matrix.
export const buyerQs: { q: string; label: string; at: [string, string, string] }[] = [
  { label: 'Talent and capacity', q: 'Can we access the talent and capacity we need?', at: ['Workforce plan, pay benchmarks and first hires', 'Onboarding and employer brand in action', 'Ongoing hiring and attrition advisory'] },
  { label: 'Business case', q: 'Does the business case justify the investment?', at: ['Business case and entity design', 'Finance and tax model running in practice', 'Reporting that shows the case holding'] },
  { label: 'Control and quality', q: 'How do we keep control and service quality?', at: ['Governance design and one accountable lead', 'Reporting and control tower', 'Governance that grows with the centre'] },
  { label: 'Integration', q: 'How will it fit our existing business?', at: ['Operating model design', 'Policies, roles and the organisation linked', 'Centre of Excellence'] },
  { label: 'Success after launch', q: 'What does success look like next year?', at: ['Defined milestones and one measurable outcome per stage', 'Attrition and vendor consolidation tracked', 'Transformation roadmaps'] },
]

export const india = [
  ['Talent availability', 'Deep pools of engineering, AI/ML, R&D, finance, analytics and operations talent across many cities.'],
  ['A large GCC ecosystem', 'Established centres, peers, specialists and workspace options close at hand.'],
  ['Government policies favouring GCCs', 'Governments in India actively support GCCs. We explain what applies to you when we plan your location.'],
]

export const brain = [
  ['Your information', 'Your inputs, gathered the same way every time.'],
  ['How it connects', 'Policies, roles and the organisation linked.'],
  ['Our GCC knowledge', 'Employment law, compliance and benchmarks as method.'],
  ['The AI workflow', 'Drafts the deliverable. A practitioner checks it.'],
]

export const offers = [
  { name: 'Readiness Check', meta: 'About 5 minutes, self-serve', job: 'Find your starting point', give: 'Three answers. Email only if you want the summary.', get: 'Likely model shortlist, what to settle first, suggested next step.', next: 'Request a Business Case if the fit looks right.', cta: 'Start the Readiness Check', to: '/plan-your-gcc/readiness-check' },
  { name: 'Business Case', meta: 'Free, built by a Finism practitioner', job: 'Test whether the business case justifies the investment', give: 'Company website, work email, short brief, planned size.', get: 'An initial assessment of potential costs, staffing considerations and financial feasibility, based on the information provided and stated assumptions.', next: 'A walkthrough call. Estimates are indicative; detailed scope, pricing and implementation planning need further discovery.', cta: 'Request a Business Case', to: '/plan-your-gcc/business-case' },
  { name: 'Strategy Session', meta: '30 to 45 minutes', job: 'Decide how to build, optimise or scale your centre', give: 'A time in your time zone and a short qualifier.', get: 'A senior Finism practitioner view on model, location, risks and first 90 days.', next: 'A proposal, or a reference call once references are approved.', cta: 'Book a Strategy Session', to: '/plan-your-gcc/strategy-session' },
]

export const guides = [
  { slug: 'choosing-a-location', title: 'Choosing a location' },
  { slug: 'government-policies', title: 'Government policies favouring GCCs in India' },
  { slug: 'cost-and-investment', title: 'Cost and investment' },
  { slug: 'entity-and-compliance', title: 'Entity and compliance' },
  { slug: 'setup-timeline', title: 'Setup timeline' },
]

export const faq: { q: string; a: string }[] = [
  { q: 'What is a GCC, in plain terms?', a: 'Your own team in India, on your payroll and working on your roadmap, instead of work handed to an outsourcing vendor. Also called a captive centre or Global In-house Centre. The people, IP and knowledge stay yours.' },
  { q: 'How is a GCC different from outsourcing or a BPO?', a: 'Outsourcing rents capability from a vendor, who keeps the IP and adds a margin. A GCC builds capability you own and run.' },
  { q: 'Is my company the right size and type?', a: 'A GCC usually starts to make sense at around $300M in revenue. Below that, entity, office and leadership costs are harder to justify, so smaller companies often start on lighter models.' },
  { q: 'How small can a GCC start?', a: 'Most start at 50 to 100 people. Some break even at 25 to 50. Below that, very small teams usually begin on an Employer of Record model.' },
  { q: 'What functions can I run from India?', a: 'If the work does not need someone physically present, it can move: technology, engineering, R&D, analytics, AI, finance, HR, marketing, customer service, procurement and supply chain. Technology usually goes first.' },
  { q: 'How much does it cost to set up and run?', a: 'A 50-person pilot runs roughly $550K to $3M, with entity registration taking about four to eight weeks. Phased models can bring entry cost to around $500K to $2M. Market estimates; they vary.' },
  { q: 'When does a GCC start paying for itself?', a: 'Usually within 18 to 30 months for a straight build. Outsourcing looks cheaper in Year 1; the case turns positive around Year 2. A phased model pulls break-even earlier.' },
  { q: 'How does it compare with outsourcing over 3 to 5 years?', a: 'GCCs tend to be 20 to 35% more cost-effective once vendor margins, attrition and overhead are counted. Vendor contracts usually carry an 18 to 45% margin.' },
  { q: 'Can I start without a legal entity?', a: 'Yes. An Employer of Record model lets you hire without your own entity. Many start there, move to Build-Operate-Transfer to scale, and set up their own entity later.' },
  { q: 'Captive, GCC-as-a-Service or BOT?', a: 'A captive is fully owned by you. With GCC-as-a-Service, Finism runs it day to day under your brand and governance. With Build-Operate-Transfer, Finism builds and runs it, then hands ownership to you.' },
  { q: 'What should I look for in a GCC adviser?', a: 'A real track record of setting up and scaling centres, local knowledge, speed and certainty of launch, transparent pricing and relevant references.' },
  { q: 'What should I watch out for?', a: 'The gap between promise and delivery. Push on dates for workspace, entity and hiring. Ask how governance works, bring your workstream leads in early, and be clear who owns compliance.' },
  { q: 'What makes Finism different?', a: 'Founder-led and hands-on. You work directly with experienced practitioners and have one clear point of accountability. Finism brings focus, practitioner experience and ownership.' },
  { q: 'What is the one thing that de-risks a build?', a: 'Ownership on your side. Nominate one senior governance lead who owns the build end to end and holds both sides to the plan.' },
]
export const popularQs = [faq[0], faq[8], faq[13]]
