"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Activity,
  AlertTriangle,
  ChevronRight,
  Bed,
  Calendar,
  UserCheck,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface PatientCardProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    age?: number | string;
    gender?: string;
    bloodGroup?: string;
    roomNumber?: string;
    bedNumber?: string;
    ward?: string;
    patientIdCode?: string;
    monitorLabel?: string;
    statusBadge?: "Critical" | "Stable" | "Under Observation" | "Pending Labs";
    primaryDiagnosis?: string;
    attendingDoctor?: string;
    admittedDate?: string;
    vitalsSummary?: string;
    vitalsStatus?: string;
    latestVitals?: {
      heartRate?: number | string;
      bloodPressure?: string;
      spo2?: number | string;
      temperature?: number | string;
    };
    precautions?: string[];
    openFlagsCount?: number;
  };
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const initials = `${patient.firstName?.[0] || "P"}${patient.lastName?.[0] || ""}`;

  // Avatar color generator based on initials
  const getAvatarStyle = (name: string) => {
    const code = name.charCodeAt(0) % 4;
    switch (code) {
      case 0:
        return "bg-rose-100 text-rose-800 border-rose-200";
      case 1:
        return "bg-teal-100 text-teal-800 border-teal-200";
      case 2:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const status = patient.statusBadge || (patient.openFlagsCount && patient.openFlagsCount > 0 ? "Critical" : "Stable");

  return (
      <Link
          href={`/terminal/workspace/patient/${patient.id}/overview`}
          className="group block bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-teal-600/50 rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
      >
        <div>
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
            <div className="flex items-start space-x-3 sm:space-x-3.5">
              <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border font-bold text-sm flex items-center justify-center shadow-xs shrink-0 ${getAvatarStyle(
                      patient.firstName
                  )}`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition truncate">
                    {patient.firstName} {patient.lastName}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                  {patient.age || "58y"} • {patient.gender === "F" ? "Female" : "Male"}
                  {patient.bloodGroup && ` • ${patient.bloodGroup}`}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center self-start sm:self-auto shrink-0">
            <span
                className={`text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 ${
                    status === "Critical"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : status === "Stable"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : status === "Under Observation"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                }`}
            >
              <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      status === "Critical" ? "bg-rose-500 animate-pulse" : "bg-current"
                  }`}
              ></span>
              <span className="whitespace-nowrap">{status}</span>
            </span>
            </div>
          </div>

          {/* Patient ID Code & Bed Monitor Row */}
          <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono mt-3 sm:mt-3.5 text-slate-500 gap-2">
          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
            {patient.patientIdCode || patient.id}
          </span>
            <span className="shrink-0">{patient.monitorLabel || "Bedside Telemetry"}</span>
          </div>

          {/* Primary Diagnosis Box */}
          <div className="mt-3 sm:mt-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 sm:p-3">
            <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">Primary Diagnosis</span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-snug line-clamp-2">
              {patient.primaryDiagnosis || "Admitted Patient"}
            </p>
          </div>

          {/* Attending & Location Metadata */}
          <div className="mt-3.5 sm:mt-4 space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-slate-600">
            <div className="flex items-center justify-between gap-2">
            <span className="flex items-center space-x-1.5 text-slate-500 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Attending:</span>
            </span>
              <span className="font-semibold text-slate-800 truncate text-right">
              {patient.attendingDoctor || "Attending Clinician"}
            </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 sm:gap-2">
            <span className="flex items-center space-x-1.5 text-slate-500 shrink-0 w-full sm:w-auto">
              <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Location:</span>
            </span>
              <span className="font-semibold text-teal-900 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono shrink-0 w-fit">
              {patient.bedNumber || "Unassigned"} • {patient.ward || "General"}
            </span>
            </div>

            <div className="flex items-center justify-between gap-2">
            <span className="flex items-center space-x-1.5 text-slate-500 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Admitted:</span>
            </span>
              <span className="text-slate-700 truncate text-right">
              {patient.admittedDate || "Recently"}
            </span>
            </div>
          </div>
        </div>

        {/* Bottom Vitals Strip & Open Link */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="text-[11px] sm:text-xs">
            <p className="font-bold font-mono text-slate-900 truncate">
              {patient.vitalsSummary || "BP 142/88 • HR 92"}
            </p>
            <p className="text-[9px] sm:text-[10px] text-rose-600 font-semibold font-mono truncate">
              {patient.vitalsStatus || "Telemetry Active"}
            </p>
          </div>

          <div className="flex items-center space-x-1 text-[11px] sm:text-xs font-bold text-teal-700 group-hover:text-teal-900 transition self-end sm:self-auto shrink-0">
            <span>Open Patient</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
  );
};