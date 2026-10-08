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
      className="group block bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-teal-600/50 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3.5">
            <div
              className={`w-12 h-12 rounded-2xl border font-bold text-sm flex items-center justify-center shadow-xs shrink-0 ${getAvatarStyle(
                patient.firstName
              )}`}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition">
                  {patient.firstName} {patient.lastName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {patient.age || "58y"} • {patient.gender === "F" ? "Female" : "Male"}
                {patient.bloodGroup && ` • ${patient.bloodGroup}`}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 ${
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
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "Critical" ? "bg-rose-500 animate-pulse" : "bg-current"
                }`}
              ></span>
              <span>{status}</span>
            </span>
          </div>
        </div>

        {/* Patient ID Code & Bed Monitor Row */}
        <div className="flex items-center justify-between text-[11px] font-mono mt-3.5 text-slate-500">
          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {patient.patientIdCode || `MC-${patient.id.substring(0, 5).toUpperCase()}`}
          </span>
          <span>{patient.monitorLabel || "CCU Bedside Monitor #2"}</span>
        </div>

        {/* Primary Diagnosis Box */}
        <div className="mt-3.5 bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Primary Diagnosis</span>
          </div>
          <p className="text-xs font-bold text-slate-900 leading-snug">
            {patient.primaryDiagnosis || "Acute Myocardial Infarction (STEMI)"}
          </p>
        </div>

        {/* Attending & Location Metadata */}
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Attending:</span>
            </span>
            <span className="font-semibold text-slate-800">
              {patient.attendingDoctor || "Dr. Marcus Vance (Cardiology)"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>Location:</span>
            </span>
            <span className="font-semibold text-teal-900 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-lg text-[11px] font-mono">
              {patient.bedNumber || "Bed C-12"} • {patient.ward || "Cardiology"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Admitted:</span>
            </span>
            <span className="text-slate-700">
              {patient.admittedDate || "27 Aug 2026 (3d ago)"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Vitals Strip & Open Link */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs">
          <p className="font-bold font-mono text-slate-900">
            {patient.vitalsSummary || "BP 142/88 • HR 92"}
          </p>
          <p className="text-[10px] text-rose-600 font-semibold font-mono">
            {patient.vitalsStatus || "Telemetry Active"}
          </p>
        </div>

        <div className="flex items-center space-x-1 text-xs font-bold text-teal-700 group-hover:text-teal-900 transition">
          <span>Open Patient</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
