// Run: node scripts/readiness.check.ts  (the six sample buyers from the wireframe)
import assert from 'node:assert/strict'
import { readiness } from '../src/readiness.ts'

const r = (stage: any, size: any, focus: any) => readiness({ stage, size, focus })
let x = r('exploring', 'small', 'talent')
assert.deepEqual(x.models, ['Employer of Record', 'Build-Operate-Transfer']); assert.equal(x.next.length, 1); assert.equal(x.settle, 'talent and capacity')
x = r('planning', 'mid', 'case')
assert.deepEqual(x.models, ['Build-Operate-Transfer', 'Managed GCC']); assert.equal(x.next.length, 2)
x = r('planning', 'large', 'control')
assert.equal(x.models[0], 'Company-owned'); assert.equal(x.next.length, 2)
x = r('running', 'small', 'case')
assert.ok(x.review); assert.deepEqual(x.next.map((n) => n.to), ['/plan-your-gcc/strategy-session'])
x = r('running', 'large', 'control')
assert.ok(x.review); assert.equal(x.next.length, 1)
x = r('exploring', 'small', 'control')
assert.match(x.note ?? '', /less control/)
console.log('readiness: 6 sample buyers ok')
