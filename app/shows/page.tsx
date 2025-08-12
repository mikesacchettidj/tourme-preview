"use client";

import React, { useState } from "react";
import { SHOWS, Show } from "./_data";
import { MapPin, Calendar, Search } from "lucide-react";
import Link from "next/link";

export default function ShowsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const filtered = SHOWS.filter((show) => {
    return (
      (query === "" ||
        show.name.toLowerCase().includes(query.toLowerCase()) ||
        show.city.toLowerCase().includes(query.toLowerCase())) &&
      (statusFilter === "" || show.status === statusFilter) &&
      (cityFilter === "" || show.city === cityFilter)
    );
  });

  const uniqueStatuses = Array.from(new Set(SHOWS.map((s) => s.status).filter(Boolean)));
  const uniqueCities = Array.from(new Set(SHOWS.map((s) => s.city)));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tours & Shows</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center border rounded-lg px-2">
          <Search className="w-4 h-4 text-zinc-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent p-1 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-3 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-1"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Show List */}
      {filtered.length === 0 ? (
        <p className="text-zinc-500">No shows found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((show) => (
            <Link
              href={`/shows/${show.slug}`}
              key={show.slug}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{show.name}</h2>
              <div className="flex items-center text-sm text-zinc-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" /> {show.date}
              </div>
              <div className="flex items-center text-sm text-zinc-500">
                <MapPin className="w-4 h-4 mr-1" /> {show.venue} — {show.city}
              </div>
              {show.status && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs border rounded-full">
                  {show.status}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
