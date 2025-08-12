
'use client'
import React,{useMemo,useState} from 'react'
import { Plane } from 'lucide-react'
type Leg = { type:'Flight'|'Train'|'Hotel'; code:string; from?:string; to?:string; date:string; depart?:string; arrive?:string; name?:string }
export default function TravelPage(){
  const [legs,setLegs]=useState<Leg[]>([
    {type:'Flight', code:'LH123', from:'BER', to:'AMS', date:'2025-10-03', depart:'10:40', arrive:'12:00'},
    {type:'Train', code:'ICE 708', from:'AMS', to:'PAR', date:'2025-11-20', depart:'08:20', arrive:'12:10'},
    {type:'Hotel', code:'H-PAR', name:'Hotel Amour', date:'2025-11-20'}
  ])
  const [paste,setPaste]=useState('')

  const parse=()=>{
    const code = (paste.match(/([A-Z]{2}\d{3,4})/)||[])[1] || 'XX000'
    const times = paste.match(/(\d{1,2}:\d{2})/g) || []
    const iatas = paste.match(/\b[A-Z]{3}\b/g) || []
    const date = (paste.match(/(20\d{2}-\d{2}-\d{2})/)||[])[1] || new Date().toISOString().slice(0,10)
    setLegs(prev=>[{type:'Flight', code, from:iatas[0], to:iatas[1], date, depart:times[0], arrive:times[1]}, ...prev])
    setPaste('')
  }

  const warnings = useMemo(()=>{
    const out:string[] = []
    for(let i=0;i<legs.length-1;i++){
      const a=legs[i], b=legs[i+1]
      if(a.date===b.date && a.arrive && b.depart){
        const [ah,am]=a.arrive.split(':').map(Number); const [bh,bm]=b.depart.split(':').map(Number)
        const mins = (bh*60+bm)-(ah*60+am)
        if(mins<60) out.push(`Tight connection on ${a.date} between ${a.code} and ${b.code}`)
      }
    }
    return out
  },[legs])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Plane className="h-4 w-4"/><h1 className="text-lg font-semibold">Travel</h1></div>
        <div className="flex items-center gap-2">
          <textarea placeholder="Paste confirmation text..." value={paste} onChange={e=>setPaste(e.target.value)} rows={2} className="w-[420px] rounded border px-2 py-1"/>
          <button onClick={parse} className="rounded border px-3 py-1">Parse</button>
        </div>
      </div>

      {warnings.length>0 && (
        <div className="space-y-2">
          {warnings.map((w,i)=>(<div key={i} className="rounded border border-yellow-400/40 bg-yellow-50 px-3 py-2 text-sm dark:border-yellow-900 dark:bg-yellow-950/30">{w}</div>))}
        </div>
      )}

      <table className="w-full">
        <thead><tr><th className="text-left">Type</th><th className="text-left">Code</th><th className="text-left">From</th><th className="text-left">To</th><th className="text-left">Date</th><th className="text-left">Depart</th><th className="text-left">Arrive</th><th className="text-left">Name</th></tr></thead>
        <tbody>
          {legs.map((l,i)=>(
            <tr key={i}><td>{l.type}</td><td>{l.code}</td><td>{l.from||''}</td><td>{l.to||''}</td><td>{l.date}</td><td>{l.depart||''}</td><td>{l.arrive||''}</td><td>{l.name||''}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
