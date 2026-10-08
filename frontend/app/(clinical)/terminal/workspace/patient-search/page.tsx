"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Filter,
  RefreshCw,
  Download,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  ArrowUpDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { ClinicalSidebar } from "@/components/clinical/ClinicalSidebar";
import { ClinicalTopBar } from "@/components/clinical/ClinicalTopBar";
import { PatientCard } from "@/components/clinical/PatientCard";
import { clinicalApi } from "@/lib/api/clinicalApi";

const MOCK_INPATIENTS = [
  {
    id: "9fdc6aa6-4508-44c1-8a83-397d876972f9",
    firstName: "Rajesh",
    lastName: "Kulkarni",
    age: "58y",
    gender: "M",
    bloodGroup: "B+",
    patientIdCode: "MC-20481",
    monitorLabel: "CCU Bedside Monitor #2",
    statusBadge: "Critical" as const,
    primaryDiagnosis: "Acute Myocardial Infarction (STEMI)",
    attendingDoctor: "Dr. Marcus Vance (Cardiology)",
    bedNumber: "Bed C-12",
    ward: "Cardiology",
    admittedDate: "27 Aug 2026 (3d ago)",
    vitalsSummary: "BP 142/88 • HR 92",
    vitalsStatus: "Telemetry Active",
    openFlagsCount: 2,
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    firstName: "Sunita",
    lastName: "Patil",
    age: "44y",
    gender: "F",
    bloodGroup: "A+",
    patientIdCode: "MC-19842",
    monitorLabel: "Insulin Protocol #4",
    statusBadge: "Stable" as const,
    primaryDiagnosis: "Type 2 Diabetes Mellitus & DKA",
    attendingDoctor: "Dr. Priya Shah (Endocrinology)",
    bedNumber: "Bed C-07",
    ward: "General",
    admittedDate: "28 Aug 2026 (2d ago)",
    vitalsSummary: "Glu 148 mg/dL • SpO2 98%",
    vitalsStatus: "Postprandial Checked",
    openFlagsCount: 0,
  },
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    firstName: "Arjun",
    lastName: "Mehta",
    age: "67y",
    gender: "M",
    bloodGroup: "O+",
    patientIdCode: "MC-21054",
    monitorLabel: "High-Flow O2 Active",
    statusBadge: "Under Observation" as const,
    primaryDiagnosis: "Severe Bilateral Pneumonia (ARDS)",
    attendingDoctor: "Dr. Sarah Lin (Pulmonology)",
    bedNumber: "Bed ICU-03",
    ward: "ICU",
    admittedDate: "26 Aug 2026 (4d ago)",
    vitalsSummary: "FiO2 45% • SpO2 93%",
    vitalsStatus: "ABG Scheduled 14:00",
    openFlagsCount: 1,
  },
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    firstName: "Priya",
    lastName: "Nair",
    age: "32y",
    gender: "F",
    bloodGroup: "B-",
    patientIdCode: "MC-21390",
    monitorLabel: "Post-Op Day 2",
    statusBadge: "Pending Labs" as const,
    primaryDiagnosis: "Post-Appendectomy Recovery & Sepsis Workup",
    attendingDoctor: "Dr. Keith Bennett (Surgery)",
    bedNumber: "Bed G-15",
    ward: "General",
    admittedDate: "29 Aug 2026 (1d ago)",
    vitalsSummary: "WBC & Lactate Pending",
    vitalsStatus: "ETA Lab Results: 35 min",
    openFlagsCount: 0,
  },
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f90",
    firstName: "Vikram",
    lastName: "Joshi",
    age: "71y",
    gender: "M",
    bloodGroup: "AB+",
    patientIdCode: "MC-18923",
    monitorLabel: "NIHSS Score: 16",
    statusBadge: "Critical" as const,
    primaryDiagnosis: "Acute Ischemic Stroke (L MCA)",
    attendingDoctor: "Dr. Ananya Desai (Neurology)",
    bedNumber: "Bed ICU-06",
    ward: "ICU",
    admittedDate: "25 Aug 2026 (5d ago)",
    vitalsSummary: "BP 168/98 • GCS 11",
    vitalsStatus: "Neuro Checks Q1H",
    openFlagsCount: 2,
  },
  {
    id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9012",
    firstName: "Ananya",
    lastName: "Sharma",
    age: "9y",
    gender: "F",
    bloodGroup: "O+",
    patientIdCode: "MC-22105",
    monitorLabel: "Pediatric Observation",
    statusBadge: "Stable" as const,
    primaryDiagnosis: "Acute Viral Bronchiolitis",
    attendingDoctor: "Dr. Rahul Sharma (Pediatrics)",
    bedNumber: "Bed P-04",
    ward: "Pediatrics",
    admittedDate: "29 Aug 2026 (1d ago)",
    vitalsSummary: "Temp 37.8°C • SpO2 97%",
    vitalsStatus: "Nebulizer Tolerated Well",
    openFlagsCount: 0,
  },
];

