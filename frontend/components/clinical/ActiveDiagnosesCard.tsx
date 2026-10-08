"use client";

import React from "react";
import { Activity, Plus, Stethoscope } from "lucide-react";
import { ClinicalEntry } from "@/lib/api/clinicalApi";

interface ActiveDiagnosesCardProps {
  diagnoses: ClinicalEntry[];
  onAddDiagnosis?: () => void;
}

export const ActiveDiagnosesCard: React.FC<ActiveDiagnosesCardProps> = ({
  diagnoses,
  onAddDiagnosis,
}) => {
  const defaultDiagnoses = [
    {
      id: "diag-1",
      title: "Acute Myocardial Infarction (STEMI)",
      icd10: "ICD-10: I21.0",
      description: "Anterior wall • Primary working diagnosis • Onset: 27 Aug 2026 (Emergency Cath Lab activated)",
      statusText: "Active / Critical",
      badgeStyle: "bg-rose-100 text-rose-800 border-rose-200",
    },
    {
      id: "diag-2",
      title: "Essential (Primary) Hypertension",
      icd10: "ICD-10: I10",
      description: "Chronic history (8+ years) • Monitored via arterial telemetry • Target SBP < 130 mmHg",
      statusText: "Chronic / Active",
      badgeStyle: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "diag-3",
      title: "Type 2 Diabetes Mellitus",
      icd10: "ICD-10: E11.9",
      description: "Controlled without acute complications • AC/HS fingersticks ordered",
      statusText: "Chronic / Controlled",
      badgeStyle: "bg-teal-100 text-teal-800 border-teal-200",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-teal-50 text-teal-700">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Active Conditions & Diagnoses</h4>
        </div>

        {onAddDiagnosis && (
          <button
            onClick={onAddDiagnosis}
            className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Diagnosis</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {defaultDiagnoses.map((diag) => (
          <div
            key={diag.id}
            className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <h5 className="text-sm font-bold text-slate-900">{diag.title}</h5>
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                  {diag.icd10}
                </span>
              </div>
              <p className="text-xs text-slate-500">{diag.description}</p>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 self-start border ${diag.badgeStyle}`}
            >
              {diag.statusText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
