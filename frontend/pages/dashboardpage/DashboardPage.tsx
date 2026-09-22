'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Search, Bell, Plus, Users, ClipboardCheck, Clock, PieChart,
    ChevronDown, Filter, RefreshCw, MoreVertical, LayoutDashboard,
    Calendar, Building2, UserPlus, Bed, FileText, Pill, FlaskConical,
    CreditCard, ShieldCheck, LineChart, Settings, HelpCircle, Menu, X,
    Download, Sparkles
} from 'lucide-react';
import { AddMedicModal, StaffMember } from '../addmedicformpage/AddMedicFormPage';
import { getStaffList } from '../../lib/api/staffApi';

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
        role: roleDisplayMap[roleStr] || roleStr,
        roleColor: roleColorMap[roleStr] || 'bg-slate-100 text-slate-700',
        dept: item.department || 'General',
        subDept: item.designation || '',
        status: statusStr,
        statusColor: statusStr === 'Active' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 bg-slate-100',
        statusDot: statusStr === 'Active' ? 'bg-teal-500' : 'bg-slate-400',
        date: formattedDate,
        initials: initials,
        avatarUrl: item.photoUrl || undefined
    };
}

export default function StaffDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
    const [totalElements, setTotalElements] = useState<number>(348);
    const [totalPages, setTotalPages] = useState<number>(35);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [activePage, setActivePage] = useState(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const fetchStaffData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getStaffList({
                role: selectedRole,
                department: selectedDept,
                status: selectedStatus,
                search: searchQuery,
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
    }, [selectedRole, selectedDept, selectedStatus, searchQuery, activePage]);

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

    // Client filter as fallback if offline
    const filteredStaff = useMemo(() => {
        return staffList.filter(staff => {
            const matchesSearch =
                staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.dept.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole =
                selectedRole === 'All Roles' ||
                staff.role.toLowerCase() === selectedRole.toLowerCase();

            const matchesDept =
                selectedDept === 'All Departments' ||
                staff.dept.toLowerCase().includes(selectedDept.toLowerCase());

            const matchesStatus =
                selectedStatus === 'All Statuses' ||
                staff.status.toLowerCase() === selectedStatus.toLowerCase();

            return matchesSearch && matchesRole && matchesDept && matchesStatus;
        });
    }, [staffList, searchQuery, selectedRole, selectedDept, selectedStatus]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedRole('All Roles');
        setSelectedDept('All Departments');
        setSelectedStatus('All Statuses');
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
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
            {/* Custom Scrollbar Styles */}
            <style>{`
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>

            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Sparkles size={18} className="text-teal-400" />
                    <span className="text-xs font-medium">{toastMessage}</span>
                </div>
            )}

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-40 md:hidden transition-opacity backdrop-blur-xs"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-300 h-full overflow-y-auto flex flex-col
                transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
                            <span className="text-lg leading-none">+</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold tracking-wide text-white">MediCore HMS</h1>
                            <p className="text-[11px] text-slate-400">Hospital Management System</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-slate-400 tracking-wider">
                    CITY CENTRAL BRANCH
                </div>

                <nav className="flex-1 px-3 space-y-5 pb-4">
                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">OVERVIEW</div>
                        <NavItem icon={<LayoutDashboard size={17} />} label="Dashboard" />
                    </div>

                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">OPERATIONS</div>
                        <NavItem href="#" icon={<Users size={17} />} label="Patients" />
                        <NavItem href="#" icon={<Calendar size={17} />} label="Appointments" />
                        <NavItem href="/dashboard" icon={<UserPlus size={17} />} label="Doctors / Staff" active />
                        <NavItem href="#" icon={<Building2 size={17} />} label="Departments" />
                        <NavItem href="/admissions" icon={<Bed size={17} />} label="Admissions" />
                        <NavItem href="#" icon={<Bed size={17} />} label="Bed Management" />
                    </div>

                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">CLINICAL</div>
                        <NavItem icon={<FileText size={17} />} label="Medical Records" />
                        <NavItem icon={<Pill size={17} />} label="Pharmacy" />
                        <NavItem icon={<FlaskConical size={17} />} label="Laboratory" />
                    </div>

                    <div>
                        <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">FINANCE & INSIGHTS</div>
                        <NavItem icon={<CreditCard size={17} />} label="Billing" />
                        <NavItem icon={<ShieldCheck size={17} />} label="Insurance" />
                        <NavItem icon={<LineChart size={17} />} label="Analytics" />
                    </div>
                </nav>

                <div className="p-3 mt-auto border-t border-slate-800 space-y-1 bg-[#0f172a]">
                    <NavItem icon={<Settings size={17} />} label="Settings" />
                    <NavItem icon={<HelpCircle size={17} />} label="Help & Support" />
                    <div className="mt-3 flex items-center gap-3 px-3 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/50">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-white">
                            EV
                        </div>
                        <div className="text-xs min-w-0">
                            <p className="font-semibold truncate">Dr. Eleanor Vance</p>
                            <p className="text-[11px] text-slate-400">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${isAddModalOpen ? 'opacity-95' : 'opacity-100'}`}>
                {/* TOP HEADER */}
                <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-800 p-1">
                            <Menu size={22} />
                        </button>
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search staff by name, ID, or role..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-700 border border-slate-200 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                            <Building2 size={14} className="text-teal-600" />
                            <span>City Central Branch</span>
                            <ChevronDown size={12} className="text-slate-400 ml-0.5" />
                        </div>

                        <button className="relative text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold cursor-pointer ring-2 ring-slate-100">
                            EV
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE PAGE BODY */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
                    {/* Page Title & Breadcrumb */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <span>ADMINISTRATION</span>
                                <span>&gt;</span>
                                <span className="text-teal-700">STAFF MANAGEMENT</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Staff</h2>
                            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                                Add, edit, and manage verified clinician identities, role clearance, and digital hospital badges.
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
                                <Plus size={15} strokeWidth={2.5} /> Add Staff Member
                            </button>
                        </div>
                    </div>

                    {/* KPI Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="TOTAL STAFF"
                            value={totalElements.toString()}
                            trend="+12 this quarter"
                            trendStatus="good"
                            icon={<Users size={18} className="text-teal-700" />}
                        />
                        <StatCard
                            title="ACTIVE TODAY"
                            value="284"
                            trend="94% on-duty operational rate"
                            trendStatus="good"
                            icon={<ClipboardCheck size={18} className="text-teal-700" />}
                        />
                        <StatCard
                            title="PENDING ACTIVATIONS"
                            value="6"
                            trend="Awaiting credential verification"
                            trendStatus="warning"
                            icon={<Clock size={18} className="text-amber-600" />}
                        />
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
                    <div className="bg-white p-3 rounded-t-xl border border-slate-200 border-b-0 flex flex-wrap gap-2.5 items-center justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setActivePage(1);
                                }}
                                placeholder="Search staff by name, email, ID..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {/* Role filter */}
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => {
                                        setSelectedRole(e.target.value);
                                        setActivePage(1);
                                    }}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
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

                            {/* Department filter */}
                            <div className="relative">
                                <select
                                    value={selectedDept}
                                    onChange={(e) => {
                                        setSelectedDept(e.target.value);
                                        setActivePage(1);
                                    }}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
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

                            {/* Status filter */}
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        setActivePage(1);
                                    }}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                                >
                                    <option value="All Statuses">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            <button
                                onClick={handleResetFilters}
                                title="Reset filters"
                                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            </button>

                            <button
                                title="Filter options"
                                className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                                <Filter size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white border border-slate-200 rounded-b-xl shadow-2xs overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[820px]">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                                    filteredStaff.map((staff, idx) => (
                                        <TableRow
                                            key={staff.id + '-' + idx}
                                            name={staff.name}
                                            email={staff.email}
                                            id={staff.id}
                                            role={staff.role}
                                            roleColor={staff.roleColor}
                                            dept={staff.dept}
                                            subDept={staff.subDept}
                                            status={staff.status}
                                            statusColor={staff.statusColor}
                                            statusDot={staff.statusDot}
                                            date={staff.date}
                                            initials={staff.initials}
                                            avatarUrl={staff.avatarUrl}
                                            isNew={staff.date === 'Just Now'}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            No staff members match the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                            <div>Showing 1-{filteredStaff.length} of {totalElements} staff members</div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActivePage(p => Math.max(1, p - 1))}
                                    disabled={activePage <= 1}
                                    className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer disabled:opacity-50"
                                >
                                    &lt; Previous
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
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
                                {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}
                                <button
                                    onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                                    disabled={activePage >= totalPages}
                                    className="px-2.5 py-1 hover:bg-slate-100 rounded text-xs font-medium cursor-pointer disabled:opacity-50"
                                >
                                    Next &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MULTI-STEP ADD STAFF MEMBER DRAWER MODAL */}
            <AddMedicModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onStaffAdded={handleStaffAdded}
            />
        </div>
    );
}

