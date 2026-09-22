'use client';

import React, { useState } from 'react';
import {
    Search, Bell, Plus, Users, Calendar, Building2, UserPlus, Bed,
    FileText, Pill, FlaskConical, CreditCard, ShieldCheck, LineChart,
    Settings, HelpCircle, ChevronDown, Filter, RefreshCw, MoreVertical,
    Download, Sparkles, Activity, AlertTriangle, CheckCircle2, Clock,
    ArrowUpRight, ShieldAlert, Radio, UserCheck
} from 'lucide-react';

export default function ActivityAuditPage() {
    const [dateFilter, setDateFilter] = useState('Today');
    const [roleFilter, setRoleFilter] = useState('All Staff Roles');
    const [deptFilter, setDeptFilter] = useState('All Departments');
    const [eventTypeFilter, setEventTypeFilter] = useState('All Event Types');
    const [severityFilter, setSeverityFilter] = useState('All Severity');

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
                            Administration &gt; System Activity & Audit Log
                        </div>
                    </div>
                </div>

                {/* CHARTS SECTION (2 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart 1: Hourly Event Flow & Load (2 Cols) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Hourly Event Flow & Load</h3>
                                <p className="text-xs text-slate-500">Real-time action frequency by hour (UTC +5:30)</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Actions</div>
                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Alerts</div>
                            </div>
                        </div>

                        {/* Simulated Wave Graph */}
                        <div className="h-48 w-full relative flex items-end pt-6 pb-2">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                            </div>
                            <svg className="w-full h-36 overflow-visible" viewBox="0 0 700 120" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 100 Q 70 80 140 90 T 280 40 T 420 70 T 560 30 T 700 80 L 700 120 L 0 120 Z" fill="url(#tealGrad)" />
                                <path d="M 0 100 Q 70 80 140 90 T 280 40 T 420 70 T 560 30 T 700 80" fill="none" stroke="#0d9488" strokeWidth="2.5" />
                            </svg>
                        </div>

                        <div className="grid grid-cols-7 text-[11px] text-slate-400 font-semibold text-center mt-2 pt-2 border-t border-slate-100">
                            <span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span><span>00:00</span>
                        </div>
                    </div>

                    {/* Chart 2: Activity by Department (1 Col) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Activity by Department</h3>
                                <p className="text-xs text-slate-500">Log throughput across clinical units</p>
                            </div>
                            <span className="text-xs text-teal-700 font-semibold cursor-pointer hover:underline">% Metric/Action</span>
                        </div>

                        <div className="space-y-4 my-auto">
                            <DeptBar label="Emergency & Trauma Care" count="4,120 actions" pct="28.4%" width="85%" />
                            <DeptBar label="Cardiovascular ICU" count="3,450 actions" pct="22.1%" width="70%" />
                            <DeptBar label="General Inpatient Medicine" count="2,890 actions" pct="18.4%" width="58%" />
                            <DeptBar label="Automated Central Pathology" count="1,940 actions" pct="13.2%" width="42%" />
                            <DeptBar label="Inpatient Pharmacy" count="1,070 actions" pct="7.6%" width="25%" />
                        </div>
                    </div>

                </div>

                {/* BOTTOM CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Events by Staff Role */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Events by Staff Role</h3>
                                <p className="text-xs text-slate-500">Identity validation and action autorize spread</p>
                            </div>
                            <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                            {/* Simulated Donut Chart */}
                            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                                <div className="w-36 h-36 rounded-full border-[14px] border-teal-600 border-t-purple-500 border-r-indigo-500 border-b-slate-200"></div>
                                <div className="absolute text-center">
                                    <span className="text-lg font-black text-slate-900">14.8k</span>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Largest Day</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2.5 w-full text-xs">
                                <RoleLegend color="bg-teal-600" title="Attending Physicians" pct="42%" count="(6,210)" />
                                <RoleLegend color="bg-indigo-500" title="Registered Nurses" pct="34%" count="(5,040)" />
                                <RoleLegend color="bg-purple-500" title="Pathologists / Techs" pct="16%" count="(2,370)" />
                                <RoleLegend color="bg-slate-300" title="System & Billing Admin" pct="8%" count="(1,272)" />
                            </div>
                        </div>
                    </div>

                    {/* Shift Load & Terminal Utilization */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Shift Load & Terminal Utilization</h3>
                                <p className="text-xs text-slate-500">Congestion periods & secure terminal authentication blocks</p>
                            </div>
                            <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full border border-teal-200">Audit Certified</span>
                        </div>

                        {/* Vertical Bar Chart Mock */}
                        <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                            <BarItem height="40%" time="06h" />
                            <BarItem height="65%" time="09h" />
                            <BarItem height="95%" time="12h" highlight />
                            <BarItem height="80%" time="15h" highlight />
                            <BarItem height="50%" time="18h" />
                            <BarItem height="35%" time="21h" />
                            <BarItem height="25%" time="22h" />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2 mt-1">
                            <span>Physicians Rounding</span>
                            <span>Nursing Shift Handover</span>
                            <span>Emergency Surge</span>
                        </div>
                    </div>

                </div>

                {/* FILTER TOOLBAR */}
                <div className="bg-white p-3 rounded-t-2xl border border-slate-200 border-b-0 flex flex-wrap gap-3 items-center justify-between mt-8">
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        <FilterSelect value={roleFilter} onChange={setRoleFilter} options={['All Staff Roles', 'Doctor', 'Nurse', 'Pathologist', 'Administrator']} />
                        <FilterSelect value={deptFilter} onChange={setDeptFilter} options={['All Departments', 'Cardiology', 'Emergency', 'Neurology', 'Pathology']} />
                        <FilterSelect value={eventTypeFilter} onChange={setEventTypeFilter} options={['All Event Types', 'EHR Access', 'Prescription', 'Biometric', 'Discharge']} />
                        <FilterSelect value={severityFilter} onChange={setSeverityFilter} options={['All Severity', 'Normal', 'Elevated', 'Critical']} />

                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                            <RefreshCw size={13} /> Reset Filters
                        </button>
                    </div>

                    <div className="text-xs font-semibold text-slate-500">
                        Showing <span className="text-slate-900">1-7</span> of <span className="text-slate-900">14,392</span> logged system events
                    </div>
                </div>

                {/* AUDIT LOG TABLE */}
                <div className="bg-white border border-slate-200 rounded-b-2xl shadow-2xs overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-4 py-3.5">Timestamp</th>
                            <th className="p-4 py-3.5">Actor / Staff Member</th>
                            <th className="p-4 py-3.5">Action Performed</th>
                            <th className="p-4 py-3.5">Department</th>
                            <th className="p-4 py-3.5">Terminal & Source IP</th>
                            <th className="p-4 py-3.5">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">

                        <AuditRow
                            time="10:42:15 AM" timeAgo="2 mins ago"
                            name="Dr. Priya Shah" id="DOC-2026-0042" initials="PS" avatarBg="bg-teal-100 text-teal-800"
                            action="Updated Patient Clinical Record: RMC-10442 (Modified dosage: Heparin IV infusion 10 IU)"
                            dept="Cardiology ICU" deptSub="Chief Resident"
                            terminal="Terminal: ICU-CU-04" ip="192.168.14.38"
                            status="Success" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                        />

                        <AuditRow
                            time="10:38:50 AM" timeAgo="6 mins ago"
                            name="Marcus Kane, RN" id="NRS-2026-1789" initials="MK" avatarBg="bg-indigo-100 text-indigo-800"
                            action="Dispensed Controlled Schedule II Drug (Override authorized: automated dispensary release for morphine sulphate 5mg)"
                            dept="Emergency Care" deptSub="Triage Nurse"
                            terminal="Kiosk: AED-MED-03" ip="192.168.10.102"
                            status="Verified" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                        />

                        <AuditRow
                            time="10:30:12 AM" timeAgo="14 mins ago"
                            name="Unknown / System" id="AUTH-FAIL-001" initials="SYS" avatarBg="bg-rose-100 text-rose-700" isWarning
                            action="Failed Biometric Authentication Attempt (Badge ID mismatch detected without multi-factor biometric pin verification)"
                            dept="Main Pharmacy Vault" deptSub="Restricted Area"
                            terminal="Secure Portal: WHS-01" ip="167.55.201.9"
                            status="Flagged" statusColor="text-rose-700 bg-rose-50" statusDot="bg-rose-500"
                        />

                        <AuditRow
                            time="10:21:04 AM" timeAgo="22 mins ago"
                            name="Dr. Eleanor Vance" id="ADM-2026-5001" initials="EV" avatarBg="bg-purple-100 text-purple-800"
                            action="Privilege Assignment: Temporary ICU Clearance (Granted Dr. Ananya Desai administrative order rights for Level-1 Trauma)"
                            dept="Administration" deptSub="Chief Medical Officer"
                            terminal="Admin Console: ADM-01" ip="192.168.5.15"
                            status="Authorized" statusColor="text-purple-700 bg-purple-50" statusDot="bg-purple-500"
                        />

                        <AuditRow
                            time="10:14:41 AM" timeAgo="29 mins ago"
                            name="Dr. Robert Lee" id="DOC-2026-0210" initials="RL" avatarBg="bg-teal-100 text-teal-800"
                            action="Authorized Patient Discharge Summary: eADM-9282 (Final operative report filed & completed. Follow-up accessible to days.)"
                            dept="General Surgery" deptSub="Attending Surgeon"
                            terminal="Workstation: ATS-NS-01" ip="192.168.20.22"
                            status="Success" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                        />

                        <AuditRow
                            time="10:10:19 AM" timeAgo="33 mins ago"
                            name="Sarah Al-Mansoor" id="LAB-2026-0411" initials="SM" avatarBg="bg-blue-100 text-blue-800"
                            action="Uploaded Stat Blood Chemistry Results: PLAN-7700 (Troponin-I Critical Alert: 1.48 ng/mL. SMS protocol paged attending on-call)"
                            dept="Pathology Lab" deptSub="Senior Lab Tech"
                            terminal="Analyzer: BCQMA-B-2000" ip="192.168.32.17"
                            status="Delivered" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                        />

                        <AuditRow
                            time="10:05:02 AM" timeAgo="38 mins ago"
                            name="David Chen, RT" id="RAD-2026-0012" initials="DC" avatarBg="bg-amber-100 text-amber-800"
                            action="Transferred DICOM CT Scan Package: 14.2 GB (Angiography study linked to patient: PMD-10402 - PACS-system verified)"
                            dept="Diagnostic Imaging" deptSub="Radiology Lead"
                            terminal="PACS-Node: IRMG-01" ip="192.168.40.10"
                            status="Success" statusColor="text-teal-700 bg-teal-50" statusDot="bg-teal-500"
                        />

                        </tbody>
                    </table>

                    {/* Table Pagination Footer */}
                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <div>Showing 1-7 of 14,392 logged system events</div>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer">&lt; Previous</button>
                            <button className="w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded-lg font-bold text-xs">1</button>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">2</button>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">3</button>
                            <span className="px-1 text-slate-400">...</span>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg font-semibold text-xs">2,056</button>
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

function DeptBar({ label, count, pct, width }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-800">{label}</span>
                <span className="text-slate-500">{count} <strong className="text-slate-800">({pct})</strong></span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width }}></div>
            </div>
        </div>
    );
}

function RoleLegend({ color, title, pct, count }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-md ${color}`}></span>
                <span className="font-semibold text-slate-800">{title}</span>
            </div>
            <div className="text-slate-500 font-medium">
                <strong className="text-slate-900">{pct}</strong> {count}
            </div>
        </div>
    );
}

function BarItem({ height, time, highlight = false }: any) {
    return (
        <div className="flex flex-col items-center gap-2 h-full justify-end flex-1 mx-1">
            <div
                className={`w-full rounded-t-lg transition-all ${highlight ? 'bg-teal-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                style={{ height }}
            ></div>
            <span className="text-[10px] font-bold text-slate-500">{time}</span>
        </div>
    );
}

function FilterSelect({ value, onChange, options }: any) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    );
}

