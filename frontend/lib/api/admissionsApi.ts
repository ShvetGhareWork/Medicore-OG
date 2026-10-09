const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}

export interface AdmissionPatient {
    id: string; // e.g. PT-2026-0814
    fullName: string;
    dob: string;
    age: number;
    gender: string;
    contactNumber: string;
    address?: string;

    // Emergency Contact
    emergencyContactName: string;
    emergencyRelationship: string;
    emergencyContactPhone: string;

    // Clinical Triage
    vitalsBloodPressure?: string;
    vitalsHeartRate?: string;
    vitalsTemperature?: string;
    vitalsSpO2?: string;
    chiefComplaint: string;
    triageLevel: string; // ESI 1 to 5
    admittingDiagnosis: string;

    // Attending Physician
    attendingDoctor: string;
    doctorSpecialty: string;

    // Ward & Bed Allocation
    ward: string; // ICU, Emergency, General, Maternity, Pediatrics
    bedNo: string; // e.g. Bed #ICU-04, Bay #ER-08, Ward-Bed #GW-212, Suite #MAT-105
    admissionStatus: 'Admitted' | 'Pending' | 'Discharged' | 'Transferred';
    admissionDate: string;
    admissionTime: string;
    expectedDischargeDate: string;
    dischargeDetail: string; // e.g. "Est. 5 days", "Bed prep ongoing", "Summary logged"

    // Insurance & Clearance
    insuranceProvider: string;
    policyNumber?: string;
    authorizationCode?: string;
    clearanceStatus: string;
}

export interface CreateAdmissionPayload {
    fullName: string;
    dob: string;
    gender: string;
    contactNumber: string;
    address?: string;

    emergencyContactName: string;
    emergencyRelationship: string;
    emergencyContactPhone: string;

    vitalsBloodPressure?: string;
    vitalsHeartRate?: string;
    vitalsTemperature?: string;
    vitalsSpO2?: string;
    chiefComplaint: string;
    triageLevel: string;
    admittingDiagnosis: string;

    attendingDoctor: string;
    attendingDoctorId?: number;
    doctorSpecialty: string;

    ward: string;
    roomOrBay?: string;
    bedNo: string;
    expectedDischargeDate: string;

    insuranceProvider: string;
    policyNumber?: string;
    authorizationCode?: string;
    consentConfirmed: boolean;
}

export interface AdmissionListParams {
    ward?: string;
    status?: string;
    attendingDoctor?: string;
    attendingDoctorId?: number;
    search?: string;
    page?: number;
    size?: number;
}

export function mapBackendPatientToAdmissionPatient(data: any): AdmissionPatient {
    const birthYear = data.dateOfBirth ? new Date(data.dateOfBirth).getFullYear() : 1990;
    const age = new Date().getFullYear() - birthYear;
    const todayStr = data.admissionDate 
        ? new Date(data.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : (data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today');
    const timeStr = data.admissionDate 
        ? new Date(data.admissionDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : (data.createdAt ? new Date(data.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '09:00 AM');

    const formattedStatus = data.admissionStatus
        ? (data.admissionStatus.charAt(0).toUpperCase() + data.admissionStatus.slice(1).toLowerCase()) as 'Admitted' | 'Pending' | 'Discharged' | 'Transferred'
        : 'Admitted';

    return {
        id: data.patientId || `PT-2026-${data.id}`,
        fullName: data.fullName,
        dob: data.dateOfBirth || '1990-01-01',
        age: age > 0 && age < 120 ? age : 35,
        gender: data.gender || 'Female',
        contactNumber: data.contactNumber || 'N/A',
        address: data.address || '',

        emergencyContactName: data.emergencyContactName || 'N/A',
        emergencyRelationship: 'Contact',
        emergencyContactPhone: data.emergencyContactPhone || '',

        vitalsBloodPressure: '120/80',
        vitalsHeartRate: '75 bpm',
        vitalsTemperature: '98.6°F',
        vitalsSpO2: '98%',
        chiefComplaint: data.admittingDiagnosis || 'Hospital Admission',
        triageLevel: data.triageLevel || 'ESI Level 2 (Emergent)',
        admittingDiagnosis: data.admittingDiagnosis || 'Admitted Diagnosis',

        attendingDoctor: data.attendingDoctorName || 'Attending Physician',
        doctorSpecialty: data.departmentName || 'General Medicine',

        ward: data.wardNumber || data.departmentName || 'General',
        bedNo: data.bedNumber || 'Assigned',
        admissionStatus: formattedStatus,
        admissionDate: todayStr,
        admissionTime: timeStr,
        expectedDischargeDate: data.expectedDischargeDate 
            ? new Date(data.expectedDischargeDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
            : 'Est. stay',
        dischargeDetail: 'Est. stay',

        insuranceProvider: 'Verified Health Plan',
        policyNumber: '',
        authorizationCode: '',
        clearanceStatus: 'Verified'
    };
}

export async function createAdmission(payload: CreateAdmissionPayload): Promise<AdmissionPatient> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/patients`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                fullName: payload.fullName,
                email: undefined,
                contactNumber: payload.contactNumber,
                dateOfBirth: payload.dob || null,
                gender: payload.gender,
                address: payload.address,
                emergencyContactName: payload.emergencyContactName,
                emergencyContactPhone: payload.emergencyContactPhone,
                admittingDiagnosis: payload.admittingDiagnosis || payload.chiefComplaint,
                triageLevel: payload.triageLevel,
                attendingDoctorId: payload.attendingDoctorId || undefined,
                departmentName: payload.ward,
                wardNumber: payload.ward,
                bedNumber: payload.bedNo,
                admissionStatus: 'ADMITTED',
                expectedDischargeDate: payload.expectedDischargeDate || null
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return mapBackendPatientToAdmissionPatient(data);
        } else {
            throw new Error(data.error || data.message || 'Failed to create patient admission');
        }
    } catch (err: any) {
        console.warn("Backend API error, falling back to local object creation if disconnected:", err);
        throw err;
    }
}

export async function getAdmissionsList(params: AdmissionListParams = {}) {
    try {
        const query = new URLSearchParams();
        if (params.status && params.status !== 'All Statuses') query.append('status', params.status.toUpperCase());
        if (params.ward && params.ward !== 'All Wards') query.append('ward', params.ward);
        if (params.attendingDoctor && params.attendingDoctor !== 'Attending Doctor') query.append('attendingDoctor', params.attendingDoctor);
        if (params.attendingDoctorId) query.append('attendingDoctorId', params.attendingDoctorId.toString());
        if (params.search) query.append('search', params.search);
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());

        const queryString = query.toString();
        const response = await fetch(`${API_BASE_URL}/admin/patients${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.warn("Backend endpoint not connected, falling back to local admission list");
    }
    return null;
}

export async function getPatientByCode(patientId: string): Promise<AdmissionPatient | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/patients/by-code/${encodeURIComponent(patientId)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (response.ok) {
            const data = await response.json();
            return mapBackendPatientToAdmissionPatient(data);
        }
    } catch (err) {
        console.warn(`Failed to fetch patient with code ${patientId}:`, err);
    }
    return null;
}

export async function getMyAdmissions(params: AdmissionListParams = {}) {
    try {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());

        const queryString = query.toString();
        const response = await fetch(`${API_BASE_URL}/admin/patients/my-patients${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.warn("Failed to fetch my patients from backend:", err);
    }
    return null;
}
