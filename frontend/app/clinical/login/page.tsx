
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { badgeLogin } from "@/lib/api/clinicalAuth";
import { storeAuthSession } from "@/lib/auth";
import { 
  QrCode, 
  KeyRound, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  RefreshCw, 
  ShieldCheck,
  Stethoscope
} from "lucide-react";

function ClinicalLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"qr" | "manual">("qr");
  
  // Manual form state
  const [staffId, setStaffId] = useState("");
  const [badgeToken, setBadgeToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Scanner state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const hasScannedRef = useRef(false);

  // Check URL query parameters for session / auth errors
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam === "invalid-session" || errorParam === "invalid_session") {
      setErrorMessage("Authentication session was invalid or expired. Please scan your QR badge again.");
    } else if (errorParam === "session-expired") {
      setErrorMessage("Your clinical session has expired. Please authenticate to continue.");
    } else if (errorParam === "unauthorized") {
      setErrorMessage("Your staff account is not authorized for this terminal station.");
    }
  }, [searchParams]);

  const startScanner = async () => {
    setCameraError(null);
    hasScannedRef.current = false;
    
    if (!videoRef.current) return;

    try {
      const codeReader = new BrowserQRCodeReader();
      setIsScanning(true);

      const controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, error) => {
          if (result && !hasScannedRef.current) {
            hasScannedRef.current = true;
            const text = result.getText();
            try {
              let parsedStaffId = "";
              let parsedBadgeToken = "";

              if (text.startsWith("{") && text.endsWith("}")) {
                const parsed = JSON.parse(text);
                parsedStaffId = parsed.staffId || "";
                parsedBadgeToken = parsed.badgeToken || "";
              } else if (text.includes(":")) {
                const parts = text.split(":");
                parsedStaffId = parts[0];
                parsedBadgeToken = parts[1];
              } else {
                parsedBadgeToken = text;
              }

              if (parsedStaffId && parsedBadgeToken) {
                stopScanner();
                await handleBadgeAuth(parsedStaffId, parsedBadgeToken);
              } else {
                setErrorMessage("Invalid QR Code format. Please scan the QR code from your credential email.");
                hasScannedRef.current = false;
              }
            } catch (err: unknown) {
              setErrorMessage("Failed to process QR code content.");
              hasScannedRef.current = false;
            }
          }
        }
      );

      controlsRef.current = controls;
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check camera permissions or use manual entry.");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (activeTab === "qr") {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [activeTab]);

  const handleBadgeAuth = async (sId: string, bToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage("Credentials recognized! Authenticating...");

    try {
      const res = await badgeLogin({
        staffId: sId.trim(),
        badgeToken: bToken.trim(),
      });

      const token = res.jwt || res.token;
      const userId = res.id || res.userId;

      if (!token) {
        throw new Error("No authorization token received from server.");
      }

      storeAuthSession(token, userId, {
        fullName: res.fullName || res.username || sId,
        username: res.username || sId,
        email: res.email || "",
        staffId: res.staffId || sId,
        roles: res.roles || ["DOCTOR"],
        initials: (res.fullName || "DR").substring(0, 2).toUpperCase(),
      });

      setSuccessMessage("Authentication verified. Loading Clinical Dashboard...");
      stopScanner();

      // Reliable browser redirect so cookies take effect synchronously in middleware
      setTimeout(() => {
        window.location.href = "/clinical/dashboard";
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Badge authentication failed";
      setErrorMessage(msg);
      setSuccessMessage(null);
      hasScannedRef.current = false;
      if (activeTab === "qr") {
        startScanner();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId.trim() || !badgeToken.trim()) {
      setErrorMessage("Please enter both Staff ID and Badge Token.");
      return;
    }
    stopScanner();
    await handleBadgeAuth(staffId, badgeToken);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-3 border border-cyan-400/20">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            MediCore Clinical
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Point-of-Care Bedside Station
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "qr"
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan QR Badge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "manual"
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Manual Entry
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: QR Scanner */}
        {activeTab === "qr" && (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[280px] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center group shadow-inner">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="relative w-full h-full border-2 border-cyan-400/40 rounded-xl">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                  {/* Scanning active laser line animation */}
                  {isScanning && (
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-bounce" />
                  )}
                </div>
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Camera className="w-8 h-8 text-slate-500" />
                  <p className="text-xs text-slate-400">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startScanner}
                    className="mt-2 text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Camera
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              Hold the QR code received in your email up to the camera
            </p>
          </div>
        )}

        {/* Tab 2: Manual Entry */}
        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff ID
              </label>
              <input
                type="text"
                placeholder="e.g. DOC-2026-0001"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Badge Token
              </label>
              <input
                type="password"
                placeholder="Paste or enter 32-char badge token"
                value={badgeToken}
                onChange={(e) => setBadgeToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate Terminal
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> System Online
          </span>
          <span>MediCore v2.4</span>
        </div>
      </div>
    </div>
  );
}

export default function ClinicalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Loading Clinical Station...</div>}>
      <ClinicalLoginContent />
    </Suspense>
  );
}
