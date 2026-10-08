"use client";

import React, { useState, useEffect, use } from "react";
import {
  HeartPulse,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Plus,
  Save,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import {
  clinicalApi,
  ClinicalEntry,
  ClinicalOverview,
  PatientSummary,
} from "@/lib/api/clinicalApi";

export default function PatientVitalsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = use(params);

  const [vitalsList, setVitalsList] = useState<ClinicalEntry[]>([]);
  const [overview, setOverview] = useState<ClinicalOverview | null>(null);
  const [patient, setPatient] = useState<PatientSummary | null>(null);

  // Form states
  const [heartRate, setHeartRate] = useState("78");
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [spo2, setSpo2] = useState("98");
  const [temperature, setTemperature] = useState("98.6");
  const [respRate, setRespRate] = useState("16");
  const [painScore, setPainScore] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [overviewData, entriesData] = await Promise.all([
        clinicalApi.getPatientOverview(patientId).catch(() => null),
        clinicalApi.getEntriesByPatient(patientId, "VITALS_SIGN").catch(() => []),
      ]);

      if (overviewData) setOverview(overviewData);
      setVitalsList(entriesData);

      setPatient({
        id: patientId,
        firstName: "Eleanor",
        lastName: "Vance",
        dateOfBirth: "1968-04-12",
        gender: "F",
        bloodGroup: "A+",
        roomNumber: "ICU-04",
        bedNumber: "Bed 02",
        ward: "ICU",
        allergies: overviewData?.allergies || [],
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const encounterId = overview?.activeEncounterId || "d0e1f2a3-b4c5-6789-0123-456789abcdef";

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSavedSuccess(false);

    const bp = `${systolic}/${diastolic}`;
    const contentJson = {
      heartRate: Number(heartRate),
      bloodPressure: bp,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      spo2: Number(spo2),
      temperature: Number(temperature),
      respiratoryRate: Number(respRate),
      painScore: Number(painScore),
    };

    try {
      const idempotencyKey = `vitals-${encounterId}-${Date.now()}`;
      await clinicalApi.createEntry(
        {
          encounterId,
          patientId,
          entryType: "VITALS_SIGN",
          contentJson,
          autoSign: true,
        },
        idempotencyKey
      );

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <ClinicalSidebar patientId={patientId} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClinicalTopBar
          patient={patient}
          precautions={overview?.precautions}
          allergies={overview?.allergies}
          encounterStatus={overview?.encounterStatus}
        />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Patient Vital Signs & Hemodynamics
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Record bedside vitals and monitor physiological trends over time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Entry Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 mb-5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Record Bedside Vitals</h3>
              </div>

              {savedSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Vitals recorded and saved successfully</span>
                </div>
              )}

              <form onSubmit={handleRecordVitals} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      required
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Oxygen SpO2 (%)
                    </label>
                    <input
                      type="number"
                      required
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      BP Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      BP Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Temp (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resp (/min)
                    </label>
                    <input
                      type="number"
                      required
                      value={respRate}
                      onChange={(e) => setRespRate(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pain (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={painScore}
                      onChange={(e) => setPainScore(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-sm transition disabled:opacity-50 mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Vitals Entry</span>
                </button>
              </form>
            </div>

            {/* Historical Trend Table */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
                <Clock className="w-4 h-4 text-[#004d40]" />
                <h3 className="text-sm font-bold text-slate-900">Vitals History Log</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] uppercase bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Recorded Time</th>
                      <th className="py-2.5 px-3">HR</th>
                      <th className="py-2.5 px-3">BP</th>
                      <th className="py-2.5 px-3">SpO2</th>
                      <th className="py-2.5 px-3">Temp</th>
                      <th className="py-2.5 px-3">Resp</th>
                      <th className="py-2.5 px-3">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {vitalsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                          No historical vitals recorded yet.
                        </td>
                      </tr>
                    ) : (
                      vitalsList.map((entry) => {
                        const data = entry.contentJson || {};
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3 text-slate-600 font-sans">
                              {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-2.5 px-3 text-rose-600 font-bold">{data.heartRate || "--"}</td>
                            <td className="py-2.5 px-3 text-[#004d40] font-bold">{data.bloodPressure || "--"}</td>
                            <td className="py-2.5 px-3 text-sky-700 font-bold">{data.spo2 ? `${data.spo2}%` : "--"}</td>
                            <td className="py-2.5 px-3 text-amber-700 font-bold">{data.temperature ? `${data.temperature}°F` : "--"}</td>
                            <td className="py-2.5 px-3 text-slate-700 font-bold">{data.respiratoryRate || "--"}</td>
                            <td className="py-2.5 px-3 text-slate-500 font-sans">{entry.authorName}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
