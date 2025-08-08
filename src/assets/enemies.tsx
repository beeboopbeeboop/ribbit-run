import React from 'react'

export function KrampusSvg({ size=28 }:{ size?:number }){
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="20" height="16" rx="6" fill="#3f3f46" stroke="#111827" strokeWidth="2" />
      <circle cx="12" cy="14" r="2" fill="#fde047" />
      <circle cx="20" cy="14" r="2" fill="#fde047" />
      <path d="M12 20 C16 23, 18 23, 20 20" stroke="#e11d48" strokeWidth="2" fill="none" />
      <path d="M8 8 L10 4 L12 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
      <path d="M20 8 L22 4 L24 8" stroke="#7c3aed" strokeWidth="2" fill="none" />
      <rect x="9" y="23" width="14" height="3" rx="1.5" fill="#111827" />
    </svg>
  )
}


