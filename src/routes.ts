export type NavItem = { label: string; to: string; children?: { label: string; to: string }[] }

export const nav: NavItem[] = [
  { label: 'Solutions', to: '/solutions/services', children: [
    { label: 'Services', to: '/solutions/services' },
    { label: 'Operating Models', to: '/solutions/operating-models' },
    { label: 'Who We Help', to: '/solutions/who-we-help' },
  ] },
  { label: 'Why GCC', to: '/why-gcc', children: [
    { label: 'Why a GCC', to: '/why-gcc' },
    { label: 'Why India', to: '/why-gcc/why-india' },
  ] },
  { label: 'Why Finism', to: '/why-finism' },
  { label: 'Insights', to: '/insights', children: [
    { label: 'Guides', to: '/insights' },
    { label: 'FAQ', to: '/insights/faq' },
    { label: 'Research and events', to: '/insights/research' },
  ] },
]

export const cta = { label: 'Plan Your GCC', to: '/plan-your-gcc' }

// Every page route, so stubs and the router share one list.
export const pages: { path: string; title: string }[] = [
  { path: '/solutions/services', title: 'Services' },
  { path: '/solutions/operating-models', title: 'Operating Models' },
  { path: '/solutions/who-we-help', title: 'Who We Help' },
  { path: '/why-gcc', title: 'Why a GCC' },
  { path: '/why-gcc/why-india', title: 'Why India' },
  { path: '/why-finism', title: 'Why Finism' },
  { path: '/insights', title: 'Insights' },
  { path: '/insights/faq', title: 'FAQ' },
  { path: '/insights/research', title: 'Research and events' },
  { path: '/plan-your-gcc', title: 'Plan Your GCC' },
  { path: '/plan-your-gcc/readiness-check', title: 'Readiness Check' },
  { path: '/plan-your-gcc/business-case', title: 'Business Case' },
  { path: '/plan-your-gcc/strategy-session', title: 'Strategy Session' },
]
