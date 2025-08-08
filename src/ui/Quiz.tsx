
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
      <div style={{ background:'white', borderRadius:16, padding:20, width:520, boxShadow:'0 12px 28px rgba(0,0,0,.25)' }}>
        <div style={{ fontSize:18, opacity:.7, marginBottom:6 }}>Choose the translation</div>
        <div style={{ fontSize:28, fontWeight:800, marginBottom:14 }}>{quiz.entry.es} <span style={{ fontSize:16, fontWeight:500, opacity:.6 }}>{quiz.entry.phon}</span></div>
        <div style={{ display:'grid', gap:10 }}>
          {quiz.choices.map((c, i) => (
            <button
              key={c}
              onClick={()=>answer(c)}
              style={{ padding:'12px 14px', borderRadius:12, border:'2px solid '+(i===idx?'#0f172a':'#ddd'), fontSize:18, textAlign:'left', cursor:'pointer', background: i===idx?'#eef3ff':'white' }}
            >{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
