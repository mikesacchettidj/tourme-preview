"use client";

import React, { useState } from "react";
import { SHOWS, Show } from "./_data";
import { Calendar, MapPin, Filter } from "lucide-react";

export default function ShowsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredShows =
    statusFilter === "All"
      ? SHOWS
      : SHOWS.filter((s) => s.status === statusFilter);

  return (
    <div className="p-6 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tours & Shows</h1>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="All">All statuses</option>
            <option value="Booked">Booked</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Shows Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredShows.map((show) => (
          <a
            key={show.slug}
            href={`/shows/${show.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold">{show.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  show.status === "Booked"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    : show.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    : show.status === "Completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                {show.status}
              </span>
            </div>

            <div className="mb-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
              <Calendar className="mr-1 h-4 w-4" /> {show.date}
            </div>
            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="mr-1 h-4 w-4" /> {show.venue} — {show.city}
            </div>
          </a>
        ))}
      </div>

      {filteredShows.length === 0 && (
        <div className="mt-10 text-center text-zinc-500">
          No shows found for this filter.
        </div>
      )}
    </div>
  );
}
