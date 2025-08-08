
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '../useGameStore'
import { speakEs } from '../audio/tts'

export function QuizOverlay(){
  const { quiz, answer } = useGameStore()
  const [idx, setIdx] = useState(0)
  const spokeRef = useRef<string>('')

  useEffect(()=>{
    if(!quiz) return
    setIdx(0)
    const key = quiz.entry.es
    if(spokeRef.current !== key){
      spokeRef.current = key
      speakEs(quiz.entry.es)
    }
  }, [quiz])

  useEffect(()=>{
    if(!quiz) return
    const onKey = (e:KeyboardEvent)=>{
      if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        e.preventDefault()
        const delta = e.key === 'ArrowUp' ? -1 : 1
        setIdx(i => (i + delta + quiz.choices.length) % quiz.choices.length)
      }else if(e.key === 'Enter'){
        e.preventDefault(); answer(quiz.choices[idx])
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [quiz, idx, answer])

  if(!quiz) return null
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', display:'grid', placeItems:'center', padding:24 }}>
      <div style={{ background:'white', borderRadius:20, padding:24, width:560, boxShadow:'0 16px 40px rgba(0,0,0,.28)', border:'2px solid #0f172a10' }}>
        <div style={{ fontSize:20, opacity:.7, marginBottom:8 }}>Choose the translation</div>
        <div style={{ fontSize:32, fontWeight:900, marginBottom:16 }}>{quiz.entry.es} <span style={{ fontSize:16, fontWeight:600, opacity:.6 }}>{quiz.entry.phon}</span></div>
        <div style={{ display:'grid', gap:12 }}>
          {quiz.choices.map((c, i) => (
            <button
              key={c}
              onClick={()=>answer(c)}
              style={{ padding:'14px 16px', borderRadius:14, border:'2px solid '+(i===idx?'#0f172a':'#ddd'), fontSize:18, textAlign:'left', cursor:'pointer', background: i===idx?'#eef3ff':'white' }}
            >{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
