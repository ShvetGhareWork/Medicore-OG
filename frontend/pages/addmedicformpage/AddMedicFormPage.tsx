'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus, X, Camera, ShieldCheck, ChevronDown, Check,
    Stethoscope, Activity, Microscope, Briefcase, FileCheck, FlaskConical,
    Search, ArrowRight, ArrowLeft, Sparkles, CheckCircle2,
    Calendar, Phone, Mail, User, Building, Award, Key, QrCode, Trash2
} from 'lucide-react';
import { createStaff, CreateStaffPayload } from '../../lib/api/staffApi';

export interface StaffMember {
    name: string;
    email: string;
    id: string;
    dbId?: number | string;
    role: string;
    roleColor: string;
    dept: string;
    subDept: string;
    status: string;
    statusColor?: string;
    statusDot?: string;
    date: string;
    initials: string;
    avatarUrl?: string;
}

interface AddMedicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStaffAdded?: (newStaff: StaffMember) => void;
}

export function AddMedicModal({ isOpen, onClose, onStaffAdded }: AddMedicModalProps) {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [createdStaffResult, setCreatedStaffResult] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State starts blank with no pre-filled mock defaults
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        role: 'Doctor',
        department: '',
        designation: '',
        reportingTo: '',
        accessLevel: 'Elevated Access',
        loginMethod: 'Badge / QR Login',
        shiftSchedule: 'Full-Time (Day Shift)',
        confirmed: false
    });

    const steps = [
        { id: 1, label: 'Basic Info', title: 'Basic Information' },
        { id: 2, label: 'Role & Dept', title: 'Role & Department' },
        { id: 3, label: 'Access', title: 'Access & Security' },
        { id: 4, label: 'Review', title: 'Review & Verification' }
    ];

    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        }
    };

    const handleNext = () => {
        if (step < 4) {
            setDirection(1);
            setStep(s => s + 1);
            setErrorMessage(null);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(s => s - 1);
            setErrorMessage(null);
        }
    };

    const handleFinalSubmit = async () => {
        setErrorMessage(null);
        setIsGenerating(true);

        const roleMap: Record<string, string> = {
            Doctor: 'DOCTOR',
            Nurse: 'NURSE',
            Pathologist: 'PATHOLOGIST',
            'Insurance Coord.': 'INSURANCE_COORDINATOR',
            Administrative: 'ADMINISTRATIVE',
            'Lab Technician': 'LAB_TECHNICIAN'
        };

        const accessLevelMap: Record<string, string> = {
            'Elevated Access': 'ELEVATED',
            'Clinical Staff Access': 'STANDARD',
            'Administrative Access': 'STANDARD',
            'Read-Only Medical Access': 'STANDARD'
        };

        const loginMethodMap: Record<string, string> = {
            'Badge / QR Login': 'BADGE_QR',
            'Single Sign-On (SSO)': 'PASSWORD',
            'FIDO2 Hardware Key': 'PASSWORD'
        };

        const payload: CreateStaffPayload = {
            fullName: formData.fullName,
            email: formData.email,
            contactNumber: formData.phone || undefined,
            dateOfBirth: formData.dob || undefined,
            role: roleMap[formData.role] || 'DOCTOR',
            department: formData.department,
            designation: formData.designation,
            reportingToId: null,
            accessLevel: accessLevelMap[formData.accessLevel] || 'ELEVATED',
            loginMethod: loginMethodMap[formData.loginMethod] || 'BADGE_QR',
            temporaryPassword: 'TempPassword123!',
            photoUrl: avatarPreview || undefined
        };

        try {
            const result = await createStaff(payload);
            setCreatedStaffResult(result);
            setIsGenerating(false);
            setIsSuccess(true);

            // Generate initials
            const nameParts = (result.fullName || formData.fullName).replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, '').trim().split(' ');
            const initials = nameParts.length >= 2
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                : (result.fullName || formData.fullName).slice(0, 2).toUpperCase();

            // Generate Role Color
            const roleColorMap: Record<string, string> = {
                Doctor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
                Nurse: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
                Pathologist: 'bg-blue-50 text-blue-700 border border-blue-200/60',
                'Insurance Coord.': 'bg-amber-50 text-amber-700 border border-amber-200/60',
                Administrative: 'bg-purple-50 text-purple-700 border border-purple-200/60',
                'Lab Technician': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            };

            const newStaff: StaffMember = {
                name: result.fullName || formData.fullName,
                email: result.email || formData.email,
                id: result.staffId,
                role: formData.role,
                roleColor: roleColorMap[formData.role] || 'bg-slate-100 text-slate-700',
                dept: (result.department || formData.department || '').split('&')[0].trim(),
                subDept: result.designation || formData.designation,
                status: 'Active',
                date: 'Just Now',
                initials: initials,
                avatarUrl: avatarPreview || undefined
            };

            setTimeout(() => {
                if (onStaffAdded) onStaffAdded(newStaff);
                handleReset();
                onClose();
            }, 2500);
        } catch (err: any) {
            console.error("Error creating staff:", err);
            setIsGenerating(false);
            setErrorMessage(err.message || 'Failed to create staff member.');
        }
    };

    const handleReset = () => {
        setStep(1);
        setIsSuccess(false);
        setIsGenerating(false);
        setErrorMessage(null);
        setCreatedStaffResult(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            dob: '',
            role: 'Doctor',
            department: '',
            designation: '',
            reportingTo: '',
            accessLevel: 'Elevated Access',
            loginMethod: 'Badge / QR Login',
            shiftSchedule: 'Full-Time (Day Shift)',
            confirmed: false
        });
    };

    const stepVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 30 : -30,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -30 : 30,
            opacity: 0
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
                    {/* BACKDROP OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] cursor-pointer"
                        onClick={onClose}
                    />

                    {/* DRAWER PANEL */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="relative z-10 w-full max-w-xl md:w-[580px] lg:w-[620px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden"
                    >
                        {/* 1. TOP HEADER */}
                        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="w-5 h-5 rounded flex items-center justify-center text-teal-700">
                                        <UserPlus size={16} strokeWidth={2.2} />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Add Staff Member
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                    aria-label="Close drawer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Staff Member</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Step {step} of 4 — {steps[step - 1].title}
                            </p>

                            {/* Step Progress Indicators */}
                            <div className="mt-5">
                                <div className="grid grid-cols-4 gap-2 relative">
                                    {/* Line progress behind */}
                                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2 -z-0" />

                                    {steps.map((s) => {
                                        const isActive = step === s.id;
                                        const isCompleted = step > s.id;
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => {
                                                    if (s.id < step) {
                                                        setDirection(-1);
                                                        setStep(s.id);
                                                    }
                                                }}
                                                disabled={s.id > step}
                                                className={`relative z-10 flex items-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-medium transition-all text-left ${
                                                    isActive
                                                        ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/20'
                                                        : isCompleted
                                                            ? 'bg-teal-50 text-teal-800 border border-teal-200/80 cursor-pointer hover:bg-teal-100/70'
                                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-75'
                                                }`}
                                            >
                                                <span
                                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                                        isActive
                                                            ? 'bg-white text-teal-800'
                                                            : isCompleted
                                                                ? 'bg-teal-600 text-white'
                                                                : 'bg-slate-200 text-slate-500'
                                                    }`}
                                                >
                                                    {isCompleted ? <Check size={10} strokeWidth={3} /> : s.id}
                                                </span>
                                                <span className="truncate text-[11px] font-semibold">{s.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 2. SCROLLABLE STEP FORM BODY */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white relative">
                            {errorMessage && (
                                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center justify-between">
                                    <span>{errorMessage}</span>
                                    <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <AnimatePresence custom={direction} mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center ring-8 ring-teal-50/50 animate-bounce">
                                            <CheckCircle2 size={36} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Staff Member Added!</h3>
                                            <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                                Digital RFID credentials and profile for <b>{formData.fullName}</b> have been issued successfully.
                                            </p>
                                        </div>

                                        {createdStaffResult && (
                                            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 text-left w-full space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Staff ID</span>
                                                    <span className="text-sm font-mono font-bold text-teal-800">{createdStaffResult.staffId}</span>
                                                </div>
                                                {createdStaffResult.badgeToken && (
                                                    <div className="flex items-center justify-between pt-1 border-t border-teal-200/60">
                                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Badge Token</span>
                                                        <span className="text-xs font-mono font-semibold text-slate-700 truncate max-w-[200px]">{createdStaffResult.badgeToken}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={step}
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                                        className="space-y-5"
                                    >
                                        {/* STEP 1: BASIC INFO */}
                                        {step === 1 && (
                                            <div className="space-y-5">
                                                {/* Profile Portrait Upload */}
                                                <div className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/60 flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handlePhotoUpload}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="relative w-16 h-16 rounded-full border-2 border-dashed border-slate-300 hover:border-teal-500 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-teal-600 cursor-pointer transition-all shrink-0 group overflow-hidden"
                                                    >
                                                        {avatarPreview ? (
                                                            <>
                                                                <img
                                                                    src={avatarPreview}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                                    <Camera size={16} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Camera size={18} className="group-hover:scale-110 transition-transform" />
                                                                <span className="text-[10px] font-medium mt-1">Upload</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-slate-900">Profile Portrait</span>
                                                            <span className="text-[10px] font-medium bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full">
                                                                Optional
                                                            </span>
                                                            {avatarPreview && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setAvatarPreview(null);
                                                                    }}
                                                                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 ml-auto cursor-pointer"
                                                                >
                                                                    <Trash2 size={12} /> Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            Accepts JPG, PNG up to 5MB. Photo will be laser-encoded onto the clinician RFID badge.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Full Name */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="text-xs font-semibold text-slate-800">
                                                            Full Name <span className="text-rose-500">*</span>
                                                        </label>
                                                        <span className="text-[11px] text-slate-400">Official Legal & Credential Name</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        placeholder="e.g. Dr. Marcus Vance"
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                    />
                                                </div>

                                                {/* Work Email Address */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="text-xs font-semibold text-slate-800">
                                                            Work Email Address <span className="text-rose-500">*</span>
                                                        </label>
                                                        <span className="text-[11px] text-slate-400">Hospital domain login</span>
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="m.vance@medicore.org"
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                    />
                                                </div>

                                                {/* Phone and Date of Birth */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Contact Number
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={formData.phone}
                                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                placeholder="+1 (555) 234-8901"
                                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Date of Birth
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="date"
                                                                value={formData.dob}
                                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* HIPAA Notice Box */}
                                                <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-xl flex items-start gap-3">
                                                    <ShieldCheck size={18} className="text-teal-700 shrink-0 mt-0.5" />
                                                    <p className="text-xs text-slate-600 leading-relaxed">
                                                        <strong className="font-semibold text-slate-800">HIPAA & NPI Compliance:</strong> Contact details are strictly handled in accordance with hospital staff registry encryption protocols.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 2: ROLE & DEPARTMENT */}
                                        {step === 2 && (
                                            <div className="space-y-5">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-xs font-semibold text-slate-800">
                                                            Select Primary Role <span className="text-rose-500">*</span>
                                                        </label>
                                                        <span className="text-[11px] text-slate-400">Step 2 of 4</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mb-3">Assign the organizational role and clinical authority tier.</p>

                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                                        {[
                                                            { role: 'Doctor', desc: 'Attending / Fellow', icon: <Stethoscope size={18} /> },
                                                            { role: 'Nurse', desc: 'RN, NP, Triage Lead', icon: <Activity size={18} /> },
                                                            { role: 'Pathologist', desc: 'Diagnostics & Biopsy', icon: <Microscope size={18} /> },
                                                            { role: 'Insurance Coord.', desc: 'Claims & Prior-Auth', icon: <FileCheck size={18} /> },
                                                            { role: 'Administrative', desc: 'Ward & Clinic Admin', icon: <Briefcase size={18} /> },
                                                            { role: 'Lab Technician', desc: 'Specimen Analysis', icon: <FlaskConical size={18} /> }
                                                        ].map((item) => {
                                                            const isSelected = formData.role === item.role;
                                                            return (
                                                                <button
                                                                    key={item.role}
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, role: item.role })}
                                                                    className={`relative p-3 rounded-xl border text-left flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                                                                        isSelected
                                                                            ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-1 ring-teal-600/30'
                                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="absolute top-2 right-2 w-4 h-4 bg-teal-700 rounded-full flex items-center justify-center text-white">
                                                                            <Check size={10} strokeWidth={3} />
                                                                        </div>
                                                                    )}
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                                                                        isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                                                                    }`}>
                                                                        {item.icon}
                                                                    </div>
                                                                    <span className="text-xs font-semibold text-slate-900">{item.role}</span>
                                                                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Department <span className="text-rose-500">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={formData.department}
                                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 appearance-none transition-all pr-8 cursor-pointer"
                                                            >
                                                                <option value="">Select Department...</option>
                                                                <option value="Cardiology & Vascular Surgery">Cardiology & Vascular</option>
                                                                <option value="General Medicine">General Medicine</option>
                                                                <option value="Emergency Care">Emergency Care</option>
                                                                <option value="Neurology">Neurology</option>
                                                                <option value="Orthopedics">Orthopedics</option>
                                                                <option value="Pathology & Diagnostics">Pathology & Diagnostics</option>
                                                                <option value="Pediatrics">Pediatrics</option>
                                                                <option value="Radiology & Imaging">Radiology & Imaging</option>
                                                            </select>
                                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Designation / Title <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.designation}
                                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                            placeholder="Senior Physician / Attending Care"
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="text-xs font-semibold text-slate-800">
                                                            Reporting Supervisor
                                                        </label>
                                                        <span className="text-[11px] text-slate-400">Optional clinical lead</span>
                                                    </div>
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.reportingTo}
                                                            onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                                                            placeholder="Clinical lead name..."
                                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: ACCESS & SECURITY */}
                                        {step === 3 && (
                                            <div className="space-y-5">
                                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                                                    <ShieldCheck size={20} className="text-teal-700 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                                                            Automated Security Provisioning
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            A unique Staff ID, laser-encoded RFID identity profile, and hospital EHR key will be provisioned.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        EHR Access Level
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.accessLevel}
                                                            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 appearance-none transition-all pr-8 cursor-pointer"
                                                        >
                                                            <option value="Elevated Access">Elevated Access (EHR Orders, Prescriptions, Records)</option>
                                                            <option value="Clinical Staff Access">Clinical Staff Access (Standard EHR & Charting)</option>
                                                            <option value="Administrative Access">Administrative Access (Billing & Patient Check-in)</option>
                                                            <option value="Read-Only Medical Access">Read-Only Medical Access</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Preferred Login & Badge Verification
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.loginMethod}
                                                            onChange={(e) => setFormData({ ...formData, loginMethod: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 appearance-none transition-all pr-8 cursor-pointer"
                                                        >
                                                            <option value="Badge / QR Login">Badge RFID + PIN Verification</option>
                                                            <option value="FIDO2 Hardware Key">FIDO2 Hardware USB Key + Biometrics</option>
                                                            <option value="Single Sign-On (SSO)">Hospital Okta SSO + MFA Authenticator</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Primary Shift Schedule
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.shiftSchedule}
                                                            onChange={(e) => setFormData({ ...formData, shiftSchedule: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 appearance-none transition-all pr-8 cursor-pointer"
                                                        >
                                                            <option value="Full-Time (Day Shift)">Full-Time (Day Shift: 08:00 - 17:00)</option>
                                                            <option value="Full-Time (Night Shift)">Full-Time (Night Shift: 20:00 - 08:00)</option>
                                                            <option value="Rotational On-Call">Rotational On-Call Emergency</option>
                                                            <option value="Part-Time Consultant">Part-Time Consultant</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 4: REVIEW & CONFIRMATION */}
                                        {step === 4 && (
                                            <div className="space-y-5">
                                                {/* Digital RFID Badge Preview Card */}
                                                <div className="p-4 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/70 via-white to-slate-50 relative overflow-hidden shadow-sm">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-lg ring-4 ring-white shadow-sm overflow-hidden shrink-0">
                                                            {avatarPreview ? (
                                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                (formData.fullName || 'CL').slice(0, 2).toUpperCase()
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-base font-bold text-slate-900 truncate">
                                                                    {formData.fullName || 'Clinician'}
                                                                </h4>
                                                                <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                                                                    {formData.role}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                                                Auto-Generated Staff ID • {formData.designation || 'Staff'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Info Grid */}
                                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 divide-y divide-slate-200/60 text-xs">
                                                    <div className="pb-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Work Email</span>
                                                        <span className="text-slate-900 font-semibold">{formData.email}</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Department</span>
                                                        <span className="text-slate-900 font-semibold">{formData.department}</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Contact Number</span>
                                                        <span className="text-slate-900 font-semibold">{formData.phone}</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Access Tier</span>
                                                        <span className="text-teal-700 font-semibold">{formData.accessLevel}</span>
                                                    </div>
                                                    <div className="pt-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Login Method</span>
                                                        <span className="text-slate-900 font-semibold">{formData.loginMethod}</span>
                                                    </div>
                                                </div>

                                                {/* Verification Checkbox */}
                                                <label className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.confirmed}
                                                        onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                                                        className="mt-0.5 w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600 cursor-pointer"
                                                    />
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-slate-900 block">
                                                            I confirm this staff member's identity and credentials have been verified
                                                        </span>
                                                        <span className="text-slate-500 mt-0.5 block leading-relaxed">
                                                            Complies with HIPAA staff directory regulations and hospital access security standards.
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. FIXED BOTTOM FOOTER ACTIONS */}
                        {!isSuccess && (
                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 hover:shadow cursor-pointer active:scale-95"
                                    >
                                        Next: {steps[step].label}
                                        <ArrowRight size={14} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleFinalSubmit}
                                        disabled={!formData.confirmed || isGenerating}
                                        className={`font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                                            formData.confirmed && !isGenerating
                                                ? 'bg-teal-800 hover:bg-teal-900 text-white cursor-pointer active:scale-95'
                                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Sparkles size={14} className="animate-spin" /> Provisioning Badge...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={14} strokeWidth={2.5} /> Generate Staff ID & Badge
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default function AddMedicFormPage() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-teal-800 transition-colors"
            >
                Open Add Staff Member Drawer
            </button>
            <AddMedicModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
