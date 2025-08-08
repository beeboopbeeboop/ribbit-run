
export function speakEs(word:string){
  try{
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'es-AR'
    window.speechSynthesis.speak(u)
  }catch{ /* noop for now */ }
}

export function playSfx(name:'jump'|'power'|'hit'){
  try{
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(ctx.destination)
    o.type = 'triangle'
    const now = ctx.currentTime
    if(name==='jump'){ o.frequency.setValueAtTime(520, now); o.frequency.exponentialRampToValueAtTime(220, now+0.12); g.gain.setValueAtTime(0.15, now) }
    if(name==='power'){ o.frequency.setValueAtTime(660, now); o.frequency.exponentialRampToValueAtTime(1320, now+0.2); g.gain.setValueAtTime(0.12, now) }
    if(name==='hit'){ o.type='sawtooth'; o.frequency.setValueAtTime(180, now); g.gain.setValueAtTime(0.2, now) }
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.25)
    o.start(now); o.stop(now+0.26)
  }catch{}
}
