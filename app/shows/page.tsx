
'use client'
import React,{useEffect,useMemo,useState} from 'react'
import { Mic } from 'lucide-react'
import data from '../data/shows.json'
import {load,save} from '../_modules_lib/storage'

type Show = { id:string; title:string; city:string; date:string; status:'Offer'|'In Progress'|'Booked'|'Cancelled'; fee:number; perDiem:number; buyouts:number; expenses:number }
const KEY='shows.v1'

export default function ShowsPage(){
  const [shows,setShows]=useState<Show[]>([])
  const [q,setQ]=useState(''); const [status,setStatus]=useState(''); const [city,setCity]=useState(''); const [month,setMonth]=useState('')
  useEffect(()=>{ setShows(load<Show[]>(KEY, (data as any))) },[])
  useEffect(()=>save(KEY,shows),[shows])
  const filtered = useMemo(()=>shows.filter(s=>(
    (!q || s.title.toLowerCase().includes(q.toLowerCase())) &&
    (!status || s.status===status) &&
    (!city || s.city===city) &&
    (!month || s.date.slice(0,7)===month)
  )),[shows,q,status,city,month])

  const unique = (k:'city'|'status') => Array.from(new Set(shows.map(s=>s[k])))
  const setStatusInline=(id:string, next:Show['status'])=> setShows(prev=> prev.map(s=> s.id===id ? {...s, status:next}:s))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Mic className="h-4 w-4"/><h1 className="text-lg font-semibold">Shows</h1></div>
        <div className="flex items-center gap-2">
          <input placeholder="Search shows" value={q} onChange={e=>setQ(e.target.value)} className="rounded border px-2 py-1"/>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded border px-2 py-1"><option value="">Any status</option>{unique('status').map(x=><option key={x} value={x}>{x}</option>)}</select>
          <select value={city} onChange={e=>setCity(e.target.value)} className="rounded border px-2 py-1"><option value="">Any city</option>{unique('city').map(x=><option key={x} value={x}>{x}</option>)}</select>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="rounded border px-2 py-1"/>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(s=>(
          <div key={s.id} className="rounded-2xl border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.title}</div>
              <select value={s.status} onChange={e=>setStatusInline(s.id, e.target.value as any)} className="rounded border px-2 py-1 text-xs">
                {['Offer','In Progress','Booked','Cancelled'].map(x=><option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="text-xs text-zinc-500">{s.city} • {s.date}</div>
            <a href={`/shows/${s.id}`} className="mt-2 inline-block rounded border px-2 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900">Open details →</a>
          </div>
        ))}
      </div>
    </div>
  )
}
