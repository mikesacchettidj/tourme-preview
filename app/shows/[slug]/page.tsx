
'use client'
import React from 'react'
export default function ShowDetail(){
  const slug = (typeof window!=='undefined' ? window.location.pathname.split('/').pop() : 'show')
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Show: {slug}</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border p-3">
          <div className="mb-2 font-medium">Checklist</div>
          <label className="block"><input type="checkbox" className="mr-2"/> Contract signed</label>
          <label className="block"><input type="checkbox" className="mr-2"/> Tech confirmed</label>
          <label className="block"><input type="checkbox" className="mr-2"/> Hospitality sent</label>
        </div>
        <div className="rounded-2xl border p-3">
          <div className="mb-2 font-medium">Quick files</div>
          <button onClick={()=>navigator.clipboard.writeText('https://fake.link/'+slug)} className="rounded border px-2 py-1">Copy link</button>
          <div className="mt-1 text-xs text-zinc-500">Copies a fake share URL</div>
        </div>
      </div>
    </div>
  )
}
