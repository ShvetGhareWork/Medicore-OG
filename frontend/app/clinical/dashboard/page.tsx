"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ArrowRight,
  ChevronRight,
  HeartPulse,
  FileText
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004d40] flex items-center justify-center shadow-xs">
            <Stethoscope className="w-5 h-5 text-[#80eec0]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              MediCore Clinical Station
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Bedside Point-of-Care Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#004d40]" />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">{profile?.fullName || "Doctor / Nurse"}</div>
              <div className="text-[10px] text-slate-500 font-mono font-medium tracking-wide">
                {profile?.staffId ? `ID: ${profile.staffId}` : (profile?.roles?.[0] || "CLINICAL")}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#004d40] text-[#80eec0] font-bold text-xs flex items-center justify-center shadow-xs">
              {profile?.initials || "DR"}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-200 hover:border-rose-200 transition-all duration-200"
              title="Sign Out of Terminal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Page Hero Title & Launch Workspace CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#0a1e24] to-[#004d40] border border-teal-800 p-7 rounded-2xl text-white shadow-lg">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#80eec0]/20 text-[#80eec0] border border-[#80eec0]/30 mb-2">
              <Activity className="w-3.5 h-3.5" /> Authenticated Session
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Clinical Terminal
            </h2>
            <p className="text-sm text-slate-200 mt-1 max-w-xl">
              Welcome back, <strong className="text-white">{profile?.fullName || "Clinical Officer"}</strong>. Launch the full patient roster, electronic chart overview, SOAP notes, orders, and nurse escalation terminal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/terminal/workspace/patient-search"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[#082823] bg-[#80eec0] hover:bg-[#68e2b0] shadow-md transition-all duration-200 group"
            >
              <Users className="w-4 h-4" />
              <span>Launch Patient Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/terminal/workspace/patient-search"
            className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-teal-600 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#004d40] group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">12</div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>Assigned Inpatients</span>
                <ChevronRight className="w-3 h-3 text-[#004d40] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          <Link
            href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/flags"
            className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-amber-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">3</div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>Critical Vitals Alerts</span>
                <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          <Link
            href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/orders"
            className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-purple-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">5</div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>Pending Lab Results</span>
                <ChevronRight className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          <Link
            href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/notes"
            className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-4 hover:border-teal-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">8</div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>Rounds Checklist</span>
                <ChevronRight className="w-3 h-3 text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>

        {/* Clinical Actions & Quick Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Clinical Actions */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#004d40]" /> Clinical Station Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/vitals"
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-teal-600 hover:bg-white transition-all cursor-pointer group block shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-[#004d40] transition-colors flex items-center justify-between">
                  <span>Record Patient Vitals</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Direct bedside entry for BP, SPO2, Pulse, and Temp.</div>
              </Link>

              <Link
                href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/notes"
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-teal-600 hover:bg-white transition-all cursor-pointer group block shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-[#004d40] transition-colors flex items-center justify-between">
                  <span>Doctor Round Notes</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Add progress notes and clinical observations.</div>
              </Link>

              <Link
                href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/orders"
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-purple-600 hover:bg-white transition-all cursor-pointer group block shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors flex items-center justify-between">
                  <span>Order Lab & Pathology</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Submit blood work and imaging requisitions.</div>
              </Link>

              <Link
                href="/terminal/workspace/patient/9fdc6aa6-4508-44c1-8a83-397d876972f9/flags"
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-amber-600 hover:bg-white transition-all cursor-pointer group block shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors flex items-center justify-between">
                  <span>Emergency Nursing Call</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Trigger department alert for code or assistance.</div>
              </Link>
            </div>
          </div>

          {/* Side Info & Active Credentials */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#004d40]" /> Active Session Info
            </h3>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Staff Identifier</div>
                <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{profile?.staffId || "DOC-2026-0001"}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Assigned Roles</div>
                <div className="text-xs font-bold text-[#004d40] mt-0.5">{profile?.roles?.join(", ") || "DOCTOR"}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Security Mode</div>
                <div className="text-xs text-emerald-700 font-bold mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" /> Hardware QR Token Authenticated
                </div>
              </div>
            </div>

            <Link
              href="/terminal/workspace/patient-search"
              className="w-full mt-4 bg-[#004d40] hover:bg-[#00382e] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-xs"
            >
              <Users className="w-4 h-4" /> Open Inpatient Roster
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" /> End Terminal Session
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
