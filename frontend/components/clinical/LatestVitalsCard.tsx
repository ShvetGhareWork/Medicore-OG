"use client";

import React from "react";
import { Heart, Activity, Wind, Thermometer, Clock, ShieldCheck } from "lucide-react";

interface LatestVitalsCardProps {
  vitals?: any;
  recordedAt?: string;
  onRecordNew?: () => void;
}

export const LatestVitalsCard: React.FC<LatestVitalsCardProps> = ({
  vitals,
  recordedAt,
  onRecordNew,
}) => {
  const hr = vitals?.heartRate || 102;
  const bp = vitals?.bloodPressure || "150/95";
  const spo2 = vitals?.spo2 || 94;
  const temp = vitals?.temperature || 99.1;
  const rr = vitals?.respiratoryRate || 20;
  const gcs = vitals?.gcs || 15;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-teal-50 text-teal-700">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Latest Vitals</h4>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span>Updated 12 min ago (14:48 Bedside Telemetry)</span>
          </span>

          {onRecordNew && (
            <button
              onClick={onRecordNew}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 px-2 py-1"
            >
              + Record Vitals
            </button>
          )}
        </div>
      </div>

      {/* Grid of Vitals Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Blood Pressure */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">BP</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-600 text-white uppercase">
              High
            </span>
          </div>
          <div className="text-xl font-black font-mono text-rose-600 tracking-tight">
            {bp}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">mmHg - Stage 2</div>
        </div>

        {/* Heart Rate */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">Heart Rate</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-600 text-white uppercase">
              Tachy
            </span>
          </div>
          <div className="text-xl font-black font-mono text-rose-600 tracking-tight">
            {hr}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">bpm - Sinus Tachy</div>
        </div>

        {/* SpO2 */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">SpO2</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-700 text-white uppercase">
              Borderline
            </span>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 tracking-tight">
            {spo2}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium">on 2L NC</div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">Temp</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase">
              Stable
            </span>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 tracking-tight">
            {temp}°F
          </div>
          <div className="text-[10px] text-slate-500 font-medium">37.3°C - Oral</div>
        </div>

        {/* Resp Rate */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">Resp Rate</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase">
              Stable
            </span>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 tracking-tight">
            {rr}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">breaths/min</div>
        </div>

        {/* GCS */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono text-slate-500">GCS</span>
            <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-teal-600 text-white uppercase">
              Optimal
            </span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-700 tracking-tight">
            {gcs}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">E4 V5 M6 [Alert]</div>
        </div>
      </div>
    </div>
  );
};
