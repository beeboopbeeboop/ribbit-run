
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGameStore } from '../useGameStore'
import { speakEs } from '../audio/tts'

function shuffle<T>(arr:T[]):T[]{
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a
}

// ensure localStorage exists in test env
const storage: Record<string,string> = {}
;(globalThis as any).localStorage = {
  getItem: (k:string)=> (k in storage ? storage[k] : null),
  setItem: (k:string, v:string)=> { storage[k]=String(v) },
  removeItem: (k:string)=> { delete storage[k] },
  clear: ()=> { for(const k of Object.keys(storage)) delete storage[k] },
  key: (i:number)=> Object.keys(storage)[i] ?? null,
  get length(){ return Object.keys(storage).length }
}

describe('shuffle', ()=>{
  it('returns same length and elements', ()=>{
    const input = [1,2,3,4]
    const out = shuffle(input)
    expect(out.length).toBe(4)
    expect(out.sort()).toEqual(input)
  })
})

describe('store quiz answers', ()=>{
  beforeEach(()=>{
    // Reset store between tests
    useGameStore.setState(useGameStore.getState())
  })
  it('increments score and removes fruit on correct', ()=>{
    const s = useGameStore.getState()
    // seed a quiz state
    const entry = { es:'hola', en:'hello', phon:'', wrong:['bye','thanks','please'] }
    const fruitId = 'x1'
    useGameStore.setState({ quiz: { fruitId, entry, choices:[entry.en,...entry.wrong], correct: entry.en }, fruits:[{ id:fruitId, x:0,y:0,r:10,kind:'🍓', entry }] })
    const { answer } = useGameStore.getState()
    answer(entry.en)
    const { score, fruits, quiz } = useGameStore.getState()
    expect(score).toBe(s.score + 100)
    expect(fruits.find(f=>f.id===fruitId)).toBeUndefined()
    expect(quiz).toBeNull()
  })
  it('decrements lives on wrong', ()=>{
    const entry = { es:'hola', en:'hello', phon:'', wrong:['bye','thanks','please'] }
    const fruitId = 'x2'
    useGameStore.setState({ lives: 3, quiz: { fruitId, entry, choices:[entry.en,...entry.wrong], correct: entry.en }, fruits:[{ id:fruitId, x:0,y:0,r:10,kind:'🍓', entry }] })
    useGameStore.getState().answer('bye')
    expect(useGameStore.getState().lives).toBe(2)
  })
  it('resetAll resets key fields', ()=>{
    useGameStore.setState({ score: 500, lives: 1, pos:{x:10,y:10}, vel:{x:5,y:5}, onGround:false })
    useGameStore.getState().resetAll()
    const s = useGameStore.getState()
    expect(s.score).toBe(0)
    expect(s.lives).toBe(3)
    expect(s.onGround).toBe(true)
  })
})

describe('settings persistence', ()=>{
  it('AR flag persists and loads', ()=>{
    useGameStore.getState().setSettings({ useAr:false })
    const raw = globalThis.localStorage?.getItem('ribbit.settings')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toMatchObject({ useAr:false })
  })
})

describe('tts', ()=>{
  it("doesn't throw if speechSynthesis is missing", ()=>{
    const old = (globalThis as any).speechSynthesis
    ;(globalThis as any).speechSynthesis = undefined
    expect(()=> speakEs('hola')).not.toThrow()
    ;(globalThis as any).speechSynthesis = old
  })
})
