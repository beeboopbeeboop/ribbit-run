
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
type Enemy = { id:string, x:number, y:number, r:number, vx:number }
type Powerup = { id:string, x:number, y:number, r:number, kind:'BBTF'|'LLS' }

function choice<T>(arr:T[]):T{ return arr[Math.floor(Math.random()*arr.length)] }
function rand(min:number, max:number){ return Math.random()*(max-min)+min }
const ORCHARD_EMOJIS = ['🍓','🍌','🍍','🍊','🍇','🍉','🍒','🥝'] as const
const CITY_EMOJIS = ['🚕','🚌','🏥','🏦','🏫','🏬','🏠','🚏','🚉','🚦'] as const
const LEVEL_WIDTH = 10000
function makeFruitFromEntry(entry:Entry, worldIndex:number=0):Fruit{
  const pool = worldIndex === 0 ? ORCHARD_EMOJIS : CITY_EMOJIS
  return { id: Math.random().toString(36).slice(2), x: rand(40, LEVEL_WIDTH-40), y: rand(120, WORLD.groundY-80), r: 16, entry, kind: choice(pool as unknown as string[]) as any }
}
function makeEnemy():Enemy{ return { id: Math.random().toString(36).slice(2), x: rand(120, LEVEL_WIDTH-120), y: WORLD.groundY - 40, r: 16, vx: (Math.random()<0.5?-1:1) * (0.6 + Math.random()*0.8) } }
function makePowerup(kind:Powerup['kind']):Powerup{ return { id: Math.random().toString(36).slice(2), x: rand(120, LEVEL_WIDTH-120), y: WORLD.groundY - 90, r: 16, kind } }

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
  powerups: Powerup[]
  quiz: Quiz | null
  flash: string | null
  settings: Settings
  cameraX: number
  levelWidth: number
  boostUntil: number
  boostFadeUntil: number
  invulnUntil: number
  extraJumps: number
  popup: string | null
  spinUntil: number
  correctCount: number
  levelComplete: boolean
  dead: boolean
  flipped: boolean
  spriteRotation: number
  setFrog: (f:keyof typeof CHAR_PRESETS)=>void
  setWorld: (i:number)=>void
  setKeys: (k:Record<string,boolean>)=>void
  setPos: (p:{x:number,y:number})=>void
  setVel: (v:{x:number,y:number})=>void
  setOnGround: (g:boolean)=>void
  setFruits: (fn:(f:Fruit[])=>Fruit[])=>void
  setEnemies: (fn:(e:Enemy[])=>Enemy[])=>void
  setPowerups: (fn:(p:Powerup[])=>Powerup[])=>void
  setPopup: (s:string|null)=>void
  setExtraJumps: (n:number)=>void
  setBoostUntil: (t:number)=>void
  setBoostFadeUntil: (t:number)=>void
  setInvulnUntil: (t:number)=>void
  setSpinUntil: (t:number)=>void
  restartLevel: ()=>void
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
  enemies: [makeEnemy()],
  powerups: [makePowerup('BBTF'), makePowerup('LLS')],
  quiz: null,
  flash: null,
  settings: persistedSettings,
  cameraX: 0,
  levelWidth: LEVEL_WIDTH,
  boostUntil: 0,
  boostFadeUntil: 0,
  invulnUntil: 0,
  extraJumps: 0,
  popup: null,
  spinUntil: 0,
  correctCount: 0,
  levelComplete: false,
  dead: false,
  flipped: false,
  spriteRotation: 0,
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
  setPowerups: (fn)=> set({ powerups: fn(get().powerups) }),
  setPopup: (s)=> set({ popup:s }),
  setExtraJumps: (n)=> set({ extraJumps:n }),
  setBoostUntil: (t)=> set({ boostUntil:t }),
  setBoostFadeUntil: (t)=> set({ boostFadeUntil:t }),
  setInvulnUntil: (t)=> set({ invulnUntil:t }),
  setSpinUntil: (t)=> set({ spinUntil:t }),
  setSpriteRotation: (deg:number)=> set({ spriteRotation: deg }),
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
    const { quiz, setQuiz, setFruits, score, lives, setFlash, correctCount } = get()
    if(!quiz) return
    if(choiceText === quiz.correct){
      setFruits(fs => fs.filter(f=> f.id !== quiz.fruitId))
      const nextCorrect = correctCount + 1
      set({ score: score + 100, correctCount: nextCorrect })
      if(nextCorrect >= 20){ set({ levelComplete:true, popup:'Level Complete! 🎉' }) }
      setFlash(BOTCHES[Math.floor(Math.random()*BOTCHES.length)])
      setTimeout(()=> setFlash(null), 900)
      setQuiz(null)
    }else{
      // Wrong answers decrease a life and show feedback, but keep the quiz open
      set({ lives: Math.max(0, lives-1) })
      setFlash('BOTCH-O-RAMA! ❌')
      setTimeout(()=> setFlash(null), 1000)
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
    flash: null,
    popup: null,
    dead: false,
    flipped: false,
    spriteRotation: 0
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
  ,restartLevel: ()=>{
    set({ cameraX:0, correctCount:0, levelComplete:false, popup:null })
    get().resetAll()
  }
}))

export function collideFruit(){
  const { pos, fruits, quiz, setQuiz, popup } = useGameStore.getState()
  if(quiz || popup) return // already active, do not re-trigger
  const frogX = pos.x + 16, frogY = pos.y + 16
  const hit = fruits.find(f => dist(f.x, f.y, frogX, frogY) <= f.r + 20)
  if(!hit) return
  const answers = [hit.entry.en, ...hit.entry.wrong]
  for(let i=answers.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [answers[i],answers[j]]=[answers[j],answers[i]] }
  setQuiz({ fruitId: hit.id, entry: hit.entry, choices: answers, correct: hit.entry.en })
}
