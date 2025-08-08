
export const WORLD = { width: 960, height: 540, groundY: 460 }
export type Vec = { x:number, y:number }

export function applyPhysics(pos:Vec, vel:Vec, onGround:boolean, cfg:{friction:number, jump:number}){
  const v = { ...vel }
  // gravity
  v.y += 0.7
  // friction
  v.x *= cfg.friction
  let nx = Math.max(0, Math.min(WORLD.width - 32, (pos.x + v.x)))
  let ny = pos.y + v.y
  let grounded = false
  if (ny >= WORLD.groundY - 32){
    ny = WORLD.groundY - 32
    v.y = 0
    grounded = true
  }
  return { pos:{x:nx,y:ny}, vel:v, onGround: grounded }
}

export function dist(ax:number, ay:number, bx:number, by:number){
  const dx = ax - bx, dy = ay - by
  return Math.hypot(dx, dy)
}
