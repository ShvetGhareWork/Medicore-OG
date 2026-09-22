'use client';

import React, { useState } from 'react';
import {
  Search, Bell, Plus, Users, Calendar, Building2, UserPlus, Bed,
  FileText, Pill, FlaskConical, CreditCard, ShieldCheck, LineChart,
  Settings, HelpCircle, ChevronDown, Filter, RefreshCw, MoreVertical,
  Download, Sparkles, Activity, AlertTriangle, CheckCircle2, Clock,
  ArrowUpRight, UserCheck, Stethoscope
} from 'lucide-react';

export default function AdmissionsPage() {
  const [wardFilter, setWardFilter] = useState('All Wards');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [doctorFilter, setDoctorFilter] = useState('Attending Doctor');

  return (
      <div className="w-full h-full bg-slate-50 font-sans text-slate-950 flex flex-col min-w-0">

        {/* Sleek Custom Scrollbar */}
        <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>



        {/* MAIN BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">

          {/* PAGE TITLE & CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Administration &gt; Admissions
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Admissions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admit, transfer, and discharge patients, and track bed availability across wards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer">
                <Download size={14} className="text-slate-500" />
                Export Records
              </button>

              <button className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95">
                <Plus size={15} strokeWidth={2.5} /> + Admit Patient
              </button>
            </div>
          </div>

          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Admitted</span>
                <Bed size={16} className="text-teal-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">318</span>
                  <span className="text-xs font-semibold text-teal-600 flex items-center">+14 from yesterday</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Active hospital census</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discharges Today</span>
                <ArrowUpRight size={16} className="text-teal-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">42</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-100">8 pending checkout</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Processed clearances</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Admissions</span>
                <Clock size={16} className="text-rose-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">19</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-100">Awaiting triage & bed prep</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Emergency queue</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bed Occupancy Rate</span>
                <Activity size={16} className="text-teal-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">88.3%</span>
                  <span className="text-[11px] text-slate-500 font-semibold">318 / 360 Total Beds</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">High capacity threshold</p>
              </div>
            </div>

          </div>

          {/* SECTION: WARD OCCUPANCY & TRENDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Real-Time Ward Occupancy (2 Cols) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Real-Time Ward Occupancy</h3>
                  <p className="text-xs text-slate-500">Occupancy per ward & clinical department</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  <span>Live Telemetry</span>
                </div>
              </div>

              <div className="space-y-4 my-auto">
                <WardBar label="Intensive Care Unit (ICU)" badge="Near Capacity" badgeColor="bg-rose-50 text-rose-700 border-rose-200" count="28 / 30 Beds" pct="93.3%" width="93%" isCritical />
                <WardBar label="Emergency & Trauma" badge="Near Capacity" badgeColor="bg-rose-50 text-rose-700 border-rose-200" count="46 / 50 Beds" pct="92.0%" width="92%" isCritical />
                <WardBar label="General Inpatient Ward" badge="Optimal" badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200" count="124 / 140 Beds" pct="88.6%" width="88%" />
                <WardBar label="Maternity & Neonatal" badge="Optimal" badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200" count="38 / 45 Beds" pct="84.4%" width="84%" />
                <WardBar label="Cardiology & Cath Lab" badge="Critical" badgeColor="bg-rose-50 text-rose-700 border-rose-200" count="42 / 45 Beds" pct="93.3%" width="93%" isCritical />
                <WardBar label="Pediatric Ward" badge="Healthy" badgeColor="bg-teal-50 text-teal-700 border-teal-200" count="40 / 50 Beds" pct="80.0%" width="80%" />
              </div>
            </div>

            {/* Inflow vs Outflow Trend (1 Col) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inflow vs Outflow Trend</h3>
                  <p className="text-xs text-slate-500">Last 14 days clinical flow metrics</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Net Intake</span>
                  <span className="text-xs font-bold text-teal-700">+3.2 pts/day</span>
                </div>
              </div>

              {/* Telemetry Wave Graph */}
              <div className="h-36 w-full relative flex items-end pt-4 pb-2 my-auto">
                <svg className="w-full h-28 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="admissionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 70 Q 50 40 100 60 T 200 30 T 300 50 L 300 100 L 0 100 Z" fill="url(#admissionGrad)" />
                  <path d="M 0 70 Q 50 40 100 60 T 200 30 T 300 50" fill="none" stroke="#0d9488" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-600"></span> Daily Admissions</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Daily Discharges</div>
                <span>Avg: 26.4 in / 23.2 out</span>
              </div>
            </div>

          </div>

          {/* FILTER TOOLBAR */}
          <div className="bg-white p-3 rounded-t-2xl border border-slate-200 border-b-0 flex flex-wrap gap-3 items-center justify-between mt-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                  type="text"
                  placeholder="Search by patient name, patient ID, ward..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <FilterSelect value={wardFilter} onChange={setWardFilter} options={['All Wards', 'ICU', 'Emergency', 'General Ward', 'Maternity', 'Pediatrics']} />
              <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Admitted', 'Pending', 'Discharged', 'Transferred']} />
              <FilterSelect value={doctorFilter} onChange={setDoctorFilter} options={['Attending Doctor', 'Dr. Marcus Vance', 'Dr. Priya Shah', 'Dr. Rahul Sharma']} />

              <button title="Reset" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                <RefreshCw size={14} />
              </button>
              <button title="Filter options" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                <Filter size={14} />
              </button>
            </div>
          </div>

          {/* ADMISSIONS TABLE */}
          <div className="bg-white border border-slate-200 rounded-b-2xl shadow-2xs overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 py-3.5">Patient</th>
                <th className="p-4 py-3.5">Attending Doctor</th>
                <th className="p-4 py-3.5">Ward / Bed No.</th>
                <th className="p-4 py-3.5">Admission Status</th>
                <th className="p-4 py-3.5">Admission Date</th>
                <th className="p-4 py-3.5">Expected Discharge</th>
                <th className="p-4 py-3.5 text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">

              <AdmissionRow
                  name="Eleanor Rigby" id="PT-2026-0814" age="54y" gender="Female" initials="ER"
                  doctor="Dr. Marcus Vance" doctorSub="Cardiology"
                  ward="ICU • Bed #ICU-04"
                  status="Admitted" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                  admissionDate="28 Aug 2026" admissionTime="09:15 AM"
                  dischargeInfo="02 Sep 2026" dischargeSub="Est. 5 days"
                  actionType="details"
              />

              <AdmissionRow
                  name="Liam Gallagher" id="PT-2026-0922" age="41y" gender="Male" initials="LG"
                  doctor="Dr. Priya Shah" doctorSub="ICU Lead"
                  ward="Emergency • Bay #ER-08"
                  status="Pending" statusColor="text-amber-700 bg-amber-50" statusDot="bg-amber-500"
                  admissionDate="28 Aug 2026" admissionTime="11:40 AM"
                  dischargeInfo="TBD (Triage)" dischargeSub="Bed prep ongoing"
                  actionType="assign"
              />

              <AdmissionRow
                  name="Chloe Zhao" id="PT-2026-0731" age="29y" gender="Female" initials="CZ"
                  doctor="Dr. Rahul Sharma" doctorSub="Internal Med"
                  ward="General • Ward-Bed #GW-212"
                  status="Admitted" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                  admissionDate="27 Aug 2026" admissionTime="04:20 PM"
                  dischargeInfo="31 Aug 2026" dischargeSub="Est. 3 days"
                  actionType="details"
              />

              <AdmissionRow
                  name="Amara Okafor" id="PT-2026-0510" age="35y" gender="Female" initials="AO"
                  doctor="Dr. Priya Shah" doctorSub="Obstetrics"
                  ward="Maternity • Suite #MAT-105"
                  status="Discharged" statusColor="text-slate-600 bg-slate-100" statusDot="bg-slate-400"
                  admissionDate="24 Aug 2026" admissionTime="08:00 AM"
                  dischargeInfo="Today (Discharged)" dischargeSub="Summary logged"
                  actionType="summary"
              />

              <AdmissionRow
                  name="Julian Sterling" id="PT-2026-0551" age="68y" gender="Male" initials="JS"
                  doctor="Dr. Ananya Desai" doctorSub="Neurology"
                  ward="ICU • Bed #ICU-08"
                  status="Transferred" statusColor="text-blue-700 bg-blue-50" statusDot="bg-blue-500"
                  admissionDate="25 Aug 2026" admissionTime="02:10 PM"
                  dischargeInfo="05 Sep 2026" dischargeSub="Post-Op Monitor"
                  actionType="transfer"
              />

              <AdmissionRow
                  name="Mateo Silva" id="PT-2026-1004" age="8y" gender="Male" initials="MS"
                  doctor="Dr. Rahul Sharma" doctorSub="Pediatrics Lead"
                  ward="Pediatrics • Bed #PED-302"
                  status="Admitted" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                  admissionDate="26 Aug 2026" admissionTime="10:45 AM"
                  dischargeInfo="30 Aug 2026" dischargeSub="Est. 2 days"
                  actionType="details"
              />

              <AdmissionRow
                  name="Siddharth Menon" id="PT-2026-0442" age="47y" gender="Male" initials="SM"
                  doctor="Dr. Marcus Vance" doctorSub="Cardiology"
                  ward="General • Ward-Bed #GW-104"
                  status="Admitted" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                  admissionDate="21 Aug 2026" admissionTime="01:30 PM"
                  dischargeInfo="Today" dischargeSub="Discharge Prep"
                  actionType="discharge_btn"
              />

              </tbody>
            </table>

            {/* Table Pagination Footer */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div>Showing 1-7 of 318 active admissions</div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer">&lt; Previous</button>
                <button className="w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded-lg font-bold text-xs">1</button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">2</button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">46</button>
                <button className="px-3 py-1 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer">Next &gt;</button>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}

/* =========================================
   HELPER COMPONENTS
   ========================================= */

function WardBar({ label, badge, badgeColor, count, pct, width, isCritical = false }: any) {
  return (
      <div>
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-800">{label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
          </div>
          <span className="text-slate-500 font-medium">{count} <strong className="text-slate-800">({pct})</strong></span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-teal-600'}`} style={{ width }}></div>
        </div>
      </div>
  );
}

function FilterSelect({ value, onChange, options }: any) {
  return (
      <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
        >
          {options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
  );
}

function AdmissionRow({ name, id, age, gender, initials, doctor, doctorSub, ward, status, statusColor, statusDot, admissionDate, admissionTime, dischargeInfo, dischargeSub, actionType }: any) {
  return (
      <tr className="hover:bg-slate-50/80 transition-colors">
        <td className="p-4 align-top">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xs font-bold text-teal-800 shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-slate-900">{name}</p>
              <p className="font-mono text-[10px] text-slate-400">{id} • {age} • {gender}</p>
            </div>
          </div>
        </td>
        <td className="p-4 align-top">
          <p className="font-semibold text-slate-900">{doctor}</p>
          <p className="text-[11px] text-slate-400">{doctorSub}</p>
        </td>
        <td className="p-4 align-top">
          <p className="font-medium text-slate-800 bg-slate-100/80 px-2 py-1 rounded-md inline-block text-[11px] font-mono">{ward}</p>
        </td>
        <td className="p-4 align-top">
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${statusColor}`}>{status}</span>
          </div>
        </td>
        <td className="p-4 align-top">
          <p className="font-semibold text-slate-800">{admissionDate}</p>
          <p className="text-[11px] text-slate-400">{admissionTime}</p>
        </td>
        <td className="p-4 align-top">
          <p className="font-semibold text-slate-800">{dischargeInfo}</p>
          <p className="text-[11px] text-slate-400">{dischargeSub}</p>
        </td>
        <td className="p-4 align-top text-right">
          {actionType === 'discharge_btn' ? (
              <button className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs">
                Discharge
              </button>
          ) : actionType === 'assign' ? (
              <button className="text-teal-700 hover:text-teal-900 font-bold text-xs underline cursor-pointer">
                Assign Bed
              </button>
          ) : actionType === 'transfer' ? (
              <button className="text-slate-700 hover:text-slate-900 font-bold text-xs underline cursor-pointer">
                Transfer History
              </button>
          ) : actionType === 'summary' ? (
              <button className="text-slate-700 hover:text-slate-900 font-bold text-xs underline cursor-pointer">
                Summary logged
              </button>
          ) : (
              <div className="flex items-center justify-end gap-2">
                <span className="text-slate-600 font-semibold text-xs cursor-pointer hover:underline">Details</span>
                <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
              </div>
          )}
        </td>
      </tr>
  );
}