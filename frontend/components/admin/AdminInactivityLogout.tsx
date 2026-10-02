"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Clock, LogOut, RefreshCw } from "lucide-react";
import { clearAuthSession } from "@/lib/auth";

interface AdminInactivityLogoutProps {
  timeoutMinutes?: number;
  warningSeconds?: number;
}

export default function AdminInactivityLogout({
  timeoutMinutes = 15,
  warningSeconds = 60,
}: AdminInactivityLogoutProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(warningSeconds);

  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = (timeoutMinutes * 60 - warningSeconds) * 1000;

  const performLogout = useCallback(() => {
    clearAuthSession();
    setShowWarning(false);
    router.push("/admin/login?error=session-expired");
  }, [router]);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setSecondsRemaining(warningSeconds);
    }
  }, [showWarning, warningSeconds]);

  useEffect(() => {
    const handleUserActivity = () => {
      // Only reset automatically if warning modal is not currently displayed
      if (!showWarning) {
        lastActivityRef.current = Date.now();
      }
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleUserActivity, { passive: true }));

    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= timeoutMs) {
        performLogout();
      } else if (elapsed >= warningMs && !showWarning) {
        setShowWarning(true);
        const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));
        setSecondsRemaining(remaining);
      }
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      clearInterval(checkInterval);
    };
  }, [timeoutMs, warningMs, showWarning, performLogout]);

  // Countdown ticker when warning is visible
  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            performLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [showWarning, performLogout]);

  const handleExtendSession = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setSecondsRemaining(warningSeconds);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl text-slate-100 relative">
        <div className="flex items-center gap-3 text-amber-400 mb-4 pb-3 border-b border-slate-800">
          <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Administrative Inactivity Warning</h3>
            <p className="text-xs text-amber-400/80">Automated Security Policy</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            No activity detected on this console for 14 minutes. For patient data privacy and HIPAA compliance, your administrative session will automatically lock.
          </p>

          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Clock className="size-5 text-teal-400 animate-pulse" />
            <div className="text-center">
              <span className="text-2xl font-mono font-bold text-white tracking-wider">
                00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Seconds Remaining</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={performLogout}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="size-3.5" /> Sign Out Now
            </button>
            <button
              onClick={handleExtendSession}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="size-3.5" /> Stay Signed In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
