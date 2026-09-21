"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admissions", label: "Admissions", icon: CalendarDays },
  { href: "/dashboard#staff", label: "Staff directory", icon: Users },
  { href: "/dashboard#activity", label: "Activity", icon: Activity },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-slate-950 px-5 py-6 text-slate-300 lg:flex">
        <div className="flex items-center gap-3 px-2 text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-400 font-black text-slate-950">M</span>
          <span className="font-semibold tracking-tight">MediCore Admin</span>
        </div>
        <p className="mb-8 mt-10 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${pathname === href.split("#")[0] ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}>
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <Link href="/dashboard#settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-white/5 hover:text-white"><Settings className="size-4" /> Settings</Link>
          <Link href="/login" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><LogOut className="size-4" /> Sign out</Link>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur lg:px-10">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Hospital operations</p><p className="text-sm font-semibold">Good morning, Administrator</p></div>
          <div className="flex items-center gap-3"><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline">All systems operational</span><span className="grid size-9 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">AR</span></div>
        </header>
        <main className="p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
