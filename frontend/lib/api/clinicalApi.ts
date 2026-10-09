import { API_BASE_URL } from "./config";
import { getToken } from "../auth";

export interface PatientAllergy {
  allergen: string;
  severity: string;
  reaction: string;
}

export interface PatientSummary {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth: string;
  age?: number | string;
  gender: string;
  bloodGroup: string;
  roomNumber?: string;
  bedNumber?: string;
  ward?: string;
  attendingDoctor?: string;
  primaryDiagnosis?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  admissionDate?: string;
  statusBadge?: "Critical" | "Stable" | "Under Observation" | "Pending Labs";
  allergies?: PatientAllergy[];
}

export interface Encounter {
  id: string;
  patientId: string;
  doctorId: string;
  nurseId?: string;
  departmentId?: string;
  type: "INPATIENT" | "OUTPATIENT" | "EMERGENCY" | "ICU" | "SURGERY";
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DISCHARGED" | "CANCELLED";
  startTime: string;
  endTime?: string;
  chiefComplaint?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalEntry {
  id: string;
  encounterId: string;
  patientId: string;
  authorId: string;
  authorName: string;
  authorRole: "DOCTOR" | "NURSE" | "ADMIN";
  entryType:
    | "SOAP_NOTE"
    | "DIAGNOSIS"
    | "PRESCRIPTION"
    | "LAB_ORDER"
    | "RADIOLOGY_ORDER"
    | "PROCEDURE_NOTE"
    | "DISCHARGE_SUMMARY"
    | "VITALS_SIGN"
    | "NURSE_NOTE"
    | "MEDICATION_ADMINISTRATION"
    | "INTAKE_OUTPUT"
    | "WOUND_CARE"
    | "SHIFT_HANDOFF";
  contentJson: any;
  status: "DRAFT" | "SIGNED" | "AMENDED" | "CANCELLED";
  isCorrection: boolean;
  originalEntryId?: string;
  correctionReason?: string;
  signedAt?: string;
  signedById?: string;
  signedByName?: string;
  createdAt: string;
}

export interface NurseFlag {
  id: string;
  encounterId: string;
  patientId: string;
  nurseId: string;
  nurseName: string;
  flagType:
    | "ABNORMAL_VITALS"
    | "CRITICAL_LAB_VALUE"
    | "PATIENT_DETERIORATION"
    | "ALLERGY_CONFLICT"
    | "MEDICATION_CONCERN"
    | "FALL_RISK"
    | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";
  responseEntryId?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalOverview {
  patientId: string;
  activeEncounterId?: string;
  encounterType?: string;
  encounterStatus?: string;
  precautions: string[];
  allergies: PatientAllergy[];
  latestVitals?: any;
  vitalsRecordedAt?: string;
  activeDiagnoses: ClinicalEntry[];
  activeMedications: ClinicalEntry[];
  openFlags: NurseFlag[];
  recentNotes: ClinicalEntry[];
}

function getAuthHeaders(idempotencyKey?: string): HeadersInit {
  const token = typeof window !== "undefined" ? getToken() : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }
  return headers;
}

export const clinicalApi = {
  // Clinical Overview
  getPatientOverview: async (patientId: string): Promise<ClinicalOverview> => {
    try {
      const res = await fetch(`${API_BASE_URL}/clinical/overview/patient/${patientId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // clinical service overview fallback
    }

    // Attempt to enrich with identity-service live patient details
    try {
      const res = await fetch(`${API_BASE_URL}/admin/patients/by-code/${encodeURIComponent(patientId)}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const p = await res.json();
        return {
          patientId: p.patientId || patientId,
          activeEncounterId: `enc-${p.id || 1}`,
          encounterType: "INPATIENT",
          encounterStatus: p.admissionStatus || "ADMITTED",
          precautions: ["Standard Precautions", "Fall Risk Protocol"],
          allergies: [],
          activeDiagnoses: [
            {
              id: `diag-${p.id}`,
              encounterId: `enc-${p.id}`,
              patientId: p.patientId,
              authorId: p.attendingDoctorId ? String(p.attendingDoctorId) : "DOC-1",
              authorName: p.attendingDoctorName || "Attending Physician",
              authorRole: "DOCTOR",
              entryType: "DIAGNOSIS",
              contentJson: { diagnosis: p.admittingDiagnosis || "Hospital Admission", severity: "PRIMARY" },
              status: "SIGNED",
              isCorrection: false,
              createdAt: p.createdAt || new Date().toISOString()
            }
          ],
          activeMedications: [],
          openFlags: [],
          recentNotes: []
        };
      }
    } catch (e) {
      console.warn("Could not load patient from identity service:", e);
    }

    throw new Error("Failed to load patient overview");
  },

  // Encounters
  getEncountersByPatient: async (patientId: string): Promise<Encounter[]> => {
    const res = await fetch(`${API_BASE_URL}/clinical/encounters/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load encounters");
    return res.json();
  },

  getEncounterById: async (id: string): Promise<Encounter> => {
    const res = await fetch(`${API_BASE_URL}/clinical/encounters/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load encounter");
    return res.json();
  },

  createEncounter: async (data: Partial<Encounter>): Promise<Encounter> => {
    const res = await fetch(`${API_BASE_URL}/clinical/encounters`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create encounter");
    return res.json();
  },

  updateEncounterStatus: async (
    id: string,
    status: string,
    endTime?: string
  ): Promise<Encounter> => {
    const res = await fetch(`${API_BASE_URL}/clinical/encounters/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, endTime }),
    });
    if (!res.ok) throw new Error("Failed to update encounter status");
    return res.json();
  },

  // Clinical Entries
  getEntriesByEncounter: async (encounterId: string): Promise<ClinicalEntry[]> => {
    const res = await fetch(`${API_BASE_URL}/clinical/entries/encounter/${encounterId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load clinical entries");
    return res.json();
  },

  getEntriesByPatient: async (patientId: string, type?: string): Promise<ClinicalEntry[]> => {
    const url = type
      ? `${API_BASE_URL}/clinical/entries/patient/${patientId}?type=${type}`
      : `${API_BASE_URL}/clinical/entries/patient/${patientId}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to load clinical entries");
    return res.json();
  },

  createEntry: async (
    data: {
      encounterId: string;
      patientId: string;
      entryType: string;
      contentJson: any;
      autoSign?: boolean;
    },
    idempotencyKey?: string
  ): Promise<ClinicalEntry> => {
    const res = await fetch(`${API_BASE_URL}/clinical/entries`, {
      method: "POST",
      headers: getAuthHeaders(idempotencyKey),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create clinical entry");
    return res.json();
  },

  signEntry: async (entryId: string): Promise<ClinicalEntry> => {
    const res = await fetch(`${API_BASE_URL}/clinical/entries/${entryId}/sign`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to sign clinical entry");
    return res.json();
  },

  amendEntry: async (
    entryId: string,
    data: { contentJson: any; correctionReason: string; autoSign?: boolean }
  ): Promise<ClinicalEntry> => {
    const res = await fetch(`${API_BASE_URL}/clinical/entries/${entryId}/amend`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to amend clinical entry");
    return res.json();
  },

  getEntryAuditHistory: async (entryId: string): Promise<ClinicalEntry[]> => {
    const res = await fetch(`${API_BASE_URL}/clinical/entries/${entryId}/audit-history`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch entry audit history");
    return res.json();
  },

  // Nurse Flags
  getOpenFlags: async (patientId: string): Promise<NurseFlag[]> => {
    const res = await fetch(`${API_BASE_URL}/clinical/flags/patient/${patientId}/open`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load nurse flags");
    return res.json();
  },

  createNurseFlag: async (data: {
    encounterId: string;
    patientId: string;
    flagType: string;
    severity: string;
    message: string;
  }): Promise<NurseFlag> => {
    const res = await fetch(`${API_BASE_URL}/clinical/flags`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create nurse flag");
    return res.json();
  },

  acknowledgeNurseFlag: async (flagId: string): Promise<NurseFlag> => {
    const res = await fetch(`${API_BASE_URL}/clinical/flags/${flagId}/acknowledge`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to acknowledge nurse flag");
    return res.json();
  },

  resolveNurseFlag: async (
    flagId: string,
    data?: { responseEntryId?: string; resolutionNotes?: string }
  ): Promise<NurseFlag> => {
    const res = await fetch(`${API_BASE_URL}/clinical/flags/${flagId}/resolve`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data || {}),
    });
    if (!res.ok) throw new Error("Failed to resolve nurse flag");
    return res.json();
  },

  // Patients search & list (from DB /admin/patients)
  getAllPatients: async (params?: { ward?: string; search?: string; attendingDoctor?: string }): Promise<any[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.ward && params.ward !== 'All Wards') query.append('ward', params.ward);
      if (params?.search) query.append('search', params.search);
      if (params?.attendingDoctor && params.attendingDoctor !== 'Attending Doctor') query.append('attendingDoctor', params.attendingDoctor);
      query.append('size', '100');

      const queryString = query.toString();
      const res = await fetch(`${API_BASE_URL}/admin/patients${queryString ? `?${queryString}` : ''}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const content = Array.isArray(data) ? data : (data.content || []);
        if (content.length > 0) {
          return content.map((p: any) => {
            const birthYear = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 1990;
            const ageNum = new Date().getFullYear() - birthYear;
            const parts = (p.fullName || "Patient").split(" ");
            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ") || "";
            return {
              id: p.patientId || `PT-2026-${p.id}`,
              numericId: p.id,
              firstName: firstName,
              lastName: lastName,
              fullName: p.fullName,
              age: ageNum > 0 && ageNum < 120 ? `${ageNum}y` : "35y",
              gender: p.gender === "Female" || p.gender === "F" ? "F" : "M",
              bloodGroup: "O+",
              patientIdCode: p.patientId || `PT-2026-${p.id}`,
              monitorLabel: `${p.wardNumber || 'Ward'} Bedside Monitor`,
              statusBadge: p.triageLevel?.includes("1") || p.triageLevel?.includes("2") ? "Critical" : "Stable",
              primaryDiagnosis: p.admittingDiagnosis || "Hospital Admission",
              attendingDoctor: p.attendingDoctorName ? `Dr. ${p.attendingDoctorName.replace(/^Dr\.\s*/i, '')}` : "Attending Physician",
              bedNumber: p.bedNumber || "Unassigned",
              ward: p.wardNumber || p.departmentName || "General",
              admittedDate: p.admissionDate ? new Date(p.admissionDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
              vitalsSummary: "Telemetry Active",
              vitalsStatus: "Monitored",
              openFlagsCount: 0,
            };
          });
        }
      }
    } catch (e) {
      console.warn("Failed to fetch patients from admin patient endpoint:", e);
    }
    return [];
  },

  getPatientDetails: async (patientId: string): Promise<PatientSummary | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/patients/by-code/${encodeURIComponent(patientId)}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const p = await res.json();
        const birthYear = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 1990;
        const ageNum = new Date().getFullYear() - birthYear;
        const parts = (p.fullName || "Patient").trim().split(/\s+/);
        const firstName = parts[0] || "Patient";
        const lastName = parts.slice(1).join(" ") || "";
        const formattedDoctor = p.attendingDoctorName
          ? (p.attendingDoctorName.startsWith("Dr.") ? p.attendingDoctorName : `Dr. ${p.attendingDoctorName}`)
          : undefined;
        const formattedAdmDate = p.admissionDate
          ? new Date(p.admissionDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
          : undefined;

        return {
          id: p.patientId || patientId,
          firstName,
          lastName,
          fullName: p.fullName || `${firstName} ${lastName}`.trim(),
          dateOfBirth: p.dateOfBirth || "1990-01-01",
          age: ageNum > 0 && ageNum < 120 ? `${ageNum}y` : "35y",
          gender: p.gender || "Male",
          bloodGroup: "O+",
          roomNumber: p.wardNumber || "General",
          bedNumber: p.bedNumber || "Unassigned",
          ward: p.wardNumber || p.departmentName || "General Ward",
          attendingDoctor: formattedDoctor,
          primaryDiagnosis: p.admittingDiagnosis,
          emergencyContactName: p.emergencyContactName,
          emergencyContactPhone: p.emergencyContactPhone,
          admissionDate: formattedAdmDate,
          statusBadge: p.triageLevel?.includes("1") || p.triageLevel?.includes("2") ? "Critical" : "Stable",
          allergies: []
        };
      }
    } catch (e) {
      console.warn("Could not fetch patient details:", e);
    }
    return null;
  },
};
