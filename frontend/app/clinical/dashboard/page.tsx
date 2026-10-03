"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, clearAuthSession, UserProfile } from "@/lib/auth";
import { 
  Stethoscope, 
  LogOut, 
  Activity, 
  Users, 
  ClipboardList, 
  FileHeart, 
  FlaskConical, 
  Clock, 
  ShieldAlert,
  Bell,
  Search
} from "lucide-react";

export default function ClinicalDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const user = getUserProfile();
    setProfile(user);

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/clinical/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/20">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              MediCore Clinical Station
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Bedside Point-of-Care Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-200">{profile?.fullName || "Doctor / Nurse"}</div>
              <div className="text-[10px] text-cyan-400 font-mono font-medium tracking-wide">
                {profile?.staffId ? `ID: ${profile.staffId}` : (profile?.roles?.[0] || "CLINICAL")}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {profile?.initials || "DR"}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700/60 hover:border-rose-500/30 transition-all duration-200"
              title="Sign Out of Terminal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Page Hero Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <Activity className="w-3.5 h-3.5" /> Authenticated Session
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Dashboard
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, <strong className="text-slate-200">{profile?.fullName || "Clinical Officer"}</strong>. Terminal is synchronized with hospital core.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Station Connection</div>
                <div className="text-xs font-bold text-emerald-400">Active • Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-slate-400">Assigned Inpatients</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FileHeart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-slate-400">Critical Vitals Alerts</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-xs text-slate-400">Pending Lab Results</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-xs text-slate-400">Rounds Checklist</div>
            </div>
          </div>
        </div>

        {/* Clinical Actions & Quick Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Clinical Actions */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-cyan-400" /> Clinical Station Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileHeart className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400 transition-colors">Record Patient Vitals</div>
                <div className="text-xs text-slate-400 mt-1">Direct bedside entry for BP, SPO2, Pulse, and Temp.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-200 group-hover:text-teal-400 transition-colors">Doctor Round Notes</div>
                <div className="text-xs text-slate-400 mt-1">Add progress notes and clinical observations.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-200 group-hover:text-purple-400 transition-colors">Order Lab & Pathology</div>
                <div className="text-xs text-slate-400 mt-1">Submit blood work and imaging requisitions.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-200 group-hover:text-amber-400 transition-colors">Emergency Nursing Call</div>
                <div className="text-xs text-slate-400 mt-1">Trigger department alert for code or assistance.</div>
              </div>
            </div>
          </div>

          {/* Side Info & Active Credentials */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-400" /> Active Session Info
            </h3>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Staff Identifier</div>
                <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{profile?.staffId || "DOC-2026-XXXX"}</div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Assigned Roles</div>
                <div className="text-xs font-semibold text-cyan-400 mt-0.5">{profile?.roles?.join(", ") || "DOCTOR"}</div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Security Mode</div>
                <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Hardware QR Token Authenticated
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-slate-800 hover:bg-rose-600/90 text-slate-200 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700 hover:border-rose-500/40"
            >
              <LogOut className="w-4 h-4" /> End Terminal Session
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
