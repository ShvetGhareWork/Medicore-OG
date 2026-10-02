"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
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

      storeAuthSession(result.jwt, result.id, {
        username: result.username || staffId.trim(),
        fullName: result.fullName || staffId.trim(),
        email: result.email || "",
        staffId: result.staffId || (staffId.startsWith("ADM-") ? staffId : ""),
        roles: roles,
      });
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

      storeAuthSession(result.jwt, result.id, {
        username: result.username || staffId.trim(),
        fullName: result.fullName || staffId.trim(),
        email: result.email || "",
        staffId: result.staffId || (staffId.startsWith("ADM-") ? staffId : ""),
        roles: roles,
      });
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

      storeAuthSession(result.jwt, result.id, {
        username: result.username || staffId.trim(),
        fullName: result.fullName || staffId.trim(),
        email: result.email || "",
        staffId: result.staffId || staffId.trim(),
        roles: roles,
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Badge login error:", err);
      setError(err.message || "Badge verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 flex flex-col justify-between font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-slate-200/80 flex items-center justify-between backdrop-blur-md bg-white/80 shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base">MediCore</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-700 font-bold tracking-wider">
                Restricted
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Hospital Administration & Operations Console</p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="size-3.5 text-slate-400" /> General Login
        </Link>
      </header>

      {/* Main Container - Non-scrollable and centered */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-3.5">
          {/* Security Banner Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-200/60">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="size-4 text-teal-600" />
                {step === 1 ? "Administrative Gateway" : "Two-Step Verification"}
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {step === 1 ? "Audited Session" : "MFA Challenge"}
              </span>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{error}</div>
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="space-y-1 mb-4">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Admin Authentication
                  </h1>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter your administrative credentials or authorized security badge token. Third-party authentication is disabled for this tier.
                  </p>
                </div>

                {/* Tab switch: Password vs Badge Token */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === "password"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
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
                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === "badge"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <QrCode className="size-3.5" /> Hardware Badge
                  </button>
                </div>

                {/* Password Auth Form */}
                {authMode === "password" ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Staff ID / Admin Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="ADM-2026-0001 or admin@hospital.org"
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Administrative Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
                      className="w-full mt-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
                  <form onSubmit={handleBadgeLogin} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Staff Identifier (Staff ID)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="ADM-2026-0001"
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Hardware / NFC Badge Token
                      </label>
                      <div className="relative">
                        <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={badgeToken}
                          onChange={(e) => setBadgeToken(e.target.value)}
                          placeholder="Tap badge or input token"
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Use an authorized hospital NFC reader or provisioned hardware token.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
              <form onSubmit={handleTotpVerify} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-2.5">
                  <Smartphone className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 mb-0.5">Authenticator Code Required</p>
                    Open your Authenticator app and enter the 6-digit code for <span className="font-mono font-semibold text-teal-800">{staffId || "Administrator"}</span>.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>6-Digit Security Code</span>
                    <span className="text-[10px] text-teal-700 font-mono font-semibold">30s Refresh</span>
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
                    className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xl text-center font-mono tracking-[0.4em] text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setTotpCode("");
                      setError("");
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="size-3.5" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || totpCode.length < 6}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        Verify Code <CheckCircle2 className="size-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Security notice footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
              <span>
                All transactions are logged with IP binding and 4-hour max session validity.
              </span>
            </div>
          </div>

          {/* Help link */}
          <div className="text-center text-xs text-slate-500 space-y-0.5">
            <p>
              Need a new Administrator account?{" "}
              <Link href="/admin/register" className="text-teal-700 font-semibold hover:underline">
                Register Admin Credentials
              </Link>
            </p>
            <p className="text-slate-400 text-[11px]">
              Lost badge or locked account? Contact IT Security (<span className="font-mono text-teal-700">it-sec@medicore.org</span>)
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer Bar */}
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
