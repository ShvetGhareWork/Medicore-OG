"use client";

import { useState } from "react";
import { KeyRound, QrCode, ShieldCheck } from "lucide-react";
import InactivityLogout from "./InactivityLogout";

export default function ClinicalTerminal() {
  const [mode, setMode] = useState<"qr" | "pin">("qr");
  const [pin, setPin] = useState("");
  const [connected, setConnected] = useState(false);
  return (
    <div className="min-h-[calc(100vh-2rem)] bg-slate-950 p-5 text-white sm:p-10">
      <InactivityLogout />
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">Clinical terminal</p><h1 className="mt-2 text-3xl font-semibold">Secure care workspace</h1></div><div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-4 text-emerald-400" /> Session encrypted</div></header>
        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 lg:grid-cols-[1fr_0.8fr]">
          <div><p className="text-sm text-slate-400">Connect a workstation to begin</p><div className="mt-6 flex gap-2 rounded-xl bg-black/20 p-1"><button onClick={() => setMode("qr")} className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${mode === "qr" ? "bg-white text-slate-950" : "text-slate-400"}`}><QrCode className="mr-2 inline size-4" />Scan QR code</button><button onClick={() => setMode("pin")} className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${mode === "pin" ? "bg-white text-slate-950" : "text-slate-400"}`}><KeyRound className="mr-2 inline size-4" />Enter PIN</button></div>
            {mode === "qr" ? <div className="mt-8 grid place-items-center rounded-2xl bg-white p-8"><div className="grid size-44 grid-cols-7 gap-1">{Array.from({ length: 49 }, (_, index) => <span key={index} className={(index * 13 + index % 5) % 3 === 0 ? "bg-slate-950" : "bg-white"} />)}</div><p className="mt-5 text-center text-sm text-slate-600">Scan with the MediCore clinician app</p></div> : <div className="mt-8"><label htmlFor="pin" className="text-sm text-slate-300">6-digit terminal PIN</label><input id="pin" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="000000" className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-4 text-2xl tracking-[0.5em] outline-none focus:border-teal-300" /><button onClick={() => setConnected(pin.length === 6)} className="mt-4 w-full rounded-xl bg-teal-300 px-4 py-3 font-semibold text-slate-950 hover:bg-teal-200">Connect terminal</button></div>}
          </div>
          <div className="flex flex-col justify-between rounded-2xl bg-teal-300 p-6 text-slate-950"><div><p className="text-xs font-bold uppercase tracking-widest">Privacy mode</p><h2 className="mt-3 text-2xl font-semibold">{connected ? "Terminal connected" : "Protected by default"}</h2><p className="mt-3 text-sm leading-6 text-slate-800/75">Patient details stay hidden until a verified clinician session is connected.</p></div><p className="mt-8 text-xs font-semibold text-slate-800/70">Auto-locks after 3 minutes of inactivity.</p></div>
        </section>
      </div>
    </div>
  );
}
