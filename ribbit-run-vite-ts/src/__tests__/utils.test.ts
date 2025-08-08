
import { describe, it, expect } from 'vitest'

function shuffle<T>(arr:T[]):T[]{
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a
}

describe('shuffle', ()=>{
  it('returns same length and elements', ()=>{
    const input = [1,2,3,4]
    const out = shuffle(input)
    expect(out.length).toBe(4)
    expect(out.sort()).toEqual(input)
  })
})
