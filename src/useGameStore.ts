
import { create } from 'zustand'
import { WORLD, dist } from './engine/physics'
import frutas from './data/sets/frutas_ar.json'
import ciudad from './data/sets/ciudad_ar.json'

export const WORD_SETS = [frutas, ciudad] as const

export const CHAR_PRESETS = {
  Ribbie: { speed: 4.2, friction: 0.86, jump: 13, ride: '🛹' },      // skateboard
  Jinnie: { speed: 4.8, friction: 0.84, jump: 12, ride: '🚲' },      // bike
  Rinnie: { speed: 3.9, friction: 0.88, jump: 14, ride: '🚗' },      // red car
  Chinnie:{ speed: 4.5, friction: 0.86, jump: 15, ride: '🚚' },      // truck
} as const

type Entry = { es:string, en:string, phon:string, wrong:string[] }
type Fruit = { id:string, x:number, y:number, r:number, kind:string, entry:Entry }
type Enemy = { id:string, x:number, y:number, r:number }

function choice<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)] }
function rand(min:number, max:number){ return Math.random()*(max-min)+min }
const ORCHARD_EMOJIS = ['🍓','🍌','🍍','🍊','🍇','🍉','🍒','🥝'] as const
const CITY_EMOJIS = ['🚕','🚌','🏥','🏦','🏫','🏬','🏠','🚏','🚉','🚦'] as const
function makeFruitFromEntry(entry:Entry, worldIndex:number=0):Fruit{
  const pool = worldIndex === 0 ? ORCHARD_EMOJIS : CITY_EMOJIS
  return { id: Math.random().toString(36).slice(2), x: rand(40, WORLD.width-40), y: rand(120, WORLD.groundY-80), r: 16, entry, kind: choice(pool as unknown as string[]) as any }
}

type Quiz = { fruitId:string, entry:Entry, choices:string[], correct:string }

type Settings = {
  useAr: boolean
}

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
  enemies: Enemy[]
  quiz: Quiz | null
  flash: string | null
  settings: Settings
  setFrog: (f:keyof typeof CHAR_PRESETS)=>void
  setWorld: (i:number)=>void
  setKeys: (k:Record<string,boolean>)=>void
  setPos: (p:{x:number,y:number})=>void
  setVel: (v:{x:number,y:number})=>void
  setOnGround: (g:boolean)=>void
  setFruits: (fn:(f:Fruit[])=>Fruit[])=>void
  setEnemies: (fn:(e:Enemy[])=>Enemy[])=>void
  setQuiz: (q:Quiz|null)=>void
  setFlash: (s:string|null)=>void
  setSettings: (partial:Partial<Settings>)=>void
  answer: (choice:string)=>void
  resetAll: ()=>void
  resetProgress: ()=>void
}

const BOTCHES = ['BOTCH-TASTIC! ✅','BOTCH-A-LICIOUS! ✅','BOTCH-ALOOZA! ✅','BOTCH-BONANZA! ✅','BOTCH-BRAVÍSIMO! ✅']

function safeLoad<T>(key:string, fallback:T):T{
  try{
    const raw = typeof localStorage!=='undefined' ? localStorage.getItem(key) : null
    return raw ? JSON.parse(raw) as T : fallback
  }catch{ return fallback }
}

type PersistedProgress = { frog:keyof typeof CHAR_PRESETS, world:number, score:number }
type PersistedSettings = Settings

const persistedSettings = safeLoad<PersistedSettings>('ribbit.settings', { useAr: true })
const persistedProgress = safeLoad<PersistedProgress>('ribbit.progress', { frog:'Ribbie', world:0, score:0 })

export const useGameStore = create<Store>((set, get)=> ({
  frog: persistedProgress.frog,
  world: persistedProgress.world,
  theme: WORD_SETS[persistedProgress.world].theme,
  pos: { x:120, y: WORLD.groundY - 32 },
  vel: { x:0, y:0 },
  onGround: true,
  keys: {},
  score: persistedProgress.score,
  lives: 3,
  fruits: WORD_SETS[persistedProgress.world].entries.map(e => makeFruitFromEntry(e, persistedProgress.world)),
  enemies: [],
  quiz: null,
  flash: null,
  settings: persistedSettings,
  setFrog: (f)=> {
    set({ frog:f });
    get().resetAll();
    try{
      if(typeof localStorage!=='undefined'){
        const { world, score } = get()
        const payload:PersistedProgress = { frog:f, world, score }
        localStorage.setItem('ribbit.progress', JSON.stringify(payload))
      }
    }catch{}
  },
  setWorld: (i)=> {
    set({ world:i, theme: WORD_SETS[i].theme });
    get().resetAll();
    try{
      if(typeof localStorage!=='undefined'){
        const { frog, score } = get()
        const payload:PersistedProgress = { frog, world:i, score }
        localStorage.setItem('ribbit.progress', JSON.stringify(payload))
      }
    }catch{}
  },
  setKeys: (k)=> set({ keys:k }),
  setPos: (p)=> set({ pos:p }),
  setVel: (v)=> set({ vel:v }),
  setOnGround: (g)=> set({ onGround:g }),
  setFruits: (fn)=> set({ fruits: fn(get().fruits) }),
  setEnemies: (fn)=> set({ enemies: fn(get().enemies) }),
  setQuiz: (q)=> set({ quiz:q }),
  setFlash: (s)=> set({ flash:s }),
  setSettings: (partial)=>{
    const next = { ...get().settings, ...partial }
    const { world } = get()
    // Reload fruit pack for current world (keeps score/lives)
    set({ settings: next, fruits: WORD_SETS[world].entries.map(e => makeFruitFromEntry(e, world)), quiz: null, flash: null })
    try{ if(typeof localStorage!=='undefined') localStorage.setItem('ribbit.settings', JSON.stringify(next)) }catch{}
  },
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
    // Persist progress after answering
    try{
      if(typeof localStorage!=='undefined'){
        const { frog, world, score:nextScore } = get()
        const payload:PersistedProgress = { frog, world, score: nextScore }
        localStorage.setItem('ribbit.progress', JSON.stringify(payload))
      }
    }catch{}
  },
  resetAll: ()=> set((state)=> ({
    pos: { x:120, y: WORLD.groundY - 32 },
    vel: { x:0, y:0 },
    onGround: true,
    score: 0,
    lives: 3,
    fruits: WORD_SETS[state.world].entries.map(e => makeFruitFromEntry(e, state.world)),
    enemies: [],
    quiz: null,
    flash: null
  })),
  resetProgress: ()=>{
    set({ frog:'Ribbie', world:0, theme: WORD_SETS[0].theme })
    get().resetAll()
    try{
      if(typeof localStorage!=='undefined'){
        localStorage.removeItem('ribbit.progress')
      }
    }catch{}
  }
}))

export function collideFruit(){
  const { pos, fruits, setQuiz } = useGameStore.getState()
  const frogX = pos.x + 16, frogY = pos.y + 16
  const hit = fruits.find(f => dist(f.x, f.y, frogX, frogY) <= f.r + 20)
  if(!hit) return
  const answers = [hit.entry.en, ...hit.entry.wrong]
  for(let i=answers.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [answers[i],answers[j]]=[answers[j],answers[i]] }
  setQuiz({ fruitId: hit.id, entry: hit.entry, choices: answers, correct: hit.entry.en })
}
