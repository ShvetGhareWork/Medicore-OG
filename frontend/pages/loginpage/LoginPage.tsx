"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldPlus,
  Shield,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GitBranchPlusIcon,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials or login failed.");
      }

      localStorage.setItem("token", result.jwt);
      localStorage.setItem("userId", result.id);

      alert("Login successful! Redirecting...");
      router.push("/");
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                      type="email"
                      name="email"
                      placeholder="doctor@hospital.org"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
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
                      className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400 font-mono"
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
                  className="w-full bg-[#111827] hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-all mt-2 disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="pt-1">
              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Or continue with
              </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        className="text-[#4285F4]"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        className="text-[#34A853]"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        className="text-[#FBBC05]"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        className="text-[#EA4335]"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-slate-700">
                  Google
                </span>
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                  <GitBranchPlusIcon className="w-3.5 h-3.5 text-slate-900" />
                  <span className="text-xs font-semibold text-slate-700">
                  GitHub
                </span>
                </button>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
              Don't have an account?{" "}
              <a
                  href="/register"
                  className="font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
  );
}