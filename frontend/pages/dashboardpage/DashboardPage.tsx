'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, Bell, Plus, Users, ClipboardCheck, Clock, PieChart,
    ChevronDown, Filter, RefreshCw, MoreVertical, LayoutDashboard,
    Calendar, Building2, UserPlus, Bed, FileText, Pill, FlaskConical,
    CreditCard, ShieldCheck, LineChart, Settings, HelpCircle, Menu, X,
    Download, Sparkles, Edit2, Trash2, Loader2, LogOut
} from 'lucide-react';
import { AddMedicModal, StaffMember } from '../addmedicformpage/AddMedicFormPage';
import { EditStaffModal } from '../../components/admin/EditStaffModal';
import { getStaffList, deactivateStaff, deleteStaff, resendStaffCredentials } from '../../lib/api/staffApi';
import { getUserProfile } from '../../lib/auth';
import { Send, UserX } from 'lucide-react';

const INITIAL_STAFF: StaffMember[] = [
    {
        name: 'Dr. Priya Shah',
        email: 'p.shah@medicore.org',
        id: 'DOC-2026-0042',
        role: 'Doctor',
        roleColor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        dept: 'Cardiology',
        subDept: 'Chief Resident',
        status: 'Active',
        statusColor: 'text-teal-700 bg-teal-50',
        statusDot: 'bg-teal-500',
        date: '14 Jan 2024',
        initials: 'PS'
    },
    {
        name: 'Dr. Rahul Sharma',
        email: 'r.sharma@medicore.org',
        id: 'DOC-2026-0089',
        role: 'Doctor',
        roleColor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        dept: 'General Medicine',
        subDept: 'Senior Physician',
        status: 'Active',
        statusColor: 'text-teal-700 bg-teal-50',
        statusDot: 'bg-teal-500',
        date: '22 Feb 2024',
        initials: 'RS'
    },
    {
        name: 'Sarah Jenkins, RN',
        email: 's.jenkins@medicore.org',
        id: 'NRS-2026-0115',
        role: 'Nurse',
        roleColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
        dept: 'Emergency Care',
        subDept: 'Head Nurse / Triage Lead',
        status: 'Active',
        statusColor: 'text-teal-700 bg-teal-50',
        statusDot: 'bg-teal-500',
        date: '03 Mar 2024',
        initials: 'SJ'
    },
    {
        name: 'Dr. Ananya Desai',
        email: 'a.desai@medicore.org',
        id: 'DOC-2026-0156',
        role: 'Doctor',
        roleColor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        dept: 'Neurology',
        subDept: 'Senior Consultant',
        status: 'Active',
        statusColor: 'text-teal-700 bg-teal-50',
        statusDot: 'bg-teal-500',
        date: '18 Apr 2024',
        initials: 'AD'
    },
    {
        name: 'Vikram Joshi, MD',
        email: 'v.joshi@medicore.org',
        id: 'DOC-2026-0203',
        role: 'Doctor',
        roleColor: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        dept: 'Orthopedics',
        subDept: 'Associate Specialist',
        status: 'Inactive',
        statusColor: 'text-slate-600 bg-slate-100',
        statusDot: 'bg-slate-400',
        date: '09 May 2024',
        initials: 'VJ'
    },
    {
        name: 'Elena Rostova',
        email: 'e.rostova@medicore.org',
        id: 'LAB-2026-0091',
        role: 'Pathologist',
        roleColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
        dept: 'Pathology & Diagnostics',
        subDept: 'Senior Pathologist',
        status: 'Active',
        statusColor: 'text-teal-700 bg-teal-50',
        statusDot: 'bg-teal-500',
        date: '30 Jun 2024',
        initials: 'ER'
    }
];

