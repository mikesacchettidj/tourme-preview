"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Receipt,
  MessageSquare,
  LayoutDashboard,
  BarChart3,
  Folder,
  Plus,
  Bell,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  Tag,
  X,
} from "lucide-react";

// ⚠️ Usa el dataset local de esta carpeta (según creamos antes).
// Si prefieres reutilizar el de la home, cambia a: import { SHOWS, Show } from "../_data";
import { SHOWS, Show } from "./_data";

/** ---------- utilidades compartidas ---------- */
const DEFAULT_CHECKS = [
  "Tech rider confirmed",
  "Rider received",
  "Transport booked",
  "Crew assigned",
  "Contract signed",
  "Visa approved",
  "Hotel booked",
];

type ShowStore = {
  files: { contract?: string; rider?: string };
  transport?: "flight" | "train" | "car" | "van" | null;
  checklist: Record<string, boolean>;
  notes?: string;
  guestLink?: string;
  guestNames?: string;
};

function useShowStore(slug: string) {
  const key = `show:${slug}`;
  const [data, setData] = useState<ShowStore>({
    files: {},
    transport: null,
    checklist: Object.fromEntries(DEFAULT_CHECKS.map((k) => [k, false])),
    notes: "",
    guestLink: "",
    guestNames: "",
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setData((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, [slug]);
  const save = (next: Partial<ShowStore>) =>
    setData((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(key, JSON.stringify(merged));
      } catch {}
      return merged;
    });
  return { data, save };
}

function StatusPill({ s }: { s?: Show["status"] }) {
  const map: Record<string, string> = {
    Booked:
      "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "In Progress":
      "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Completed:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Cancelled:
      "bg-rose-500/15 text-rose-400 border-rose-500/20",
  };
  const base =
    "px-2 py-0.5 text-xs rounded-full border";
  const cls = s && map[s] ? map[s] : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  return <span className={`${base} ${cls}`}>{s ?? "—"}</span>;
}

function ShowPanel({ show, onClose }: { show: Show; onClose: () => void }) {
  const { data, save } = useShowStore(show.slug);
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      <aside className="fixed right-0 top-0 z-50 h-full w-[min(40vw,640px)] overflow-y-auto border-l border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold">{show.name}</div>
            <div className="truncate text-sm text-zinc-500">
              {show.date} • {show.venue} — {show.city}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill s={show.status} />
            <Link
              href={`/shows/${show.slug}`}
              className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              View full page
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-2 text-sm font-medium">Schedule</div>
            <div className="text-sm">
              <div>Doors 22:00 • Set 01:00–02:30</div>
              <div className="text-zinc-500">Soundcheck 20:00</div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-2 text-sm font-medium">Quick files</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <input
                  placeholder="Contract URL"
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
                  value={data.files.contract ?? ""}
                  onChange={(e) => save({ files: { ...data.files, contract: e.target.value } })}
                />
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <input
                  placeholder="Rider URL"
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
                  value={data.files.rider ?? ""}
                  onChange={(e) => save({ files: { ...data.files, rider: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-2 text-sm font-medium">Checklist</div>
            <ul className="space-y-2 text-sm">
              {DEFAULT_CHECKS.map((k) => {
                const checked = !!data.checklist[k];
                return (
                  <li key={k}>
                    <button
                      onClick={() => save({ checklist: { ...data.checklist, [k]: !checked } })}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      <span className="inline-block h-4 w-4 rounded border border-zinc-400 text-center text-[10px] leading-4">
                        {checked ? "✓" : ""}
                      </span>
                      <span className={checked ? "line-through opacity-70" : ""}>{k}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

/** ---------- página /shows con el MISMO marco que la home ---------- */
export default function ShowsIndexPage() {
  // Tema
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-graphite", "theme-deep");
    if (isDark) root.classList.add("dark", "theme-graphite");
    else root.classList.remove("dark");
  }, [isDark]);

  // Slideover por query ?show=slug
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const p = new URLSearchParams(window.location.search);
      setActive(p.get("show"));
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const close = () => {
    const p = new URLSearchParams(window.location.search);
    p.delete("show");
    const q = p.toString();
    window.history.pushState({}, "", q ? `/shows?${q}` : "/shows");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Filtros
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [month, setMonth] = useState<string>("All");

  const uniqueStatuses = Array.from(new Set(SHOWS.map((s) => s.status).filter(Boolean))) as string[];
  const uniqueCities = Array.from(new Set(SHOWS.map((s) => s.city)));
  const uniqueMonths = Array.from(
    new Set(
      SHOWS.map((s) => {
        const d = new Date(s.date);
        return `${d.getMonth() + 1}`.padStart(2, "0");
      })
    )
  ).sort();

  const filtered = SHOWS.filter((s) => {
    const txt =
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.city.toLowerCase().includes(q.toLowerCase()) ||
      s.venue.toLowerCase().includes(q.toLowerCase());
    const matchStatus = status === "All" ? true : s.status === status;
    const matchCity = city === "All" ? true : s.city === city;
    const matchMonth =
      month === "All"
        ? true
        : new Date(s.date).getMonth() + 1 === Number(month);
    return txt && matchStatus && matchCity && matchMonth;
  });

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div>
        {/* Topbar (idéntica a la home) */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <div className="font-black tracking-tight text-xl">TOUR.ME</div>

            <nav className="mx-4 hidden items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900 md:flex">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </Link>
              <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800">
                <Folder className="h-4 w-4" />
                <span>Files</span>
              </button>
              <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800">
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </button>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsDark((d) => !d)}
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Help">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                aria-label="Add Event"
              >
                <Plus className="mr-1 inline h-4 w-4" /> Add Event
              </button>
              <div className="ml-1 h-8 w-8 overflow-hidden rounded-full bg-zinc-200" />
            </div>
          </div>
        </header>

        {/* Body con sidebar (idéntico a la home) */}
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="sticky top-[68px] flex flex-col gap-6">
              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Navigation</div>
                <nav className="flex flex-col gap-1">
                  <Link href="/calendar" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <Calendar className="h-4 w-4" />
                    <span>Agenda</span>
                  </Link>
                  <Link href="/shows" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <MapPin className="h-4 w-4" />
                    <span>Tours & Shows</span>
                  </Link>
                  <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
                    <Users className="h-4 w-4" />
                    <span>Contacts</span>
                  </a>
                  <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
                    <FileText className="h-4 w-4" />
                    <span>Documents</span>
                  </a>
                  <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
                    <Receipt className="h-4 w-4" />
                    <span>Expenses</span>
                  </a>
                  <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main: SOLO cambia esta sección respecto a la home */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            {/* Header de sección + filtros */}
            <section className="mb-6">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Tours & Shows</h2>
                {/* (Opcional) export */}
                {/* <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">Export CSV</button> */}
              </div>
              <p className="mb-4 text-sm text-zinc-500">All events with quick filters</p>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search name, city, venue..."
                    className="w-64 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-2 text-sm outline-none hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-zinc-500" />
                  <select
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>All</option>
                    {uniqueStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <select
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option>All</option>
                    {uniqueCities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option>All</option>
                    {uniqueMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Grid de shows */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
                No shows match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <article
                    key={s.slug}
                    className="group rounded-2xl border border-zinc-200 bg-white p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="min-w-0 truncate text-lg font-medium">{s.name}</h3>
                      <StatusPill s={s.status} />
                    </div>
                    <div className="mb-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      <span>{s.date}</span>
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="h-4 w-4" />
                      <span>{s.venue} — {s.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          const p = new URLSearchParams(window.location.search);
                          p.set("show", s.slug);
                          const q = p.toString();
                          window.history.pushState({}, "", q ? `/shows?${q}` : "/shows");
                          window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                        className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Quick view
                      </button>
                      <Link
                        href={`/shows/${s.slug}`}
                        className="text-xs underline underline-offset-4 hover:no-underline"
                      >
                        Open
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Slideover */}
        {active &&
          (() => {
            const s = SHOWS.find((x) => x.slug === active);
            return s ? <ShowPanel show={s} onClose={close} /> : null;
          })()}
      </div>
    </Suspense>
  );
}
