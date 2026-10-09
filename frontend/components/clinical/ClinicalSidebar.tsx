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
    <aside className="w-60 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Header */}
      <div>
        <div className="h-16 px-5 flex items-center border-b border-slate-800/80">
          <Link
            href="/terminal/workspace/patient-search"
            className="flex items-center space-x-2.5 text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-white block">
                MediCore
              </span>
              <span className="text-[11px] text-slate-400 block font-normal">
                Clinical Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {isPatientContext ? (
            <>
              <Link
                href="/terminal/workspace/patient-search"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
                <span>Back to Patients</span>
              </Link>

              <div className="px-3 pt-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Patient Chart
              </div>

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
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
              ].map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === "/terminal/workspace/patient-search";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Footer User Profile */}
      <div className="p-3 border-t border-slate-800/80">
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
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
