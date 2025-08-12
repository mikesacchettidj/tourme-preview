"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react"; // ajusta según íconos que uses

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Ejemplo: fetch inicial
    fetch("/api/shows")
      .then((res) => res.json())
      .then((shows) => setData(shows));
  }, []);

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div>
        {/* Top */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Tour.me</h1>
            <nav className="space-x-4">
              <Link href="/shows" className="hover:underline">
                Shows
              </Link>
              <Link href="/calendar" className="hover:underline">
                Calendar
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {data.length === 0 ? (
            <p>No shows yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.map((show, i) => (
                <li key={i} className="p-4 border rounded-lg flex items-center gap-4">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{show.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {show.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </Suspense>
  );
}
