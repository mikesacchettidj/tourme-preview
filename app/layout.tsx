
'use client'
import React, {useEffect, useState} from 'react'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'
import '../styles/globals.css'

export default function RootLayout({children}:{children:React.ReactNode}){
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    const theme = localStorage.getItem('theme') || 'dark'
    document.documentElement.dataset.theme = theme
    setReady(true)
  },[])
  const toggle=()=>{
    const curr = document.documentElement.dataset.theme === 'dark' ? 'light':'dark'
    document.documentElement.dataset.theme = curr
    localStorage.setItem('theme', curr)
  }
  return (
    <html lang="en"><body>
      <div className="topbar"><Topbar onToggleTheme={toggle}/></div>
      <Sidebar active={typeof window !== 'undefined' ? window.location.pathname : ''}/>
      <main className="main">{ready? children : null}</main>
    </body></html>
  )
}
