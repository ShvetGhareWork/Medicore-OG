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
  wardName = "Cardiology Ward 3",
}) => {
  const router = useRouter();
  const user = getUser();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-10 shadow-xs">
      {/* Left: Facility or Ward dropdown selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-700">
          <Building2 className="w-4 h-4 text-teal-700" />
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Ward / Facility:
          </span>
          <span className="text-slate-900 font-bold">{wardName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {patient && (
          <div className="hidden lg:flex items-center space-x-2 pl-3 border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-800">
              {patient.firstName} {patient.lastName}
            </span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
              #{patient.id.substring(0, 8)}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Critical</span>
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications, Staff Profile & Lock */}
      <div className="flex items-center space-x-3">
        {patient && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/terminal/workspace/patient/${patient.id}/vitals`)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Add Vitals</span>
            </button>

            {onOpenOrderModal && (
              <button
                onClick={onOpenOrderModal}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600" />
                <span>New Order</span>
              </button>
            )}

            <button
              onClick={() => router.push(`/terminal/workspace/patient/${patient.id}/notes`)}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Add Note</span>
            </button>
          </div>
        )}

        {/* Search icon button */}
        <button
          onClick={() => router.push("/terminal/workspace/patient-search")}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Search Patients"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Bell button */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* Attending Physician profile */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
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
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.fullName?.substring(0, 2).toUpperCase() || "DR"}
          </div>
        </div>

        {/* Fast Lock Screen button */}
        <button
          onClick={() => router.push("/terminal")}
          title="Lock Screen"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
