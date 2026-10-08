"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  Save,
  Clock,
  History,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Bold,
  Italic,
  List,
  Quote,
  Zap,
  Copy,
  ChevronDown,
  Trash2,
  Lock,
  Search,
  BookOpen,
} from "lucide-react";
import { ClinicalEntry, clinicalApi } from "@/lib/api/clinicalApi";

interface SOAPNoteEditorProps {
  encounterId: string;
  patientId: string;
  previousNotes: ClinicalEntry[];
  onNoteSaved: () => void;
}

export const SOAPNoteEditor: React.FC<SOAPNoteEditorProps> = ({
  encounterId,
  patientId,
  previousNotes,
  onNoteSaved,
}) => {
  const [subjective, setSubjective] = useState(
    "Patient reports feeling significantly better this morning with minimal chest discomfort (1/10 resting, down from 6/10 yesterday). Denies shortness of breath, palpitation, or diaphoresis while sitting. Mild fatigue noted after morning ambulation to the bathroom. Slept 6 hours without orthopnea."
  );
  const [objective, setObjective] = useState(
    "Vitals (10:00 AM): BP 128/82 mmHg, HR 74 bpm (NSR on telemetry), SpO2 98% on room air, RR 16/min, Temp 98.6°F.\nCardiovascular: S1/S2 present, regular rhythm, no murmurs, rubs, or gallops. Femoral access site clean, dry, no hematoma or bruit. Distal pedal pulses 2+ bilaterally.\nLungs: Clear to auscultation bilaterally, no crackles or wheezing."
  );
  const [assessment, setAssessment] = useState(
    "58yo male Day 3 s/p STEMI (PCI with DES to LAD). Clinical status improving and stable. Hemodynamically normal on medical therapy. No signs of post-infarction angina, heart failure decompensation, or reperfusion arrhythmias."
  );
  const [plan, setPlan] = useState(
    "1. Continue dual antiplatelet therapy (Aspirin 81mg daily + Ticagrelor 90mg BID).\n2. Continue Metoprolol Succinate 25mg daily, Atorvastatin 80mg QHS, Lisinopril 5mg daily.\n3. Advance diet to cardiac prudent, low sodium. Encourage hallway ambulation with telemetry monitoring."
  );

  const [activeHistoryTab, setActiveHistoryTab] = useState<"ALL" | "DOCTOR" | "NURSE">("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Amend state
  const [amendingNote, setAmendingNote] = useState<ClinicalEntry | null>(null);
  const [amendReason, setAmendReason] = useState("");

  const handleStartAmend = (note: ClinicalEntry) => {
    setAmendingNote(note);
    setSubjective(note.contentJson?.subjective || "");
    setObjective(note.contentJson?.objective || "");
    setAssessment(note.contentJson?.assessment || "");
    setPlan(note.contentJson?.plan || "");
    setAmendReason("");
  };

  const handleCancelAmend = () => {
    setAmendingNote(null);
    setAmendReason("");
  };

  const handleSave = async (autoSign: boolean) => {
    if (!subjective && !objective && !assessment && !plan) {
      setError("Please fill in at least one section of the SOAP note");
      return;
    }

    if (amendingNote && !amendReason) {
      setError("Please provide a reason for amending this signed note");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const contentJson = {
      subjective,
      objective,
      assessment,
      plan,
    };

    try {
      if (amendingNote) {
        await clinicalApi.amendEntry(amendingNote.id, {
          contentJson,
          correctionReason: amendReason,
          autoSign,
        });
        setSuccessMsg("Amended clinical note appended successfully");
        setAmendingNote(null);
      } else {
        const idempotencyKey = `soap-${encounterId}-${Date.now()}`;
        await clinicalApi.createEntry(
          {
            encounterId,
            patientId,
            entryType: "SOAP_NOTE",
            contentJson,
            autoSign,
          },
          idempotencyKey
        );
        setSuccessMsg(
          autoSign ? "Clinical SOAP note signed and saved" : "SOAP draft saved successfully"
        );
      }

      onNoteSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save SOAP note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockTimeline = [
    {
      id: "note-1",
      date: "13 Mar 2026, 17:30",
      role: "DOCTOR",
      title: "Evening Progress Note (SOAP)",
      author: "Dr. A. Verma (Cardiology Fellow)",
      s: "Pt comfortable, denies angina post afternoon ambulation.",
      o: "BP 132/84, HR 78 NSR. Access site benign.",
      a: "Post-PCI Day 2, clinical course uncomplicated.",
      p: "Bedtime telemetry review, hold NTG PRN.",
    },
    {
      id: "note-2",
      date: "13 Mar 2026, 07:15",
      role: "NURSE",
      title: "Shift Handover & Vitals Note",
      author: "Nurse S. Raman, RN",
      s: "Night shift uneventful. Slept well. Telemetry monitored continuously, no ectopy noted.",
      code: "#N-8942",
    },
    {
      id: "note-3",
      date: "12 Mar 2026, 21:00",
      role: "DOCTOR",
      title: "Post-Procedure Note (Cardiac Cath)",
      author: "Dr. Meera Iyer (Attending)",
      s: "Successful DES placement to mid-LAD, TIMI 3 flow restored. Access via right radial artery.",
      code: "#DOC-4411",
    },
    {
      id: "note-4",
      date: "12 Mar 2026, 11:20",
      role: "DOCTOR",
      title: "Initial Admission Assessment",
      author: "Dr. Meera Iyer (Attending)",
      s: "Acute coronary syndrome presentation with retrosternal crushing pain. Direct catheterization...",
      code: "#DOC-4390",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 8 Cols: SOAP Editor */}
      <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Editor Title & Fast Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  {amendingNote ? "Amend Progress Note" : "New Progress Note"}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  SOAP Format
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Auto-saving enabled</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {}}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Pull Vitals & Labs</span>
            </button>

            <button
              onClick={() => {}}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Copy className="w-3.5 h-3.5 text-teal-600" />
              <span>Copy Previous Note</span>
            </button>
          </div>
        </div>

        {/* Author banner */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span>Author: </span>
            <strong className="text-slate-900">Dr. Meera Iyer, Cardiology</strong>
            <span> • 14 Mar 2026, 10:42 AM</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-teal-900 bg-teal-100/80 border border-teal-200 px-2 py-0.5 rounded-lg">
            Encounter: Inpatient Day 3 (Post-PCI Care)
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {amendingNote && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
            <label className="block text-xs font-bold text-amber-900">
              Correction / Amendment Reason <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={amendReason}
              onChange={(e) => setAmendReason(e.target.value)}
              placeholder="e.g., Corrected telemetry findings and updated medication titration plan"
              className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        )}

        {/* 4 SOAP Blocks */}
        <div className="space-y-5">
          {/* Subjective */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#004d40] text-white font-black text-xs flex items-center justify-center">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Subjective</h4>
                  <p className="text-[10px] text-slate-400">Patient's reported symptoms, complaints, and pain assessment</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-slate-400 text-xs">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-700 font-bold"><Bold className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-700"><List className="w-3.5 h-3.5" /></button>
                <button className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold ml-2">
                  <span>Quick Phrases</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-teal-600 resize-none font-sans"
            />
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#004d40] text-white font-black text-xs flex items-center justify-center">
                  O
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Objective</h4>
                  <p className="text-[10px] text-slate-400">Vital signs, physical exam findings, telemetry, lab values</p>
                </div>
              </div>

              <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-200/80">
                <span>+ Insert Vitals Macro</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-teal-600 resize-none font-sans"
            />
          </div>

          {/* Assessment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#004d40] text-white font-black text-xs flex items-center justify-center">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Assessment</h4>
                  <p className="text-[10px] text-slate-400">Clinical synthesis, diagnosis progress, differential</p>
                </div>
              </div>

              <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200">
                <span>🔗 Link ICD-10 (I21.09)</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-teal-600 resize-none font-sans"
            />
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#004d40] text-white font-black text-xs flex items-center justify-center">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Plan</h4>
                  <p className="text-[10px] text-slate-400">Orders, medications, therapy, consultations, and discharge targets</p>
                </div>
              </div>
            </div>

            <textarea
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-teal-600 resize-none font-sans"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Draft auto-saved 1 min ago (10:43 AM)</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                setSubjective("");
                setObjective("");
                setAssessment("");
                setPlan("");
              }}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(true)}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-md shadow-[#004d40]/20 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{amendingNote ? "Sign and Save Amendment" : "Sign and Save Note"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right 4 Cols: Note History & Lab Trends */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-teal-700" />
              <h4 className="text-sm font-bold text-slate-900">Note History (8)</h4>
            </div>
            <button className="text-xs font-bold text-teal-700 hover:text-teal-900">
              Expand All
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes, keywords, ICD..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            {(["All Notes (8)", "Doctor (5)", "Nurse (3)"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  tab.startsWith("All")
                    ? "bg-[#004d40] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* History Cards */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {mockTimeline.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-bold text-slate-700">
                    {item.date}
                  </span>
                  <span
                    className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded uppercase ${
                      item.role === "DOCTOR"
                        ? "bg-teal-100 text-teal-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.author}</p>
                </div>

                {item.s && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 line-clamp-2">
                    {item.s}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-500 font-mono text-[10px]">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Signed & Locked</span>
                  </span>

                  <button className="text-xs font-bold text-teal-700 hover:underline">
                    View Full →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dossier button */}
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Open Full Clinical Dossier</span>
          </button>
        </div>

        {/* Troponin I Trend visualization */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900">Troponin I Trend (ng/mL)</h5>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Resolving
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="space-y-1">
              <div className="h-16 bg-rose-500 rounded-lg flex items-end justify-center p-1">
                <span className="text-[10px] font-bold text-white font-mono">0.72</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">ADM</p>
            </div>

            <div className="space-y-1">
              <div className="h-10 bg-teal-400 rounded-lg flex items-end justify-center p-1 mt-6">
                <span className="text-[10px] font-bold text-slate-900 font-mono">0.40</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">D1</p>
            </div>

            <div className="space-y-1">
              <div className="h-5 bg-teal-700 rounded-lg flex items-end justify-center p-1 mt-11">
                <span className="text-[10px] font-bold text-white font-mono">0.12</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">D3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
