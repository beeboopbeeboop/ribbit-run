
export const WORLD = { width: 960, height: 540, groundY: 460 }
export type Vec = { x:number, y:number }

export function applyPhysics(
  pos:Vec,
  vel:Vec,
  onGround:boolean,
  cfg:{friction:number, jump:number},
  groundYAt?: (x:number)=>number
){
  const v = { ...vel }
  // gravity
  v.y += 0.7
  // friction
  v.x *= cfg.friction
  let nx = pos.x + v.x
  let ny = pos.y + v.y
  const ground = groundYAt ? groundYAt(nx) : WORLD.groundY
  let grounded = false
  if (ny >= ground - 32){
    ny = ground - 32
    v.y = 0
    grounded = true
  }
  return { pos:{x:nx,y:ny}, vel:v, onGround: grounded }
}

export function dist(ax:number, ay:number, bx:number, by:number){
  const dx = ax - bx, dy = ay - by
  return Math.hypot(dx, dy)
}
