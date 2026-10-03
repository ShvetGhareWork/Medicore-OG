"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  Briefcase, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { updateStaff, UpdateStaffPayload } from "@/lib/api/staffApi";
import { StaffMember } from "@/pages/addmedicformpage/AddMedicFormPage";

interface EditStaffModalProps {
  isOpen: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onStaffUpdated: (updated: StaffMember) => void;
}

export function EditStaffModal({ isOpen, staff, onClose, onStaffUpdated }: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    dateOfBirth: "",
    role: "DOCTOR",
    department: "",
    designation: "",
    accessLevel: "STANDARD",
    status: "ACTIVE",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      const roleUpperMap: Record<string, string> = {
        "Doctor": "DOCTOR",
        "Nurse": "NURSE",
        "Pathologist": "PATHOLOGIST",
        "Insurance Coord.": "INSURANCE_COORDINATOR",
        "Administrative": "ADMINISTRATIVE",
        "Lab Technician": "LAB_TECHNICIAN",
      };

      setFormData({
        fullName: staff.name || "",
        email: staff.email || "",
        contactNumber: "",
        dateOfBirth: "",
        role: roleUpperMap[staff.role] || staff.role.toUpperCase(),
        department: staff.dept || "General Medicine",
        designation: staff.subDept || "",
        accessLevel: "STANDARD",
        status: staff.status === "Inactive" ? "INACTIVE" : "ACTIVE",
      });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.department.trim() || !formData.designation.trim()) {
      setErrorMessage("Please complete all required fields (Name, Department, Designation).");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: UpdateStaffPayload = {
        fullName: formData.fullName.trim(),
        contactNumber: formData.contactNumber.trim() || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        role: formData.role,
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        accessLevel: formData.accessLevel,
        status: formData.status,
      };

      const targetId = staff.dbId || staff.id;
      const response = await updateStaff(targetId, payload);

      const roleDisplayMap: Record<string, string> = {
        DOCTOR: "Doctor",
        NURSE: "Nurse",
        PATHOLOGIST: "Pathologist",
        INSURANCE_COORDINATOR: "Insurance Coord.",
        ADMINISTRATIVE: "Administrative",
        LAB_TECHNICIAN: "Lab Technician",
      };

      const updatedMember: StaffMember = {
        ...staff,
        name: response.fullName || formData.fullName,
        dept: response.department || formData.department,
        subDept: response.designation || formData.designation,
        role: roleDisplayMap[response.role] || response.role || formData.role,
        status: response.status === "INACTIVE" ? "Inactive" : "Active",
        statusColor: response.status === "INACTIVE" ? "text-slate-600 bg-slate-100" : "text-teal-700 bg-teal-50",
        statusDot: response.status === "INACTIVE" ? "bg-slate-400" : "bg-teal-500",
      };

      setSuccessMessage("Staff details updated successfully!");
      setTimeout(() => {
        onStaffUpdated(updatedMember);
        onClose();
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update staff member";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
              {staff.initials || "ST"}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Staff Member</h3>
              <p className="text-xs text-slate-500 font-mono">ID: {staff.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Email Address (Locked)
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Role Clearance *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
              >
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>
                <option value="PATHOLOGIST">Pathologist</option>
                <option value="INSURANCE_COORDINATOR">Insurance Coordinator</option>
                <option value="ADMINISTRATIVE">Administrative</option>
                <option value="LAB_TECHNICIAN">Lab Technician</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Staff Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending Verification</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Department *
              </label>
              <div className="relative">
                <Building size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology, Neurology"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Designation / Title *
              </label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Consultant, Lead Resident"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Contact Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">
                Access Level
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
              >
                <option value="STANDARD">Standard Station Access</option>
                <option value="ELEVATED">Elevated Clinical Access</option>
                <option value="UNRESTRICTED">Unrestricted Hospital Clearance</option>
              </select>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading && <Loader2 size={13} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
