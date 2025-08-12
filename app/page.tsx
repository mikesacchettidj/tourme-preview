"use client";

import React, { Suspense, useEffect, useState } from "react";
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
  Moon,
  Sun,
  Plus,
  Bell,
  HelpCircle,
  Settings,
  X,
  CheckSquare,
  Square,
  Link as LinkIcon,
  Plane,
  TrainFront,
  Car,
} from "lucide-react";

/* ---------- Flip card ---------- */
function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped((v) => !v)} className="group perspective cursor-pointer">
      <div
        className={`relative h-48 w-64 [transform-style:preserve-3d] transition-transform duration-500 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800 [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}

/* ---------- Types ---------- */
type Show = {
  slug: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  status?: "confirmed" | "tentative" | "in_progress" | "cancelled";
};

/* ---------- Demo data ---------- */
const SHOWS: Show[] = [
  { slug: "next-wave", name: "Next Wave", date: "12.01", venue: "Berghain / Panorama", city: "Berlin, Germany", status: "confirmed" },
  { slug: "sunny-side-fest", name: "Sunny Side Fest", date: "18.01", venue: "Santa Catalina", city: "Los Angeles, USA", status: "confirmed" },
  { slug: "whole-fest", name: "Whole Fest", date: "22.01", venue: "NDSM", city: "Amsterdam, Netherlands", status: "tentative" },
  { slug: "festi-fest", name: "Festi Fest", date: "24.01", venue: "Urban Spree", city: "Madrid, Spain", status: "confirmed" },
];

/* ---------- Helpers ---------- */
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs dark:border-zinc-700">{children}</span>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-2 text-sm font-medium">{title}</div>
      {children}
    </div>
  );
}

/* ---------- Persistency (localStorage per show) ---------- */
type ShowStore = {
  files: { contract?: string; rider?: string };
  transport?: "flight" | "train" | "car" | "van" | null;
  checklist: Record<string, boolean>;
  notes?: string;
  guestLink?: string;
  guestNames?: string;
};
const DEFAULT_CHECKS = [
  "Tech rider confirmed",
  "Rider received",
  "Transport booked",
  "Crew assigned",
  "Contract signed",
  "Visa approved",
  "Hotel booked",
];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const save = (next: Partial<ShowStore>) => {
    setData((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(key, JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  return { data, save, setData };
}

/* ---------- Slide-over ---------- */
function ShowPanel({ show, onClose }: { show: Show; onClose: () => void }) {
  const { data, save } = useShowStore(show.slug);

  const TransportPill = ({ value, label, icon }: { value: ShowStore["transport"]; label: string; icon: React.ReactNode }) => {
    const active = data.transport === value;
    return (
      <button
        onClick={() => save({ transport: data.transport === value ? null : value })}
        className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
          active
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  const toggleCheck = (k: string) => save({ checklist: { ...data.checklist, [k]: !data.checklist[k] } });

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 h-full w-[min(40vw,640px)] overflow-y-auto border-l border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950" aria-label="Show details">
        {/* Header */}
        <div className="sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold">{show.name}</div>
            <div className="truncate text-sm text-zinc-500">
              {show.date} • {show.venue} — {show.city}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{show.status ?? "—"}</Badge>
            <button className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Edit</button>
            <button className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">View full page</button>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Schedule */}
          <Section title="Schedule">
            <div className="text-sm">
              <div>Doors 22:00 • Set 01:00–02:30</div>
              <div className="text-zinc-500">Soundcheck 20:00</div>
            </div>
          </Section>

          {/* Quick files */}
          <Section title="Quick files">
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
          </Section>

          {/* Primary contact */}
          <Section title="Primary contact">
            <div className="text-sm">
              <div className="font-medium">Alex — Promoter</div>
              <div className="text-zinc-500">alex@promoter.com • +49 160 000000</div>
            </div>
          </Section>

          {/* Transport */}
          <Section title="Transport">
            <div className="flex flex-wrap gap-2 text-xs">
              <TransportPill value="flight" label="Flight" icon={<Plane className="h-3.5 w-3.5" />} />
              <TransportPill value="train" label="Train" icon={<TrainFront className="h-3.5 w-3.5" />} />
              <TransportPill value="car" label="Car" icon={<Car className="h-3.5 w-3.5" />} />
              <TransportPill value="van" label="Van" icon={<Car className="hidden" />} />
            </div>
          </Section>

          {/* Checklist */}
          <Section title="Checklist">
            <ul className="space-y-2 text-sm">
              {DEFAULT_CHECKS.map((k) => {
                const checked = !!data.checklist[k];
                const Icon = checked ? CheckSquare : Square;
                return (
                  <li key={k}>
                    <button onClick={() => toggleCheck(k)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900">
                      <Icon className="h-4 w-4" />
                      <span className={checked ? "line-through opacity-70" : ""}>{k}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>

          {/* Notes */}
          <Section title="Notes">
            <textarea
              rows={5}
              placeholder="Add special notes for this show…"
              className="w-full rounded-xl border border-zinc-300 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
              value={data.notes ?? ""}
              onChange={(e) => save({ notes: e.target.value })}
            />
          </Section>

          {/* Guest list */}
          <Section title="Guest list">
            <div className="mb-2 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <input
                placeholder="Guest list submission link (URL)"
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
                value={data.guestLink ?? ""}
                onChange={(e) => save({ guestLink: e.target.value })}
              />
              <button
                onClick={() => data.guestLink && navigator.clipboard.writeText(data.guestLink)}
                className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Copy
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Names (one per line)"
              className="w-full rounded-xl border border-zinc-300 bg-transparent p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700"
              value={data.guestNames ?? ""}
              onChange={(e) => save({ guestNames: e.target.value })}
            />
          </Section>
        </div>
      </aside>
    </>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  const [dark, setDark] = useState(true);

  // Estado para el slug activo leído desde la URL (?show=...)
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Lee ?show=... desde window.location y escucha cambios del historial
  useEffect(() => {
    const update = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        setActiveSlug(params.get("show"));
      } catch {
        setActiveSlug(null);
      }
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const active = activeSlug ? SHOWS.find((s) => s.slug === activeSlug) ?? null : null;

  const openShowBySlug = (slug: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("show", slug);
    window.history.pushState({}, "", `/?${params.toString()}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const closePanel = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("show");
    const q = params.toString();
    window.history.pushState({}, "", q ? `/?${q}` : "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const people = [
    { name: "Maria", role: "Booker" },
    { name: "Petra", role: "Event Manager" },
    { name: "Josh", role: "Promoter" },
    { name: "Patrizia", role: "Artist" },
    { name: "Jason", role: "Event Manager" },
    { name: "Damian", role: "Tech" },
  ];

  const TopItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800">
      {icon}
      <span>{label}</span>
    </button>
  );
  const NavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <a className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" href="#">
      {icon}
      <span>{label}</span>
    </a>
  );

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div>
        {/* Top */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <div className="font-black tracking-tight text-xl">TOUR.ME</div>

            <nav className="mx-4 hidden items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900 md:flex">
              <TopItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
              <TopItem icon={<Calendar className="h-4 w-4" />} label="Calendar" />
              <TopItem icon={<Folder className="h-4 w-4" />} label="Files" />
              <TopItem icon={<BarChart3 className="h-4 w-4" />} label="Insights" />
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Help"><HelpCircle className="h-5 w-5" /></button>
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Settings"><Settings className="h-5 w-5" /></button>
              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
              <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900" aria-label="Add Event"><Plus className="mr-1 inline h-4 w-4" /> Add Event</button>
              <button onClick={() => setDark(!dark)} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Toggle theme">
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                  <NavItem icon={<Calendar className="h-4 w-4" />} label="Agenda" />
                  <NavItem icon={<MapPin className="h-4 w-4" />} label="Tours & Shows" />
                  <NavItem icon={<Users className="h-4 w-4" />} label="Contacts" />
                  <NavItem icon={<FileText className="h-4 w-4" />} label="Documents" />
                  <NavItem icon={<Receipt className="h-4 w-4" />} label="Expenses" />
                  <NavItem icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
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
                {SHOWS.map((s) => (
                  <FlipCard
                    key={s.slug}
                    front={
                      <div className="flex h-full w-full flex-col justify-between rounded-xl">
                        <div className="text-xl font-semibold">{s.name}<span className="ml-2 text-zinc-400">{s.date}</span></div>
                        <div className="text-sm text-zinc-500">@ {s.venue}<br />{s.city}</div>
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
                          <span className="text-zinc-500">Status: {s.status ?? "—"}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openShowBySlug(s.slug); }}
                            className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                          >
                            Open
                          </button>
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
                {[
                  { name: "Maria", role: "Booker" },
                  { name: "Petra", role: "Event Manager" },
                  { name: "Josh", role: "Promoter" },
                  { name: "Patrizia", role: "Artist" },
                  { name: "Jason", role: "Event Manager" },
                  { name: "Damian", role: "Tech" },
                ].map((p, i) => (
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

        {/* Slide-over */}
        {active && <ShowPanel show={active} onClose={closePanel} />}

        <style>{`
          .perspective { perspective: 1000px; }
          .backface-hidden { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        `}</style>
      </div>
    </Suspense>
  );
}
