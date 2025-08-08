import React from 'react'
import { WORLD } from '../engine/physics'

export function OrchardBg(){
  const w = WORLD.width, h = WORLD.height
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute', inset:0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff9ff"/>
          <stop offset="100%" stopColor="#bfe7ff"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#sky)" />
      {Array.from({ length: 7 }).map((_,i)=>{
        const x = 60 + i*130
        const y = h-140
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect x="-20" y="20" width="40" height="60" rx="6" fill="#8b5a2b" />
            <circle cx="0" cy="0" r="50" fill="#69c56d" />
            <circle cx="-25" cy="-10" r="14" fill="#d946ef" />
            <circle cx="15" cy="-18" r="14" fill="#ef4444" />
            <circle cx="10" cy="10" r="14" fill="#f97316" />
          </g>
        )
      })}
      <rect x="0" y={h-80} width={w} height="80" fill="#78c46c"/>
      <rect x="0" y={h-96} width={w} height="16" fill="#4f8d46"/>
    </svg>
  )
}

export function CityBg(){
  const w = WORLD.width, h = WORLD.height
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute', inset:0 }}>
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eae7ff"/>
          <stop offset="100%" stopColor="#cfdcff"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#sky2)" />
      {Array.from({ length: 8 }).map((_,i)=>{
        const x = i * (w/8)
        const bw = w/8 - 12
        const bh = 120 + (i%3)*40
        return (
          <g key={i} transform={`translate(${x+6} ${h-200})`}>
            <rect width={bw} height={bh} fill="#475569" />
            {Array.from({ length: 6 }).map((_,j)=> (
              <rect key={j} x={8+(j%3)*((bw-24)/3)} y={10+Math.floor(j/3)*30} width={(bw-36)/3} height="18" fill="#facc15" opacity=".5" />
            ))}
          </g>
        )
      })}
      <rect x="0" y={h-80} width={w} height="80" fill="#94a3b8"/>
      <rect x="0" y={h-96} width={w} height="16" fill="#475569"/>
    </svg>
  )
}


