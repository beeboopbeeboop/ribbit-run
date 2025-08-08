
import React from 'react'
import { CHAR_PRESETS, useGameStore } from '../useGameStore'

export function HUD(){
  const { frog, setFrog, score, lives, theme, world, setWorld } = useGameStore()
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:900, fontSize:22 }}>Ribbit Run: Español</div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <div>Score: <b>{score}</b></div>
          <div>Lives: {'❤️'.repeat(lives) || '💀'}</div>
        </div>
      </div>
      <div className="tabs">
        {Object.keys(CHAR_PRESETS).map(name => (
          <button key={name} className={`tab ${frog===name?'is-on':''}`} onClick={()=>setFrog(name as any)} title={`Ride: ${CHAR_PRESETS[name as keyof typeof CHAR_PRESETS].ride}`}>
            {name}
          </button>
        ))}
        <div style={{ marginLeft:12, opacity:.75, display:'flex', alignItems:'center', gap:8 }}>
          <span>World:</span>
          <button className={`tab ${world===0?'is-on':''}`} onClick={()=>setWorld(0)}>Orchard</button>
          <button className={`tab ${world===1?'is-on':''}`} onClick={()=>setWorld(1)}>City</button>
        </div>
        <div style={{ marginLeft:'auto', opacity:.7, fontWeight:600 }}>{theme}</div>
      </div>
    </div>
  )
}
