"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Send, AlertCircle } from "lucide-react";
import { clinicalApi } from "@/lib/api/clinicalApi";

interface NurseFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounterId: string;
  patientId: string;
  onFlagCreated: () => void;
}

export const NurseFlagModal: React.FC<NurseFlagModalProps> = ({
  isOpen,
  onClose,
  encounterId,
  patientId,
  onFlagCreated,
}) => {
  const [flagType, setFlagType] = useState("ABNORMAL_VITALS");
  const [severity, setSeverity] = useState("HIGH");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please describe the clinical concern or observation");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await clinicalApi.createNurseFlag({
        encounterId,
        patientId,
        flagType,
        severity,
        message,
      });

      onFlagCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to raise nurse flag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Raise Clinical Flag / Alert</h3>
              <p className="text-xs text-slate-500">
                Instantly notify attending physicians and nursing team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alert Category
            </label>
            <select
              value={flagType}
              onChange={(e) => setFlagType(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
            >
              <option value="ABNORMAL_VITALS">Abnormal Vital Signs</option>
              <option value="PATIENT_DETERIORATION">Patient Deterioration (Rapid Response)</option>
              <option value="CRITICAL_LAB_VALUE">Critical Laboratory Panic Value</option>
              <option value="ALLERGY_CONFLICT">Suspected Allergy / Medication Reaction</option>
              <option value="MEDICATION_CONCERN">Medication Timing / Dose Concern</option>
              <option value="FALL_RISK">Acute Fall / Mobility Risk</option>
              <option value="OTHER">Other Clinical Concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold tracking-wide border transition ${
                    severity === lvl
                      ? lvl === "CRITICAL"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : lvl === "HIGH"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-[#004d40] text-white border-[#004d40]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Observation / Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Blood pressure spiked to 195/110 with acute headache. Requested urgent doctor evaluation."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
