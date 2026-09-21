import { BedDouble, Clock3, UserRound } from "lucide-react";

const admissions = [
  ["ADM-2048", "Amelia Carter", "Emergency Care", "Awaiting bed", "12 min"],
  ["ADM-2047", "Noah Williams", "Cardiology", "In review", "27 min"],
  ["ADM-2046", "Sofia Martinez", "General Medicine", "Admitted", "41 min"],
];

export default function AdmissionsPage() {
  return <div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-teal-700">Admissions</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Patient flow, at a glance.</h1></div><button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Register admission</button></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 shadow-sm"><BedDouble className="size-5 text-teal-700" /><p className="mt-5 text-3xl font-semibold">18</p><p className="text-sm text-slate-500">Open beds</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><UserRound className="size-5 text-blue-700" /><p className="mt-5 text-3xl font-semibold">42</p><p className="text-sm text-slate-500">Today&apos;s admissions</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><Clock3 className="size-5 text-amber-600" /><p className="mt-5 text-3xl font-semibold">19 min</p><p className="text-sm text-slate-500">Average wait time</p></div></div><div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4 font-semibold">Live admission queue</div><div className="divide-y divide-slate-100">{admissions.map(([id, name, department, status, wait]) => <div key={id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1.4fr_1.4fr_1fr_0.6fr] sm:items-center"><span className="font-mono text-xs text-slate-500">{id}</span><span className="font-semibold">{name}</span><span className="text-sm text-slate-600">{department}</span><span className="text-sm text-teal-700">{status}</span><span className="text-sm text-slate-400">{wait}</span></div>)}</div></div></div>;
}
