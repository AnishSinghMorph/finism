// Readiness Check rules, from the wireframe's sample-results table. "Logic to be validated by Finism."
export type Stage = 'exploring' | 'planning' | 'running'
export type Size = 'small' | 'mid' | 'large'
export type Focus = 'talent' | 'case' | 'control'
export type Answers = { stage: Stage; size: Size; focus: Focus }
export type Result = { review: boolean; models: string[]; note?: string; next: { label: string; to: string }[]; settle: string }

const focusLabel: Record<Focus, string> = { talent: 'talent and capacity', case: 'the business case', control: 'control and service quality' }
const bc = { label: 'Request a Business Case', to: '/plan-your-gcc/business-case' }
const ss = { label: 'Book a Strategy Session', to: '/plan-your-gcc/strategy-session' }

export function readiness({ stage, size, focus }: Answers): Result {
  const settle = focusLabel[focus]
  // Existing centres override size: review what runs today, no business case first.
  if (stage === 'running') return { review: true, models: [], next: [ss], settle }
  const models = {
    small: ['Employer of Record', 'Build-Operate-Transfer'],
    mid: ['Build-Operate-Transfer', 'Managed GCC'],
    large: ['Company-owned', 'Build-Operate-Transfer with a handover'],
  }[size]
  const note = size === 'small' && focus === 'control' ? 'Employer of Record gives you less control. Look at Build-Operate-Transfer.' : undefined
  return { review: false, models, note, next: stage === 'exploring' ? [bc] : [bc, ss], settle }
}
