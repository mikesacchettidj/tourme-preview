
export function toCSV(rows: any[]): string {
  if(!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v:any)=> `"${String(v??'').replaceAll('"','""')}"`
  const lines = [headers.join(',')].concat(rows.map(r => headers.map(h=>escape(r[h])).join(',')))
  return lines.join('\n')
}
export function downloadCSV(filename:string, rows:any[]) {
  const blob = new Blob([toCSV(rows)], {type:'text/csv'})
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
}
export function parseCSV(text:string): any[] {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/)
  const headers = headerLine.split(',').map(h=>h.trim().replace(/^"|"$/g,''))
  return lines.map(line=>{
    const cols = line.split(',').map(c=>c.trim().replace(/^"|"$/g,''))
    const obj:any = {}; headers.forEach((h,i)=>obj[h]=cols[i]); return obj
  })
}
