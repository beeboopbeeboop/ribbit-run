import React from 'react'

type Props = { size?: number }

function wrap(svg:React.ReactNode, size:number){
  return (
    <div style={{ width:size, height:size }}>
      {svg}
    </div>
  )
}

export function RibbieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="8" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="3" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="21" cy="12" r="3" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="1" fill="#0f172a" />
      <circle cx="21" cy="12" r="1" fill="#0f172a" />
      <path d="M10 20 C14 24, 18 24, 22 20" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="6" y="26" width="20" height="3" rx="1.5" fill="#0f172a"/>
      <circle cx="9" cy="29" r="2" fill="#475569" />
      <circle cx="23" cy="29" r="2" fill="#475569" />
    </svg>, size)
}

export function JinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="10" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2" />
      <circle cx="11" cy="12" r="3" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2" />
      <circle cx="21" cy="12" r="3" fill="#6de1e8" stroke="#1c6b70" strokeWidth="2" />
      <circle cx="11" cy="12" r="1" fill="#0f172a" />
      <circle cx="21" cy="12" r="1" fill="#0f172a" />
      <path d="M10 21 C14 23, 18 23, 22 21" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* bike */}
      <circle cx="8" cy="28" r="3" stroke="#0f172a" fill="none" strokeWidth="1.5" />
      <circle cx="24" cy="28" r="3" stroke="#0f172a" fill="none" strokeWidth="1.5" />
      <path d="M8 28 L14 24 L18 28 L24 28" stroke="#0f172a" strokeWidth="1.5" fill="none" />
    </svg>, size)
}

export function RinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="7" width="24" height="18" rx="9" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="3" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="21" cy="12" r="3" fill="#9fe27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="1" fill="#0f172a" />
      <circle cx="21" cy="12" r="1" fill="#0f172a" />
      <path d="M11 20 C14 22, 18 22, 21 20" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* red car */}
      <rect x="6" y="24" width="20" height="6" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
      <circle cx="11" cy="31" r="3" fill="#0f172a" />
      <circle cx="21" cy="31" r="3" fill="#0f172a" />
    </svg>, size)
}

export function ChinnieSvg({ size = 32 }:Props){
  return wrap(
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="8" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="3" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="21" cy="12" r="3" fill="#79e27e" stroke="#2c7b2c" strokeWidth="2" />
      <circle cx="11" cy="12" r="1" fill="#0f172a" />
      <circle cx="21" cy="12" r="1" fill="#0f172a" />
      <path d="M10 21 C14 19, 18 19, 22 21" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* truck */}
      <rect x="5" y="23" width="22" height="7" rx="2" fill="#0ea5e9" stroke="#0369a1" strokeWidth="1.5" />
      <rect x="21" y="21" width="6" height="4" fill="#0284c7" />
      <circle cx="12" cy="31" r="3" fill="#0f172a" />
      <circle cx="22" cy="31" r="3" fill="#0f172a" />
    </svg>, size)
}


