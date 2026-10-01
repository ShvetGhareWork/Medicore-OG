"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  QrCode,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  Server,
  Activity,
  ChevronLeft,
  Smartphone,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { extractRoles, storeAuthSession } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";

export default function AdminLoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [authMode, setAuthMode] = useState<"password" | "badge">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [badgeToken, setBadgeToken] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [totpCode, setTotpCode] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "unauthorized") {
        setError("Access denied: Your account lacks Hospital Administrator privileges.");
      } else if (errorParam === "session-expired") {
        setError("Administrative session expired. Please authenticate again.");
      } else {
        setError(decodeURIComponent(errorParam));
      }
    }
  }, [searchParams]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: staffId.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Invalid administrative credentials.");
      }

      // Check if MFA is required
      if (result.mfaRequired && result.tempToken) {
        setTempToken(result.tempToken);
        setStep(2);
        setError("");
        return;
      }

      const roles = extractRoles(result.jwt);
      const hasAdminRole = roles.some((r) => r === "ADMIN" || r === "ADMINISTRATIVE");

      if (!hasAdminRole) {
        throw new Error("Access restricted: This account does not possess Administrative privileges.");
      }

      storeAuthSession(result.jwt, result.id);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(err.message || "Failed to establish secure connection to Authentication Server.");
    } finally {
      setLoading(false);
    }
  };

  const handleTotpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/mfa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempToken: tempToken || staffId.trim(),
          totpCode: totpCode.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Invalid 6-digit Authenticator code.");
      }

      const roles = extractRoles(result.jwt);
      const hasAdminRole = roles.some((r) => r === "ADMIN" || r === "ADMINISTRATIVE");

      if (!hasAdminRole) {
        throw new Error("Access restricted: This account does not possess Administrative privileges.");
      }

      storeAuthSession(result.jwt, result.id);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("MFA verification error:", err);
      setError(err.message || "Authenticator verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/badge-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: staffId.trim(),
          badgeToken: badgeToken.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Badge token verification failed.");
      }

      const roles = extractRoles(result.jwt);
      const hasAdminRole = roles.some((r) => r === "ADMIN" || r === "ADMINISTRATIVE");

      if (!hasAdminRole) {
        throw new Error("Access restricted: Badge identity does not have Administrative authority.");
      }

      storeAuthSession(result.jwt, result.id);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Badge login error:", err);
      setError(err.message || "Badge verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between backdrop-blur bg-slate-950/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-base shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">MediCore</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold tracking-wider">
                Restricted
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hospital Administration & Operations Console</p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60"
        >
          <ChevronLeft className="size-3.5" /> General Login
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Security Banner Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="size-4" />
                {step === 1 ? "Administrative Gateway" : "Two-Step Verification"}
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {step === 1 ? "Audited Session" : "MFA Challenge"}
              </span>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle className="size-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="space-y-1.5 mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Admin Authentication
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enter your administrative credentials or authorized security badge token. Third-party authentication is disabled for this tier.
                  </p>
                </div>

                {/* Tab switch: Password vs Badge Token */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === "password"
                        ? "bg-slate-800 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <KeyRound className="size-3.5" /> Password Access
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("badge");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === "badge"
                        ? "bg-slate-800 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <QrCode className="size-3.5" /> Hardware Badge
                  </button>
                </div>

                {/* Password Auth Form */}
                {authMode === "password" ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Staff ID / Admin Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="ADM-2026-0001 or admin@hospital.org"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                          Administrative Password
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                          Verifying Credentials...
                        </span>
                      ) : (
                        <>
                          Enter Admin Console <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Badge Token Form */
                  <form onSubmit={handleBadgeLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Staff Identifier (Staff ID)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="ADM-2026-0001"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Hardware / NFC Badge Token
                      </label>
                      <div className="relative">
                        <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          value={badgeToken}
                          onChange={(e) => setBadgeToken(e.target.value)}
                          placeholder="Tap badge or input token"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-mono transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Use an authorized hospital NFC reader or provisioned hardware token.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                          Validating Badge...
                        </span>
                      ) : (
                        <>
                          Verify Badge & Sign In <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Step 2: TOTP Multi-Factor Authentication */
              <form onSubmit={handleTotpVerify} className="space-y-5 animate-fadeIn">
                <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-start gap-3">
                  <Smartphone className="size-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-white mb-0.5">Authenticator Code Required</p>
                    Open your Authenticator app (Google Authenticator, Microsoft Authenticator, or Authy) and enter the 6-digit code for <span className="font-mono text-teal-300">{staffId || "Administrator"}</span>.
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>6-Digit Security Code</span>
                    <span className="text-[10px] text-teal-400 font-mono">30s Refresh</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setTotpCode(val);
                    }}
                    placeholder="000 000"
                    className="w-full py-3 px-4 bg-slate-950 border border-slate-700/80 rounded-xl text-2xl text-center font-mono tracking-[0.5em] text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setTotpCode("");
                      setError("");
                    }}
                    className="py-3 px-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || totpCode.length < 6}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify Code <CheckCircle2 className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security notice footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-400">
              <ShieldAlert className="size-4 text-amber-400 shrink-0" />
              <span>
                All transactions are logged with IP binding and 4-hour max session validity.
              </span>
            </div>
          </div>

          {/* Help link */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>
              Forgot administrative credentials or lost badge?
            </p>
            <p className="text-slate-400">
              Contact Hospital IT Security Operations (<span className="font-mono text-teal-400">it-sec@medicore.org</span>)
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Server className="size-3.5 text-slate-400" />
          <span>MediCore Self-Healing Microservices Architecture</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-teal-400">
            <Activity className="size-3" /> Identity Cluster 8081 Active
          </span>
          <span>© 2026 MediCore Healthcare Systems</span>
        </div>
      </footer>
    </div>
  );
}
