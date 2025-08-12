// app/shows/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("shows");
    if (saved) setShows(JSON.parse(saved));
  }, []);

  const filtered = shows.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tours & Shows</h1>
        <button
          onClick={() => {
            const name = prompt("Show name?");
            if (!name) return;
            const newShows = [...shows, { name, date: "TBD", slug: name.toLowerCase().replace(/\s+/g, "-") }];
            setShows(newShows);
            localStorage.setItem("shows", JSON.stringify(newShows));
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg"
        >
          New Show
        </button>
      </div>
      <input
        placeholder="Search shows..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-2 py-1 mb-4"
      />
      {filtered.length === 0 ? (
        <p className="text-zinc-500">No shows found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((s, i) => (
            <li key={i} className="border rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <Link href={`/shows/${s.slug}`} className="font-medium">{s.name}</Link>
              <div className="text-sm text-zinc-500">{s.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
