"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import { Manrope, Inter } from "next/font/google";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bell,
    Building2,
    CheckCircle2,
    ChevronRight,
    Cpu,
    CreditCard,
    FileSpreadsheet,
    FileText,
    KeyRound,
    Layers,
    LockKeyhole,
    Menu,
    Pill,
    Search,
    Server,
    Shield,
    UserCheck,
    Users,
    X,
    ClipboardList,
} from "lucide-react";

/* =========================================================
   FONTS
   Manrope: display face, used sparingly for headings — has a
   confident, slightly geometric feel that stays legible at
   large sizes. Inter: body face, tuned for on-screen reading
   at small sizes (better x-height / hinting than the previous
   system-font fallback).
========================================================= */

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    variable: "--font-manrope",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
    display: "swap",
});

/* =========================================================
   DATA
========================================================= */

const features = [
    {
        icon: Users,
        title: "Patient Management",
        desc: "End-to-end patient lifecycle from admission to discharge.",
    },
    {
        icon: ClipboardList,
        title: "Appointments",
        desc: "Smart scheduling with availability and booking controls.",
    },
    {
        icon: FileText,
        title: "Medical Records",
        desc: "Secure clinical records, prescriptions and test results.",
    },
    {
        icon: Pill,
        title: "Pharmacy & Laboratory",
        desc: "Integrated inventory and diagnostic workflows.",
    },
    {
        icon: CreditCard,
        title: "Billing & Insurance",
        desc: "Automated billing, claims and payment processing.",
    },
    {
        icon: BarChart3,
        title: "Hospital Analytics",
        desc: "Real-time insights for operational decisions.",
    },
];

const securityFeatures = [
    {
        icon: LockKeyhole,
        title: "Role-based access",
        desc: "Granular permissions ensure staff only access the data they need.",
    },
    {
        icon: KeyRound,
        title: "Secure authentication",
        desc: "MFA and SSO provide secure access for every team.",
    },
    {
        icon: Shield,
        title: "Encrypted data",
        desc: "End-to-end encryption protects sensitive healthcare information.",
    },
    {
        icon: FileSpreadsheet,
        title: "Audit logs",
        desc: "Complete visibility into user activity and data access.",
    },
];

const navigation = [
    ["Features", "#features"],
    ["Solutions", "#features"],
    ["Security", "#security"],
    ["Architecture", "#architecture"],
    ["Contact", "#contact"],
];

/* =========================================================
   MOTION HELPERS
   Centralized so every section animates consistently: a quiet
   fade + rise on scroll-in, staggered for grids of cards.
   Respects prefers-reduced-motion by disabling movement, not
   just shortening it.
========================================================= */

const fadeUp = (reduce: boolean): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
});

const staggerParent: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

