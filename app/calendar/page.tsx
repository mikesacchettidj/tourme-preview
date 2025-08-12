"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
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
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

/** ============================
 * Tipos y utilidades
 * ============================ */
type ShowStatus = "Booked" | "In Progress" | "Completed" | "Cancelled" | undefined;

type Show = {
  slug: string;
  name: string;
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
  status?: ShowStatus;
  type?: string;
};

const LS_KEY = "shows";

// Semilla mínima por si no hay nada en localStorage (no rompe producción)
const SEED: Show[] = [
  {
    slug: "berlin-berghain-2025",
    name: "Berghain",
    date: "2025-09-14",
    venue: "Berghain Club",
    city: "Berlin",
    status: "Booked",
    type: "DJ set",
  },
  {
    slug: "paris-rex-2025",
    name: "Rex Club",
    date: "2025-09-20",
    venue: "Rex Club",
    city: "Paris",
    status: "In Progress",
    type: "Live gig",
  },
];

function fmtISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function startOfWeek(d: Date) {
  // Lunes como inicio de semana
  const day = (d.getDay() + 6) % 7;
  const nd = new Date(d);
  nd.setDate(d.getDate() - day);
  return nd;
}
function addDays(d: Date, n: number) {
  const nd = new Date(d);
  nd.setDate(d.getDate() + n);
  return nd;
}

/** ============================
 * Badges de estado
 * ============================ */
function StatusPill({ s }: { s: ShowStatus }) {
  const base = "px-2 py-0.5 text-xs rounded-full border";
  const cls =
    s === "Booked"
      ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
      : s === "In Progress"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
      : s === "Completed"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : s === "Cancelled"
      ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  return <span className={`${base} ${cls}`}>{s ?? "—"}</span>;
}

/** ============================
 * Modal "Quick Add Show"
 * ============================ */