function AuditRow({ time, timeAgo, name, id, initials, avatarBg, isWarning = false, action, dept, deptSub, terminal, ip, status, statusColor, statusDot }: any) {
    return (
        <tr className={`hover:bg-slate-50/80 transition-colors ${isWarning ? 'bg-rose-50/30' : ''}`}>
            <td className="p-4 align-top">
                <p className="font-bold text-slate-900">{time}</p>
                <p className="text-[11px] text-slate-400">{timeAgo}</p>
            </td>
            <td className="p-4 align-top">
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarBg}`}>
                        {initials}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {name}
                            {isWarning && <ShieldAlert size={13} className="text-rose-500" />}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">{id}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 align-top max-w-xs">
                <p className="font-medium text-slate-800 leading-relaxed text-xs">{action}</p>
            </td>
            <td className="p-4 align-top">
                <p className="font-semibold text-slate-900">{dept}</p>
                <p className="text-[11px] text-slate-400">{deptSub}</p>
            </td>
            <td className="p-4 align-top font-mono text-[11px]">
                <p className="text-slate-800">{terminal}</p>
                <p className="text-slate-400">{ip}</p>
            </td>
            <td className="p-4 align-top">
                <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${statusColor}`}>{status}</span>
                </div>
            </td>
        </tr>
    );
}