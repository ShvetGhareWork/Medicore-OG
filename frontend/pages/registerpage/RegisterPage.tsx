"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    HeartPulse,
    Shield,
    RefreshCw,
    User,
    Phone,
    Mail,
    Lock,
    Eye,
    CheckCircle2,
    Circle,
    ArrowRight,
    GitBranchPlusIcon,
} from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8081/oauth2/authorization/google";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch("http://localhost:8081/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.email,
                    password: data.password,
                    name: data.fullName,
                    roles: ["PATIENT"],
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || result.message || "Registration failed. Please try again."
                );
            }

            alert("Registration successful! Redirecting to login page...");
            router.push("/login");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to connect to the backend server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row font-sans text-slate-900 bg-white">
            {/* Left Panel - Branding & Information */}
            <div className="w-full lg:w-[45%] h-[10vh] lg:h-full bg-gradient-to-br from-blue-50 via-blue-100/60 to-cyan-100 p-4 lg:p-12 flex flex-row lg:flex-col justify-between items-center lg:items-start border-b lg:border-b-0 lg:border-r border-blue-200/50">
                <div className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900"/>
                    <span className="text-lg lg:text-xl font-bold tracking-tight">
            MediCore
          </span>
                </div>

                {/* Hidden on mobile to save vertical space */}
                <div className="hidden lg:block space-y-6 w-full max-w-md">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                        Modern Healthcare Infrastructure
                    </h1>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Connecting patients, doctors, departments, and hospital operations
                        through one secure platform.
                    </p>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Shield className="w-4 h-4 text-emerald-600"/>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                Enterprise-grade Security
              </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <RefreshCw className="w-4 h-4 text-emerald-600"/>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                Real-time Data Sync
              </span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block text-[11px] text-slate-500 font-medium">
                    © 2024 MediCore Systems Inc.
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex-1 w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
                <div className="w-full max-w-md border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
                    <div className="space-y-1 mb-5">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Create your MediCore account
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm">
                            Get started with a secure hospital management platform.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {error && (
                            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Contact Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    placeholder="Enter your contact number"
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a strong password"
                                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <Eye className="w-4 h-4"/>
                                </button>
                            </div>

                            {/* Password Requirements */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                                <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-slate-900"/> 8+ chars
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-slate-900"/> Uppercase
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                    <Circle className="w-3 h-3 text-slate-400"/> Number
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                    <Circle className="w-3 h-3 text-slate-400"/> Special
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                required
                            />
                            <label
                                htmlFor="terms"
                                className="text-[11px] sm:text-xs text-slate-600 leading-snug"
                            >
                                I agree to the{" "}
                                <a href="#" className="font-semibold text-slate-900 hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="font-semibold text-slate-900 hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Creating Account..." : "Create Account"}{" "}
                            <ArrowRight className="w-4 h-4"/>
                        </button>
                    </form>

                    {/* Social Sign Up */}
                    <div className="mt-5">
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Or sign up with
              </span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                            >
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
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <GitBranchPlusIcon className="w-3.5 h-3.5 text-slate-900"/>
                                <span className="text-xs font-semibold text-slate-700">
                  GitHub
                </span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-600 mt-5">
                        Already have an account?{" "}
                        <a href="/login" className="font-bold text-slate-900 hover:underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}