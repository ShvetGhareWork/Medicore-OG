"use client";

import React, { useState, useEffect, use } from "react";
import {
  ClipboardList,
  Pill,
  FlaskConical,
  Scan,
  Scissors,
  PlusCircle,
  ShieldAlert,
  CheckCircle,
  Filter,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import { NewOrderModal } from "@/components/clinical/NewOrderModal";
import {
  clinicalApi,
  ClinicalEntry,
  ClinicalOverview,
  PatientSummary,
} from "@/lib/api/clinicalApi";

export default function PatientOrdersPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const [orders, setOrders] = useState<ClinicalEntry[]>([]);
  const [overview, setOverview] = useState<ClinicalOverview | null>(null);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewData, entriesData, livePatient] = await Promise.all([
        clinicalApi.getPatientOverview(patientId).catch(() => null),
        clinicalApi.getEntriesByPatient(patientId).catch(() => []),
        clinicalApi.getPatientDetails(patientId).catch(() => null),
      ]);

      if (overviewData) setOverview(overviewData);

      // Filter only order-type entries
      const orderEntries = entriesData.filter((e) =>
        ["PRESCRIPTION", "LAB_ORDER", "RADIOLOGY_ORDER", "PROCEDURE_NOTE"].includes(e.entryType)
      );
      setOrders(orderEntries);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "ALL") return true;
    return o.entryType === activeFilter;
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
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Physician Orders & Prescriptions
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Active medication orders, diagnostics, laboratory tests, and procedure requests
              </p>
            </div>

            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition self-start"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Order</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2">
            {[
              { id: "ALL", label: "All Orders" },
              { id: "PRESCRIPTION", label: "Medications (Rx)" },
              { id: "LAB_ORDER", label: "Lab Orders" },
              { id: "RADIOLOGY_ORDER", label: "Radiology" },
              { id: "PROCEDURE_NOTE", label: "Procedures" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeFilter === tab.id
                    ? "bg-[#004d40] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <ClipboardList className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No orders found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click &ldquo;Create New Order&rdquo; to place a prescription, lab, or imaging request.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const data = order.contentJson || {};
                const isRx = order.entryType === "PRESCRIPTION";
                const isLab = order.entryType === "LAB_ORDER";
                const isRad = order.entryType === "RADIOLOGY_ORDER";

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isRx
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : isLab
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : isRad
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isRx && <Pill className="w-5 h-5" />}
                        {isLab && <FlaskConical className="w-5 h-5" />}
                        {isRad && <Scan className="w-5 h-5" />}
                        {!isRx && !isLab && !isRad && <Scissors className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {isRx && `${data.medicationName} ${data.dosage}`}
                            {isLab && data.testName}
                            {isRad && `${data.modality} — ${data.bodyPart}`}
                            {!isRx && !isLab && !isRad && data.procedureName}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {order.entryType}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {isRx && (
                            <>
                              <span>Route: <strong className="text-slate-900">{data.route}</strong></span>
                              <span>•</span>
                              <span>Freq: <strong className="text-slate-900">{data.frequency}</strong></span>
                              <span>•</span>
                              <span>Duration: <strong className="text-slate-900">{data.duration}</strong></span>
                            </>
                          )}
                          {isLab && (
                            <>
                              <span>Priority: <strong className="text-slate-900">{data.priority}</strong></span>
                              {data.clinicalIndication && <span>• Indication: {data.clinicalIndication}</span>}
                            </>
                          )}
                          {isRad && (
                            <span>Reason: {data.clinicalReason || "Diagnostic evaluation"}</span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400">
                          Ordered by {order.authorName} • {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end md:self-center">
                      {data.allergyConflictAcknowledged && (
                        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Allergy Override</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Signed & Transmitted</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
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
    </div>
  );
}
