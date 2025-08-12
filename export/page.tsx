
'use client'
import React from 'react'
import { Download } from 'lucide-react'
import {downloadCSV} from '../_modules_lib/csv'
import shows from '../data/shows.json'

export default function ExportPage(){
  const allData=()=> downloadCSV('all-data.csv', (shows as any))
  const daySheets=()=> alert('PDF placeholder generated (fake)')
  const budget=()=> downloadCSV('budget.csv', (shows as any).map((s:any)=>({show:s.title, net: s.fee - (s.expenses + s.perDiem + s.buyouts*20)})))
  const share=()=> { navigator.clipboard.writeText('https://export.fake/xyz789'); alert('Share link copied (fake)') }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><Download className="h-4 w-4"/><h1 className="text-lg font-semibold">Export</h1></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border p-3"><div className="mb-2 font-medium">Export All Data</div><button onClick={allData} className="rounded border px-2 py-1">CSV</button></div>
        <div className="rounded-2xl border p-3"><div className="mb-2 font-medium">Day Sheets</div><button onClick={daySheets} className="rounded border px-2 py-1">PDF (placeholder)</button></div>
        <div className="rounded-2xl border p-3"><div className="mb-2 font-medium">Budget</div><button onClick={budget} className="rounded border px-2 py-1">CSV</button></div>
      </div>
      <button onClick={share} className="rounded border px-3 py-1">Generate share link (fake)</button>
    </div>
  )
}
