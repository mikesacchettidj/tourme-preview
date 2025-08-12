
'use client'
import React,{useState} from 'react'
import { FileText } from 'lucide-react'
type Row = { name:string; size:string }
export default function FilesPage(){
  const [rows,setRows]=useState<Row[]>([
    {name:'Contract.pdf', size:'120 KB'},
    {name:'Tech Rider.pdf', size:'88 KB'},
    {name:'Hospitality Rider.pdf', size:'64 KB'}
  ])
  const onUpload=(file:File)=> setRows(r=>[...r,{name:file.name, size: Math.round(file.size/1024)+' KB'}])
  const copy=(name:string)=> navigator.clipboard.writeText('https://files.fake/'+encodeURIComponent(name))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><FileText className="h-4 w-4"/><h1 className="text-lg font-semibold">Files</h1></div>
        <input type="file" onChange={e=> e.target.files && onUpload(e.target.files[0])}/>
      </div>
      <table className="w-full">
        <thead><tr><th className="text-left">File</th><th className="text-left">Size</th><th className="text-left">Share</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}><td>{r.name}</td><td>{r.size}</td><td><button onClick={()=>copy(r.name)} className="rounded border px-2 py-1">Copy link</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
