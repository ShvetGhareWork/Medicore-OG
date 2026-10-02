"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  AlertTriangle,
  X,
  Lock,
  ArrowRight,
  QrCode
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api/config";

interface MfaSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  onMfaEnabled?: () => void;
}

export default function MfaSetupModal({
  isOpen,
  onClose,
  username,
  onMfaEnabled,
}: MfaSetupModalProps) {
  const [step, setStep] = useState<"initial" | "verify" | "success">("initial");
  const [secretKey, setSecretKey] = useState("");
  const [qrCodeUri, setQrCodeUri] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartSetup = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const storedUserId = localStorage.getItem("userId");
      const targetUser = username || storedUserId || "admin";

      const res = await fetch(`${API_BASE_URL}/auth/mfa/setup?username=${encodeURIComponent(targetUser)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to initialize MFA setup.");
      }

      setSecretKey(data.secretKey);
      setQrCodeUri(data.qrCodeUri);
      setStep("verify");
    } catch (err: any) {
      console.error("MFA setup start error:", err);
      setError(err.message || "Failed to contact authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const storedUserId = localStorage.getItem("userId");
      const targetUser = username || storedUserId || "admin";

      const res = await fetch(`${API_BASE_URL}/auth/mfa/enable?username=${encodeURIComponent(targetUser)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          secretKey: secretKey,
          totpCode: totpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Invalid 6-digit confirmation code.");
      }

      setStep("success");
      if (onMfaEnabled) {
        onMfaEnabled();
      }
    } catch (err: any) {
      console.error("MFA enable error:", err);
      setError(err.message || "Failed to verify 6-digit confirmation code.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="size-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Two-Factor Authentication (2FA)</h2>
            <p className="text-xs text-slate-400">RFC 6238 TOTP Authenticator Security</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {step === "initial" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Protect your administrative hospital account by requiring a 6-digit one-time code from an Authenticator app (Google Authenticator, Authy, Microsoft Authenticator) whenever you sign in.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Smartphone className="size-4" /> Recommended for Administrators
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Prevents account compromise even if your administrative password is leaked or guessed.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartSetup}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Generating Secret..." : "Set Up Authenticator"} <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <form onSubmit={handleConfirmEnable} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter this Secret Key into your Authenticator app (Google Authenticator, Authy, etc.):
            </p>

            {/* Secret Key Display */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Base32 Secret Key</p>
                <p className="font-mono text-sm font-bold text-teal-300 tracking-widest">{secretKey}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Enter 6-digit code to confirm
              </label>
              <input
                type="text"
                required
                autoFocus
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000 000"
                className="w-full py-2.5 px-4 bg-slate-950 border border-slate-700 rounded-xl text-center font-mono text-xl tracking-[0.4em] text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep("initial")}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || totpCode.length < 6}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Activating..." : "Confirm & Activate 2FA"}
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center py-4">
            <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Two-Factor Authentication Active</h3>
              <p className="text-xs text-slate-400">
                Your hospital administrator account is now protected with 2-Step TOTP authentication.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
