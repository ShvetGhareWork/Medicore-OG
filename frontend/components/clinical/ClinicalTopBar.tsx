"use client";

import React from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Lock,
  PlusCircle,
  Clock,
  User,
  Activity,
  Search,
  Bell,
  Building2,
  ChevronDown,
  Plus,
  FileText,
  HeartPulse,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientSummary, PatientAllergy } from "@/lib/api/clinicalApi";
import { getUser } from "@/lib/auth";

interface ClinicalTopBarProps {
  patient?: PatientSummary | null;
  precautions?: string[];
  allergies?: PatientAllergy[];
  encounterStatus?: string;
  encounterType?: string;
  onOpenOrderModal?: () => void;
  onOpenFlagModal?: () => void;
  onOpenSoapModal?: () => void;
  wardName?: string;
}

export const ClinicalTopBar: React.FC<ClinicalTopBarProps> = ({
                                                                patient,
                                                                precautions = [],
                                                                allergies = [],
                                                                encounterStatus,
                                                                encounterType,
                                                                onOpenOrderModal,
                                                                onOpenFlagModal,
                                                                onOpenSoapModal,
                                                                wardName,
                                                              }) => {
  const router = useRouter();
  const user = getUser();
  const currentWard = wardName || patient?.ward || "General Ward";

  return (
      <header className="h-14 md:h-16 bg-white border-b border-slate-200/80 px-3 md:px-6 flex items-center justify-between shrink-0 z-10 shadow-xs gap-2">
        {/* Left: Facility or Ward dropdown selector */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0 min-w-0">
          <div className="flex items-center space-x-1.5 md:space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 md:px-3 py-1.5 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-700 shrink-0 min-w-0">
            <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-700 shrink-0" />
            <span className="hidden md:inline text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
            Ward / Facility:
          </span>
            <span className="text-slate-900 font-bold truncate max-w-[100px] sm:max-w-none">{currentWard}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {patient && (
              <div className="hidden xl:flex items-center space-x-2 pl-3 border-l border-slate-200 shrink-0">
            <span className="text-xs font-semibold text-slate-800">
              {patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient'}
            </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
              #{patient.id}
            </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{patient.statusBadge || "Admitted"}</span>
            </span>
              </div>
          )}
        </div>

        {/* Right: Actions, Notifications, Staff Profile & Lock */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide shrink-0">
          {patient && (
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <button
                    onClick={() => router.push(`/terminal/workspace/patient/${patient.id}/vitals`)}
                    className="flex items-center space-x-1 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shrink-0"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="hidden lg:inline">+ Add Vitals</span>
                </button>

                {onOpenOrderModal && (
                    <button
                        onClick={onOpenOrderModal}
                        className="flex items-center space-x-1 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="hidden lg:inline">New Order</span>
                    </button>
                )}

                <button
                    onClick={() => router.push(`/terminal/workspace/patient/${patient.id}/notes`)}
                    className="flex items-center space-x-1 px-2.5 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition shrink-0"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">+ Add Note</span>
                </button>
              </div>
          )}

          {/* Search icon button */}
          <button
              onClick={() => router.push("/terminal/workspace/patient-search")}
              className="p-1.5 md:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
              title="Search Patients"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bell button */}
          <button
              className="relative p-1.5 md:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
              title="Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Attending Physician profile */}
          <div className="flex items-center space-x-2.5 pl-1.5 sm:pl-3 border-l border-slate-200 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">
                {user?.fullName || "Dr. Meera Iyer"}
              </p>
              <div className="flex items-center justify-end space-x-1.5 mt-0.5">
              <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                {user?.roles?.[0] || "Doctor"}
              </span>
                <span className="text-[10px] text-slate-400">Attending Clinician</span>
              </div>
            </div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {user?.fullName?.substring(0, 2).toUpperCase() || "DR"}
            </div>
          </div>

          {/* Fast Lock Screen button */}
          <button
              onClick={() => router.push("/terminal")}
              title="Lock Screen"
              className="p-1.5 md:p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shrink-0"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>
  );
};