"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  CalendarDays,
  LogOut,
  Settings,
  Users,
  ShieldCheck,
  Menu,
  X,
  UserPlus,
  LayoutDashboard,
  LineChart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { clearAuthSession, getUserProfile } from "@/lib/auth";
import AdminInactivityLogout from "./AdminInactivityLogout";
import MfaSetupModal from "./MfaSetupModal";

const workspaceLinks = [
  { href: "/dashboard", label: "Staff directory", icon: Users },
  { href: "/admissions", label: "Admissions", icon: UserPlus },
  { href: "/activity", label: "Activity", icon: LineChart },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentHash, setCurrentHash] = useState("");
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Administrator");
  const [adminInitials, setAdminInitials] = useState("AD");
  const [adminStaffId, setAdminStaffId] = useState("");

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile.fullName) {
      setAdminName(profile.fullName);
    }
    if (profile.initials) {
      setAdminInitials(profile.initials);
    }
    if (profile.staffId) {
      setAdminStaffId(profile.staffId);
    }
  }, []);

  const isLinkActive = (href: string) => {
    const [path, hash] = href.split("#");
    if (hash) {
      return pathname === path && currentHash === `#${hash}`;
    }
    return pathname === path && (!currentHash || currentHash === "#");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
            M
          </div>
          <h1 className="text-sm font-semibold tracking-wide text-white">MediCore</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-slate-400 hover:text-white p-1 lg:hidden cursor-pointer rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Workspace Section */}
      <div className="px-4 pt-5 pb-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
        WORKSPACE
      </div>

      <nav className="px-3 space-y-1">
        {workspaceLinks.map(({ href, label, icon: Icon }) => {
          const active = isLinkActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                setCurrentHash(href.includes("#") ? `#${href.split("#")[1]}` : "");
                setIsMobileMenuOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl transition-all ${
                active
                  ? "bg-slate-800/90 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-teal-400" />
              )}
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-colors ${
                  active ? "bg-teal-500/15 text-teal-400" : "text-slate-400 group-hover:text-white"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="text-sm truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Support & Security Section */}
      <div className="px-4 pt-6 pb-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
        SUPPORT
      </div>

      <nav className="px-3 space-y-1">
        <button
          onClick={() => {
            setIsMfaModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="w-full group relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-left transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 text-slate-400 group-hover:text-white">
            <ShieldCheck size={16} />
          </span>
          <span className="text-sm truncate">2FA Security</span>
        </button>

        <Link
          href="/dashboard#settings"
          onClick={() => setIsMobileMenuOpen(false)}
          className="group relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 text-slate-400 group-hover:text-white">
            <Settings size={16} />
          </span>
          <span className="text-sm truncate">Settings</span>
        </Link>
      </nav>

      <div className="flex-1" />

      {/* User Profile Card & Sign Out */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 rounded-xl text-white border border-slate-700/50 hover:bg-slate-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold shrink-0 text-slate-200">
            {adminInitials}
          </div>
          <div className="text-xs min-w-0 flex-1 text-left">
            <p className="font-semibold truncate text-white">{adminName}</p>
            <p className="text-[11px] text-slate-400 truncate">
              {adminStaffId ? `${adminStaffId} • Admin` : "Administrator"}
            </p>
          </div>
          <button
            onClick={() => {
              clearAuthSession();
              router.push("/admin/login");
            }}
            title="Sign out"
            aria-label="Sign out"
            className="p-1 text-slate-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 font-sans">
      <AdminInactivityLogout timeoutMinutes={15} warningSeconds={60} />
      <MfaSetupModal isOpen={isMfaModalOpen} onClose={() => setIsMfaModalOpen(false)} />

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-[min(16rem,85vw)] bg-[#0a0f1c] text-slate-300 h-full overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <NavContent />
      </aside>

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-800/80 bg-[#0a0f1c] text-slate-300 lg:flex z-30">
        <NavContent />
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">
                Hospital operations
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                Good morning, {adminName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline border border-emerald-200/50">
              All systems operational
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
              {adminInitials}
            </span>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0">{children}</main>
      </div>
    </div>
  );
}