export default function PatientSearchPage() {
  const [activeWard, setActiveWard] = useState<string>("All Wards");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patients, setPatients] = useState<any[]>(MOCK_INPATIENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLivePatients() {
      try {
        const fetched = await clinicalApi.getAllPatients();
        if (fetched && fetched.length > 0) {
          // Merge API patients if available
          const merged = fetched.map((p, idx) => ({
            ...MOCK_INPATIENTS[idx % MOCK_INPATIENTS.length],
            id: p.id,
            firstName: p.firstName || MOCK_INPATIENTS[idx % MOCK_INPATIENTS.length].firstName,
            lastName: p.lastName || MOCK_INPATIENTS[idx % MOCK_INPATIENTS.length].lastName,
          }));
          setPatients(merged);
        }
      } catch (e) {
        console.warn("Using default rich clinical roster");
      }
    }
    fetchLivePatients();
  }, []);

  const wardTabs = [
    { label: "All Wards", count: 57 },
    { label: "Cardiology", count: 14 },
    { label: "ICU", count: 8 },
    { label: "General", count: 26 },
    { label: "Pediatrics", count: 9 },
  ];

  const filteredPatients = patients.filter((p) => {
    const matchesWard =
      activeWard === "All Wards" ||
      (p.ward && p.ward.toLowerCase() === activeWard.toLowerCase());

    const matchesSearch =
      searchQuery === "" ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.patientIdCode && p.patientIdCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.bedNumber && p.bedNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.primaryDiagnosis && p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesWard && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
      <ClinicalSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClinicalTopBar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
            <span>Clinical Operations</span>
            <span>/</span>
            <span className="text-teal-800">Patient Directory</span>
          </div>

          {/* Title & Top Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Patient Search
                </h1>
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300">
                  Inpatient Census: 57 Beds
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Search across active inpatients, triage admissions, and recent clinical records in real time.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition">
                <Download className="w-3.5 h-3.5" />
                <span>Export Results</span>
              </button>

              <button className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d40] hover:bg-[#00382e] shadow-md shadow-[#004d40]/20 transition">
                <Plus className="w-4 h-4" />
                <span>Quick Intake</span>
              </button>
            </div>
          </div>

          {/* Search Box Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Search Patients
            </p>

            {/* Search Input Bar */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, patient ID (e.g. MC-20481), bed number, or ward..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-12 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘ K
                </span>
              </div>

              <button className="flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Ward Filter Pills & Status Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2 border-t border-slate-100">
              {/* Ward Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mr-1">
                  Ward:
                </span>
                {wardTabs.map((tab) => {
                  const isActive = activeWard === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveWard(tab.label)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                        isActive
                          ? "bg-[#004d40] text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status and Sort dropdowns */}
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-500 text-[11px] uppercase font-mono">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Critical">Critical</option>
                    <option value="Stable">Stable</option>
                    <option value="Under Observation">Under Observation</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-500 text-[11px] uppercase font-mono">Sort:</span>
                  <button className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800">
                    <span>Recently Admitted</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Census matching status bar */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-slate-700">
                Showing <strong>{filteredPatients.length}</strong> of <strong>6</strong> active inpatients matching criteria
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5 text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span>Live EHR Bedside Sync</span>
              </span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              <button className="p-1.5 rounded-lg bg-slate-200 text-slate-800">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-slate-200">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>

          {/* Bottom KPI Banner */}
          <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-teal-50/70 border border-slate-200/90 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Emergency Room to Inpatient Triage Throughput
                </h4>
                <p className="text-[11px] text-slate-500">
                  Avg admission time: <strong className="text-slate-800">38 mins</strong> • Bed turnover index: <strong className="text-slate-800">94.2%</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-mono uppercase font-bold text-slate-400">
                24H Ward Influx
              </p>
              <p className="text-base font-black text-slate-900 font-mono">
                +18 Admissions
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
