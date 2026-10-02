"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldPlus,
  Shield,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { extractRoles, getRedirectPathForRoles, storeAuthSession } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: (data.username || data.email || "").toString().trim(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Invalid credentials or login failed.");
      }

      storeAuthSession(result.jwt, result.id);
      const roles = extractRoles(result.jwt);
      const targetPath = getRedirectPathForRoles(roles);

      router.push(targetPath);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row font-sans text-slate-900 bg-white">
        {/* Left Panel - Branding */}
        <div className="w-full lg:w-1/2 bg-[#F8FAFC] p-8 lg:p-16 flex flex-col justify-between min-h-[40vh] lg:min-h-full border-b lg:border-b-0 lg:border-r border-slate-200/60 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-6 h-6 text-teal-700" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
            MediCore
          </span>
          </div>

          <div className="space-y-10 w-full max-w-lg my-auto pt-12 lg:pt-0">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Modern Healthcare Infrastructure
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                Connecting patients, doctors, departments, and hospital operations
                through one secure platform.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-teal-700" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Enterprise-grade Security
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    HIPAA compliant architecture designed for maximum data protection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-100/50 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-4 h-4 text-teal-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Real-time Data Sync
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Instant updates across all departments and remote care
                    facilities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-wrap gap-3 text-[11px] text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <span>© 2024 MediCore Systems Inc.</span>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Sign in to access your hospital management platform.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                  <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {error}
                  </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                  Email / Staff Identifier
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                      type="text"
                      name="username"
                      placeholder="admin@medicore.org or ADM-2026-0001"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                      required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <a
                      href="#"
                      className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400 font-mono"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                        <Eye className="w-4 h-4" />
                    ) : (
                        <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111827] hover:bg-slate-800 text-white text-sm font-semibold py-3 rounded-lg transition-all mt-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In Directly"}
              </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-600 pt-3">
              Don't have an account?{" "}
              <a
                  href="/register"
                  className="font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Sign up as Patient
              </a>
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hospital Administrator?</span>
              <a
                href="/admin/login"
                className="font-semibold text-slate-900 hover:text-teal-700 inline-flex items-center gap-1 transition-colors"
              >
                Dedicated Admin Portal &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}