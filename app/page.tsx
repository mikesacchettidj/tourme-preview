"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Receipt,
  MessageSquare,
  LayoutDashboard,
  BarChart3,
  FileStack,
  Moon,
  Sun,
  Plus,
  Bell,
  HelpCircle,
  Settings
} from "lucide-react";

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(v => !v)} className="group perspective cursor-pointer">
      <div className={`relative h-48 w-64 [transform-style:preserve-3d] transition-transform duration-500 ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 p-4 shadow-sm [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const shows = [
    { name: "Next Wave", date: "12.01", venue: "Berghain / Panorama", city: "Berlin, Germany" },
    { name: "Sunny Side Fest", date: "18.01", venue: "Santa Catalina", city: "Los Angeles, USA" },
    { name: "Whole Fest", date: "22.01", venue: "NDSM", city: "Amsterdam, Netherlands" },
    { name: "Festi Fest", date: "24.01", venue: "Urban Spree", city: "Madrid, Spain" },
  ];

  const people = [
    { name: "Maria", role: "Booker" },
    { name: "Petra", role: "Event Manager" },
    { name: "Josh", role: "Promoter" },
    { name: "Patrizia", role: "Artist" },
    { name: "Jason", role: "Event Manager" },
    { name: "Damian", role: "Tech" },
  ];

  const TopItem = ({ icon, label }:{icon:React.ReactNode,label:string}) => (
    <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800">
      {icon}<span>{label}</span>
    </button>
  );

  const NavItem = ({ icon, label }:{icon:React.ReactNode,label:string}) => (
    <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
      {icon}<span>{label}</span>
    </a>
  );

  return (
    <div className="">
      {/* Top */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="font-black tracking-tight text-xl">TOUR.ME</div>

          <nav className="mx-4 hidden items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900 md:flex">
            <TopItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
            <TopItem icon={<Calendar className="h-4 w-4" />} label="Calendar" />
            <TopItem icon={<FileStack className="h-4 w-4" />} label="Documents" />
            <TopItem icon={<BarChart3 className="h-4 w-4" />} label="Insights" />
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Help"><HelpCircle className="h-5 w-5"/></button>
            <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Settings"><Settings className="h-5 w-5"/></button>
            <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Notifications"><Bell className="h-5 w-5"/></button>
            <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900" aria-label="Add Event"><Plus className="mr-1 inline h-4 w-4"/> Add Event</button>
            <button onClick={() => setDark(!dark)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Toggle theme">
              {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
            </button>
            <div className="ml-1 h-8 w-8 overflow-hidden rounded-full bg-zinc-200" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[68px] flex flex-col gap-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Navigation</div>
              <nav className="flex flex-col gap-1">
                <NavItem icon={<Calendar className="h-4 w-4"/>} label="Agenda" />
                <NavItem icon={<MapPin className="h-4 w-4"/>} label="Tours & Shows" />
                <NavItem icon={<Users className="h-4 w-4"/>} label="Contacts" />
                <NavItem icon={<FileText className="h-4 w-4"/>} label="Documents" />
                <NavItem icon={<Receipt className="h-4 w-4"/>} label="Expenses" />
                <NavItem icon={<MessageSquare className="h-4 w-4"/>} label="Chat" />
              </nav>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <section className="mb-8">
            <h2 className="mb-1 text-2xl font-semibold">Shows</h2>
            <p className="mb-4 text-sm text-zinc-500">Scheduled performances and gigs</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {shows.map((s, i) => (
                <FlipCard
                  key={i}
                  front={
                    <div className="flex h-full w-full flex-col justify-between rounded-xl">
                      <div className="text-xl font-semibold">{s.name}<span className="ml-2 text-zinc-400">{s.date}</span></div>
                      <div className="text-sm text-zinc-500">@ {s.venue}<br/>{s.city}</div>
                    </div>
                  }
                  back={
                    <div className="flex h-full w-full flex-col justify-between">
                      <div>
                        <div className="text-sm text-zinc-400">Details</div>
                        <div className="mt-1 text-base">Doors 22:00 • Set 01:00–02:30</div>
                        <div className="text-sm text-zinc-500">Soundcheck 20:00 • Contact: Alex (Promoter)</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Status: Confirmed</span>
                        <button className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Open</button>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-1 text-2xl font-semibold">People</h2>
            <p className="mb-4 text-sm text-zinc-500">Artists, promoters, venues, tech crew and more</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {people.map((p, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
                  <div className="h-24 w-full rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
                  <div className="mt-2 text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.role}</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