function Reveal({
                    children,
                    className,
                    as = "div",
                }: {
    children: React.ReactNode;
    className?: string;
    as?: "div" | "section";
}) {
    const reduce = useReducedMotion();
    const Comp = motion[as];
    return (
        <Comp
            className={className}
            variants={fadeUp(!!reduce)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
        >
            {children}
        </Comp>
    );
}

/* =========================================================
   SMOOTH SCROLL (Lenis)
   Initialized once on mount, torn down on unmount. Skips the
   smoothing entirely when the user has reduced motion enabled
   — Lenis still lets native scroll behave normally in that case.
========================================================= */

function useLenis() {
    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
            smoothWheel: true,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MediCoreLanding() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const reduce = useReducedMotion();
    useLenis();

    return (
        <main
            className={`${manrope.variable} ${inter.variable} min-h-screen overflow-x-clip bg-white font-[family-name:var(--font-inter)] text-[#111827] antialiased`}
        >
            {/* =====================================================
          NAVBAR
      ===================================================== */}

            <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:h-[76px] lg:px-12">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 sm:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#0f172a] text-white sm:h-9 sm:w-9">
                            <span className="text-sm font-bold">M</span>
                        </div>

                        <div className="leading-none">
                            <span className="font-[family-name:var(--font-manrope)] text-[22px] font-bold tracking-[-0.03em] text-[#0f172a] sm:text-[26px] lg:text-[28px]">
                                MediCore
                            </span>

                            <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:block">
                                Healthcare Systems
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
                        {navigation.map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className="relative py-2 text-[13px] font-medium text-slate-600 transition-colors hover:text-[#0f172a]"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <Link href="/register" passHref >
                        <motion.button
                            whileHover={reduce ? undefined : { scale: 1.03 }}
                            whileTap={reduce ? undefined : { scale: 0.97 }}
                            className="hidden items-center gap-2 rounded-[5px] bg-[#0f172a] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1e293b] lg:flex"
                        >
                            Get started
                            <ArrowRight className="h-3.5 w-3.5" />
                        </motion.button>
                    </Link>

                    {/* Mobile button */}
                    <button
                        type="button"
                        aria-label="Open menu"
                        aria-expanded={mobileMenu}
                        onClick={() => setMobileMenu((value) => !value)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                    >
                        {mobileMenu ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence initial={false}>
                    {mobileMenu && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
                        >
                            <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 sm:px-6">
                                {navigation.map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setMobileMenu(false)}
                                        className="flex items-center justify-between border-b border-slate-100 py-4 text-sm font-semibold text-slate-700"
                                    >
                                        {label}
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                    </a>
                                ))}

                                <Link href="/register" passHref >
                                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#0f172a] py-3.5 text-xs font-bold uppercase tracking-wider text-white">
                                        Get started
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* =====================================================
          HERO
      ===================================================== */}

            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-[1440px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-14">
                    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                        {/* Hero copy */}
                        <motion.div
                            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-5"
                        >
                            <h1 className="max-w-[650px] text-balance font-[family-name:var(--font-manrope)] text-[clamp(2.5rem,8vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0f172a] sm:leading-[0.98]">
                                Simplifying Healthcare.
                                <br />
                                <span className="text-[#0f766e]">
                                    Connecting Every Department.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-[550px] text-[15px] leading-7 text-slate-500 sm:mt-7 sm:text-[16px]">
                                One secure and scalable platform for patients, clinicians,
                                operations and care.
                             </p>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                                <Link href="/register" passHref >
                                    <motion.button
                                        whileHover={reduce ? undefined : { scale: 1.02 }}
                                        whileTap={reduce ? undefined : { scale: 0.98 }}
                                        className="group flex items-center justify-center gap-2 rounded-[5px] bg-[#0f172a] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#1e293b]"
                                    >
                                        Get started
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </motion.button>
                                </Link>

                                <a
                                    href="#features"
                                    className="flex items-center justify-center rounded-[5px] border border-slate-300 bg-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    Explore platform
                                </a>
                            </div>

                            {/* Hero trust */}
                            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-medium text-slate-400">
                                {["Secure", "Scalable", "Unified"].map((item, index) => (
                                    <React.Fragment key={item}>
                                        {index > 0 && (
                                            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                                        )}

                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#0f766e]" />
                                            {item}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div>

                        {/* Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                            className="lg:col-span-7"
                        >
                            <div className="relative">
                                <div className="absolute -inset-6 rounded-[40px] bg-slate-200/40 blur-3xl" />

                                <div className="relative overflow-hidden rounded-[10px] border border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                                    {/* Dashboard top bar */}
                                    <div className="flex h-[56px] items-center justify-between border-b border-slate-200 px-3.5 sm:h-[62px] sm:px-6">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f172a] text-white sm:h-8 sm:w-8">
                                                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-semibold text-slate-800 sm:text-[13px]">
                                                    General Hospital
                                                </p>

                                                <p className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">
                                                    Hospital Operations
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-400 sm:gap-4">
                                            <Search className="h-4 w-4" />
                                            <Bell className="h-4 w-4" />
                                            <div className="h-7 w-7 rounded-full border border-slate-200 bg-slate-100" />
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <motion.div
                                        variants={staggerParent}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, margin: "-40px" }}
                                        className="grid grid-cols-2 gap-2.5 p-3.5 sm:grid-cols-4 sm:gap-3 sm:p-5"
                                    >
                                        {[
                                            ["TOTAL PATIENTS", "1,248", "+5.2%"],
                                            ["APPOINTMENTS", "142", "12 Today"],
                                            ["AVAILABLE BEDS", "36", "of 250"],
                                            ["REVENUE", "$42k", "+1.8%"],
                                        ].map(([title, value, sub]) => (
                                            <motion.div
                                                key={title}
                                                variants={fadeUp(!!reduce)}
                                                className="rounded-[6px] border border-slate-200 bg-white p-3 sm:p-4"
                                            >
                                                <p className="text-[8.5px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px]">
                                                    {title}
                                                </p>

                                                <p className="mt-2 font-[family-name:var(--font-manrope)] text-[19px] font-bold tracking-[-0.03em] text-[#0f172a] sm:text-[25px]">
                                                    {value}
                                                </p>

                                                <p className="mt-1 text-[10px] font-medium text-[#0f766e]">
                                                    {sub}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Dashboard body */}
                                    <div className="grid gap-3.5 px-3.5 pb-3.5 sm:grid-cols-[1.6fr_1fr] sm:gap-4 sm:px-5 sm:pb-5">
                                        {/* Schedule */}
                                        <div className="overflow-hidden rounded-[6px] border border-slate-200">
                                            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
                                                <p className="text-[13px] font-semibold text-slate-800">
                                                    Today&apos;s Schedule
                                                </p>

                                                <span className="text-[10px] text-slate-400">
                                                    View all
                                                </span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <div className="min-w-[390px]">
                                                    <div className="grid grid-cols-[65px_1.2fr_1fr_1fr] border-b border-slate-100 bg-slate-50 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                                        <span>Time</span>
                                                        <span>Patient</span>
                                                        <span>Doctor</span>
                                                        <span>Department</span>
                                                    </div>

                                                    {[
                                                        ["09:00 AM", "Sarah Jenkins", "Dr. Smith", "Cardiology"],
                                                        ["09:30 AM", "Michael Chen", "Dr. Lee", "Neurology"],
                                                        ["10:00 AM", "Emily Davis", "Dr. Smith", "Cardiology"],
                                                    ].map(([time, patient, doctor, department]) => (
                                                        <div
                                                            key={time}
                                                            className="grid grid-cols-[65px_1.2fr_1fr_1fr] border-b border-slate-100 px-3 py-3 text-[10px] text-slate-600 last:border-0 sm:text-[11px]"
                                                        >
                                                            <span className="text-slate-400">{time}</span>
                                                            <span className="font-medium text-slate-700">
                                                                {patient}
                                                            </span>
                                                            <span>{doctor}</span>
                                                            <span>{department}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent patients */}
                                        <div className="rounded-[6px] border border-slate-200">
                                            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
                                                <p className="text-[13px] font-semibold text-slate-800">
                                                    Recent Patients
                                                </p>

                                                <span className="text-[14px] text-slate-400">•••</span>
                                            </div>

                                            <div className="space-y-4 p-4">
                                                {[
                                                    ["SJ", "Sarah Jenkins", "P-98234"],
                                                    ["MC", "Michael Chen", "P-98235"],
                                                    ["ED", "Emily Davis", "P-98236"],
                                                ].map(([initials, name, id]) => (
                                                    <div key={id} className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                            {initials}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-[11px] font-semibold text-slate-700">
                                                                {name}
                                                            </p>

                                                            <p className="mt-0.5 text-[9px] text-slate-400">
                                                                ID: {id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          TRUST BAR
      ===================================================== */}

            <section className="border-y border-slate-200 bg-[#f8fafc]">
                <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
                    {[
                        [Activity, "99.99%", "Uptime"],
                        [Shield, "Secure", "By design"],
                        [Server, "Scalable", "Infrastructure"],
                        [Building2, "Multi-hospital", "Ready"],
                    ].map(([Icon, value, label]) => {
                        const TrustIcon = Icon as React.ElementType;

                        return (
                            <div
                                key={label as string}
                                className="flex items-center justify-center gap-2.5 px-3 py-5 sm:py-6"
                            >
                                <TrustIcon className="h-4 w-4 shrink-0 text-[#0f766e]" />

                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-600 sm:text-[12px]">
                                        {value as string}
                                    </p>

                                    <p className="mt-0.5 text-[9px] text-slate-400 sm:text-[10px]">
                                        {label as string}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* =====================================================
          FEATURES
      ===================================================== */}

            <section
                id="features"
                className="scroll-mt-20 bg-white py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                            Platform
                        </p>

                        <h2 className="mt-3 text-balance font-[family-name:var(--font-manrope)] text-[clamp(1.75rem,6vw,3rem)] font-bold leading-tight tracking-[-0.04em] text-[#0f172a]">
                            Everything Your Hospital Needs
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-slate-500 sm:text-[14px]">
                            Comprehensive modules designed for every department, unified in
                            one logical platform.
                        </p>
                    </Reveal>

                    <motion.div
                        variants={staggerParent}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-60px" }}
                        className="mt-10 grid overflow-hidden rounded-[8px] border border-slate-200 bg-slate-200 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {features.map((feature) => {
                            const FeatureIcon = feature.icon;

                            return (
                                <motion.article
                                    key={feature.title}
                                    variants={fadeUp(!!reduce)}
                                    whileHover={reduce ? undefined : { y: -3 }}
                                    className="group bg-white p-6 transition-colors duration-200 hover:bg-slate-50 sm:p-7"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#eff6ff] text-[#0f766e] transition-colors group-hover:bg-[#e6f5f3]">
                                        <FeatureIcon className="h-[18px] w-[18px]" />
                                    </div>

                                    <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 sm:mt-7">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 max-w-sm text-[12px] leading-6 text-slate-500 sm:text-[13px]">
                                        {feature.desc}
                                    </p>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
          SECURITY
      ===================================================== */}

            <section
                id="security"
                className="scroll-mt-20 bg-white py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
                    <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
                        {/* Security intro */}
                        <Reveal className="relative overflow-hidden rounded-[8px] bg-[#0f172a] p-7 text-white sm:p-9 lg:col-span-5 lg:p-10">
                            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#0f766e]/20 blur-3xl" />

                            <div className="relative">
                                <div className="flex h-11 w-11 items-center justify-center rounded-[7px] border border-white/10 bg-white/5">
                                    <Shield className="h-5 w-5 text-[#5eead4]" />
                                </div>

                                <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5eead4] sm:mt-14">
                                    Security
                                </p>

                                <h2 className="mt-3 max-w-sm text-balance font-[family-name:var(--font-manrope)] text-[clamp(1.75rem,5vw,2.7rem)] font-bold leading-tight tracking-[-0.035em]">
                                    Built for Healthcare Security
                                </h2>

                                <p className="mt-5 max-w-md text-[12px] leading-6 text-slate-400 sm:text-[13px]">
                                    Enterprise-grade security is built into every layer, from
                                    identity to infrastructure and data protection.
                                </p>
                            </div>
                        </Reveal>

                        {/* Security cards */}
                        <motion.div
                            variants={staggerParent}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            className="grid gap-3 sm:grid-cols-2 lg:col-span-7"
                        >
                            {securityFeatures.map((feature) => {
                                const SecurityIcon = feature.icon;

                                return (
                                    <motion.article
                                        key={feature.title}
                                        variants={fadeUp(!!reduce)}
                                        whileHover={reduce ? undefined : { y: -3 }}
                                        className="rounded-[8px] border border-slate-200 bg-[#f8fafc] p-5 transition-shadow duration-200 hover:shadow-sm sm:p-6"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#eaf2ff] text-[#0f766e]">
                                            <SecurityIcon className="h-[18px] w-[18px]" />
                                        </div>

                                        <h3 className="mt-5 text-[14px] font-semibold text-slate-900 sm:text-[15px]">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-[12px]">
                                            {feature.desc}
                                        </p>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =====================================================
          ARCHITECTURE
      ===================================================== */}

            <section
                id="architecture"
                className="scroll-mt-20 border-y border-slate-200 bg-[#f8fafc] py-16 sm:py-24 lg:py-28"
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
                    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                        {/* Text */}
                        <Reveal className="lg:col-span-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                Architecture
                            </p>

                            <h2 className="mt-3 text-balance font-[family-name:var(--font-manrope)] text-[clamp(1.75rem,6vw,3rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[#0f172a]">
                                One Platform.
                                <br />
                                Every Workflow.
                            </h2>

                            <p className="mt-5 max-w-md text-[13px] leading-6 text-slate-500 sm:text-[14px]">
                                Built on a robust microservices architecture that keeps
                                departments, systems and data connected.
                            </p>

                            <div className="mt-7 space-y-3.5">
                                {[
                                    "Centralized Data Hub",
                                    "Microservices Scalability",
                                    "Interoperable API Layer",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2.5">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0f766e]" />

                                        <span className="text-[12px] font-medium text-slate-600">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Architecture diagram */}
                        <Reveal className="lg:col-span-8">
                            <div className="rounded-[8px] border border-slate-200 bg-white p-5 sm:p-7 lg:p-9">
                                <div className="grid items-center gap-4 md:grid-cols-[1fr_180px_1fr]">
                                    {/* Left */}
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                                        {[
                                            [Users, "Patients"],
                                            [UserCheck, "Doctors"],
                                        ].map(([Icon, label]) => {
                                            const NodeIcon = Icon as React.ElementType;

                                            return (
                                                <div
                                                    key={label as string}
                                                    className="flex min-h-[72px] items-center gap-3 rounded-[7px] border border-slate-200 bg-white px-4 sm:min-h-[76px]"
                                                >
                                                    <NodeIcon className="h-5 w-5 shrink-0 text-[#0f766e]" />

                                                    <span className="text-[12px] font-semibold text-slate-700 sm:text-[13px]">
                                                        {label as string}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Core */}
                                    <motion.div
                                        whileHover={reduce ? undefined : { scale: 1.04 }}
                                        className="order-first flex flex-col items-center md:order-none"
                                    >
                                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[12px] bg-[#0f172a] text-white shadow-lg sm:h-[82px] sm:w-[82px]">
                                            <Cpu className="h-7 w-7 sm:h-8 sm:w-8" />
                                        </div>

                                        <p className="mt-4 text-[14px] font-semibold text-slate-800">
                                            MediCore Core
                                        </p>

                                        <p className="mt-1 text-center text-[9px] uppercase tracking-[0.12em] text-slate-400">
                                            Central Event Bus & API Gateway
                                        </p>
                                    </motion.div>

                                    {/* Right */}
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                                        {[
                                            [Layers, "Departments"],
                                            [Building2, "Administration"],
                                        ].map(([Icon, label]) => {
                                            const NodeIcon = Icon as React.ElementType;

                                            return (
                                                <div
                                                    key={label as string}
                                                    className="flex min-h-[72px] items-center gap-3 rounded-[7px] border border-slate-200 bg-white px-4 sm:min-h-[76px]"
                                                >
                                                    <NodeIcon className="h-5 w-5 shrink-0 text-[#0f766e]" />

                                                    <span className="text-[12px] font-semibold text-slate-700 sm:text-[13px]">
                                                        {label as string}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* =====================================================
          CTA
      ===================================================== */}

            <section
                id="contact"
                className="scroll-mt-20 border-t border-slate-200 bg-[#eaf2ff] py-16 sm:py-24 lg:py-28"
            >
                <Reveal className="mx-auto max-w-[1440px] px-4 text-center sm:px-6 lg:px-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                        MediCore
                    </p>

                    <h2 className="mx-auto mt-3 max-w-2xl text-balance font-[family-name:var(--font-manrope)] text-[clamp(1.9rem,7vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f172a]">
                        Build a Better Hospital
                        <br className="hidden sm:block" /> Experience.
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-[13px] leading-6 text-slate-500 sm:text-[14px]">
                        Bring your hospital&apos;s operations together on one modern
                        platform. Reduce complexity and focus on what matters most:
                        patient care.
                    </p>

                    <Link href="/register" passHref >
                        <motion.button
                            whileHover={reduce ? undefined : { scale: 1.03 }}
                            whileTap={reduce ? undefined : { scale: 0.97 }}
                            className="mt-8 inline-flex items-center gap-2 rounded-[5px] bg-[#0f172a] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-md transition-colors hover:bg-[#1e293b]"
                        >
                            Get started
                            <ArrowRight className="h-4 w-4" />
                        </motion.button>
                    </Link>
                </Reveal>
            </section>

            {/* =====================================================
          FOOTER
      ===================================================== */}

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
                    <div>
                        <span className="font-[family-name:var(--font-manrope)] text-[22px] font-bold tracking-[-0.02em] text-[#0f172a]">
                            MediCore
                        </span>

                        <p className="mt-1 text-[9px] text-slate-400">
                            © 2026 MediCore Systems Inc. All rights reserved.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-medium text-slate-400">
                        <a href="#" className="hover:text-slate-700">
                            Privacy Policy
                        </a>

                        <a href="#" className="hover:text-slate-700">
                            Terms of Service
                        </a>

                        <a href="#" className="hover:text-slate-700">
                            Security
                        </a>

                        <a href="#" className="hover:text-slate-700">
                            Cookie Settings
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}