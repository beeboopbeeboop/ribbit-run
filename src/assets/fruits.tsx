import React from 'react'

type Props = { r: number }

export function Strawberry({ r }:Props){
  return (
    <svg width={r*2} height={r*2} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 30 C8 26,4 20,6 14 C8 8,24 8,26 14 C28 20,24 26,16 30 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
      <circle cx="14" cy="18" r="1" fill="#facc15"/>
      <circle cx="18" cy="16" r="1" fill="#facc15"/>
      <circle cx="12" cy="22" r="1" fill="#facc15"/>
      <path d="M10 10 L16 6 L22 10" fill="#16a34a" stroke="#166534" strokeWidth="2" />
    </svg>
  )
}

export function Banana({ r }:Props){
  return (
    <svg width={r*2} height={r*2} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18 C10 26, 22 28, 26 18" fill="#facc15" stroke="#a16207" strokeWidth="2"/>
    </svg>
  )
}

export function Grape({ r }:Props){
  return (
    <svg width={r*2} height={r*2} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      {Array.from({length:7}).map((_,i)=>{
        const pos = [ [16,18],[12,20],[20,20],[10,24],[16,24],[22,24],[16,14] ][i]
        return <circle key={i} cx={pos[0]} cy={pos[1]} r="4" fill="#a855f7" stroke="#6b21a8" strokeWidth="2"/>
      })}
      <path d="M16 10 L18 6" stroke="#16a34a" strokeWidth="2" />
    </svg>
  )
}

export function Orange({ r }:Props){
  return (
    <svg width={r*2} height={r*2} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="20" r="8" fill="#f97316" stroke="#c2410c" strokeWidth="2"/>
      <path d="M14 10 C16 12, 18 12, 20 10" stroke="#16a34a" strokeWidth="2"/>
    </svg>
  )
}

export function renderFruit(kind:string, r:number){
  switch(kind){
    case '🍓': return <Strawberry r={r}/>
    case '🍌': return <Banana r={r}/>
    case '🍇': return <Grape r={r}/>
    case '🍊': return <Orange r={r}/>
    default: return <div style={{ fontSize: r*1.4, width:r*2, height:r*2, display:'grid', placeItems:'center' }}>{kind}</div>
  }
}


