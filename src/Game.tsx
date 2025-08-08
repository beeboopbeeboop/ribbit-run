
import React, { useEffect, useRef } from 'react'
import { WORLD, applyPhysics } from './engine/physics'
import { playSfx } from './audio/tts'
import { useGameStore, CHAR_PRESETS, collideFruit } from './useGameStore'
import { HUD } from './ui/HUD'
import { QuizOverlay } from './ui/Quiz'
import { OrchardBg, CityBg } from './assets/backgrounds'
import { SkyParallax, MidParallax, FarSkyline } from './assets/parallax'
import { RibbieSvg, JinnieSvg, RinnieSvg, ChinnieSvg } from './assets/characters'
import { KrampusSvg } from './assets/enemies'
import { renderFruit } from './assets/fruits'

export default function Game(){
  const state = useGameStore()
  const { frog, pos, vel, onGround, keys, quiz, flash, world, cameraX, powerups, enemies, boostUntil, extraJumps, levelComplete } = state as any
  const { setPos, setVel, setOnGround, setKeys, setExtraJumps, setBoostUntil, setSpriteRotation } = state as any
  const cfg = CHAR_PRESETS[frog as keyof typeof CHAR_PRESETS]
  const prevSpace = useRef(false)
  const enemySpawnAt = useRef(performance.now()+1500)
  const powerSpawnAt = useRef(performance.now()+5000)

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
    const groundYAt = (x:number)=>{
      // simple rolling sine-based ground; different per world
      const base = WORLD.groundY
      const amp = world===0 ? 14 : 10
      const freq = world===0 ? 0.008 : 0.012
      return base - Math.sin((x+200)*freq) * amp
    }
    const loop = ()=>{
      // Pause gameplay whenever quiz or popup is showing
      if(!quiz && !useGameStore.getState().popup){
        const v = { ...vel }
        // timing + boost state first
        const now = performance.now()
        const boosted = now < boostUntil
        // prevent backing out before gameplay area start
        const moveUnit = 0.6 * cfg.speed * (boosted ? 1.35 : 1)
        if(keys['ArrowLeft'] && pos.x > 0) v.x -= moveUnit
        if(keys['ArrowRight']) v.x += moveUnit
        // hold to jump higher: apply stronger impulse at takeoff
        const jumpPower = (boosted ? 1.18 : 1) * 1.1
        const space = !!(keys[' '] || keys['Spacebar'])
        const justPressed = space && !prevSpace.current
        if(justPressed && onGround && !useGameStore.getState().popup && !useGameStore.getState().quiz){
          v.y = -cfg.jump * jumpPower; useGameStore.setState({ onGround:false });
          const startingJumps = (frog==='Ribbie' && boosted) ? 3 : 2
          setExtraJumps(startingJumps);
          playSfx('jump')
        }
        // airborne extra jumps only on fresh tap
        if(justPressed && !onGround && extraJumps>0 && !useGameStore.getState().popup && !useGameStore.getState().quiz){
          // only on fresh press: we approximate by checking upward velocity not very negative
          v.y = -cfg.jump * (boosted?1.12:1)
          const remaining = extraJumps - 1
          setExtraJumps(remaining)
          if(remaining===0){
            useGameStore.setState({ spinUntil: performance.now()+500 })
            // Ribbie special: kickflip on final (triple) jump while boosted
            if(frog==='Ribbie' && boosted){
              const el = document.getElementById('frog-sprite')
              if(el){
                el.style.animation = 'kickflip .6s ease both'
                // keep rotation at 360deg after animation for smoothness
                setTimeout(()=>{ if(el){ el.style.animation = ''; setSpriteRotation(360) } }, 650)
              }
            }
          }
        }
        // variable jump height: if space held, soften gravity a bit while rising
        if(space && v.y < 0){ v.y *= 0.98 }
        const usedFriction = boosted ? Math.min(0.97, cfg.friction + 0.1) : cfg.friction
        const next = applyPhysics(pos, v, onGround, { friction: usedFriction, jump: cfg.jump }, groundYAt)
        setPos(next.pos); setVel(next.vel); setOnGround(next.onGround)
        // camera follow: smooth lerp towards target
        const target = Math.max(0, next.pos.x - WORLD.width*0.5)
        const cam = cameraX + (target - cameraX) * 0.08
        useGameStore.setState({ cameraX: cam })
        collideFruit()
        // enemy movement + collisions
        useGameStore.setState({ enemies: useGameStore.getState().enemies.map((e)=> {
          let nx = e.x + e.vx
          let nvx = e.vx
          if(nx < 20){ nx = 20; nvx = Math.abs(nvx) }
          if(nx > useGameStore.getState().levelWidth - 20){ nx = useGameStore.getState().levelWidth - 20; nvx = -Math.abs(nvx) }
          return { ...e, x: nx, vx: nvx }
        }) })
        // cleanup enemies and powerups far behind camera
        useGameStore.setState({ enemies: useGameStore.getState().enemies.filter(e => e.x > cameraX - 200) })
        useGameStore.setState({ powerups: useGameStore.getState().powerups.filter(p => p.x > cameraX - 200) })
        useGameStore.getState().enemies.forEach(e=>{
          const d = Math.hypot(e.x-next.pos.x, e.y-next.pos.y)
          const now2 = performance.now()
          if(d < 28 && now2 > (useGameStore.getState().invulnUntil ?? 0)){
            const { lives } = useGameStore.getState()
            if(lives <= 1){
              useGameStore.setState({ popup:'The Krampus got you! Game Over.', lives:0 })
              const frogEl = document.getElementById('frog-sprite')
              if(frogEl){ setSpriteRotation(180) }
              playSfx('hit')
            }else{
              useGameStore.setState({ lives: lives-1, invulnUntil: now2+1500, popup:'Ouch! The Krampus hit you.' })
              playSfx('hit')
            }
            setVel({ ...next.vel, x: next.vel.x + (next.pos.x<e.x?-6:6), y: -8 })
            // cancel active powerup on hit
            setBoostUntil(0)
          }
        })
        // powerup pickups with glow effect
        powerups.forEach((p:any)=>{
          const dx = (p.x - next.pos.x), dy = (p.y - next.pos.y)
          if(Math.hypot(dx,dy) < 24){
            useGameStore.setState({ powerups: powerups.filter((q:any)=>q.id!==p.id) })
            const msg = p.kind==='BBTF' ? 'A wild BBTF appears out of the blue!' : 'A super casual LL appears randomly.'
            useGameStore.setState({ popup: msg })
            setBoostUntil(performance.now()+10000)
            // aura handled by boost-aura element while boost is active
            playSfx('power')
          }
        })
        // spawn pacing
        if(now > enemySpawnAt.current && useGameStore.getState().enemies.length < 8){
          const ex = cameraX + WORLD.width + 120
          const speed = 0.6 + Math.random()*1.2 + (useGameStore.getState().score/1000)
          useGameStore.setState({ enemies: [...useGameStore.getState().enemies, { id: Math.random().toString(36).slice(2), x: ex, y: WORLD.groundY-40, r:16, vx: (-1)*speed }] })
          enemySpawnAt.current = now + (1500 + Math.random()*1500) * Math.max(0.6, 1 - useGameStore.getState().score/3000)
        }
        if(now > powerSpawnAt.current && useGameStore.getState().powerups.length < 3){
          const px = cameraX + WORLD.width + 80
          const kind = Math.random()<0.5?'BBTF':'LLS'
          useGameStore.setState({ powerups: [...useGameStore.getState().powerups, { id: Math.random().toString(36).slice(2), x: px, y: WORLD.groundY-90, r:16, kind }] })
          powerSpawnAt.current = now + 8000 + Math.random()*5000
        }
        prevSpace.current = space
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
      <MobileControls/>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <ResetButton/>
        <small style={{ opacity:.7 }}>Controls: ← → move, space jump • Collect fruit to quiz • Correct = keep going</small>
      </div>
      <style>{`.btn{padding:10px 14px;border:1px solid #ccd;border-radius:12px;background:white}`}</style>
    </div>
  )
}

function Playfield(){
  const { pos, flash, quiz, world, frog, cameraX, fruits, powerups, enemies, boostUntil, spriteRotation } = useGameStore() as any
  return (
    <div style={{ width: WORLD.width, height: WORLD.height, borderRadius:24, background:'linear-gradient(180deg,#dff9ff,#bfe7ff)', boxShadow:'0 10px 30px rgba(0,0,0,.15)', position:'relative', overflow:'hidden', userSelect:'none' }}>
      <SkyParallax cameraX={cameraX}/>
      <FarSkyline cameraX={cameraX}/>
      <MidParallax cameraX={cameraX}/>
      <div style={{ position:'absolute', left:-cameraX, top:0, width: 12000, height: WORLD.height }}>
        {world === 0 ? <OrchardBg width={12000}/> : <CityBg width={12000}/>}
        <Fruits/>
        {/* Powerups */}
        {powerups.map((p:any) => (
          <div key={p.id} style={{ position:'absolute', left:p.x-12, top:p.y-12, width:24, height:24, display:'grid', placeItems:'center', borderRadius:12, background:'#fff7ed', border:'2px solid #fb923c', boxShadow:'0 6px 16px rgba(0,0,0,.15)', animation:'pulseGlow 1s ease-in-out infinite alternate' }} title={p.kind}>
            {p.kind==='BBTF' ? '👴' : '👱'}
          </div>
        ))}
        {/* Enemies */}
        {enemies.map((e:any) => (
          <div key={e.id} style={{ position:'absolute', left:e.x-16, top:e.y-16 }}>
            <KrampusSvg size={32}/>
          </div>
        ))}
      </div>
      <div id="frog-sprite" style={{ position:'absolute', left: pos.x - cameraX, top: pos.y, width:48, height:48, transform: 'rotate('+spriteRotation+'deg)' }} title="You are a frog">
        {(performance.now() < boostUntil) && <div className="boost-aura" />}
        {frog==='Ribbie' && <RibbieSvg size={48}/>} 
        {frog==='Jinnie' && <JinnieSvg size={48}/>} 
        {frog==='Rinnie' && <RinnieSvg size={48}/>} 
        {frog==='Chinnie' && <ChinnieSvg size={48}/>}
      </div>
      {quiz && <QuizOverlay/>}
      {useGameStore.getState().popup && (
        <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', background:'rgba(0,0,0,.35)' }}>
          <div style={{ background:'white', padding:'16px 18px', borderRadius:16, boxShadow:'0 12px 28px rgba(0,0,0,.25)', maxWidth:520, textAlign:'center' }}>
            <div style={{ fontWeight:900, marginBottom:8 }}>{useGameStore.getState().popup}</div>
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              {useGameStore.getState().levelComplete || useGameStore.getState().lives===0 ? (
                <button className='btn' onClick={()=>useGameStore.getState().restartLevel()}>Restart</button>
              ) : (
                <button className='btn' onClick={()=>useGameStore.setState({ popup:null })}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}
      {flash && (
        <div style={{ position:'absolute', top:18, left:0, right:0, display:'grid', placeItems:'center' }}>
          <div style={{ background:'#0f172a', color:'white', padding:'14px 22px', borderRadius:999, fontWeight:900, letterSpacing:.6, boxShadow:'0 10px 26px rgba(0,0,0,.35)', fontSize:20 }}>{flash}</div>
        </div>
      )}
    </div>
  )
}

function Fruits(){
  const { fruits, cameraX } = useGameStore()
  return <>{fruits.map(f => (
    <div key={f.id} style={{ position:'absolute', left: f.x - f.r, top: f.y - f.r, width: f.r*2, height: f.r*2 }} title={f.entry.es}>
      {renderFruit(f.kind, f.r)}
    </div>
  ))}</>
}

function ResetButton(){
  const resetAll = useGameStore(s => s.resetAll)
  return <button onClick={resetAll} className="btn">Reset</button>
}

function MobileControls(){
  // simple overlay controls for mobile
  const { keys, setKeys, onGround } = useGameStore()
  const press = (k:string)=>{ const next={...keys,[k]:true}; setKeys(next) }
  const release = (k:string)=>{ const next={...keys,[k]:false}; setKeys(next) }
  // detect double/triple tap for jump
  let lastTap = 0
  let tapCount = 0
  const onJumpTouchStart = ()=>{
    const now = performance.now()
    if(now - lastTap < 400){ tapCount += 1 } else { tapCount = 1 }
    lastTap = now
    press(' ')
  }
  const onJumpTouchEnd = ()=>{
    release(' ')
  }
  const btnStyle:React.CSSProperties = { background:'rgba(255,255,255,.75)', border:'1px solid #cfe', borderRadius:16, padding:'10px 14px', boxShadow:'0 8px 18px rgba(0,0,0,.15)', fontWeight:900 }
  return (
    <div style={{ display:'flex', justifyContent:'space-between', gap:10, marginTop:6 }}>
      <div style={{ display:'flex', gap:8 }}>
        <button style={btnStyle} onTouchStart={()=>press('ArrowLeft')} onTouchEnd={()=>release('ArrowLeft')}>
          ←
        </button>
        <button style={btnStyle} onTouchStart={()=>press('ArrowRight')} onTouchEnd={()=>release('ArrowRight')}>
          →
        </button>
      </div>
      <button style={btnStyle} onTouchStart={onJumpTouchStart} onTouchEnd={onJumpTouchEnd}>Jump</button>
    </div>
  )
}
