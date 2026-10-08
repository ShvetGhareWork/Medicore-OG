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
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  roomNumber?: string;
  bedNumber?: string;
  ward?: string;
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
    const res = await fetch(`${API_BASE_URL}/clinical/overview/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load patient overview");
    return res.json();
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

  // Patients search & list (via patient-service or fallback admissions)
  getAllPatients: async (): Promise<PatientSummary[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/patients`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : data.content || [];
      }
    } catch (e) {
      console.warn("Failed to fetch from patient service directly:", e);
    }
    return [];
  },
};
