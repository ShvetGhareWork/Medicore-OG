"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
  RefreshCw,
  Printer,
  QrCode,
  ShieldAlert,
  ChevronRight,
  User,
  HeartPulse,
  ClipboardList,
  AlertCircle,
  FilePlus2,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import { LatestVitalsCard } from "@/components/clinical/LatestVitalsCard";
import { ActiveDiagnosesCard } from "@/components/clinical/ActiveDiagnosesCard";
import { MedicationsCard } from "@/components/clinical/MedicationsCard";
import { NewOrderModal } from "@/components/clinical/NewOrderModal";
import { NurseFlagModal } from "@/components/clinical/NurseFlagModal";
import {
  clinicalApi,
  ClinicalOverview,
  PatientSummary,
} from "@/lib/api/clinicalApi";

export default function PatientOverviewPage({
                                              params,
                                            }: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const [overview, setOverview] = useState<ClinicalOverview | null>(null);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, livePatient] = await Promise.all([
        clinicalApi.getPatientOverview(patientId).catch(() => null),
        clinicalApi.getPatientDetails(patientId).catch(() => null),
      ]);

      if (data) setOverview(data);

      if (livePatient) {
        setPatient(livePatient);
      } else {
        setPatient({
          id: patientId,
          firstName: "Patient",
          lastName: patientId,
          dateOfBirth: "1985-05-14",
          gender: "M",
          bloodGroup: "O+",
          roomNumber: "General",
          bedNumber: "Bed #01",
          ward: "Inpatient Care",
          allergies: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const encounterId = overview?.activeEncounterId || "d0e1f2a3-b4c5-6789-0123-456789abcdef";

  const navTabs = [
    { label: "Overview", href: `/terminal/workspace/patient/${patientId}/overview`, active: true },
    { label: "Assessment", href: `/terminal/workspace/patient/${patientId}/notes` },
    { label: "Vitals", href: `/terminal/workspace/patient/${patientId}/vitals` },
    { label: "Orders", href: `/terminal/workspace/patient/${patientId}/orders` },
    { label: "Notes", href: `/terminal/workspace/patient/${patientId}/notes` },
    { label: "Discharge", href: `/terminal/workspace/patient/${patientId}/overview` },
  ];

  return (
      <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 flex-col md:flex-row">
        <ClinicalSidebar patientId={patientId} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ClinicalTopBar
              patient={patient}
              precautions={overview?.precautions}
              allergies={overview?.allergies}
              encounterStatus={overview?.encounterStatus}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              onOpenFlagModal={() => setIsFlagModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
            {/* Top Breadcrumb & Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Link href="/terminal/workspace/patient-search" className="hover:text-teal-700 whitespace-nowrap">
                  Patient Search
                </Link>
                <span>›</span>
                <span className="font-bold text-slate-900 whitespace-nowrap">
                {patient?.fullName || `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Patient'}
              </span>
                <span className="font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                #{patient?.id || patientId}
              </span>
                <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="whitespace-nowrap">{patient?.statusBadge || "Under Care"}</span>
              </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <Link
                    href={`/terminal/workspace/patient/${patientId}/vitals`}
                    className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition w-full sm:w-auto"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="whitespace-nowrap">+ Add Vitals</span>
                </Link>

                <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition w-full sm:w-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="whitespace-nowrap">New Order</span>
                </button>

                <Link
                    href={`/terminal/workspace/patient/${patientId}/notes`}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-md shadow-[#004d40]/20 transition w-full sm:w-auto"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">+ Add Note</span>
                </Link>
              </div>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-hide w-full">
              {navTabs.map((tab) => (
                  <Link
                      key={tab.label}
                      href={tab.href}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                          tab.active
                              ? "bg-[#004d40] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    <span>{tab.label}</span>
                  </Link>
              ))}
            </div>

            {/* 2-Column Main Patient Chart Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
              {/* Left 4 Cols: Patient Demographics & Identification Card */}
              <div className="lg:col-span-4 space-y-4 md:space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-6 shadow-xs space-y-5">
                  {/* Avatar & Patient Name */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 font-black text-lg flex items-center justify-center shrink-0 border border-blue-200">
                      {(patient?.firstName?.[0] || "P") + (patient?.lastName?.[0] || "")}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 leading-tight">
                        {patient?.fullName || `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Patient'}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {patient?.age || '35y'} • {patient?.gender || 'Unknown'} • <span className="text-rose-600 font-bold whitespace-nowrap">🫀 {patient?.bloodGroup || 'O+'}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        DOB: {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Severe Allergies Red Flagged Box */}
                  <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-bold text-rose-800">
                    <span className="flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>SEVERE ALLERGIES</span>
                    </span>
                      <span className="font-mono text-[9px] bg-rose-200/80 text-rose-900 px-1.5 py-0.2 rounded font-bold uppercase">
                      EHR Flagged
                    </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {patient?.allergies && patient.allergies.length > 0 ? (
                          patient.allergies.map((a, i) => (
                              <span key={i} className="text-xs font-bold bg-white text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg shadow-xs">
                          {a.allergen} ({a.reaction || a.severity})
                        </span>
                          ))
                      ) : (
                          <span className="text-xs font-medium text-slate-500 italic">
                        No known drug allergies (NKDA) recorded
                      </span>
                      )}
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-3 pt-2 text-xs border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-medium">BED / WARD</span>
                      <span className="font-bold text-slate-900 font-mono">
                      {patient?.bedNumber || 'Unassigned'} • {patient?.ward || 'General Ward'}
                    </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-medium">ATTENDING CLINICIAN</span>
                      <span className="font-bold text-slate-900">
                      {patient?.attendingDoctor || 'Attending Physician'}
                    </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-medium">ADMISSION</span>
                      <span className="font-bold text-slate-900">
                      {patient?.admissionDate || 'Recently'}
                    </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-medium">CODE STATUS</span>
                      <span className="font-bold font-mono text-[10px] bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full uppercase w-fit">
                      FULL CODE
                    </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Emergency Contact
                    </span>
                      <p className="font-bold text-slate-900">
                        {patient?.emergencyContactName || 'None listed'}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px]">
                        {patient?.emergencyContactPhone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition">
                      <Printer className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Print Bedside Wristband</span>
                    </button>

                    <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition">
                      <QrCode className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Verify Bedside Barcode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 8 Cols: Active Precautions, Vitals, Diagnoses, Medications */}
              <div className="lg:col-span-8 space-y-4 md:space-y-6">
                {/* Active Clinical Precautions Banner */}
                <div className="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-4 md:p-5 shadow-xs space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-rose-800 font-black text-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Active Clinical Precautions</span>
                    </div>
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-rose-600 text-white uppercase w-fit">
                    HIGH VIGILANCE
                  </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs space-y-1 flex flex-col justify-between">
                      <div className="flex items-start space-x-1.5 text-xs font-bold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>Allergy: Penicillin</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Severe anaphylaxis risk. Strict contraindication.
                      </p>
                    </div>

                    <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs space-y-1 flex flex-col justify-between">
                      <div className="flex items-start space-x-1.5 text-xs font-bold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>Fall Risk (High)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Morse Scale: 65. Bed alarm armed & 2-person assist.
                      </p>
                    </div>

                    <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-xs space-y-1 flex flex-col justify-between sm:col-span-2 xl:col-span-1">
                      <div className="flex items-start space-x-1.5 text-xs font-bold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>NPO After Midnight</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Prep for Cardiac Catheterization @ 08:30 tomorrow.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Latest Vitals */}
                <LatestVitalsCard
                    vitals={overview?.latestVitals}
                    recordedAt={overview?.vitalsRecordedAt}
                    onRecordNew={() => setIsOrderModalOpen(true)}
                />

                {/* Active Conditions & Diagnoses */}
                <ActiveDiagnosesCard
                    diagnoses={overview?.activeDiagnoses || []}
                    onAddDiagnosis={() => setIsOrderModalOpen(true)}
                />

                {/* Current Inpatient Medications (eMAR) */}
                <MedicationsCard
                    medications={overview?.activeMedications || []}
                    patientId={patientId}
                    onOrderMedication={() => setIsOrderModalOpen(true)}
                />
              </div>
            </div>
          </main>
        </div>

        <NewOrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            encounterId={encounterId}
            patientId={patientId}
            allergies={overview?.allergies}
            onOrderCreated={loadData}
        />

        <NurseFlagModal
            isOpen={isFlagModalOpen}
            onClose={() => setIsFlagModalOpen(false)}
            encounterId={encounterId}
            patientId={patientId}
            onFlagCreated={loadData}
        />
      </div>
  );
}