/* =========================================
   HELPER COMPONENTS
   ========================================= */

function NavItem({ href = '#', icon, label, active = false }: { href?: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <a
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors ${
                active
                    ? 'bg-slate-800 text-white font-medium shadow-2xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </a>
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

function TableRow({
    name,
    email,
    id,
    role,
    roleColor,
    dept,
    subDept,
    status,
    date,
    initials,
    avatarUrl,
    isNew = false
}: any) {
    const isInactive = status === 'Inactive';

    return (
        <tr className={`hover:bg-slate-50/80 transition-colors group ${isNew ? 'bg-teal-50/40' : ''}`}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden shrink-0">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-slate-900">{name}</p>
                            {isNew && (
                                <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">NEW</span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400">{email}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 font-mono text-[11px] text-slate-600 font-medium">{id}</td>
            <td className="p-4">
                <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${roleColor}`}>
                    {role}
                </span>
            </td>
            <td className="p-4">
                <p className="font-semibold text-slate-900">{dept}</p>
                <p className="text-[11px] text-slate-400">{subDept}</p>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-slate-400' : 'bg-teal-500'}`} />
                    <span className={`text-xs font-medium ${isInactive ? 'text-slate-600' : 'text-teal-700'}`}>
                        {status}
                    </span>
                </div>
            </td>
            <td className="p-4 text-slate-500 text-xs">{date}</td>
            <td className="p-4 text-right">
                <button className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <MoreVertical size={16} />
                </button>
            </td>
        </tr>
    );
}
