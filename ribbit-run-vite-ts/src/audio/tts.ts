
export function speakEs(word:string){
  try{
    const u = new SpeechSynthesisUtterance(word)
    u.lang = 'es-AR'
    window.speechSynthesis.speak(u)
  }catch{ /* noop for now */ }
}