function mapApiItemToStaffMember(item: any): StaffMember {
    const roleColorMap: Record<string, string> = {
        DOCTOR: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        NURSE: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
        PATHOLOGIST: 'bg-blue-50 text-blue-700 border border-blue-200/60',
        INSURANCE_COORDINATOR: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        ADMINISTRATIVE: 'bg-purple-50 text-purple-700 border border-purple-200/60',
        LAB_TECHNICIAN: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
    };

    const roleDisplayMap: Record<string, string> = {
        DOCTOR: 'Doctor',
        NURSE: 'Nurse',
        PATHOLOGIST: 'Pathologist',
        INSURANCE_COORDINATOR: 'Insurance Coord.',
        ADMINISTRATIVE: 'Administrative',
        LAB_TECHNICIAN: 'Lab Technician',
        PATIENT: 'Patient',
        ADMIN: 'Admin'
    };

    const nameParts = (item.fullName || '').replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, '').trim().split(' ');
    const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : (item.fullName || 'ST').slice(0, 2).toUpperCase();

    const roleStr = item.role || 'DOCTOR';
    const statusStr = item.status === 'INACTIVE' ? 'Inactive' : item.status === 'PENDING' ? 'Pending' : 'Active';

    const formattedDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Just Now';

    return {
        name: item.fullName || 'Unknown Staff',
        email: item.email || '',
        id: item.staffId || 'STF-0000',
        dbId: item.id,
        role: roleDisplayMap[roleStr] || roleStr,
        roleColor: roleColorMap[roleStr] || 'bg-slate-100 text-slate-700',
        dept: item.department || 'General',
        subDept: item.designation || '',
        status: statusStr,
        statusColor: statusStr === 'Active' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 bg-slate-100',
        statusDot: statusStr === 'Active' ? 'bg-teal-500' : 'bg-slate-400',
        date: formattedDate,
        initials: initials,
        avatarUrl: item.photoUrl || undefined,
        createdByStaffId: item.createdByStaffId
    };
}

