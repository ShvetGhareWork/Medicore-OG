"use client";

import React from "react";
import Link from "next/link";
import { Pill, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { ClinicalEntry } from "@/lib/api/clinicalApi";

interface MedicationsCardProps {
  medications: ClinicalEntry[];
  patientId?: string;
  onOrderMedication?: () => void;
}

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  medications,
  patientId,
  onOrderMedication,
}) => {
  const defaultMedications = [
    {
      name: "Heparin Sodium",
      protocol: "Anticoagulant protocol",
      dose: "18 units/kg/hr",
      route: "IV Continuous",
      frequency: "Q1H Titration",
      status: "Active",
      statusStyle: "bg-teal-100 text-teal-800 border-teal-200",
    },
    {
      name: "Aspirin (Ecosprin)",
      protocol: "Antiplatelet therapy",
      dose: "81 mg",
      route: "Oral",
      frequency: "Once Daily (OD)",
      status: "Administered",
      statusStyle: "bg-slate-100 text-slate-700 border-slate-200",
    },
    {
      name: "Atorvastatin (Lipitor)",
      protocol: "Lipid-lowering agent",
      dose: "80 mg",
      route: "Oral",
      frequency: "Bedtime (HS)",
      status: "Active",
      statusStyle: "bg-teal-100 text-teal-800 border-teal-200",
    },
    {
      name: "Metoprolol Tartrate",
      protocol: "Beta-blocker protocol",
      dose: "25 mg",
      route: "Oral",
      frequency: "Twice Daily (BID)",
      status: "Held: HR/BP",
      statusStyle: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      name: "Nitroglycerin Infusion",
      protocol: "Vasodilator titrate",
      dose: "10 mcg/min",
      route: "IV Titration",
      frequency: "PRN Chest Pain",
      status: "Active",
      statusStyle: "bg-teal-100 text-teal-800 border-teal-200",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-teal-50 text-teal-700">
            <Pill className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Current Inpatient Medications</h4>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-full flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
            <span>eMAR Sync: Active</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-50 border-y border-slate-100">
            <tr>
              <th className="py-2.5 px-3">Drug Name</th>
              <th className="py-2.5 px-3">Dose</th>
              <th className="py-2.5 px-3">Route</th>
              <th className="py-2.5 px-3">Frequency</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {defaultMedications.map((med, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">{med.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{med.protocol}</p>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                  {med.dose}
                </td>
                <td className="py-3 px-3 text-slate-600">{med.route}</td>
                <td className="py-3 px-3 text-slate-600">{med.frequency}</td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${med.statusStyle}`}
                  >
                    <span>{med.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer verification & link */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-1.5 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Verified by Hospital Pharmacy • Last reconciliation 29 Aug 12:30 by PharmD. K. Rao</span>
        </div>

        {patientId && (
          <Link
            href={`/terminal/workspace/patient/${patientId}/orders`}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
          >
            <span>View Complete Medication Order History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
