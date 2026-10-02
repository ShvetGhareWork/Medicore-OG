'use client';

import React, { useState, useMemo, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, Plus, Users, ClipboardCheck, Clock, PieChart,
    ChevronDown, Filter, RefreshCw, MoreVertical, LayoutDashboard,
    Calendar, Building2, UserPlus, Bed, FileText, Pill, FlaskConical,
    CreditCard, ShieldCheck, LineChart, Settings, HelpCircle, Menu, X,
    Download, Sparkles, HeartPulse, Activity, AlertCircle, CheckCircle2,
    ArrowRight, ArrowLeft, Check, User, Phone, MapPin, Stethoscope, Shield,
    FileCheck, Award
} from 'lucide-react';
import { createAdmission, CreateAdmissionPayload, AdmissionPatient } from '../../lib/api/admissionsApi';

/* =========================================
   INITIAL ADMISSION SEED DATA MATCHING IMAGE
   ========================================= */

const INITIAL_ADMISSIONS: AdmissionPatient[] = [
    {
        id: 'PT-2026-0814',
        fullName: 'Eleanor Rigby',
        dob: '1972-03-15',
        age: 54,
        gender: 'Female',
        contactNumber: '+1 (555) 345-6789',
        emergencyContactName: 'John Rigby',
        emergencyRelationship: 'Spouse',
        emergencyContactPhone: '+1 (555) 987-6543',
        chiefComplaint: 'Severe Acute Chest Pain',
        triageLevel: 'ESI Level 2 (Emergent)',
        admittingDiagnosis: 'Coronary Artery Syndrome',
        attendingDoctor: 'Dr. Marcus Vance',
        doctorSpecialty: 'Cardiology',
        ward: 'ICU',
        bedNo: 'Bed #ICU-04',
        admissionStatus: 'Admitted',
        admissionDate: '28 Aug 2026',
        admissionTime: '09:15 AM',
        expectedDischargeDate: '02 Sep 2026',
        dischargeDetail: 'Est. 5 days',
        insuranceProvider: 'BlueCross Health',
        clearanceStatus: 'Verified'
    },
    {
        id: 'PT-2026-0922',
        fullName: 'Liam Gallagher',
        dob: '1985-07-22',
        age: 41,
        gender: 'Male',
        contactNumber: '+1 (555) 234-5678',
        emergencyContactName: 'Noel Gallagher',
        emergencyRelationship: 'Brother',
        emergencyContactPhone: '+1 (555) 876-5432',
        chiefComplaint: 'Abdominal Trauma & Fever',
        triageLevel: 'ESI Level 3 (Urgent)',
        admittingDiagnosis: 'Acute Appendicitis Observation',
        attendingDoctor: 'Dr. Priya Shah',
        doctorSpecialty: 'ICU Lead',
        ward: 'Emergency',
        bedNo: 'Bay #ER-08',
        admissionStatus: 'Pending',
        admissionDate: '28 Aug 2026',
        admissionTime: '11:40 AM',
        expectedDischargeDate: 'TBD (Triage)',
        dischargeDetail: 'Bed prep ongoing',
        insuranceProvider: 'Medicare',
        clearanceStatus: 'Pending'
    },
    {
        id: 'PT-2026-0731',
        fullName: 'Chloe Zhao',
        dob: '1997-11-04',
        age: 29,
        gender: 'Female',
        contactNumber: '+1 (555) 876-1234',
        emergencyContactName: 'David Zhao',
        emergencyRelationship: 'Father',
        emergencyContactPhone: '+1 (555) 432-1098',
        chiefComplaint: 'Persistent High Fever & Dehydration',
        triageLevel: 'ESI Level 3 (Urgent)',
        admittingDiagnosis: 'Severe Pneumonia',
        attendingDoctor: 'Dr. Rahul Sharma',
        doctorSpecialty: 'Internal Med',
        ward: 'General',
        bedNo: 'Ward-Bed #GW-212',
        admissionStatus: 'Admitted',
        admissionDate: '27 Aug 2026',
        admissionTime: '04:20 PM',
        expectedDischargeDate: '31 Aug 2026',
        dischargeDetail: 'Est. 3 days',
        insuranceProvider: 'Aetna Select',
        clearanceStatus: 'Verified'
    },
    {
        id: 'PT-2026-0510',
        fullName: 'Amara Okafor',
        dob: '1991-02-18',
        age: 35,
        gender: 'Female',
        contactNumber: '+1 (555) 654-3210',
        emergencyContactName: 'Chidi Okafor',
        emergencyRelationship: 'Spouse',
        emergencyContactPhone: '+1 (555) 321-0987',
        chiefComplaint: 'Routine Post-Partum Care',
        triageLevel: 'ESI Level 4 (Less Urgent)',
        admittingDiagnosis: 'Post-Delivery Recovery',
        attendingDoctor: 'Dr. Priya Shah',
        doctorSpecialty: 'Obstetrics',
        ward: 'Maternity',
        bedNo: 'Suite #MAT-105',
        admissionStatus: 'Discharged',
        admissionDate: '24 Aug 2026',
        admissionTime: '08:00 AM',
        expectedDischargeDate: 'Today (Discharged)',
        dischargeDetail: 'Summary logged',
        insuranceProvider: 'Cigna Health',
        clearanceStatus: 'Verified'
    },
    {
        id: 'PT-2026-0551',
        fullName: 'Julian Sterling',
        dob: '1958-09-30',
        age: 68,
        gender: 'Male',
        contactNumber: '+1 (555) 987-0123',
        emergencyContactName: 'Claire Sterling',
        emergencyRelationship: 'Daughter',
        emergencyContactPhone: '+1 (555) 012-3456',
        chiefComplaint: 'Ischemic Stroke Assessment',
        triageLevel: 'ESI Level 1 (Resuscitation)',
        admittingDiagnosis: 'Acute Cerebrovascular Event',
        attendingDoctor: 'Dr. Ananya Desai',
        doctorSpecialty: 'Neurology',
        ward: 'ICU',
        bedNo: 'Bed #ICU-08',
        admissionStatus: 'Transferred',
        admissionDate: '25 Aug 2026',
        admissionTime: '02:10 PM',
        expectedDischargeDate: '05 Sep 2026',
        dischargeDetail: 'Post-Op Monitor',
        insuranceProvider: 'Medicare Prime',
        clearanceStatus: 'Verified'
    }
];

