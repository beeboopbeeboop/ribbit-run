
import { create } from 'zustand'
import { WORLD, dist } from './engine/physics'
import frutas from './data/sets/frutas_ar.json'
import ciudad from './data/sets/ciudad_ar.json'

export const WORD_SETS = [frutas, ciudad] as const

export const CHAR_PRESETS = {
  Ribbie: { speed: 4.2, friction: 0.86, jump: 13, ride: '🛹' },
  Jinnie: { speed: 4.8, friction: 0.84, jump: 12, ride: '🚗' },
  Rinnie: { speed: 3.9, friction: 0.88, jump: 14, ride: '🚲' },
  Chinnie:{ speed: 4.5, friction: 0.86, jump: 15, ride: '🦘' },
} as const

type Entry = { es:string, en:string, phon:string, wrong:string[] }
type Fruit = { id:string, x:number, y:number, r:number, kind:string, entry:Entry }

function choice<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)] }
function rand(min:number, max:number){ return Math.random()*(max-min)+min }
function makeFruitFromEntry(entry:Entry):Fruit{
  return { id: Math.random().toString(36).slice(2), x: rand(40, WORLD.width-40), y: rand(120, WORLD.groundY-80), r: 16, entry, kind: choice(['🍓','🍌','🍍','🍊','🍇','🍉','🍒','🥝']) }
}

type Quiz = { fruitId:string, entry:Entry, choices:string[], correct:string }

type Store = {
  frog: keyof typeof CHAR_PRESETS
  world: number
  theme: string
  pos: {x:number,y:number}
  vel: {x:number,y:number}
  onGround: boolean
  keys: Record<string,boolean>
  score: number
  lives: number
  fruits: Fruit[]
  quiz: Quiz | null
  flash: string | null
  setFrog: (f:keyof typeof CHAR_PRESETS)=>void
  setWorld: (i:number)=>void
  setKeys: (k:Record<string,boolean>)=>void
  setPos: (p:{x:number,y:number})=>void
  setVel: (v:{x:number,y:number})=>void
  setOnGround: (g:boolean)=>void
  setFruits: (fn:(f:Fruit[])=>Fruit[])=>void
  setQuiz: (q:Quiz|null)=>void
  setFlash: (s:string|null)=>void
  answer: (choice:string)=>void
  resetAll: ()=>void
}

const BOTCHES = ['BOTCH-TASTIC! ✅','BOTCH-A-LICIOUS! ✅','BOTCH-ALOOZA! ✅','BOTCH-BONANZA! ✅','BOTCH-BRAVÍSIMO! ✅']

export const useGameStore = create<Store>((set, get)=> ({
  frog: 'Ribbie',
  world: 0,
  theme: WORD_SETS[0].theme,
  pos: { x:120, y: WORLD.groundY - 32 },
  vel: { x:0, y:0 },
  onGround: true,
  keys: {},
  score: 0,
  lives: 3,
  fruits: WORD_SETS[0].entries.map(makeFruitFromEntry),
  quiz: null,
  flash: null,
  setFrog: (f)=> { set({ frog:f }); get().resetAll() },
  setWorld: (i)=> { set({ world:i, theme: WORD_SETS[i].theme }); get().resetAll() },
  setKeys: (k)=> set({ keys:k }),
  setPos: (p)=> set({ pos:p }),
  setVel: (v)=> set({ vel:v }),
  setOnGround: (g)=> set({ onGround:g }),
  setFruits: (fn)=> set({ fruits: fn(get().fruits) }),
  setQuiz: (q)=> set({ quiz:q }),
  setFlash: (s)=> set({ flash:s }),
  answer: (choiceText)=>{
    const { quiz, setQuiz, setFruits, score, lives, setFlash } = get()
    if(!quiz) return
    if(choiceText === quiz.correct){
      setFruits(fs => fs.filter(f=> f.id !== quiz.fruitId))
      set({ score: score + 100 })
      setFlash(BOTCHES[Math.floor(Math.random()*BOTCHES.length)])
      setTimeout(()=> setFlash(null), 900)
      setQuiz(null)
    }else{
      set({ lives: Math.max(0, lives-1) })
      setFlash('BOTCH-O-RAMA! ❌')
      setTimeout(()=> setFlash(null), 1000)
      setQuiz(null)
    }
  },
  resetAll: ()=> set((state)=> ({
    pos: { x:120, y: WORLD.groundY - 32 },
    vel: { x:0, y:0 },
    onGround: true,
    score: 0,
    lives: 3,
    fruits: WORD_SETS[state.world].entries.map(makeFruitFromEntry),
    quiz: null,
    flash: null
  }))
}))

export function collideFruit(){
  const { pos, fruits, setQuiz } = useGameStore.getState()
  const frogX = pos.x + 16, frogY = pos.y + 16
  const hit = fruits.find(f => dist(f.x, f.y, frogX, frogY) < f.r + 16)
  if(!hit) return
  const answers = [hit.entry.en, ...hit.entry.wrong]
  for(let i=answers.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [answers[i],answers[j]]=[answers[j],answers[i]] }
  setQuiz({ fruitId: hit.id, entry: hit.entry, choices: answers, correct: hit.entry.en })
}
