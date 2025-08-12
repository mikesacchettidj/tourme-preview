
'use client'
import React from 'react'
export default function Topbar({onToggleTheme}:{onToggleTheme:()=>void}){
  return (
    <div className="topbar">
      <strong>tour.me</strong>
      <span className="small">Graphite</span>
      <div style={{flex:1}}/>
      <button onClick={onToggleTheme} title="Toggle theme (persist)">🌓 Theme</button>
      <kbd className="kbd">⌘K</kbd>
    </div>
  )
}
