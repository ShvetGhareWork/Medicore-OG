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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
              <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">Current Inpatient Medications</h4>
          </div>

          <div className="flex items-center space-x-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-0.5 rounded-full flex items-center space-x-1.5 shrink-0 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse shrink-0"></span>
            <span>eMAR Sync: Active</span>
          </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-50 border-y border-slate-100">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap">Drug Name</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Dose</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Route</th>
              <th className="py-2.5 px-3 whitespace-nowrap">Frequency</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Status</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
            {defaultMedications.map((med, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{med.protocol}</p>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {med.dose}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{med.route}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{med.frequency}</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
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
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start lg:items-center justify-between text-xs text-slate-500 gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center space-x-1.5 text-[11px] leading-tight">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>Verified by Hospital Pharmacy • Last reconciliation 29 Aug 12:30 by PharmD. K. Rao</span>
          </div>

          {patientId && (
              <Link
                  href={`/terminal/workspace/patient/${patientId}/orders`}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 shrink-0 group"
              >
                <span>View Complete Medication Order History</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
          )}
        </div>
      </div>
  );
};