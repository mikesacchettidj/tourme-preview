
'use client'
import React from 'react'
export default function Page(){
  return (
    <div className="vstack">
      <h1>Home</h1>
      <div className="grid cols-3">
        <div className="card"><strong>Planner</strong><p>Month/Week/Agenda + Quick Add</p></div>
        <div className="card"><strong>Shows</strong><p>Grid with filters and inline status</p></div>
        <div className="card"><strong>Advance</strong><p>Day sheet skeleton + status banner</p></div>
        <div className="card"><strong>Travel</strong><p>Flights/Trains/Hotels + Parser fake</p></div>
        <div className="card"><strong>Budget</strong><p>Inline P&amp;L + CSV export</p></div>
        <div className="card"><strong>Guestlist</strong><p>CSV import + QR placeholder</p></div>
        <div className="card"><strong>Files</strong><p>Upload simulated + Copy link</p></div>
        <div className="card"><strong>Chat</strong><p>Timeline + field mapping (UI)</p></div>
        <div className="card"><strong>Export</strong><p>All data CSV + placeholders</p></div>
      </div>
    </div>
  )
}
