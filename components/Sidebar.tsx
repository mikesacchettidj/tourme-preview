
'use client'
import React from 'react'
import Link from 'next/link'

const items = [
  {href:'/planner', label:'Planner', icon:'🗓️'},
  {href:'/shows', label:'Shows', icon:'🎛️'},
  {href:'/advance', label:'Advance', icon:'📝'},
  {href:'/travel', label:'Travel', icon:'✈️'},
  {href:'/budget', label:'Budget', icon:'💰'},
  {href:'/guestlist', label:'Guestlist', icon:'🎟️'},
  {href:'/files', label:'Files', icon:'📄'},
  {href:'/chat', label:'Chat', icon:'💬'},
  {href:'/export', label:'Export', icon:'📦'},
]

export default function Sidebar({active}:{active:string}){
  return (
    <aside className="sidebar">
      <nav className="nav vstack">
        {items.map(it=>(
          <Link key={it.href} href={it.href} className={active===it.href? 'active': '' as any}>
            <span style={{width:22,display:'inline-block',textAlign:'center'}}>{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