function QuickAddModal({
  dateISO,
  onClose,
  onSave,
}: {
  dateISO: string;
  onClose: () => void;
  onSave: (s: Show) => void;
}) {
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<ShowStatus>("Booked");
  const [type, setType] = useState("DJ set");

  const save = () => {
    if (!name) return;
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Math.floor(Math.random() * 10000);
    onSave({ slug, name, date: dateISO, venue, city, status, type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick add show</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="mb-1 text-xs text-zinc-500">Date</div>
            <input
              value={dateISO}
              readOnly
              className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-500">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Show name"
              className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-xs text-zinc-500">Venue</div>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Venue"
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
            <div>
              <div className="mb-1 text-xs text-zinc-500">City</div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-xs text-zinc-500">Status</div>
              <select
                value={status ?? "Booked"}
                onChange={(e) => setStatus(e.target.value as ShowStatus)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option>Booked</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <div className="mb-1 text-xs text-zinc-500">Type</div>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="DJ set / Live gig / …"
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>

          <button
            onClick={save}
            className="mt-2 w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/** ============================
 * Vista principal /calendar
 * ============================ */
export default function CalendarPage() {
  // Tema graphite (igual que home)
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-graphite", "theme-deep");
    if (isDark) root.classList.add("dark", "theme-graphite");
    else root.classList.remove("dark");
  }, [isDark]);

  // Carga/sincronización de shows con localStorage
  const [shows, setShows] = useState<Show[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setShows(JSON.parse(raw));
      else setShows(SEED);
    } catch {
      setShows(SEED);
    }
  }, []);
  const saveShows = (next: Show[]) => {
    setShows(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  // Fecha navegable
  const [current, setCurrent] = useState<Date>(new Date());
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const monthStartGrid = startOfWeek(monthStart); // empezar en lunes
  const daysInGrid = 6 * 7; // 6 semanas visibles

  // Tabs: Month / Week / Agenda
  const [view, setView] = useState<"month" | "week" | "agenda">("month");

  // Búsqueda
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    return shows.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.city.toLowerCase().includes(lower) ||
        s.venue.toLowerCase().includes(lower)
    );
  }, [shows, q]);

  // Quick add modal
  const [modalDateISO, setModalDateISO] = useState<string | null>(null);
  const closeModal = () => setModalDateISO(null);
  const addShow = (s: Show) => {
    const next = [...shows, s].sort((a, b) => +parseISO(a.date) - +parseISO(b.date));
    saveShows(next);
    closeModal();
  };

  // Helpers por día
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Show[]>();
    for (const s of filtered) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    return map;
  }, [filtered]);

  // Semana actual (desde current)
  const weekStart = startOfWeek(current);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Agenda (próximos)
  const upcoming = [...filtered].sort((a, b) => +parseISO(a.date) - +parseISO(b.date));

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
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-white shadow dark:bg-zinc-800"
              >
                <CalendarIcon className="h-4 w-4" />
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
              <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900" aria-label="Add Event"
                onClick={() => setModalDateISO(fmtISO(new Date()))}
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
                  <Link href="/calendar" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Agenda</span>
                  </Link>
                  <Link href="/shows" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
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

          {/* Main: contenido de calendario */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            {/* Header de sección y controles */}
            <section className="mb-4">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">Calendar</h2>
                <div className="flex items-center gap-2">
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
                  <div className="inline-flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <button
                      className={`px-3 py-2 text-sm ${view === "month" ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}
                      onClick={() => setView("month")}
                    >
                      Month
                    </button>
                    <button
                      className={`px-3 py-2 text-sm ${view === "week" ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}
                      onClick={() => setView("week")}
                    >
                      Week
                    </button>
                    <button
                      className={`px-3 py-2 text-sm ${view === "agenda" ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}
                      onClick={() => setView("agenda")}
                    >
                      Agenda
                    </button>
                  </div>
                </div>
              </div>

              {/* Nav de mes/semana */}
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  className="rounded-lg border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  onClick={() =>
                    setCurrent(
                      view === "week"
                        ? addDays(current, -7)
                        : new Date(current.getFullYear(), current.getMonth() - 1, 1)
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="min-w-[160px] text-center">
                  {current.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <button
                  className="rounded-lg border border-zinc-200 px-2 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  onClick={() =>
                    setCurrent(
                      view === "week"
                        ? addDays(current, 7)
                        : new Date(current.getFullYear(), current.getMonth() + 1, 1)
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  className="ml-2 rounded-lg border border-zinc-200 px-3 py-1 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  onClick={() => setCurrent(new Date())}
                >
                  Today
                </button>
              </div>
            </section>

            {/* Vistas */}
            {view === "month" && (
              <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800">
                {/* Cabecera días */}
                <div className="grid grid-cols-7 border-b border-zinc-200 text-center text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="px-2 py-2">
                      {d}
                    </div>
                  ))}
                </div>
                {/* Celdas */}
                <div className="grid grid-cols-7">
                  {Array.from({ length: daysInGrid }, (_, i) => {
                    const day = addDays(monthStartGrid, i);
                    const isThisMonth = day.getMonth() === current.getMonth();
                    const iso = fmtISO(day);
                    const list = eventsByDay.get(iso) ?? [];
                    const isToday = sameDay(day, new Date());
                    return (
                      <div
                        key={iso}
                        className={`min-h-[110px] border-b border-r border-zinc-200 p-2 text-sm dark:border-zinc-800 ${
                          !isThisMonth ? "bg-zinc-50/40 dark:bg-zinc-900/40" : ""
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <div className={`h-7 w-7 rounded-full text-center leading-7 ${isToday ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : ""}`}>
                            {day.getDate()}
                          </div>
                          <button
                            className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            onClick={() => setModalDateISO(iso)}
                          >
                            + Add
                          </button>
                        </div>
                        <div className="space-y-1">
                          {list.slice(0, 3).map((s) => (
                            <Link
                              key={s.slug}
                              href={`/shows/${s.slug}`}
                              className="block truncate rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                              title={`${s.name} — ${s.venue} • ${s.city}`}
                            >
                              {s.name}
                            </Link>
                          ))}
                          {list.length > 3 && (
                            <div className="text-xs text-zinc-500">+ {list.length - 3} more…</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {view === "week" && (
              <section className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((day) => {
                    const iso = fmtISO(day);
                    const list = eventsByDay.get(iso) ?? [];
                    const isToday = sameDay(day, new Date());
                    return (
                      <div key={iso} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-7 w-7 rounded-full text-center text-sm leading-7 ${isToday ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : ""}`}>
                              {day.getDate()}
                            </div>
                            <span className="text-zinc-500">
                              {day.toLocaleDateString(undefined, { weekday: "short" })}
                            </span>
                          </div>
                          <button
                            className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            onClick={() => setModalDateISO(iso)}
                          >
                            + Add
                          </button>
                        </div>
                        {list.length === 0 ? (
                          <div className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
                            No events
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {list.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/shows/${s.slug}`}
                                className="block rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                              >
                                <div className="font-medium">{s.name}</div>
                                <div className="text-[11px] text-zinc-500">
                                  {s.venue} — {s.city}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {view === "agenda" && (
              <section className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
                {upcoming.length === 0 ? (
                  <div className="rounded-md border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
                    No upcoming events.
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {upcoming.map((s) => (
                      <li key={s.slug} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{s.date}</span>
                          </div>
                          <div className="truncate text-base font-medium">{s.name}</div>
                          <div className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                            <MapPin className="mr-1 inline h-4 w-4" />
                            {s.venue} — {s.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusPill s={s.status} />
                          <Link
                            href={`/shows/${s.slug}`}
                            className="text-xs underline underline-offset-4 hover:no-underline"
                          >
                            Open
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </main>
        </div>

        {/* Modal quick add */}
        {modalDateISO && (
          <QuickAddModal
            dateISO={modalDateISO}
            onClose={closeModal}
            onSave={addShow}
          />
        )}
      </div>
    </Suspense>
  );
}