/* =========================================
   MULTI-STEP ADMISSION MODAL COMPONENT
   ========================================= */

interface AddAdmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdmissionAdded?: (newAdmission: AdmissionPatient) => void;
}

export function AddAdmissionModal({ isOpen, onClose, onAdmissionAdded }: AddAdmissionModalProps) {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [createdResult, setCreatedResult] = useState<AdmissionPatient | null>(null);

    // Admission Form State starts blank with no pre-filled mock defaults
    const [formData, setFormData] = useState({
        // Demographics
        fullName: '',
        dob: '',
        gender: 'Female',
        phone: '',
        address: '',

        // Emergency Contact
        emergencyName: '',
        emergencyRelationship: 'Spouse',
        emergencyPhone: '',

        // Triage & Assessment
        bp: '',
        hr: '',
        temp: '',
        spo2: '',
        chiefComplaint: '',
        triageLevel: 'ESI Level 2 (Emergent)',
        admittingDiagnosis: '',

        // Doctor & Dept
        attendingDoctor: '',
        doctorSpecialty: '',

        // Ward & Bed
        ward: 'ICU',
        roomOrBay: '',
        bedNo: '',
        expectedDischargeDate: '',

        // Insurance & Clearance
        insuranceProvider: 'BlueCross Health',
        policyNumber: '',
        authorizationCode: '',
        confirmed: false
    });

    const steps = [
        { id: 1, label: 'Demographics', title: 'Patient Demographics & Next-of-Kin' },
        { id: 2, label: 'Triage', title: 'Clinical Assessment & Triage' },
        { id: 3, label: 'Ward & Bed', title: 'Ward, Bed & Financial Clearance' },
        { id: 4, label: 'Review', title: 'Review & Admission Authorization' }
    ];

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
        setIsSubmitting(true);

        const payload: CreateAdmissionPayload = {
            fullName: formData.fullName,
            dob: formData.dob,
            gender: formData.gender,
            contactNumber: formData.phone,
            address: formData.address,

            emergencyContactName: formData.emergencyName,
            emergencyRelationship: formData.emergencyRelationship,
            emergencyContactPhone: formData.emergencyPhone,

            vitalsBloodPressure: formData.bp,
            vitalsHeartRate: formData.hr,
            vitalsTemperature: formData.temp,
            vitalsSpO2: formData.spo2,
            chiefComplaint: formData.chiefComplaint,
            triageLevel: formData.triageLevel,
            admittingDiagnosis: formData.admittingDiagnosis || formData.chiefComplaint,

            attendingDoctor: formData.attendingDoctor,
            doctorSpecialty: formData.doctorSpecialty,

            ward: formData.ward,
            roomOrBay: formData.roomOrBay,
            bedNo: formData.bedNo,
            expectedDischargeDate: formData.expectedDischargeDate,

            insuranceProvider: formData.insuranceProvider,
            policyNumber: formData.policyNumber,
            authorizationCode: formData.authorizationCode,
            consentConfirmed: formData.confirmed
        };

        try {
            const result = await createAdmission(payload);
            setCreatedResult(result);
            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                if (onAdmissionAdded) onAdmissionAdded(result);
                handleReset();
                onClose();
            }, 2500);
        } catch (err: any) {
            console.error("Error creating admission:", err);
            setIsSubmitting(false);
            setErrorMessage(err.message || 'Failed to process patient admission.');
        }
    };

    const handleReset = () => {
        setStep(1);
        setIsSuccess(false);
        setIsSubmitting(false);
        setErrorMessage(null);
        setCreatedResult(null);
        setFormData({
            fullName: '',
            dob: '',
            gender: 'Female',
            phone: '',
            address: '',

            emergencyName: '',
            emergencyRelationship: 'Spouse',
            emergencyPhone: '',

            bp: '',
            hr: '',
            temp: '',
            spo2: '',
            chiefComplaint: '',
            triageLevel: 'ESI Level 2 (Emergent)',
            admittingDiagnosis: '',

            attendingDoctor: '',
            doctorSpecialty: '',

            ward: 'ICU',
            roomOrBay: '',
            bedNo: '',
            expectedDischargeDate: '',

            insuranceProvider: 'BlueCross Health',
            policyNumber: '',
            authorizationCode: '',
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
                        className="relative z-10 w-full max-w-xl md:w-[580px] lg:w-[640px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 overflow-hidden"
                    >
                        {/* 1. TOP HEADER */}
                        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0 bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="w-5 h-5 rounded flex items-center justify-center text-teal-700">
                                        <Bed size={16} strokeWidth={2.2} />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                        Patient Admission Workflow
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

                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Patient Admission</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Step {step} of 4 — {steps[step - 1].title}
                            </p>

                            {/* Step Progress Indicators */}
                            <div className="mt-5">
                                <div className="grid grid-cols-4 gap-2 relative">
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
                                            <h3 className="text-xl font-bold text-slate-900">Admission Authorized!</h3>
                                            <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                                Patient <b>{formData.fullName}</b> has been admitted and assigned to <b>{formData.ward}</b>.
                                            </p>
                                        </div>

                                        {createdResult && (
                                            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 text-left w-full space-y-2 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-500 uppercase tracking-wider">Patient MRN ID</span>
                                                    <span className="font-mono font-bold text-teal-800">{createdResult.id}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-1 border-t border-teal-200/60">
                                                    <span className="font-semibold text-slate-500 uppercase tracking-wider">Ward / Bed Allocation</span>
                                                    <span className="font-semibold text-slate-900">{createdResult.bedNo}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-1 border-t border-teal-200/60">
                                                    <span className="font-semibold text-slate-500 uppercase tracking-wider">Attending Physician</span>
                                                    <span className="font-semibold text-slate-900">{createdResult.attendingDoctor}</span>
                                                </div>
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
                                        {/* STEP 1: DEMOGRAPHICS & EMERGENCY CONTACT */}
                                        {step === 1 && (
                                            <div className="space-y-5">
                                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                                                    <User size={18} className="text-teal-700 shrink-0" />
                                                    <p className="text-xs text-slate-600">
                                                        Enter legal patient demographics and primary emergency contact for hospital record registration.
                                                    </p>
                                                </div>

                                                {/* Full Name */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Patient Legal Name <span className="text-rose-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        placeholder="e.g. Eleanor Vance"
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                    />
                                                </div>

                                                {/* DOB, Gender & Contact */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Date of Birth <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={formData.dob}
                                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Gender <span className="text-rose-500">*</span>
                                                        </label>
                                                        <select
                                                            value={formData.gender}
                                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
                                                        >
                                                            <option value="Female">Female</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Contact Phone <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            placeholder="+1 (555) 000-0000"
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Residential Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        placeholder="Residential street address..."
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                    />
                                                </div>

                                                {/* Emergency Contact Header */}
                                                <div className="pt-3 border-t border-slate-200">
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                        <Phone size={14} className="text-teal-700" />
                                                        Emergency Contact & Next-of-Kin
                                                    </h4>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="sm:col-span-1">
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Contact Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.emergencyName}
                                                                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                                                placeholder="e.g. Arthur Vance"
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Relationship
                                                            </label>
                                                            <select
                                                                value={formData.emergencyRelationship}
                                                                onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
                                                            >
                                                                <option value="Spouse">Spouse</option>
                                                                <option value="Parent">Parent</option>
                                                                <option value="Sibling">Sibling</option>
                                                                <option value="Child">Child</option>
                                                                <option value="Friend / Other">Friend / Other</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Emergency Phone
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.emergencyPhone}
                                                                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                                                placeholder="+1 (555) 890-1234"
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 2: CLINICAL TRIAGE & ASSESSMENT */}
                                        {step === 2 && (
                                            <div className="space-y-5">
                                                {/* Initial Vital Signs */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                        <HeartPulse size={15} className="text-teal-700" />
                                                        Initial Vital Signs Assessment
                                                    </h4>

                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Blood Pressure</span>
                                                            <input
                                                                type="text"
                                                                value={formData.bp}
                                                                onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                                                                placeholder="120/80"
                                                                className="w-full mt-1 bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-900"
                                                            />
                                                        </div>
                                                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Heart Rate</span>
                                                            <input
                                                                type="text"
                                                                value={formData.hr}
                                                                onChange={(e) => setFormData({ ...formData, hr: e.target.value })}
                                                                placeholder="75 bpm"
                                                                className="w-full mt-1 bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-900"
                                                            />
                                                        </div>
                                                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Temperature</span>
                                                            <input
                                                                type="text"
                                                                value={formData.temp}
                                                                onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                                                                placeholder="98.6 °F"
                                                                className="w-full mt-1 bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-900"
                                                            />
                                                        </div>
                                                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">SpO2 Oxygen</span>
                                                            <input
                                                                type="text"
                                                                value={formData.spo2}
                                                                onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                                                                placeholder="98%"
                                                                className="w-full mt-1 bg-white border border-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-900"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chief Complaint */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Chief Complaint & Symptoms <span className="text-rose-500">*</span>
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={formData.chiefComplaint}
                                                        onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                                        placeholder="Describe primary symptoms on presentation..."
                                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all resize-none"
                                                    />
                                                </div>

                                                {/* Triage Level & Diagnosis */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Triage Severity (ESI Scale) <span className="text-rose-500">*</span>
                                                        </label>
                                                        <select
                                                            value={formData.triageLevel}
                                                            onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
                                                        >
                                                            <option value="ESI Level 1 (Resuscitation)">ESI Level 1 - Immediate Resuscitation</option>
                                                            <option value="ESI Level 2 (Emergent)">ESI Level 2 - Emergent / High Risk</option>
                                                            <option value="ESI Level 3 (Urgent)">ESI Level 3 - Urgent Care</option>
                                                            <option value="ESI Level 4 (Less Urgent)">ESI Level 4 - Less Urgent</option>
                                                            <option value="ESI Level 5 (Non-Urgent)">ESI Level 5 - Non-Urgent</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Admitting Diagnosis <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.admittingDiagnosis}
                                                            onChange={(e) => setFormData({ ...formData, admittingDiagnosis: e.target.value })}
                                                            placeholder="Initial clinical diagnosis..."
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Attending Physician Selection */}
                                                <div className="pt-2 border-t border-slate-200">
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Assigned Attending Doctor <span className="text-rose-500">*</span>
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { name: 'Dr. Marcus Vance', dept: 'Cardiology' },
                                                            { name: 'Dr. Priya Shah', dept: 'ICU Lead' },
                                                            { name: 'Dr. Rahul Sharma', dept: 'Internal Med' },
                                                            { name: 'Dr. Ananya Desai', dept: 'Neurology' }
                                                        ].map((doc) => {
                                                            const isSelected = formData.attendingDoctor === doc.name;
                                                            return (
                                                                <button
                                                                    key={doc.name}
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, attendingDoctor: doc.name, doctorSpecialty: doc.dept })}
                                                                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                                                                        isSelected
                                                                            ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600/30'
                                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                                    }`}
                                                                >
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                                        isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                                                                    }`}>
                                                                        {doc.name.slice(4, 6)}
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-slate-900 block leading-tight">{doc.name}</span>
                                                                        <span className="text-[10px] text-slate-500">{doc.dept}</span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: WARD, BED & FINANCIAL CLEARANCE */}
                                        {step === 3 && (
                                            <div className="space-y-5">
                                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                                                    <Bed size={18} className="text-teal-700 shrink-0" />
                                                    <p className="text-xs text-slate-600">
                                                        Select target ward, room/bay, and confirm insurance pre-authorization details.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Ward Allocation <span className="text-rose-500">*</span>
                                                        </label>
                                                        <select
                                                            value={formData.ward}
                                                            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
                                                        >
                                                            <option value="ICU">Intensive Care Unit (ICU)</option>
                                                            <option value="Emergency">Emergency Care (ER)</option>
                                                            <option value="General">General Ward</option>
                                                            <option value="Maternity">Maternity & Obstetrics</option>
                                                            <option value="Pediatrics">Pediatrics</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Room / Bay Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.roomOrBay}
                                                            onChange={(e) => setFormData({ ...formData, roomOrBay: e.target.value })}
                                                            placeholder="Bay #ICU-02"
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                            Bed Number <span className="text-rose-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.bedNo}
                                                            onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })}
                                                            placeholder="Bed #01"
                                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                        Estimated Discharge Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.expectedDischargeDate}
                                                        onChange={(e) => setFormData({ ...formData, expectedDischargeDate: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                    />
                                                </div>

                                                {/* Insurance Header */}
                                                <div className="pt-3 border-t border-slate-200">
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                        <ShieldCheck size={14} className="text-teal-700" />
                                                        Insurance & Financial Clearance
                                                    </h4>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Insurance Provider
                                                            </label>
                                                            <select
                                                                value={formData.insuranceProvider}
                                                                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
                                                            >
                                                                <option value="BlueCross Health">BlueCross Health</option>
                                                                <option value="Medicare Prime">Medicare Prime</option>
                                                                <option value="Aetna Select">Aetna Select</option>
                                                                <option value="Cigna Health">Cigna Health</option>
                                                                <option value="Self-Pay Deposit">Self-Pay / Private Deposit</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Policy / Member ID
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.policyNumber}
                                                                onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                                                                placeholder="Policy / Member ID"
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                                                                Pre-Auth Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.authorizationCode}
                                                                onChange={(e) => setFormData({ ...formData, authorizationCode: e.target.value })}
                                                                placeholder="Pre-auth code"
                                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 4: REVIEW & CONSENT */}
                                        {step === 4 && (
                                            <div className="space-y-5">
                                                {/* Patient Admission Digital Badge Preview Card */}
                                                <div className="p-4 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/70 via-white to-slate-50 relative overflow-hidden shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-lg ring-4 ring-white shadow-sm shrink-0">
                                                            {(formData.fullName || 'PT').slice(0, 2).toUpperCase()}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-base font-bold text-slate-900 truncate">
                                                                    {formData.fullName || 'Patient'}
                                                                </h4>
                                                                <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                                                                    {formData.ward}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                                                Auto-MRN • {formData.bedNo || 'Unassigned'} • {formData.attendingDoctor || 'Unassigned'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summary Grid */}
                                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 divide-y divide-slate-200/60 text-xs">
                                                    <div className="pb-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Chief Complaint</span>
                                                        <span className="text-slate-900 font-semibold text-right max-w-[260px] truncate">{formData.chiefComplaint}</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Triage Severity</span>
                                                        <span className="text-teal-700 font-semibold">{formData.triageLevel}</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Attending Physician</span>
                                                        <span className="text-slate-900 font-semibold">{formData.attendingDoctor} ({formData.doctorSpecialty})</span>
                                                    </div>
                                                    <div className="py-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Insurance Provider</span>
                                                        <span className="text-slate-900 font-semibold">{formData.insuranceProvider}</span>
                                                    </div>
                                                    <div className="pt-2.5 flex justify-between">
                                                        <span className="text-slate-400 font-medium">Emergency Contact</span>
                                                        <span className="text-slate-900 font-semibold">{formData.emergencyName} ({formData.emergencyRelationship})</span>
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
                                                            I confirm patient identity, clinical assessment, and signed admission consent forms
                                                        </span>
                                                        <span className="text-slate-500 mt-0.5 block leading-relaxed">
                                                            Complies with HIPAA hospital admission standards and bed allocation protocols.
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
                                        disabled={!formData.confirmed || isSubmitting}
                                        className={`font-semibold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                                            formData.confirmed && !isSubmitting
                                                ? 'bg-teal-800 hover:bg-teal-900 text-white cursor-pointer active:scale-95'
                                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Sparkles size={14} className="animate-spin" /> Authorizing Admission...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={14} strokeWidth={2.5} /> Process Patient Admission
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

/* =========================================
   MAIN ADMISSIONS DASHBOARD PAGE COMPONENT
   ========================================= */

export default function AdmissionsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [admissionsList, setAdmissionsList] = useState<AdmissionPatient[]>(INITIAL_ADMISSIONS);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWard, setSelectedWard] = useState('All Wards');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [selectedDoctor, setSelectedDoctor] = useState('Attending Doctor');
    const [activePage, setActivePage] = useState(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleAdmissionAdded = (newAdmission: AdmissionPatient) => {
        setAdmissionsList(prev => [newAdmission, ...prev]);
        showToast(`Patient "${newAdmission.fullName}" admitted successfully!`);
    };

    // Filter Logic matching image
    const filteredAdmissions = useMemo(() => {
        return admissionsList.filter(item => {
            const matchesSearch =
                item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.bedNo.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesWard =
                selectedWard === 'All Wards' ||
                item.ward.toLowerCase().includes(selectedWard.toLowerCase());

            const matchesStatus =
                selectedStatus === 'All Statuses' ||
                item.admissionStatus.toLowerCase() === selectedStatus.toLowerCase();

            const matchesDoctor =
                selectedDoctor === 'Attending Doctor' ||
                item.attendingDoctor.toLowerCase().includes(selectedDoctor.toLowerCase());

            return matchesSearch && matchesWard && matchesStatus && matchesDoctor;
        });
    }, [admissionsList, searchQuery, selectedWard, selectedStatus, selectedDoctor]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedWard('All Wards');
        setSelectedStatus('All Statuses');
        setSelectedDoctor('Attending Doctor');
        showToast('Filters reset to default');
    };

    const handleExport = () => {
        const json = JSON.stringify(admissionsList, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medicore-admissions-directory-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showToast('Admissions directory exported successfully');
    };

    const totalAdmittedCount = admissionsList.filter(a => a.admissionStatus === 'Admitted').length + 124;

    return (
        <div className="p-4 lg:p-8 space-y-6">
            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Sparkles size={18} className="text-teal-400" />
                    <span className="text-xs font-medium">{toastMessage}</span>
                </div>
            )}

            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <span>OPERATIONS</span>
                                <span>&gt;</span>
                                <span className="text-teal-700">PATIENT ADMISSIONS</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Admissions</h2>
                            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                                Manage inpatient admissions, clinical triage levels, ward and bed allocation, attending doctor links, and discharge tracking.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={handleExport}
                                className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                            >
                                <Download size={14} className="text-slate-500" />
                                Export Directory
                            </button>

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-3.5 py-2 bg-[#111827] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                            >
                                <Plus size={15} strokeWidth={2.5} /> New Admission
                            </button>
                        </div>
                    </div>

                    {/* Top KPI Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="TOTAL ADMITTED"
                            value={totalAdmittedCount.toString()}
                            trend="+8 admitted today"
                            trendStatus="good"
                            icon={<Bed size={18} className="text-teal-700" />}
                        />
                        <StatCard
                            title="PENDING BED PREP"
                            value="14"
                            trend="Awaiting ward clearance"
                            trendStatus="warning"
                            icon={<Clock size={18} className="text-amber-600" />}
                        />
                        <StatCard
                            title="ICU OCCUPANCY"
                            value="88%"
                            trend="14 / 16 beds occupied"
                            trendStatus="warning"
                            icon={<HeartPulse size={18} className="text-rose-600" />}
                        />
                        <StatCard
                            title="DISCHARGED TODAY"
                            value="12"
                            trend="4 pending final summary"
                            trendStatus="good"
                            icon={<CheckCircle2 size={18} className="text-teal-700" />}
                        />
                    </div>

                    {/* Filter & Search Bar matching image.png */}
                    <div className="bg-white p-3 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap gap-2.5 items-center justify-between">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by patient name, patient ID, ward..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {/* All Wards Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                                >
                                    <option value="All Wards">All Wards</option>
                                    <option value="ICU">ICU</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="General">General Ward</option>
                                    <option value="Maternity">Maternity</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* All Statuses Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                                >
                                    <option value="All Statuses">All Statuses</option>
                                    <option value="Admitted">Admitted</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Discharged">Discharged</option>
                                    <option value="Transferred">Transferred</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Attending Doctor Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                                >
                                    <option value="Attending Doctor">Attending Doctor</option>
                                    <option value="Dr. Marcus Vance">Dr. Marcus Vance</option>
                                    <option value="Dr. Priya Shah">Dr. Priya Shah</option>
                                    <option value="Dr. Rahul Sharma">Dr. Rahul Sharma</option>
                                    <option value="Dr. Ananya Desai">Dr. Ananya Desai</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            <button
                                onClick={handleResetFilters}
                                title="Reset filters"
                                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={14} />
                            </button>

                            <button
                                title="Filter options"
                                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                                <Filter size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Data Table matching image.png */}
                    <div className="bg-white border border-slate-200 rounded-b-xl shadow-2xs overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4 py-3">Patient</th>
                                    <th className="p-4 py-3">Attending Doctor</th>
                                    <th className="p-4 py-3">Ward / Bed No.</th>
                                    <th className="p-4 py-3">Admission Status</th>
                                    <th className="p-4 py-3">Admission Date</th>
                                    <th className="p-4 py-3">Expected Discharge</th>
                                    <th className="p-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredAdmissions.length > 0 ? (
                                    filteredAdmissions.map((patient, idx) => (
                                        <AdmissionTableRow
                                            key={patient.id + '-' + idx}
                                            patient={patient}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            No patient admissions match the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                            <div>Showing 1-{filteredAdmissions.length} of {filteredAdmissions.length + 120} admissions</div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActivePage(p => Math.max(1, p - 1))}
                                    className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer"
                                >
                                    &lt; Previous
                                </button>
                                {[1, 2, 3].map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setActivePage(page)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md font-semibold text-xs cursor-pointer ${
                                            activePage === page ? 'bg-[#111827] text-white' : 'hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <span className="px-1 text-slate-400">...</span>
                                <button
                                    onClick={() => setActivePage(p => p + 1)}
                                    className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer"
                                >
                                    Next &gt;
                                </button>
                            </div>
                        </div>
                    </div>

            {/* MULTI-STEP NEW ADMISSION MODAL */}
            <AddAdmissionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdmissionAdded={handleAdmissionAdded}
            />
        </div>
    );
}

function StatCard({ title, value, trend, icon, trendStatus = 'good' }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{title}</h3>
                <div className="p-1.5 bg-teal-50/70 rounded-lg">{icon}</div>
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                <div className="flex items-center gap-1.5 mt-1">
                    {trendStatus === 'good' && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
                    {trendStatus === 'warning' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                    <p className="text-[11px] text-slate-500">{trend}</p>
                </div>
            </div>
        </div>
    );
}

function AdmissionTableRow({ patient }: { patient: AdmissionPatient }) {
    const initials = patient.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // Status styling matching image.png
    const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
        Admitted: { bg: 'bg-teal-50', text: 'text-teal-800 font-semibold', dot: 'bg-teal-500' },
        Pending: { bg: 'bg-amber-50', text: 'text-amber-800 font-semibold', dot: 'bg-amber-500' },
        Discharged: { bg: 'bg-slate-100', text: 'text-slate-600 font-semibold', dot: 'bg-slate-400' },
        Transferred: { bg: 'bg-blue-50', text: 'text-blue-700 font-semibold', dot: 'bg-blue-500' }
    };

    const currentStatus = statusConfig[patient.admissionStatus] || statusConfig['Admitted'];

    return (
        <tr className="hover:bg-slate-50/80 transition-colors group">
            {/* PATIENT COLUMN */}
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200/80 flex items-center justify-center text-xs font-bold text-teal-800 shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-tight">{patient.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {patient.id} • {patient.age}y • {patient.gender}
                        </p>
                    </div>
                </div>
            </td>

            {/* ATTENDING DOCTOR */}
            <td className="p-4">
                <p className="font-semibold text-slate-900">{patient.attendingDoctor}</p>
                <p className="text-[11px] text-slate-400">{patient.doctorSpecialty}</p>
            </td>

            {/* WARD / BED NO. BADGE */}
            <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100/80 border border-slate-200/60 text-slate-700 font-mono">
                    {patient.ward} • {patient.bedNo}
                </span>
            </td>

            {/* ADMISSION STATUS */}
            <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${currentStatus.bg} ${currentStatus.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                    {patient.admissionStatus}
                </span>
            </td>

            {/* ADMISSION DATE */}
            <td className="p-4">
                <p className="font-semibold text-slate-800">{patient.admissionDate}</p>
                <p className="text-[11px] text-slate-400">{patient.admissionTime}</p>
            </td>

            {/* EXPECTED DISCHARGE */}
            <td className="p-4">
                <p className="font-semibold text-slate-800">{patient.expectedDischargeDate}</p>
                <p className="text-[11px] text-slate-400">{patient.dischargeDetail}</p>
            </td>

            {/* ACTIONS MATCHING IMAGE */}
            <td className="p-4 text-right">
                {patient.admissionStatus === 'Pending' ? (
                    <button className="text-xs font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer">
                        Assign Bed
                    </button>
                ) : patient.admissionStatus === 'Discharged' ? (
                    <span className="text-xs font-semibold text-slate-800 underline cursor-pointer">
                        Summary logged
                    </span>
                ) : patient.admissionStatus === 'Transferred' ? (
                    <span className="text-xs font-semibold text-slate-800 underline cursor-pointer">
                        Transfer History
                    </span>
                ) : (
                    <div className="flex items-center justify-end gap-1">
                        <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                            Details
                        </button>
                        <button className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 cursor-pointer">
                            <MoreVertical size={15} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
