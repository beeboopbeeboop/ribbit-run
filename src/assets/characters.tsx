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
      <rect x="8" y="4" width="16" height="3" rx="1.5" fill="#1c6b70" />
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
      <circle cx="26" cy="10" r="2" fill="#f5d90a" />
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
      <path d="M6 24 L10 28 L14 24" stroke="#c2410c" strokeWidth="2" fill="#f97316" />
    </svg>, size)
}


