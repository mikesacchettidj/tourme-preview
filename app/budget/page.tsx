
'use client'
import React,{useMemo,useState} from 'react'
import { Receipt } from 'lucide-react'
import data from '../data/shows.json'

type Row = { id:string; title:string; fee:number; expenses:number; perDiem:number; buyouts:number }
export default function BudgetPage(){
  const [rows,setRows]=useState<Row[]>( (data as any).map((s:any)=>({id:s.id,title:s.title,fee:s.fee,expenses:s.expenses,perDiem:s.perDiem,buyouts:s.buyouts})) )
  const totals = useMemo(()=>{
    const revenue = rows.reduce((a,r)=>a + r.fee,0)
    const costs = rows.reduce((a,r)=>a + r.expenses + r.perDiem + r.buyouts*20,0)
    return {revenue, costs, net: revenue - costs}
  },[rows])
  const onChange=(i:number, k:keyof Row, v:number|string)=> setRows(rs=> rs.map((r,idx)=> idx===i? {...r,[k]: (k==='title'? v: Number(v))}:r))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Receipt className="h-4 w-4"/><h1 className="text-lg font-semibold">Budget</h1></div>
      </div>

      <table className="w-full">
        <thead><tr><th className="text-left">Show</th><th className="text-left">Fee</th><th className="text-left">Expenses</th><th className="text-left">Per-diem</th><th className="text-left">Buyouts</th><th className="text-left">Net</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={r.id}>
              <td><input value={r.title} onChange={e=>onChange(i,'title',e.target.value)} className="rounded border px-2 py-1"/></td>
              <td><input type="number" value={r.fee} onChange={e=>onChange(i,'fee',e.target.value)} className="rounded border px-2 py-1"/></td>
              <td><input type="number" value={r.expenses} onChange={e=>onChange(i,'expenses',e.target.value)} className="rounded border px-2 py-1"/></td>
              <td><input type="number" value={r.perDiem} onChange={e=>onChange(i,'perDiem',e.target.value)} className="rounded border px-2 py-1"/></td>
              <td><input type="number" value={r.buyouts} onChange={e=>onChange(i,'buyouts',e.target.value)} className="rounded border px-2 py-1"/></td>
              <td>{r.fee - (r.expenses + r.perDiem + r.buyouts*20)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border p-3"><div className="text-sm text-zinc-500">Revenue</div><div className="text-xl font-semibold">€ {totals.revenue}</div></div>
        <div className="rounded-2xl border p-3"><div className="text-sm text-zinc-500">Costs</div><div className="text-xl font-semibold">€ {totals.costs}</div></div>
        <div className="rounded-2xl border p-3"><div className="text-sm text-zinc-500">Net</div><div className="text-xl font-semibold">€ {totals.net}</div></div>
      </div>
    </div>
  )
}
