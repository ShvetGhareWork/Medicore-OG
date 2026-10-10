"use client";

import { useState } from "react";
import { KeyRound, QrCode, ShieldCheck } from "lucide-react";
import InactivityLogout from "./InactivityLogout";

export default function ClinicalTerminal() {
  const [mode, setMode] = useState<"qr" | "pin">("qr");
  const [pin, setPin] = useState("");
  const [connected, setConnected] = useState(false);

  return (
      <div className="min-h-[calc(100vh-2rem)] bg-[#f8fafc] p-4 sm:p-6 lg:p-10 text-slate-900">
        <InactivityLogout />
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:gap-10">
          <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#004d40]">Clinical terminal</p>
              <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Secure care workspace</h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs self-start sm:self-auto">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> Session encrypted
            </div>
          </header>

          <section className="grid gap-6 sm:gap-8 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10 shadow-xl">
            <div>
              <p className="text-sm font-medium text-slate-600">Connect a workstation to begin</p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                <button
                    onClick={() => setMode("qr")}
                    className={`flex-1 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold transition-all flex items-center justify-center ${
                        mode === "qr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  <QrCode className="mr-2 size-4 text-[#004d40] shrink-0" />
                  Scan QR code
                </button>
                <button
                    onClick={() => setMode("pin")}
                    className={`flex-1 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold transition-all flex items-center justify-center ${
                        mode === "pin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  <KeyRound className="mr-2 size-4 text-[#004d40] shrink-0" />
                  Enter PIN
                </button>
              </div>

              {mode === "qr" ? (
                  <div
                      onClick={() => {
                        setConnected(true);
                        window.location.href = "/terminal/workspace/patient-search";
                      }}
                      className="mt-6 sm:mt-8 grid place-items-center rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 cursor-pointer hover:bg-slate-100/70 hover:border-slate-300 transition group shadow-inner"
                  >
                    <div className="grid size-36 sm:size-44 grid-cols-7 gap-1 p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                      {Array.from({ length: 49 }, (_, index) => (
                          <span
                              key={index}
                              className={(index * 13 + (index % 5)) % 3 === 0 ? "bg-[#004d40]" : "bg-slate-100"}
                          />
                      ))}
                    </div>
                    <p className="mt-4 sm:mt-5 text-center text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900">
                      Scan with the MediCore clinician app to open terminal &rarr;
                    </p>
                  </div>
              ) : (
                  <div className="mt-6 sm:mt-8">
                    <label htmlFor="pin" className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700">
                      6-digit terminal PIN
                    </label>
                    <input
                        id="pin"
                        value={pin}
                        onChange={(event) =>
                            setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        placeholder="000000"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:py-4 text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.5em] text-slate-900 outline-none focus:bg-white focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] font-mono shadow-inner text-center sm:text-left"
                    />
                    <button
                        onClick={() => {
                          setConnected(true);
                          window.location.href = "/terminal/workspace/patient-search";
                        }}
                        className="mt-4 w-full rounded-xl bg-[#004d40] px-4 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white hover:bg-[#00382e] shadow-sm transition"
                    >
                      Connect terminal
                    </button>
                  </div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-[#0a1e24] p-6 sm:p-8 text-white shadow-md">
              <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#80eec0] bg-[#80eec0]/15 px-3 py-1 rounded-full border border-[#80eec0]/30 inline-block mb-3 sm:mb-4">
                Privacy Mode
              </span>
                <h2 className="text-xl sm:text-2xl font-bold">{connected ? "Terminal connected" : "Protected by default"}</h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-300">
                  Patient details stay hidden until a verified clinician session is connected.
                </p>
              </div>
              <p className="mt-6 sm:mt-8 text-[11px] sm:text-xs font-semibold text-slate-400">
                Auto-locks after 3 minutes of inactivity.
              </p>
            </div>
          </section>
        </div>
      </div>
  );
}