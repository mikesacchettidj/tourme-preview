
'use client'
import React,{useEffect,useMemo,useState} from 'react'
import { Calendar } from 'lucide-react'
import {load,save} from '../_modules_lib/storage'

type Event = { id:string; title:string; date:string; city?:string }
const KEY='planner.events.v1'
const today = new Date()
const fmt=(d:Date)=> d.toISOString().slice(0,10)

export default function PlannerPage(){
  const [view,setView]=useState<'month'|'week'|'agenda'>('month')
  const [q,setQ]=useState('')
  const [events,setEvents]=useState<Event[]>([])
  const [quickDay,setQuickDay]=useState<string|null>(null)

  useEffect(()=>{ setEvents(load<Event[]>(KEY,[
    {id:'1', title:'Rehearsal', date: fmt(new Date(today.getFullYear(),today.getMonth(), today.getDate()+1))},
    {id:'2', title:'Fly to AMS', date: fmt(new Date(today.getFullYear(),today.getMonth(), today.getDate()+3))},
  ]))},[])
  useEffect(()=>{ save(KEY, events) },[events])

  const filtered = useMemo(()=> events.filter(e=> e.title.toLowerCase().includes(q.toLowerCase())),[events,q])
  const addQuick=(title:string)=>{ if(!quickDay) return; setEvents(p=>[{id:String(Date.now()), title, date:quickDay}, ...p]); setQuickDay(null) }

  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const startDay = (start.getDay()+6)%7
  const days = Array.from({length:42}, (_,i)=> new Date(start.getFullYear(), start.getMonth(), i - startDay + 1))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4"/><h1 className="text-lg font-semibold">Planner</h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={view} onChange={e=>setView(e.target.value as any)} className="rounded border px-2 py-1">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>
          <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="rounded border px-2 py-1"/>
        </div>
      </div>

      {view==='month' && (
        <div className="grid gap-2" style={{gridTemplateColumns:'repeat(7,1fr)'}}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(<div key={d} className="text-xs text-zinc-500">{d}</div>))}
          {days.map(d=>{
            const s = fmt(d); const es = filtered.filter(e=>e.date===s).slice(0,3)
            return (
              <div key={s} className="rounded-xl border p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer" onClick={()=>setQuickDay(s)}>
                <div className="text-xs text-zinc-500">{s}</div>
                <div className="mt-1 space-y-1">
                  {es.map(e=>(<div key={e.id} className="text-xs rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{e.title}</div>))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view==='week' && (
        <div className="space-y-2">
          {Array.from({length:7},(_,i)=>{
            const d = new Date(today); d.setDate(today.getDate() - ((today.getDay()+6)%7) + i)
            const s = fmt(d); const es = filtered.filter(e=>e.date===s)
            return <div key={s} className="rounded-xl border p-3"><strong>{s}</strong> <span className="text-xs text-zinc-500">({es.length} items)</span></div>
          })}
        </div>
      )}

      {view==='agenda' && (
        <div className="space-y-2">
          {filtered.sort((a,b)=>a.date.localeCompare(b.date)).map(e=>(
            <div key={e.id} className="rounded-xl border p-3"><strong>{e.date}</strong> — {e.title}</div>
          ))}
        </div>
      )}

      {quickDay && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={()=>setQuickDay(null)}>
          <div className="w-full max-w-sm rounded-2xl border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950" onClick={e=>e.stopPropagation()}>
            <div className="mb-2 text-sm font-medium">Quick Add — {quickDay}</div>
            <input id="qa" placeholder="Title" autoFocus className="w-full rounded border px-2 py-1"/>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={()=>setQuickDay(null)} className="rounded border px-3 py-1">Cancel</button>
              <button onClick={()=>{ const i=document.getElementById('qa') as HTMLInputElement; addQuick(i.value||'Untitled') }} className="rounded bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
