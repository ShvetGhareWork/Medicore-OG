"use client";

import React, { useState, useEffect, use } from "react";
import {
  AlertTriangle,
  PlusCircle,
  CheckCircle,
  Clock,
  ShieldCheck,
  User,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import { NurseFlagModal } from "@/components/clinical/NurseFlagModal";
import {
  clinicalApi,
  NurseFlag,
  ClinicalOverview,
  PatientSummary,
} from "@/lib/api/clinicalApi";

export default function PatientFlagsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const [flags, setFlags] = useState<NurseFlag[]>([]);
  const [overview, setOverview] = useState<ClinicalOverview | null>(null);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

  const loadData = async () => {
    try {
      const [overviewData, openFlagsData, livePatient] = await Promise.all([
        clinicalApi.getPatientOverview(patientId).catch(() => null),
        clinicalApi.getOpenFlags(patientId).catch(() => []),
        clinicalApi.getPatientDetails(patientId).catch(() => null),
      ]);

      if (overviewData) setOverview(overviewData);
      setFlags(openFlagsData);

      if (livePatient) {
        setPatient(livePatient);
      } else {
        setPatient({
          id: patientId,
          firstName: "Patient",
          lastName: patientId,
          dateOfBirth: "1985-04-12",
          gender: "F",
          bloodGroup: "O+",
          roomNumber: "General",
          bedNumber: "Bed 01",
          ward: "Inpatient Care",
          allergies: overviewData?.allergies || [],
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const handleAcknowledge = async (flagId: string) => {
    try {
      await clinicalApi.acknowledgeNurseFlag(flagId);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (flagId: string) => {
    try {
      await clinicalApi.resolveNurseFlag(flagId, {
        resolutionNotes: "Evaluated and verified normal parameters",
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFlags = flags.filter((f) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "OPEN") return f.status === "OPEN" || f.status === "ACKNOWLEDGED";
    return f.status === "RESOLVED" || f.status === "DISMISSED";
  });

  const encounterId = overview?.activeEncounterId || "d0e1f2a3-b4c5-6789-0123-456789abcdef";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <ClinicalSidebar patientId={patientId} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClinicalTopBar
          patient={patient}
          precautions={overview?.precautions}
          allergies={overview?.allergies}
          encounterStatus={overview?.encounterStatus}
          onOpenFlagModal={() => setIsFlagModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Nurse Flags & Clinical Escalation Alerts
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time nursing notifications, abnormal findings, and physician response workflows
              </p>
            </div>

            <button
              onClick={() => setIsFlagModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition self-start"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise New Flag</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2">
            {[
              { id: "ALL", label: "All Alerts" },
              { id: "OPEN", label: "Open & Pending" },
              { id: "RESOLVED", label: "Resolved" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#004d40] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Flags List */}
          <div className="space-y-4">
            {filteredFlags.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900">No active alerts</h3>
                <p className="text-xs text-slate-500 mt-1">
                  All clinical flags for this patient are resolved.
                </p>
              </div>
            ) : (
              filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        flag.severity === "CRITICAL"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : flag.severity === "HIGH"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-teal-50 text-teal-700 border border-teal-200"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                            flag.severity === "CRITICAL"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : flag.severity === "HIGH"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-teal-50 text-teal-800 border-teal-200"
                          }`}
                        >
                          {flag.severity}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {flag.flagType.replace("_", " ")}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {flag.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700">{flag.message}</p>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span>Reported by {flag.nurseName}</span>
                        <span>•</span>
                        <span>{new Date(flag.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-center">
                    {flag.status === "OPEN" && (
                      <button
                        onClick={() => handleAcknowledge(flag.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    {flag.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleResolve(flag.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-xs transition"
                      >
                        Resolve Flag
                      </button>
                    )}
                    {flag.status === "RESOLVED" && (
                      <span className="flex items-center space-x-1 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

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
