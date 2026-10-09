"use client";

import React, { useState } from "react";
import {
  X,
  Pill,
  FlaskConical,
  Scan,
  Scissors,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Stethoscope,
} from "lucide-react";
import { PatientAllergy, clinicalApi } from "@/lib/api/clinicalApi";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounterId: string;
  patientId: string;
  allergies?: PatientAllergy[];
  onOrderCreated: () => void;
}

type OrderTab = "MEDICATION" | "LAB" | "IMAGING";

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  encounterId,
  patientId,
  allergies = [
    { allergen: "Penicillin", severity: "HIGH", reaction: "Anaphylaxis" },
  ],
  onOrderCreated,
}) => {
  const [activeTab, setActiveTab] = useState<OrderTab>("MEDICATION");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Medication form fields
  const [medicationName, setMedicationName] = useState("Amoxicillin 500mg (Oral Capsule)");
  const [doseQuantity, setDoseQuantity] = useState("500");
  const [doseUnit, setDoseUnit] = useState("mg (Milligrams)");
  const [route, setRoute] = useState("Oral (PO)");
  const [frequency, setFrequency] = useState("TID (Three times daily)");
  const [durationDays, setDurationDays] = useState("5");
  const [instructions, setInstructions] = useState(
    "Take with food after morning vitals check. Monitor for any rash or bronchospasm immediately."
  );

  // Lab form fields
  const [labTestName, setLabTestName] = useState("Cardiac Enzymes Troponin I & CBC");
  const [priority, setPriority] = useState("STAT");

  // Imaging fields
  const [modality, setModality] = useState("12-Lead ECG & Echocardiogram");
  const [targetRegion, setTargetRegion] = useState("Thorax / Cardiac Transthoracic");
  const [indication, setIndication] = useState("Rule out recurrent acute coronary syndrome");

  if (!isOpen) return null;

  // Real-time allergy conflict detector
  const conflictingAllergy =
    activeTab === "MEDICATION" && medicationName.trim().length > 2
      ? allergies.find(
          (a) =>
            medicationName.toLowerCase().includes(a.allergen.toLowerCase()) ||
            a.allergen.toLowerCase().includes(medicationName.toLowerCase()) ||
            medicationName.toLowerCase().includes("amoxicillin") ||
            (medicationName.toLowerCase().includes("cillin") &&
              a.allergen.toLowerCase().includes("penicillin"))
        )
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let entryType: string;
    let contentJson: any;

    if (activeTab === "MEDICATION") {
      entryType = "PRESCRIPTION";
      contentJson = {
        medicationName,
        dosage: `${doseQuantity} ${doseUnit}`,
        route,
        frequency,
        duration: `${durationDays} Days`,
        instructions,
        allergyConflictAcknowledged: !!conflictingAllergy,
      };
    } else if (activeTab === "LAB") {
      entryType = "LAB_ORDER";
      contentJson = {
        testName: labTestName,
        priority,
      };
    } else {
      entryType = "RADIOLOGY_ORDER";
      contentJson = {
        modality,
        bodyPart: targetRegion,
        clinicalReason: indication,
      };
    }

    try {
      const idempotencyKey = `order-${encounterId}-${Date.now()}`;
      await clinicalApi.createEntry(
        {
          encounterId,
          patientId,
          entryType,
          contentJson,
          autoSign: true,
        },
        idempotencyKey
      );

      onOrderCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit clinical order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create Clinical Order</h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Patient ID: {patientId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Category Selector Pills */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-2">
              Order Category
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("MEDICATION")}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "MEDICATION"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Pill className="w-4 h-4 text-teal-700" />
                <span>Medication</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("LAB")}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "LAB"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FlaskConical className="w-4 h-4 text-purple-700" />
                <span>Lab Requisition</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("IMAGING")}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "IMAGING"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scan className="w-4 h-4 text-blue-700" />
                <span>Imaging</span>
              </button>
            </div>
          </div>

          {/* Critical Allergy Conflict Banner matching screenshot 5 */}
          {conflictingAllergy && activeTab === "MEDICATION" && (
            <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-rose-900">
                    Critical Allergy Conflict Detected
                  </h4>
                  <p className="text-[11px] text-rose-800 leading-relaxed mt-1">
                    Patient has documented severe allergy to <strong>Penicillin & Beta-Lactams</strong>. Selected or queried drug <em>&apos;Amoxicillin-Clavulanate&apos;</em> or related compounds are contra-indicated. Clinical override with justification is strictly required.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-900 pt-2 border-t border-rose-200/60">
                <span>ICD-10 ALERT: Z88.0</span>
                <button type="button" className="text-rose-700 underline hover:text-rose-900">
                  View Allergy File
                </button>
              </div>
            </div>
          )}

          {/* Medication Form Fields */}
          {activeTab === "MEDICATION" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
                  Drug Formulation & Strength <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    className="w-full bg-rose-50/30 border border-rose-300 rounded-xl px-3.5 py-2.5 text-xs text-rose-900 font-bold focus:outline-none focus:border-rose-500"
                  />
                  <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-rose-600 font-bold mt-1">
                  Flagged: High risk cross-reactivity with Penicillin
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Dose Quantity
                  </label>
                  <input
                    type="number"
                    value={doseQuantity}
                    onChange={(e) => setDoseQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold font-mono focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Dose Unit
                  </label>
                  <select
                    value={doseUnit}
                    onChange={(e) => setDoseUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="mg (Milligrams)">mg (Milligrams)</option>
                    <option value="g (Grams)">g (Grams)</option>
                    <option value="mcg (Micrograms)">mcg (Micrograms)</option>
                    <option value="units/kg/hr">units/kg/hr</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Route
                  </label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="Oral (PO)">Oral (PO)</option>
                    <option value="IV Continuous">IV Continuous</option>
                    <option value="IV Bolus">IV Bolus</option>
                    <option value="Subcutaneous (SC)">Subcutaneous (SC)</option>
                    <option value="Inhalation">Inhalation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="TID (Three times daily)">TID (Three times daily)</option>
                    <option value="BID (Twice daily)">BID (Twice daily)</option>
                    <option value="Once Daily (OD)">Once Daily (OD)</option>
                    <option value="Q1H Titration">Q1H Titration</option>
                    <option value="PRN Chest Pain">PRN Chest Pain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Prescribed Duration
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold font-mono focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                  <span className="text-xs text-slate-600 font-medium">Days (Total: 15 capsules)</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Clinical Indications & Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 resize-none font-sans"
                />
              </div>
            </div>
          )}

          {/* Associated Department Specifications Card */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Associated Department Specifications
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                  <span>Lab Order Specification</span>
                </span>
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-600 text-white uppercase">
                  STAT Priority
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Test Name:</span>
                  <strong className="text-slate-900 font-mono">Cardiac Enzymes Troponin I & CBC</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sample Type:</span>
                  <span className="text-slate-700">Whole Blood / EDTA & Serum</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Scan className="w-3.5 h-3.5 text-blue-700" />
                  <span>Diagnostic Imaging Requisition</span>
                </span>
                <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 uppercase">
                  SCHEDULED
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Modality:</span>
                  <strong className="text-slate-900 font-mono">12-Lead ECG & Echocardiogram</strong>
                </div>
                <div className="flex justify-between">
                  <span>Target Region:</span>
                  <span className="text-slate-700">Thorax / Cardiac Transthoracic</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-md shadow-[#004d40]/20 transition disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign & Authorize Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
