
import React from 'react'
import { useGameStore } from '../useGameStore'

export function QuizOverlay(){
  const { quiz, answer } = useGameStore()
  if(!quiz) return null
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', display:'grid', placeItems:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:16, padding:20, width:520, boxShadow:'0 12px 28px rgba(0,0,0,.25)' }}>
        <div style={{ fontSize:18, opacity:.7, marginBottom:6 }}>Choose the translation</div>
        <div style={{ fontSize:28, fontWeight:800, marginBottom:14 }}>{quiz.entry.es} <span style={{ fontSize:16, fontWeight:500, opacity:.6 }}>{quiz.entry.phon}</span></div>
        <div style={{ display:'grid', gap:10 }}>
          {quiz.choices.map(c => (
            <button key={c} onClick={()=>answer(c)} style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #ddd', fontSize:18, textAlign:'left', cursor:'pointer' }}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