export default function StaffDashboard() {
    const currentUserProfile = useMemo(() => getUserProfile(), []);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
    const [totalElements, setTotalElements] = useState<number>(348);
    const [totalPages, setTotalPages] = useState<number>(35);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [onlyMyAdditions, setOnlyMyAdditions] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setActivePage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchStaffData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getStaffList({
                role: selectedRole,
                department: selectedDept,
                status: selectedStatus,
                search: debouncedSearch,
                createdBy: onlyMyAdditions ? 'self' : undefined,
                page: activePage - 1,
                size: 10
            });

            if (data && data.content) {
                const apiMembers = data.content.map(mapApiItemToStaffMember);
                setStaffList(apiMembers);
                setTotalElements(data.totalElements || apiMembers.length);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err) {
            console.warn("API fetch unavailable, using current staff list:", err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedRole, selectedDept, selectedStatus, debouncedSearch, onlyMyAdditions, activePage]);

    useEffect(() => {
        fetchStaffData();
    }, [fetchStaffData]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleStaffAdded = (newStaff: StaffMember) => {
        setStaffList(prev => [newStaff, ...prev]);
        setTotalElements(prev => prev + 1);
        showToast(`Staff member "${newStaff.name}" added successfully!`);
        fetchStaffData();
    };

    const handleEdit = (staff: StaffMember) => {
        setEditingStaff(staff);
        setIsEditModalOpen(true);
    };

    const handleStaffUpdated = (updated: StaffMember) => {
        setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
        showToast(`Staff member "${updated.name}" updated successfully!`);
        fetchStaffData();
    };

    const handleDeactivate = async (staff: StaffMember) => {
        if (!confirm(`Deactivate "${staff.name}"? This will disable their active credentials.`)) return;
        try {
            const targetId = staff.dbId || staff.id;
            await deactivateStaff(targetId);
            setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, status: 'Inactive', statusColor: 'text-slate-600 bg-slate-100', statusDot: 'bg-slate-400' } : s));
            showToast(`"${staff.name}" has been marked Inactive.`);
        } catch (err: any) {
            showToast(`Failed to deactivate: ${err.message}`);
        }
    };

    const handleDeletePermanent = async (staff: StaffMember) => {
        if (!confirm(`Permanently delete "${staff.name}" (${staff.id})? This will remove their record and credentials completely.`)) return;
        try {
            const targetId = staff.dbId || staff.id;
            await deleteStaff(targetId);
            setStaffList(prev => prev.filter(s => s.id !== staff.id));
            setTotalElements(prev => Math.max(0, prev - 1));
            showToast(`Staff member "${staff.name}" has been permanently deleted.`);
        } catch (err: any) {
            showToast(`Failed to delete: ${err.message}`);
        }
    };

    const [resendingStaffId, setResendingStaffId] = useState<string | null>(null);

    const handleResendCredentials = async (staff: StaffMember) => {
        setResendingStaffId(staff.id);
        try {
            const targetId = staff.dbId || staff.id;
            await resendStaffCredentials(targetId);
            showToast(`✅ Fresh QR credentials & login badge sent to ${staff.email}`);
        } catch (err: any) {
            showToast(`❌ Failed to resend credentials: ${err.message}`);
        } finally {
            setResendingStaffId(null);
        }
    };

    const filteredStaff = useMemo(() => {
        return staffList.filter(staff => {
            const matchesSearch =
                staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.dept.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = selectedRole === 'All Roles' || staff.role.toLowerCase() === selectedRole.toLowerCase();
            const matchesDept = selectedDept === 'All Departments' || staff.dept.toLowerCase().includes(selectedDept.toLowerCase());
            const matchesStatus = selectedStatus === 'All Statuses' || staff.status.toLowerCase() === selectedStatus.toLowerCase();

            return matchesSearch && matchesRole && matchesDept && matchesStatus;
        });
    }, [staffList, searchQuery, selectedRole, selectedDept, selectedStatus]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedRole('All Roles');
        setSelectedDept('All Departments');
        setSelectedStatus('All Statuses');
        setOnlyMyAdditions(false);
        setActivePage(1);
        showToast('Filters reset to default');
    };

    const handleExport = () => {
        const json = JSON.stringify(staffList, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medicore-staff-directory-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showToast('Staff directory exported successfully');
    };

    return (
        <div className="w-full h-full min-h-0 bg-slate-50 font-sans text-slate-900 flex flex-col min-w-0 relative overflow-hidden">
            <style>{`
                /* Desktop: slim, auto-hiding scrollbar that only appears on hover/scroll */
                @media (min-width: 768px) {
                    .scroll-area {
                        scrollbar-width: none; /* Firefox: hidden until hover */
                    }
                    .scroll-area:hover,
                    .scroll-area:focus-within {
                        scrollbar-width: thin;
                        scrollbar-color: #cbd5e1 transparent;
                    }
                    .scroll-area::-webkit-scrollbar { width: 6px; height: 6px; }
                    .scroll-area::-webkit-scrollbar-track { background: transparent; }
                    .scroll-area::-webkit-scrollbar-thumb {
                        background: transparent;
                        border-radius: 10px;
                        transition: background 0.2s ease;
                    }
                    .scroll-area:hover::-webkit-scrollbar-thumb,
                    .scroll-area:focus-within::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                    }
                    .scroll-area::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                }
                /* Mobile: keep native touch scrolling, thin visible bar */
                @media (max-width: 767px) {
                    .scroll-area::-webkit-scrollbar { width: 4px; height: 4px; }
                    .scroll-area::-webkit-scrollbar-track { background: transparent; }
                    .scroll-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                }
            `}</style>

            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-[120] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300 sm:max-w-sm"
                >
                    <Sparkles size={18} className="text-teal-400 shrink-0" />
                    <span className="text-xs font-medium">{toastMessage}</span>
                </div>
            )}

            {/* SCROLLABLE PAGE BODY */}
            <div className="scroll-area flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">

                {/* Page Title & Breadcrumb */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <span>ADMINISTRATION</span>
                            <span>&gt;</span>
                            <span className="text-teal-700">STAFF MANAGEMENT</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Manage Staff</h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                            Add, edit, and manage verified clinician identities, role clearance, and digital hospital badges.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={handleExport}
                            aria-label="Export staff directory"
                            className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                        >
                            <Download size={14} className="text-slate-500 shrink-0" />
                            <span className="hidden sm:inline">Export Directory</span>
                            <span className="sm:hidden">Export</span>
                        </button>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            aria-label="Add staff member"
                            className="px-3.5 py-2 bg-[#111827] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Plus size={15} strokeWidth={2.5} className="shrink-0" />
                            <span className="hidden sm:inline">Add Staff Member</span>
                            <span className="sm:hidden">Add Staff</span>
                        </button>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="TOTAL STAFF" value={totalElements.toString()} trend="+12 this quarter" trendStatus="good" icon={<Users size={18} className="text-teal-700" />} />
                    <StatCard title="ACTIVE TODAY" value="284" trend="94% on-duty operational rate" trendStatus="good" icon={<ClipboardCheck size={18} className="text-teal-700" />} />
                    <StatCard title="PENDING ACTIVATIONS" value="6" trend="Awaiting credential verification" trendStatus="warning" icon={<Clock size={18} className="text-amber-600" />} />
                    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">BY ROLE BREAKDOWN</h3>
                            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                                <PieChart size={18} />
                            </div>
                        </div>
                        <div>
                            <p className="text-base font-bold text-slate-900 leading-tight">142 Doctors / 126 Nurses</p>
                            <p className="text-[11px] text-slate-500 mt-1">48 Administrative • 32 Laboratory Techs</p>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-3 rounded-t-xl border border-slate-200 border-b-0 flex flex-col xl:flex-row gap-3 xl:items-center justify-between">
                    <div className="relative w-full xl:w-72 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }}
                            placeholder="Search staff by name, email, ID..."
                            aria-label="Search staff"
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        <div className="relative flex-1 min-w-[9.5rem] sm:flex-none">
                            <select
                                value={selectedRole}
                                onChange={(e) => { setSelectedRole(e.target.value); setActivePage(1); }}
                                aria-label="Filter by role"
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                            >
                                <option value="All Roles">All Roles</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Pathologist">Pathologist</option>
                                <option value="Insurance Coord.">Insurance Coord.</option>
                                <option value="Administrative">Administrative</option>
                                <option value="Lab Technician">Lab Technician</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 min-w-[9.5rem] sm:flex-none">
                            <select
                                value={selectedDept}
                                onChange={(e) => { setSelectedDept(e.target.value); setActivePage(1); }}
                                aria-label="Filter by department"
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                            >
                                <option value="All Departments">All Departments</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Emergency Care">Emergency Care</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pathology">Pathology</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 min-w-[8rem] sm:flex-none">
                            <select
                                value={selectedStatus}
                                onChange={(e) => { setSelectedStatus(e.target.value); setActivePage(1); }}
                                aria-label="Filter by status"
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                            >
                                <option value="All Statuses">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={() => { setOnlyMyAdditions(prev => !prev); setActivePage(1); }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                onlyMyAdditions
                                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            <UserPlus size={13} className={onlyMyAdditions ? "text-teal-200" : "text-slate-500"} />
                            <span>Added by Me</span>
                        </button>

                        <button
                            onClick={handleResetFilters}
                            title="Reset filters"
                            aria-label="Reset filters"
                            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        </button>

                        <button
                            title="Filter options"
                            aria-label="More filter options"
                            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                            <Filter size={14} />
                        </button>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="bg-white border border-slate-200 rounded-b-xl shadow-2xs min-h-[380px] flex flex-col justify-between relative">
                    <div className="overflow-x-auto w-full">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-md">
                                    <Loader2 size={15} className="animate-spin text-teal-600" />
                                    <span className="text-xs font-semibold text-slate-700">Loading staff data…</span>
                                </div>
                            </div>
                        )}
                        <table className="w-full text-left border-collapse min-w-[820px]">
                            <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="p-4 py-3">Staff Member</th>
                                <th className="p-4 py-3">Staff ID</th>
                                <th className="p-4 py-3">Role</th>
                                <th className="p-4 py-3">Department</th>
                                <th className="p-4 py-3">Status</th>
                                <th className="p-4 py-3">Date Added</th>
                                <th className="p-4 py-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((staff, idx) => {
                                    const isCreatedByMe = Boolean(
                                        onlyMyAdditions ||
                                        (
                                            staff.createdByStaffId &&
                                            (
                                                staff.createdByStaffId === 'self' ||
                                                (currentUserProfile.staffId && staff.createdByStaffId.toLowerCase() === currentUserProfile.staffId.toLowerCase()) ||
                                                (currentUserProfile.username && staff.createdByStaffId.toLowerCase() === currentUserProfile.username.toLowerCase()) ||
                                                (currentUserProfile.email && staff.createdByStaffId.toLowerCase() === currentUserProfile.email.toLowerCase())
                                            )
                                        )
                                    );
                                    return (
                                        <TableRow
                                            key={staff.id + '-' + idx}
                                            {...staff}
                                            isNew={staff.date === 'Just Now'}
                                            isCreatedByMe={isCreatedByMe}
                                            isResending={resendingStaffId === staff.id}
                                            onEdit={() => handleEdit(staff)}
                                            onDeactivate={() => handleDeactivate(staff)}
                                            onDelete={() => handleDeletePermanent(staff)}
                                            onResend={() => handleResendCredentials(staff)}
                                        />
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                                        <Search size={24} className="mx-auto mb-2 text-slate-300" />
                                        <p className="font-medium text-slate-600">No staff members found</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 mt-auto bg-slate-50/40 rounded-b-xl">
                        <div>Showing 1-{filteredStaff.length} of {totalElements} staff members</div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActivePage(p => Math.max(1, p - 1))}
                                disabled={activePage <= 1}
                                aria-label="Previous page"
                                className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &lt; Previous
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setActivePage(page)}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={activePage === page ? 'page' : undefined}
                                    className={`w-7 h-7 flex items-center justify-center rounded-md font-semibold text-xs cursor-pointer ${
                                        activePage === page ? 'bg-[#111827] text-white' : 'hover:bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}
                            <button
                                onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                                disabled={activePage >= totalPages}
                                aria-label="Next page"
                                className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MULTI-STEP ADD STAFF MEMBER DRAWER MODAL */}
            <AddMedicModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onStaffAdded={handleStaffAdded}
            />

            {/* EDIT STAFF MEMBER MODAL */}
            <EditStaffModal
                isOpen={isEditModalOpen}
                staff={editingStaff}
                onClose={() => setIsEditModalOpen(false)}
                onStaffUpdated={handleStaffUpdated}
            />
        </div>
    );
}

/* =========================================
   HELPER COMPONENTS
   ========================================= */

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

function TableRow({
                      name, email, id, role, roleColor, dept, subDept, status, date, initials, avatarUrl, createdByStaffId, isCreatedByMe = false, isNew = false, isResending = false, onEdit, onDeactivate, onDelete, onResend
                  }: any) {
    const isInactive = status === 'Inactive';
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (menuOpen) {
            setMenuOpen(false);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuHeight = 185;
            const menuWidth = 210;
            const spaceBelow = window.innerHeight - rect.bottom;

            let top = rect.bottom + 6;
            if (spaceBelow < menuHeight && rect.top > menuHeight) {
                top = rect.top - menuHeight - 6;
            }

            const left = Math.max(12, rect.right - menuWidth);
            setMenuCoords({ top, left });
            setMenuOpen(true);
        }
    };

    useEffect(() => {
        if (!menuOpen) return;
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        const handleScrollOrResize = () => setMenuOpen(false);

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [menuOpen]);

    return (
        <tr className={`hover:bg-slate-50/90 transition-all duration-150 group ${isNew ? 'bg-teal-50/40' : ''}`}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden shrink-0 shadow-2xs">
                        {avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : initials}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-slate-900 tracking-tight">{name}</p>
                            {isNew && <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full">NEW</span>}
                            {isCreatedByMe && (
                                <span className="inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                                    {/* <Sparkles size={9} className="text-teal-600" />
                                    Added by You */}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-normal">{email}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 font-mono text-[11px] text-slate-600 font-medium">{id}</td>
            <td className="p-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${roleColor}`}>{role}</span>
            </td>
            <td className="p-4">
                <p className="font-semibold text-slate-900">{dept}</p>
                <p className="text-[11px] text-slate-400">{subDept}</p>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-slate-400' : 'bg-teal-500'}`} />
                    <span className={`text-xs font-medium ${isInactive ? 'text-slate-600' : 'text-teal-700'}`}>{status}</span>
                </div>
            </td>
            <td className="p-4 text-slate-500 text-xs">
                <div>{date}</div>
                {createdByStaffId && !isCreatedByMe && (
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">By: {createdByStaffId}</div>
                )}
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    {/* Quick Action: Resend QR */}
                    <button
                        onClick={onResend}
                        disabled={isResending}
                        title="Resend QR Credentials"
                        aria-label={`Resend credentials for ${name}`}
                        className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isResending ? <Loader2 size={15} className="animate-spin text-teal-600" /> : <Send size={15} />}
                    </button>

                    {/* Quick Action: Edit */}
                    <button
                        onClick={onEdit}
                        title="Edit Details"
                        aria-label={`Edit ${name}`}
                        className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                        <Edit2 size={15} />
                    </button>

                    {/* 3-Dots Menu Trigger */}
                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        aria-label={`More actions for ${name}`}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            menuOpen ? 'bg-slate-200 text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>

                {/* Portal-rendered Dropdown Menu */}
                {menuOpen && menuCoords && typeof document !== 'undefined' && createPortal(
                    <div
                        ref={menuRef}
                        style={{ top: `${menuCoords.top}px`, left: `${menuCoords.left}px` }}
                        role="menu"
                        className="fixed w-52 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-150 py-1.5 ring-1 ring-slate-900/5 text-left"
                    >
                        <button
                            role="menuitem"
                            disabled={isResending}
                            onClick={() => { setMenuOpen(false); onResend?.(); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {isResending ? <Loader2 size={14} className="animate-spin text-teal-600" /> : <Send size={14} />}
                            <span>{isResending ? "Sending Credentials..." : "Resend QR Credentials"}</span>
                        </button>
                        <button
                            role="menuitem"
                            onClick={() => { setMenuOpen(false); onEdit?.(); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            <Edit2 size={14} /> Edit Details
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                            role="menuitem"
                            onClick={() => { setMenuOpen(false); onDeactivate?.(); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                            <UserX size={14} /> Deactivate
                        </button>
                        <button
                            role="menuitem"
                            onClick={() => { setMenuOpen(false); onDelete?.(); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                            <Trash2 size={14} /> Delete Record
                        </button>
                    </div>,
                    document.body
                )}
            </td>
        </tr>
    );
}