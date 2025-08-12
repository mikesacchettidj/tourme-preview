
'use client'
import React,{useMemo,useRef,useState} from 'react'
import { Ticket } from 'lucide-react'
import {parseCSV} from '../_modules_lib/csv'
import {fakeQR} from '../_modules_lib/qr'
type Guest = { name:string; city?:string; status:'pending'|'confirmed'; code:string }
export default function GuestlistPage(){
  const [guests,setGuests]=useState<Guest[]>([
    {name:'Alice', city:'Berlin', status:'confirmed', code:'GL-0001'},
    {name:'Marco', city:'Paris', status:'pending', code:'GL-0002'}
  ])
  const fileRef = useRef<HTMLInputElement>(null)
  const counts = useMemo(()=>{
    const byCity:Record<string,number> = {}
    guests.forEach(g=> byCity[g.city||'—'] = (byCity[g.city||'—']||0) + 1)
    return byCity
  },[guests])

  const onDrop=(file:File)=> file.text().then(t=>{
    const rows = parseCSV(t)
    const mapped = rows.map((r:any)=>({name:r.name||r.Name||'Guest', city:r.city||r.City||'', status:'pending', code:'GL-'+Math.random().toString().slice(2,6)}))
    setGuests(g=>[...g, ...mapped])
  })

  const genQR=(g:Guest)=>{
    const c = fakeQR(g.code)
    const a = document.createElement('a'); a.download = g.code+'.png'; a.href = c.toDataURL('image/png'); a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Ticket className="h-4 w-4"/><h1 className="text-lg font-semibold">Guestlist</h1></div>
        <div className="flex items-center gap-2">
          <input type="file" accept=".csv" ref={fileRef} onChange={e=> e.target.files && onDrop(e.target.files[0])}/>
          <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f) onDrop(f)}} className="rounded border px-2 py-1 text-sm">Drag & drop CSV</div>
        </div>
      </div>

      <table className="w-full">
        <thead><tr><th className="text-left">Name</th><th className="text-left">City</th><th className="text-left">Status</th><th className="text-left">QR</th></tr></thead>
        <tbody>
          {guests.map((g,i)=>(
            <tr key={i}>
              <td>{g.name}</td>
              <td>{g.city}</td>
              <td>
                <select value={g.status} onChange={e=> setGuests(prev=> prev.map((x,j)=> j===i? {...x,status:e.target.value as any}:x))} className="rounded border px-2 py-1">
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                </select>
              </td>
              <td><button onClick={()=>genQR(g)} className="rounded border px-2 py-1">Generate QR</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.keys(counts).map(k=>(<div key={k} className="rounded-2xl border p-3"><div className="text-sm text-zinc-500">{k}</div><div className="text-xl font-semibold">{counts[k]} guests</div></div>))}
      </div>
    </div>
  )
}
