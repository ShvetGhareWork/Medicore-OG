"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const error = searchParams.get("error");

    if (token) {
      // 1. Set cookie for Next.js Server-Side Middleware
      document.cookie = `jwt_token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // 2. Keep localStorage for Client-Side API calls
      localStorage.setItem("token", token);
      if (userId) {
        localStorage.setItem("userId", userId);
      }

      router.push("/dashboard");
    } else if (error) {
      console.error("OAuth2 error:", error);
      router.push(`/login?error=${encodeURIComponent(error)}`);
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center max-w-sm w-full space-y-4">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Signing you in...</h3>
          <p className="text-xs text-slate-500">Completing authentication with Google</p>
        </div>
      </div>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
