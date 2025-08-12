
'use client'
import React,{useState} from 'react'
import { MessageSquare } from 'lucide-react'
type Msg = { from:'Promoter'|'TM'; text:string; ts:string }
export default function ChatPage(){
  const [msgs,setMsgs]=useState<Msg[]>([
    {from:'Promoter', text:'Hi! Can we shift set time to 22:15?', ts:'2025-08-10 11:40'},
    {from:'TM', text:'Works for us.', ts:'2025-08-10 11:42'},
    {from:'Promoter', text:'Parking is on Schlesische Str. 38', ts:'2025-08-10 11:50'}
  ])
  const [draft,setDraft]=useState('')
  const [mapped,setMapped]=useState<{setTime?:string; parking?:string}>({})

  const onMap=(m:Msg)=>{
    if(/set time|settime|22:|21:|23:/.test(m.text.toLowerCase())) setMapped(v=>({...v, setTime:m.text}))
    if(/parking/.test(m.text.toLowerCase())) setMapped(v=>({...v, parking:m.text}))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/><h1 className="text-lg font-semibold">Chat</h1></div></div>
      <div className="space-y-2">
        {msgs.map((m,i)=>(
          <div key={i} className="flex">
            <div className={"rounded-2xl border p-2 " + (m.from==='TM'?'ml-auto':'mr-auto')}>
              <div className="text-xs text-zinc-500">{m.from} • {m.ts}</div>
              <div>{m.text}</div>
              <div className="mt-1"><button onClick={()=>onMap(m)} className="rounded border px-2 py-1 text-xs">Map to fields</button></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border p-3">
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-2 py-1" placeholder="Message (UI only)" value={draft} onChange={e=>setDraft(e.target.value)}/>
            <button onClick={()=>setDraft('')} className="rounded border px-3 py-1">Send</button>
          </div>
          <div className="mt-1 text-xs text-zinc-500">Does not send (demo)</div>
        </div>
        <div className="rounded-2xl border p-3">
          <div className="font-medium">Mapped fields</div>
          <div className="text-sm">Set time → <code>{(mapped as any).setTime||'—'}</code></div>
          <div className="text-sm">Parking → <code>{(mapped as any).parking||'—'}</code></div>
        </div>
      </div>
    </div>
  )
}
