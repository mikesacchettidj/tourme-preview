
'use client'
import React,{useEffect,useState} from 'react'
import { ClipboardList } from 'lucide-react'
import {load,save} from '../_modules_lib/storage'
type Row = { time:string; label:string; contact?:string; notes?:string }
const KEY='advance.sheet.v1'
export default function AdvancePage(){
  const [status,setStatus]=useState<'Offer'|'In Progress'|'Draft Ready'>('Offer')
  const [rows,setRows]=useState<Row[]>([])
  useEffect(()=>{ setRows(load<Row[]>(KEY,[
    {time:'16:00', label:'Load-in'},
    {time:'17:00', label:'Soundcheck'},
    {time:'20:00', label:'Doors'},
    {time:'22:00', label:'Set time'},
  ]))},[])
  useEffect(()=>save(KEY,rows),[rows])

  const copyMagic=()=>{ navigator.clipboard.writeText('https://day-sheet.fake/abcd1234') }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><ClipboardList className="h-4 w-4"/><h1 className="text-lg font-semibold">Advance</h1></div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status</span>
          <select value={status} onChange={e=>setStatus(e.target.value as any)} className="rounded border px-2 py-1">
            {['Offer','In Progress','Draft Ready'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={copyMagic} className="rounded border px-2 py-1">Copy magic link</button>
        </div>
      </div>

      {status==='In Progress' && (
        <div className="rounded-2xl border border-blue-300/50 bg-blue-50 p-3 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          <strong>Draft day sheet created</strong>
          <div className="text-sm opacity-80">This is a simulated banner on status change.</div>
        </div>
      )}

      <table className="w-full border-spacing-y-2">
        <thead><tr><th className="text-left">Time</th><th className="text-left">Item</th><th className="text-left">Contact</th><th className="text-left">Notes</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td><input value={r.time} onChange={e=>setRows(rs=>rs.map((x,j)=> j===i? {...x,time:e.target.value}:x))} className="rounded border px-2 py-1"/></td>
              <td><input value={r.label} onChange={e=>setRows(rs=>rs.map((x,j)=> j===i? {...x,label:e.target.value}:x))} className="rounded border px-2 py-1"/></td>
              <td><input value={r.contact||''} onChange={e=>setRows(rs=>rs.map((x,j)=> j===i? {...x,contact:e.target.value}:x))} className="rounded border px-2 py-1"/></td>
              <td><input value={r.notes||''} onChange={e=>setRows(rs=>rs.map((x,j)=> j===i? {...x,notes:e.target.value}:x))} className="rounded border px-2 py-1"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
