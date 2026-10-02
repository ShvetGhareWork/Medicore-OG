"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Server,
  Activity,
  ChevronLeft,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api/config";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    staffId: string;
    username: string;
    email: string;
    fullName: string;
  } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          username: username.trim(),
          password: password,
          secretKey: secretKey.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to register administrator account."
        );
      }

      setSuccessData({
        staffId: result.staffId || "ADM-2026-0001",
        username: result.username || username,
        email: result.email || email,
        fullName: result.fullName || fullName,
      });
    } catch (err: any) {
      console.error("Admin registration error:", err);
      setError(err.message || "Failed to establish connection to Gateway Authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 flex flex-col justify-between font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-200/80 flex items-center justify-between backdrop-blur-md bg-white/80 shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base">
                MediCore
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-700 font-bold tracking-wider">
                Restricted
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Hospital Administration & Operations Console
            </p>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="size-3.5 text-slate-400" /> Back to Admin Login
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
        {/* Ambient Subtle Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          {successData ? (
            /* Success Confirmation Screen */
            <div className="rounded-2xl border border-teal-200 bg-white p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-teal-500/5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4 mx-auto">
                <BadgeCheck size={28} />
              </div>

              <div className="text-center space-y-1 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Admin Credentials Provisioned
                </h1>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your administrator identity has been registered and granted verified clearance.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 mb-6 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Assigned Staff ID</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {successData.staffId}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Administrator Name</span>
                  <span className="font-semibold text-slate-800">{successData.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Admin Username</span>
                  <span className="font-mono font-semibold text-slate-800">{successData.username}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">System Roles</span>
                  <span className="font-semibold text-emerald-700">ROLE_ADMIN, ROLE_ADMINISTRATIVE</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/admin/login")}
                className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Admin Login <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* Registration Form */
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="size-4 text-teal-600" />
                  Admin Provisioning Gateway
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Secured Registration
                </span>
              </div>

              {error && (
                <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{error}</div>
                </div>
              )}

              <div className="space-y-0.5 mb-3.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Register Administrator
                </h1>
                <p className="text-[11px] text-slate-500">
                  Provide verified administrator details and the Master Secret Key.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Eleanor Vance"
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.vance@medicore.org"
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Admin Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="eleanor.vance"
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Password (min 8 chars)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-8 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Master Admin Secret Key
                    </label>
                    <span className="text-[10px] text-teal-700 font-mono font-medium">
                      Default: MediCore@AdminSecret2026
                    </span>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type={showSecretKey ? "text" : "password"}
                      required
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter the server environment secret key"
                      className="w-full pl-9 pr-8 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showSecretKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Validating Clearance & Registering...
                    </span>
                  ) : (
                    <>
                      Register Administrator Identity <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-teal-600" /> Auto-assigns Administrator Tier
                </span>
                <Link
                  href="/admin/login"
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-2.5 border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1.5 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <Server className="size-3.5 text-slate-400" />
          <span>MediCore Self-Healing Microservices Architecture</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-teal-700 font-semibold">
            <Activity className="size-3 text-emerald-500" /> Identity Cluster 8081 Active
          </span>
          <span className="text-slate-400">|</span>
          <span>© 2026 MediCore Healthcare Systems</span>
        </div>
      </footer>
    </div>
  );
}
