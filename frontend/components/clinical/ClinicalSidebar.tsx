"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  UserCheck,
  FileText,
  Activity,
  ClipboardList,
  AlertTriangle,
  HeartPulse,
  LogOut,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";
import { logout, getUser } from "@/lib/auth";

interface ClinicalSidebarProps {
  patientId?: string;
}

export const ClinicalSidebar: React.FC<ClinicalSidebarProps> = ({ patientId }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push("/clinical/login");
  };

  const isPatientContext = Boolean(patientId);

  return (
      <aside className="w-full md:w-60 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 text-slate-300 flex flex-col md:justify-between shrink-0 select-none z-20">
        {/* Top Header & Mobile Profile */}
        <div className="flex flex-col md:block w-full min-w-0">
          <div className="h-14 md:h-16 px-4 md:px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
            <Link
                href="/terminal/workspace/patient-search"
                className="flex items-center space-x-2.5 text-white"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shrink-0">
                <Stethoscope className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div>
              <span className="text-sm font-semibold tracking-tight text-white block leading-tight">
                MediCore
              </span>
                <span className="text-[10px] md:text-[11px] text-slate-400 block font-normal leading-tight">
                Clinical Workspace
              </span>
              </div>
            </Link>

            {/* Mobile Profile & Logout */}
            <div className="flex items-center space-x-3 md:hidden">
              <div className="w-7 h-7 rounded-md bg-teal-900/60 border border-teal-700/50 text-teal-300 font-semibold text-xs flex items-center justify-center shrink-0">
                {user?.fullName?.substring(0, 2).toUpperCase() || "SG"}
              </div>
              <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-2 md:p-3 flex md:flex-col overflow-x-auto scrollbar-hide space-x-2 md:space-x-0 md:space-y-1 items-center md:items-stretch w-full">
            {isPatientContext ? (
                <>
                  <Link
                      href="/terminal/workspace/patient-search"
                      className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition md:mb-3 shrink-0 whitespace-nowrap"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="hidden md:inline">Back to Patients</span>
                    <span className="md:hidden">Back</span>
                  </Link>

                  <div className="hidden md:block px-3 pt-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                    Patient Chart
                  </div>
                  {/* Divider for mobile scroll view */}
                  <div className="md:hidden w-px h-5 bg-slate-800 mx-1 shrink-0"></div>

                  {[
                    {
                      label: "Overview",
                      href: `/terminal/workspace/patient/${patientId}/overview`,
                      icon: Activity,
                    },
                    {
                      label: "SOAP Notes",
                      href: `/terminal/workspace/patient/${patientId}/notes`,
                      icon: FileText,
                    },
                    {
                      label: "Orders & Rx",
                      href: `/terminal/workspace/patient/${patientId}/orders`,
                      icon: ClipboardList,
                    },
                    {
                      label: "Vital Signs",
                      href: `/terminal/workspace/patient/${patientId}/vitals`,
                      icon: HeartPulse,
                    },
                    {
                      label: "Nurse Flags",
                      href: `/terminal/workspace/patient/${patientId}/flags`,
                      icon: AlertTriangle,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-2 md:space-x-2.5 px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium transition shrink-0 whitespace-nowrap ${
                                isActive
                                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </Link>
                    );
                  })}
                </>
            ) : (
                <>
                  <div className="hidden md:block px-3 pt-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                    Patients
                  </div>

                  {[
                    {
                      label: "Inpatient Census",
                      href: "/terminal/workspace/patient-search",
                      icon: Users,
                    },
                    {
                      label: "My Patients",
                      href: "/terminal/workspace/patient-search?filter=my-patients",
                      icon: UserCheck,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-2 md:space-x-2.5 px-3 py-1.5 md:py-2 rounded-lg text-xs font-medium transition shrink-0 whitespace-nowrap ${
                                isActive
                                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </Link>
                    );
                  })}
                </>
            )}
          </div>
        </div>

        {/* Desktop Footer User Profile */}
        <div className="hidden md:block p-3 border-t border-slate-800/80 w-full shrink-0">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-teal-900/60 border border-teal-700/50 text-teal-300 font-semibold text-xs flex items-center justify-center shrink-0">
                {user?.fullName?.substring(0, 2).toUpperCase() || "SG"}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {user?.fullName || "Shvet Ghare"}
                </p>
                <p className="text-[10px] text-teal-400 truncate">
                  {user?.roles?.[0] || "Doctor"}
                </p>
              </div>
            </div>

            <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
  );
};