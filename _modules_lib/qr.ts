
export function fakeQR(data:string, size=160): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width=c.height=size
  const ctx = c.getContext('2d')!
  ctx.fillStyle='#0f1115'; ctx.fillRect(0,0,size,size)
  ctx.fillStyle='#e6eaf2'
  const n = 25, cell = Math.floor(size/n)
  let seed = Array.from(data).reduce((a, ch)=> (a*31 + ch.charCodeAt(0)) >>> 0, 7)
  for(let y=0;y<n;y++){
    for(let x=0;x<n;x++){
      seed = (seed*1664525 + 1013904223)>>>0
      if((seed>>24)&1){ ctx.fillRect(x*cell+1, y*cell+1, cell-2, cell-2) }
    }
  }
  const drawFinder=(x:number,y:number)=>{ ctx.strokeStyle='#e6eaf2'; ctx.lineWidth=3; ctx.strokeRect(x,y,cell*6,cell*6) }
  drawFinder(2,2); drawFinder(size-cell*8,2); drawFinder(2,size-cell*8)
  return c
}
