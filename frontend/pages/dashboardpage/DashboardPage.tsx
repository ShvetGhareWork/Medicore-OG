"use client";

import React, { useState } from "react";
import {
    Search,
    Bell,
    Mail,
    HelpCircle,
    LayoutDashboard,
    Users,
    Calendar,
    Stethoscope,
    Building2,
    UserPlus,
    BedDouble,
    FileText,
    Pill,
    TestTube,
    CreditCard,
    ShieldCheck,
    BarChart3,
    PieChart,
    MessageSquare,
    Settings,
    ChevronDown,
    Plus,
    MoreHorizontal,
    Circle,
    MapPin,
    TrendingUp,
    Activity,
    ArrowRight,
    PlusSquare,
    AlertCircle,
    Clock,
    CalendarPlus,
    FilePlus,
    FileBox,
    Menu,
    X,
    TrendingDown
} from "lucide-react";

export default function DashboardPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative z-50 h-full bg-[#0F172A] text-slate-300 flex flex-col 
                w-[260px] shrink-0 overflow-y-auto hidden-scrollbar
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-800">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-tight">
                                MediCore HMS
                            </span>
                            <span className="text-xs text-slate-400">
                                Hospital Management
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-4 flex flex-col gap-6 px-3 overflow-y-auto">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Overview
                        </div>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-lg"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Operations
                        </div>
                        <div className="space-y-0.5">
                            <NavItem icon={<Users className="w-4 h-4" />} label="Patients" />
                            <NavItem icon={<Calendar className="w-4 h-4" />} label="Appointments" />
                            <NavItem icon={<Stethoscope className="w-4 h-4" />} label="Doctors" />
                            <NavItem icon={<Building2 className="w-4 h-4" />} label="Departments" />
                            <NavItem icon={<UserPlus className="w-4 h-4" />} label="Admissions" />
                            <NavItem icon={<BedDouble className="w-4 h-4" />} label="Bed Management" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Clinical
                        </div>
                        <div className="space-y-0.5">
                            <NavItem icon={<FileText className="w-4 h-4" />} label="Medical Records" />
                            <NavItem icon={<Pill className="w-4 h-4" />} label="Pharmacy" />
                            <NavItem icon={<TestTube className="w-4 h-4" />} label="Laboratory" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Finance
                        </div>
                        <div className="space-y-0.5">
                            <NavItem icon={<CreditCard className="w-4 h-4" />} label="Billing" />
                            <NavItem icon={<ShieldCheck className="w-4 h-4" />} label="Insurance" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Insights
                        </div>
                        <div className="space-y-0.5">
                            <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
                            <NavItem icon={<PieChart className="w-4 h-4" />} label="Reports" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                            Communication
                        </div>
                        <div className="space-y-0.5">
                            <NavItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
                            <div className="flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-slate-800/50 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4" />
                                    <span className="text-sm">Notifications</span>
                                </div>
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    3
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 space-y-0.5 border-t border-slate-800 mt-auto">
                    <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
                    <NavItem icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" />
                    <div className="mt-2 flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff"
                                alt="User"
                                className="w-8 h-8 rounded-full bg-slate-800"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white leading-tight">
                                    Administrator
                                </span>
                                <span className="text-[11px] text-slate-400">Super Admin</span>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-slate-600 hover:text-slate-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="relative w-full max-w-[200px] md:max-w-[400px] lg:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            Main Branch
                            <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 text-slate-500">
                            <div className="relative cursor-pointer hover:text-slate-700">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
                            </div>
                            <Mail className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                            <HelpCircle className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="hidden md:flex flex-col">
                                <span className="text-sm font-semibold text-slate-700 leading-tight">
                                    Administrator
                                </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Scrollable */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Hospital Overview
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Monitor operations, patients, and financial activity.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mr-2">
                                <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                                All systems operational
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <span className="text-slate-400">Today</span>
                                    <span className="text-slate-700 font-semibold">29 Aug</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 w-full md:w-auto justify-center">
                                <CalendarPlus className="w-4 h-4" />
                                Book Appt
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 w-full md:w-auto justify-center">
                                <Plus className="w-4 h-4" />
                                Add Patient
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={<Users className="w-5 h-5 text-blue-600" />}
                            iconBg="bg-blue-50"
                            title="TOTAL PATIENTS"
                            value="24,892"
                            trend="+8.2% vs last month"
                            trendUp={true}
                            chartColor="#3b82f6"
                        />
                        <StatCardWithProgress
                            icon={<Calendar className="w-5 h-5 text-emerald-600" />}
                            iconBg="bg-emerald-50"
                            title="TODAY'S APPTS"
                            value="186"
                            subLeft="24 completed"
                            subRight="24 / 186"
                            progress={15}
                            progressColor="bg-emerald-500"
                        />
                        <StatCardWithProgress
                            icon={<BedDouble className="w-5 h-5 text-orange-600" />}
                            iconBg="bg-orange-50"
                            title="BED OCCUPANCY"
                            value={
                                <>
                                    138 <span className="text-slate-400 text-xl font-medium">/ 180</span>
                                </>
                            }
                            subLeft="76.7% occupied"
                            progress={76.7}
                            progressColor="bg-red-500"
                        />
                        <StatCard
                            icon={<CreditCard className="w-5 h-5 text-purple-600" />}
                            iconBg="bg-purple-50"
                            title="TODAY'S REVENUE"
                            value="₹8.42L"
                            trend="+12.4% vs yesterday"
                            trendUp={true}
                            chartColor="#a855f7"
                        />
                    </div>

                    {/* Charts Row - Fixed Structure */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient Overview Chart (Spans 2 cols on desktop) */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm overflow-x-auto">
                            <div className="min-w-[6000px]">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Patient Overview</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">New vs Returning Patients</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex bg-slate-100 rounded-lg p-1">
                                            <button className="px-3 py-1 text-xs font-semibold bg-white text-blue-600 rounded shadow-sm">7 Days</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900">30 Days</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900">3 Months</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900">1 Year</button>
                                        </div>
                                        <MoreHorizontal className="w-5 h-5 text-slate-400 ml-2 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-4 px-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <div className="w-3 h-3 rounded-[2px] bg-blue-600"></div> New Patients
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <div className="w-3 h-3 rounded-[2px] bg-teal-400"></div> Returning Patients
                                    </div>
                                </div>

                                <div className="relative h-64 w-full flex items-end justify-between px-2 pb-6 pt-4">
                                    {/* Y-Axis labels */}
                                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 pr-2">
                                        <span>800</span>
                                        <span>600</span>
                                        <span>400</span>
                                        <span>200</span>
                                        <span>0</span>
                                    </div>
                                    {/* Grid lines */}
                                    <div className="absolute left-6 right-0 top-1 bottom-6 flex flex-col justify-between">
                                        <div className="w-full border-b border-slate-100 border-dashed"></div>
                                        <div className="w-full border-b border-slate-100 border-dashed"></div>
                                        <div className="w-full border-b border-slate-100 border-dashed"></div>
                                        <div className="w-full border-b border-slate-100 border-dashed"></div>
                                        <div className="w-full border-b border-slate-200"></div>
                                    </div>

                                    {/* Bars */}
                                    <div className="relative z-10 w-full ml-8 flex justify-between h-full items-end">
                                        {[
                                            { day: "23 Aug", n: "50%", r: "75%" },
                                            { day: "24 Aug", n: "50%", r: "80%" },
                                            { day: "25 Aug", n: "58%", r: "70%" },
                                            { day: "26 Aug", n: "50%", r: "68%" },
                                            { day: "27 Aug", n: "48%", r: "60%", active: true },
                                            { day: "28 Aug", n: "48%", r: "85%" },
                                            { day: "29 Aug", n: "58%", r: "75%" },
                                        ].map((bar, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 w-16 relative">
                                                <div className="flex items-end gap-1.5 w-full h-52 justify-center">
                                                    <div className={`w-3.5 rounded-t-sm bg-blue-600 ${bar.active ? "opacity-100" : "opacity-90"}`} style={{ height: bar.n }}></div>
                                                    <div className={`w-3.5 rounded-t-sm bg-teal-400 ${bar.active ? "opacity-100" : "opacity-90"}`} style={{ height: bar.r }}></div>
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-500">{bar.day}</span>

                                                {/* Tooltip for active bar */}
                                                {bar.active && (
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-40 z-20">
                                                        <p className="text-xs font-semibold text-slate-800 mb-2">{bar.day} 2026</p>
                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-[11px]">
                                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div> New Patients
                                                                </div>
                                                                <span className="font-bold text-slate-900">320</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-[11px]">
                                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                                    <div className="w-2 h-2 rounded-full bg-teal-400"></div> Returning Patients
                                                                </div>
                                                                <span className="font-bold text-slate-900">480</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                                                            <span className="text-slate-500 font-medium">Total</span>
                                                            <span className="font-bold text-slate-900">800</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Appointments Timeline (Spans 1 col on desktop) */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Today's Appointments</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">186 appointments</p>
                                </div>
                                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                    View Calendar <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="flex-1 relative overflow-x-auto">
                                {/* Vertical Line */}
                                <div className="absolute left-[52px] top-2 bottom-2 w-px bg-slate-200 min-h-[400px]"></div>

                                <div className="space-y-6 relative z-10 min-w-[300px]">
                                    <TimelineItem time="09:00 AM" dotColor="bg-blue-600" doctor="Dr. Priya Shah" dept="Cardiology" patient="Aarav Mehta" status="Confirmed" statusColor="text-emerald-700 bg-emerald-50 border-emerald-200" />
                                    <TimelineItem time="10:30 AM" dotColor="bg-slate-300" doctor="Dr. Rahul Sharma" dept="General Medicine" patient="Sneha Patel" status="In Progress" statusColor="text-blue-700 bg-blue-50 border-blue-200" />
                                    <TimelineItem time="11:45 AM" dotColor="bg-orange-500" doctor="Dr. Ananya Desai" dept="Neurology" patient="Rohan Kulkarni" status="Upcoming" statusColor="text-orange-700 bg-orange-50 border-orange-200" />
                                    <TimelineItem time="01:30 PM" dotColor="bg-slate-300" doctor="Dr. Vikram Joshi" dept="Orthopedics" patient="Meera Nair" status="Upcoming" statusColor="text-orange-700 bg-orange-50 border-orange-200" />
                                    <TimelineItem time="03:00 PM" dotColor="bg-slate-300" doctor="Dr. Neha Verma" dept="General Medicine" patient="Patient" status="Upcoming" statusColor="text-orange-700 bg-orange-50 border-orange-200" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">View Calendar →</a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row 1: Recent Patients & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-x-auto">
                            <div className="flex justify-between items-start mb-4 min-w-[600px]">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Recent Patients</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Latest patient activity</p>
                                </div>
                                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                    View All <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Patient</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">ID</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Dept</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Doctor</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Type</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase"></th>
                                </tr>
                                </thead>
                                <tbody className="text-sm">
                                <TableRow name="Aarav Mehta" id="MC-10482" dept="Cardiology" doctor="Dr. Priya Shah" type="Follow-up" status="Active" statusColor="text-emerald-700 bg-emerald-50" date="29 Aug 2026" />
                                <TableRow name="Sneha Patel" id="MC-10481" dept="General Medicine" doctor="Dr. Rahul Sharma" type="Consultation" status="Active" statusColor="text-emerald-700 bg-emerald-50" date="29 Aug 2026" />
                                <TableRow name="Rohan Kulkarni" id="MC-10480" dept="Neurology" doctor="Dr. Ananya Desai" type="New Visit" status="Waiting" statusColor="text-orange-700 bg-orange-50" date="29 Aug 2026" />
                                <TableRow name="Meera Nair" id="MC-10479" dept="Orthopedics" doctor="Dr. Vikram Joshi" type="Follow-up" status="Completed" statusColor="text-blue-700 bg-blue-50" date="29 Aug 2026" />
                                <TableRow name="Karan Singh" id="MC-10478" dept="General Medicine" doctor="Dr. Neha Verma" type="Consultation" status="Active" statusColor="text-emerald-700 bg-emerald-50" date="28 Aug 2026" />
                                </tbody>
                            </table>
                        </div>

                        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <QuickAction icon={<UserPlus className="w-6 h-6 text-blue-600" />} label="Add Patient" />
                                <QuickAction icon={<CalendarPlus className="w-6 h-6 text-emerald-600" />} label="Book Appt" />
                                <QuickAction icon={<BedDouble className="w-6 h-6 text-orange-600" />} label="Admit" />
                                <QuickAction icon={<FileText className="w-6 h-6 text-indigo-600" />} label="Medical Record" />
                                <QuickAction icon={<FilePlus className="w-6 h-6 text-purple-600" />} label="Invoice" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row 2: Departments, Capacity, Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Department Overview */}
                        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-5">
                                <h3 className="text-base font-bold text-slate-900">Department Overview</h3>
                                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline">View Departments →</a>
                            </div>
                            <div className="space-y-5">
                                <DeptRow
                                    icon={<Activity className="w-4 h-4 text-blue-600" />}
                                    name="Cardiology"
                                    patients="42 patients"
                                    doctors="8 doctors"
                                    pct={68}
                                    barColor="bg-blue-600"
                                />
                                <DeptRow
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                                        </svg>
                                    }
                                    name="Neurology"
                                    patients="28 patients"
                                    doctors="5 doctors"
                                    pct={56}
                                    barColor="bg-blue-400"
                                />
                                <DeptRow
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>
                                            <path d="M4.9 6.1a2 2 0 0 0-1.4 3.4l8.5 8.5a2 2 0 0 0 3.4-1.4V15"/>
                                            <path d="M19.1 6.1a2 2 0 0 1 1.4 3.4l-8.5 8.5a2 2 0 0 1-3.4-1.4V15"/>
                                        </svg>
                                    }
                                    name="Orthopedics"
                                    patients="36 patients"
                                    doctors="6 doctors"
                                    pct={72}
                                    barColor="bg-orange-500"
                                />
                                <DeptRow
                                    icon={<Stethoscope className="w-4 h-4 text-emerald-600" />}
                                    name="General Medicine"
                                    patients="64 patients"
                                    doctors="12 doctors"
                                    pct={80}
                                    barColor="bg-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Hospital Capacity */}
                        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="mb-5">
                                <h3 className="text-base font-bold text-slate-900">Hospital Capacity</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Real-time occupancy status</p>
                            </div>
                            <div className="space-y-6">
                                <CapacityRow label="General Beds" used="84" total="110" pct={76} barColor="bg-blue-600" />
                                <CapacityRow label="ICU" used="18" total="24" pct={75} barColor="bg-red-500" />
                                <CapacityRow label="Emergency" used="12" total="20" pct={60} barColor="bg-orange-500" />
                                <CapacityRow label="Private Rooms" used="24" total="26" pct={92} barColor="bg-teal-500" />
                            </div>
                        </div>

                        {/* Important Alerts */}
                        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Important Alerts</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Critical notifications & alerts</p>
                                </div>
                                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline">View All →</a>
                            </div>
                            <div className="space-y-5">
                                <AlertItem icon={<Pill className="w-4 h-4 text-red-600" />} iconBg="bg-red-50" title="Low Pharmacy Stock" desc="12 medicines are below minimum stock level." time="10 min ago" />
                                <AlertItem icon={<FileBox className="w-4 h-4 text-orange-600" />} iconBg="bg-orange-50" title="Pending Insurance Claims" desc="8 insurance claims require attention." time="25 min ago" />
                                <AlertItem icon={<Calendar className="w-4 h-4 text-blue-600" />} iconBg="bg-blue-50" title="Upcoming Appointments" desc="3 appointments begin within the next hour." time="35 min ago" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Subcomponents

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
}

function StatCard({ icon, iconBg, title, value, trend, trendUp, chartColor }: any) {
    return (
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    {trendUp && <TrendingUp className="w-3 h-3" />}
                    {trend}
                </div>
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 15 L10 12 L20 18 L30 8 L40 10 L50 4 L60 2" stroke={chartColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
}

function StatCardWithProgress({ icon, iconBg, title, value, subLeft, subRight, progress, progressColor }: any) {
    return (
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                    <span className={progressColor === 'bg-emerald-500' ? "text-emerald-600" : "text-red-500"}>{subLeft}</span>
                    <span>{subRight}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`${progressColor} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ time, dotColor, doctor, dept, patient, status, statusColor }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-xs font-semibold text-slate-700 w-16 pt-0.5 text-right shrink-0">{time}</div>
            <div className="relative flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor} z-10 ring-4 ring-white mt-1`}></div>
            </div>
            <div className="flex-1 flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div>
                    <h4 className="text-sm font-bold text-slate-900">{doctor}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dept} • <span className="font-medium text-slate-700">{patient}</span></p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusColor}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

function TableRow({ name, id, dept, doctor, type, status, statusColor, date }: any) {
    return (
        <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
            <td className="py-3">
                <div className="flex items-center gap-2">
                    <img src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff&size=32`} alt={name} className="w-6 h-6 rounded-full" />
                    <span className="font-semibold text-slate-900">{name}</span>
                </div>
            </td>
            <td className="py-3 text-slate-600">{id}</td>
            <td className="py-3 text-slate-600">{dept}</td>
            <td className="py-3 text-slate-900 font-medium">{doctor}</td>
            <td className="py-3 text-slate-600">{type}</td>
            <td className="py-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="py-3 text-slate-600">{date}</td>
            <td className="py-3 text-right">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

function QuickAction({ icon, label }: any) {
    return (
        <button className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all bg-white group">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                {icon}
            </div>
            <span className="text-[11px] font-semibold text-slate-700 text-center">{label}</span>
        </button>
    );
}

function DeptRow({ icon, name, patients, doctors, pct, barColor }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900">{name}</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{patients} <span className="mx-1">•</span> {doctors}</span>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 ml-2">
                        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CapacityRow({ label, used, total, pct, barColor }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 w-28">{label}</span>
            <div className="flex-1 px-4 flex items-center">
                <span className="text-xs font-semibold text-slate-900 w-12">{used} <span className="text-slate-400 font-normal">/ {total}</span></span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 mx-3">
                    <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
            </div>
            <span className="text-xs font-bold text-slate-900 w-8 text-right">{pct}%</span>
        </div>
    );
}

function AlertItem({ icon, iconBg, title, desc, time }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${iconBg} shrink-0 mt-0.5`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900">{title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{desc}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 shrink-0">
                {time} <ChevronDown className="w-3 h-3 -rotate-90" />
            </div>
        </div>
    );
}