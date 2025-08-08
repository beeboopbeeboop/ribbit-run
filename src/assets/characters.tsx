import React from 'react'

type Props = { size?: number }

function wrap(svg:React.ReactNode, size:number){
  return <div style={{ width:size, height:size }}>{svg}</div>
}

export function RibbieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="22" rx="18" ry="12" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="5" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="32" cy="14" r="5" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="2" fill="#0f172a" />
      <circle cx="32" cy="14" r="2" fill="#0f172a" />
      <path d="M16 28 C22 34, 26 34, 32 28" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      <rect x="10" y="36" width="28" height="4" rx="2" fill="#0f172a"/>
      <circle cx="16" cy="41" r="3" fill="#475569" />
      <circle cx="32" cy="41" r="3" fill="#475569" />
    </svg>, size)
}

export function JinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="22" rx="18" ry="12" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="5" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2.5" />
      <circle cx="32" cy="14" r="5" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="2" fill="#0f172a" />
      <circle cx="32" cy="14" r="2" fill="#0f172a" />
      <path d="M16 30 C22 32, 26 32, 32 30" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* bike */}
      <circle cx="14" cy="38" r="4" stroke="#0f172a" fill="none" strokeWidth="2" />
      <circle cx="32" cy="38" r="4" stroke="#0f172a" fill="none" strokeWidth="2" />
      <path d="M14 38 L20 32 L26 38 L32 38" stroke="#0f172a" strokeWidth="2" fill="none" />
    </svg>, size)
}

export function RinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="22" rx="18" ry="12" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="5" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="32" cy="14" r="5" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="2" fill="#0f172a" />
      <circle cx="32" cy="14" r="2" fill="#0f172a" />
      <path d="M16 28 C22 30, 26 30, 32 28" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* red car */}
      <rect x="10" y="34" width="28" height="8" rx="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
      <circle cx="18" cy="44" r="4" fill="#0f172a" />
      <circle cx="34" cy="44" r="4" fill="#0f172a" />
    </svg>, size)
}

export function ChinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="22" rx="18" ry="12" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="5" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="32" cy="14" r="5" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2.5" />
      <circle cx="16" cy="14" r="2" fill="#0f172a" />
      <circle cx="32" cy="14" r="2" fill="#0f172a" />
      <path d="M10 21 C14 19, 18 19, 22 21" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* truck */}
      <rect x="10" y="34" width="28" height="8" rx="3" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2" />
      <rect x="26" y="30" width="10" height="6" fill="#0284c7" />
      <circle cx="18" cy="44" r="4" fill="#0f172a" />
      <circle cx="34" cy="44" r="4" fill="#0f172a" />
    </svg>, size)
}


