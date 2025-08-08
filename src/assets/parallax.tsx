import React from 'react'
import { WORLD } from '../engine/physics'

export function SkyParallax({ cameraX }:{ cameraX:number }){
  const w = 8000, h = WORLD.height
  const offset = - (cameraX * 0.2) % w
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <svg width={w} height={h} style={{ position:'absolute', left:offset, top:0 }} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
        <linearGradient id="skygrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf7ff"/>
          <stop offset="100%" stopColor="#cfe9ff"/>
        </linearGradient>
        <rect width={w} height={h} fill="url(#skygrad)"/>
        {/* Peppa Pig style clouds */}
        {Array.from({ length: 24 }).map((_,i)=>{
          const cx = i*320+100
          const cy = 60 + (i%5)*12
          return (
            <g key={i} transform={`translate(${cx} ${cy})`} opacity=".9">
              <ellipse cx="0" cy="0" rx="36" ry="18" fill="#ffffff"/>
              <ellipse cx="-22" cy="4" rx="18" ry="10" fill="#ffffff"/>
              <ellipse cx="22" cy="6" rx="20" ry="11" fill="#ffffff"/>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function MidParallax({ cameraX }:{ cameraX:number }){
  const w = 8000, h = WORLD.height
  const offset = - (cameraX * 0.4) % w
  return (
    <svg width={w} height={h} style={{ position:'absolute', left:offset, top:0 }} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: Math.ceil(w/220)+2 }).map((_,i)=>{
        const x = i*220+40
        return (
          <g key={i} transform={`translate(${x} ${h-180})`}>
            <rect x="-16" y="40" width="32" height="70" rx="6" fill="#14532d"/>
            <circle cx={0} cy={0} r={40} fill="#166534"/>
          </g>
        )
      })}
    </svg>
  )
}

export function FarSkyline({ cameraX }:{ cameraX:number }){
  const w = 16000, h = WORLD.height
  const offset = - (cameraX * 0.1) % w
  return (
    <svg width={w} height={h} style={{ position:'absolute', left:offset, top:0 }} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <g opacity=".35">
        {Array.from({ length: Math.ceil(w/320)+3 }).map((_,i)=>{
          const x = i*320
          const bh = 140 + (i%4)*30
          return (
            <g key={i} transform={`translate(${x} ${h-260})`}>
              <rect width="300" height={bh} fill="#334155" />
              {Array.from({ length: 12 }).map((_,j)=> (
                <rect key={j} x={8+(j%6)*46} y={10+Math.floor(j/6)*30} width={38} height="18" fill="#facc15" opacity=".2" />
              ))}
            </g>
          )
        })}
      </g>
    </svg>
  )
}


