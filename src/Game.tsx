
import React, { useEffect } from 'react'
import { WORLD, applyPhysics } from './engine/physics'
import { useGameStore, CHAR_PRESETS, collideFruit } from './useGameStore'
import { HUD } from './ui/HUD'
import { QuizOverlay } from './ui/Quiz'
import { OrchardBg, CityBg } from './assets/backgrounds'
import { RibbieSvg, JinnieSvg, RinnieSvg, ChinnieSvg } from './assets/characters'

export default function Game(){
  const { frog, pos, vel, onGround, keys, setPos, setVel, setOnGround, quiz, flash, setKeys } = useGameStore()
  const cfg = CHAR_PRESETS[frog]

  // input listeners
  useEffect(()=>{
    const k = { ...keys }
    const down = (e:KeyboardEvent)=>{ k[e.key]=true; setKeys({ ...k }) }
    const up = (e:KeyboardEvent)=>{ k[e.key]=false; setKeys({ ...k }) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return ()=>{ window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  },[])

  // game loop
  useEffect(()=>{
    let raf = 0
    const loop = ()=>{
      if(!quiz){
        const v = { ...vel }
        // auto-scroll to the right for side-scroller feel
        v.x += 0.25 * cfg.speed
        if(keys['ArrowLeft']) v.x -= 0.6 * cfg.speed
        if(keys['ArrowRight']) v.x += 0.6 * cfg.speed
        if((keys[' '] || keys['Spacebar']) && onGround){ v.y = -cfg.jump; useGameStore.setState({ onGround:false }) }
        const next = applyPhysics(pos, v, onGround, { friction: cfg.friction, jump: cfg.jump })
        setPos(next.pos); setVel(next.vel); setOnGround(next.onGround)
        collideFruit()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return ()=> cancelAnimationFrame(raf)
  }, [cfg, pos, vel, onGround, keys, quiz])

  const wrap:React.CSSProperties = {
    width: WORLD.width,
    height: WORLD.height,
    borderRadius: 24,
    background: 'linear-gradient(180deg,#dff9ff,#bfe7ff)',
    boxShadow: '0 10px 30px rgba(0,0,0,.15)',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  }

  return (
    <div style={{ display:'grid', gap:12 }}>
      <HUD/>
      <Playfield/>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <ResetButton/>
        <small style={{ opacity:.7 }}>Controls: ← → move, space jump • Collect fruit to quiz • Correct = keep going</small>
      </div>
      <style>{`.btn{padding:10px 14px;border:1px solid #ccd;border-radius:12px;background:white}`}</style>
    </div>
  )
}

function Playfield(){
  const { pos, flash, quiz, world, frog } = useGameStore()
  return (
    <div style={{ width: WORLD.width, height: WORLD.height, borderRadius:24, background:'linear-gradient(180deg,#dff9ff,#bfe7ff)', boxShadow:'0 10px 30px rgba(0,0,0,.15)', position:'relative', overflow:'hidden', userSelect:'none' }}>
      {world === 0 ? <OrchardBg/> : <CityBg/>}
      <Fruits/>
      <div style={{ position:'absolute', left: pos.x, top: pos.y, width:32, height:32 }} title="You are a frog">
        {frog==='Ribbie' && <RibbieSvg/>}
        {frog==='Jinnie' && <JinnieSvg/>}
        {frog==='Rinnie' && <RinnieSvg/>}
        {frog==='Chinnie' && <ChinnieSvg/>}
      </div>
      {quiz && <QuizOverlay/>}
      {flash && (
        <div style={{ position:'absolute', top:18, left:0, right:0, display:'grid', placeItems:'center' }}>
          <div style={{ background:'#0f172a', color:'white', padding:'10px 16px', borderRadius:999, fontWeight:800, letterSpacing:.5, boxShadow:'0 8px 20px rgba(0,0,0,.35)' }}>{flash}</div>
        </div>
      )}
    </div>
  )
}

function Fruits(){
  const { fruits } = useGameStore()
  return <>{fruits.map(f => (
    <div key={f.id} style={{ position:'absolute', left: f.x - f.r, top: f.y - f.r, width: f.r*2, height: f.r*2, borderRadius: f.r, display:'grid', placeItems:'center', fontSize:22 }} title={f.entry.es}>
      {f.kind}
    </div>
  ))}</>
}

function ResetButton(){
  const resetAll = useGameStore(s => s.resetAll)
  return <button onClick={resetAll} className="btn">Reset</button>
}
