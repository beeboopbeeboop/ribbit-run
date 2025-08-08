
import React, { useState } from 'react'
import { CHAR_PRESETS, useGameStore } from '../useGameStore'

export function HUD(){
  const { frog, setFrog, score, lives, theme, world, setWorld } = useGameStore()
  const [showSettings, setShowSettings] = useState(false)
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:900, fontSize:22 }}>Ribbit Run</div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <button aria-label="Settings" title="Settings" className="btn" onClick={()=>setShowSettings(true)} style={{ padding:'6px 10px' }}>⚙️</button>
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
      {showSettings && <SettingsModal onClose={()=>setShowSettings(false)} />}
    </div>
  )
}

function SettingsModal({ onClose }:{ onClose:()=>void }){
  const { settings, setSettings, resetProgress } = useGameStore()
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'grid', placeItems:'center', padding:24 }}>
      <div role="dialog" aria-modal="true" style={{ background:'white', borderRadius:16, padding:20, width:420, boxShadow:'0 12px 28px rgba(0,0,0,.25)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontWeight:800, fontSize:18 }}>Settings</div>
          <button className="btn" onClick={onClose}>Done</button>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:10 }}>
          <input type="checkbox" checked={settings.useAr} onChange={(e)=> setSettings({ useAr: e.target.checked })} />
          <span>Use Argentine variants (AR)</span>
        </label>
        <div style={{ height:1, background:'#eee', margin:'16px 0' }} />
        <button className="btn" onClick={resetProgress}>Reset progress</button>
      </div>
    </div>
  )
}
