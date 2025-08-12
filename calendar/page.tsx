// app/calendar/page.tsx
"use client";
import React, { useState, useEffect } from "react";

export default function CalendarPage() {
  const [shows, setShows] = useState([]);
  const days = Array.from({ length: 30 }, (_, i) => i + 1); // simulamos un mes de 30 días

  useEffect(() => {
    const saved = localStorage.getItem("shows");
    if (saved) setShows(JSON.parse(saved));
  }, []);

  const addShow = (day) => {
    const name = prompt("Show name?");
    if (!name) return;
    const newShows = [...shows, { name, date: `2025-08-${String(day).padStart(2, "0")}`, slug: name.toLowerCase().replace(/\s+/g, "-") }];
    setShows(newShows);
    localStorage.setItem("shows", JSON.stringify(newShows));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dayShows = shows.filter(s => s.date.endsWith(String(day).padStart(2, "0")));
          return (
            <div key={day} className="border rounded-lg p-2 h-24 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span>{day}</span>
                <button onClick={() => addShow(day)} className="text-xs text-blue-500">+ Show</button>
              </div>
              <div className="space-y-1">
                {dayShows.map((s, i) => (
                  <div key={i} className="text-xs text-zinc-600">{s.name}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
