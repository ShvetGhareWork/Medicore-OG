"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  FileText,
  Activity,
  AlertTriangle,
  Heart,
  Wind,
  Plus,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import { SOAPNoteEditor } from "@/components/clinical/SOAPNoteEditor";
import {
  clinicalApi,
  ClinicalEntry,
  ClinicalOverview,
  PatientSummary,
} from "@/lib/api/clinicalApi";

export default function PatientNotesPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const [notes, setNotes] = useState<ClinicalEntry[]>([]);
  const [overview, setOverview] = useState<ClinicalOverview | null>(null);
  const [patient, setPatient] = useState<PatientSummary | null>(null);

  const loadData = async () => {
    try {
      const [overviewData, entriesData] = await Promise.all([
        clinicalApi.getPatientOverview(patientId).catch(() => null),
        clinicalApi.getEntriesByPatient(patientId, "SOAP_NOTE").catch(() => []),
      ]);

      if (overviewData) setOverview(overviewData);
      setNotes(entriesData);

      setPatient({
        id: patientId,
        firstName: "Rajesh",
        lastName: "Kulkarni",
        dateOfBirth: "1968-05-14",
        gender: "M",
        bloodGroup: "B+",
        roomNumber: "C-304",
        bedNumber: "Bed C-304",
        ward: "Cardiology Ward 3",
        allergies: [
          { allergen: "Penicillin", severity: "HIGH", reaction: "Anaphylaxis" },
          { allergen: "Sulfa", severity: "MEDIUM", reaction: "Severe Rash" },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const encounterId = overview?.activeEncounterId || "d0e1f2a3-b4c5-6789-0123-456789abcdef";

  const navTabs = [
    { label: "Overview", href: `/terminal/workspace/patient/${patientId}/overview` },
    { label: "Assessment", href: `/terminal/workspace/patient/${patientId}/notes` },
    { label: "Vitals", href: `/terminal/workspace/patient/${patientId}/vitals` },
    { label: "Orders", href: `/terminal/workspace/patient/${patientId}/orders` },
    { label: "Notes", href: `/terminal/workspace/patient/${patientId}/notes`, active: true },
    { label: "Discharge", href: `/terminal/workspace/patient/${patientId}/overview` },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      <ClinicalSidebar patientId={patientId} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClinicalTopBar
          patient={patient}
          precautions={overview?.precautions}
          allergies={overview?.allergies}
          encounterStatus={overview?.encounterStatus}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Top Patient Header Bar matching Screenshot 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center shrink-0 border border-blue-200">
                RK
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-slate-900">
                    Rajesh Kulkarni
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">58y M</span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    #MC-20481
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>Bed: <strong className="text-slate-700">C-304 (Cardiology Ward 3)</strong></span>
                  <span>•</span>
                  <span>Attending: <strong className="text-slate-700">Dr. Meera Iyer</strong></span>
                  <span>•</span>
                  <span>Adm: 12 Mar 2026 (Day 3)</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-[10px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded">
                    B+
                  </span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    <span>Allergy: Penicillin</span>
                  </span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500" />
                    <span>Allergy: Sulfa</span>
                  </span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                    Fall Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Vitals Telemetry strip */}
            <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 self-start lg:self-center">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">BP</span>
                <span className="text-xs font-black font-mono text-slate-900">142/88</span>
                <span className="text-[9px] text-slate-400 font-mono">mmHg</span>
              </div>
              <div className="text-center pl-3 border-l border-slate-200">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">HR</span>
                <span className="text-xs font-black font-mono text-slate-900">84</span>
                <span className="text-[9px] text-slate-400 font-mono">bpm</span>
              </div>
              <div className="text-center pl-3 border-l border-slate-200">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">SPO2</span>
                <span className="text-xs font-black font-mono text-slate-900">96</span>
                <span className="text-[9px] text-slate-400 font-mono">%</span>
              </div>
              <div className="text-center pl-3 border-l border-slate-200">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Telemetry</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>NSR</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            {navTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  tab.active
                    ? "bg-[#80eec0] text-[#082823] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>

          <SOAPNoteEditor
            encounterId={encounterId}
            patientId={patientId}
            previousNotes={notes}
            onNoteSaved={loadData}
          />
        </main>
      </div>
    </div>
  );
}
