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
  Plus,
  Bell,
  HelpCircle,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { SHOWS, Show } from "./_data";

function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped((v) => !v)} className="group perspective cursor-pointer">
      <div
        className={`relative h-48 w-64 [transform-style:preserve-3d] transition-transform duration-500 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden rounded-2xl border card-surface border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rounded-2xl border card-surface border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800 [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}

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
            <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs dark:border-zinc-700">
              {show.status ?? "—"}
            </span>
            <a
              href={`/shows/${show.slug}`}
              className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              View full page
            </a>
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

export default function Page() {
  // Toggle Moon/Sun — dark (Graphite) por defecto
  const [isDark, setIsDark] = useState(true);

  // Slideover por query ?show=slug
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-graphite", "theme-deep");
    if (isDark) {
      root.classList.add("dark", "theme-graphite");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

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
    window.history.pushState({}, "", q ? `/?${q}` : "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div>
        {/* Top */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-950/60">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <div className="font-black tracking-tight text-xl">TOUR.ME</div>

            <nav className="mx-4 hidden items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900 md:flex">
              <a
                href="/"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
              <a
                href="/calendar"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </a>
              <a
                href="/shows"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <Folder className="h-4 w-4" />
                <span>Shows</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white hover:shadow dark:hover:bg-zinc-800"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </a>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {/* Toggle Moon/Sun */}
              <button
                onClick={() => setIsDark((d) => !d)}
                className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Help">
                <HelpCircle className="h-5 w-
