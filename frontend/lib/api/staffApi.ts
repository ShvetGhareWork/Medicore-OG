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

export interface CreateStaffPayload {
    fullName: string;
    email: string;
    contactNumber?: string;
    dateOfBirth?: string;
    role: string;
    department: string;
    designation: string;
    reportingToId?: number | null;
    accessLevel?: string;
    loginMethod?: string;
    temporaryPassword?: string;
    photoUrl?: string;
}

export interface StaffListParams {
    role?: string;
    department?: string;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
}

export async function createStaff(payload: CreateStaffPayload) {
    const response = await fetch(`${API_BASE_URL}/admin/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create staff member');
    }
    return data;
}

export async function getStaffList(params: StaffListParams = {}) {
    const query = new URLSearchParams();
    if (params.role && params.role !== 'All Roles') {
        const roleMap: Record<string, string> = {
            'Doctor': 'DOCTOR',
            'Nurse': 'NURSE',
            'Pathologist': 'PATHOLOGIST',
            'Insurance Coord.': 'INSURANCE_COORDINATOR',
            'Administrative': 'ADMINISTRATIVE',
            'Lab Technician': 'LAB_TECHNICIAN',
        };
        query.append('role', roleMap[params.role] || params.role.toUpperCase());
    }
    if (params.department && params.department !== 'All Departments') {
        query.append('department', params.department);
    }
    if (params.status && params.status !== 'All Statuses') {
        query.append('status', params.status.toUpperCase());
    }
    if (params.search) {
        query.append('search', params.search);
    }
    if (params.page !== undefined) {
        query.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
        query.append('size', params.size.toString());
    }

    const queryString = query.toString();
    const url = `${API_BASE_URL}/admin/staff${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch staff list');
    }
    return data;
}

export async function getStaffById(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/admin/staff/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch staff details');
    }
    return data;
}

export async function deactivateStaff(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/admin/staff/${id}/deactivate`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to deactivate staff member');
    }
    return data;
}

export async function resendStaffCredentials(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/admin/staff/${id}/resend-credentials`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to resend credentials');
    }
    return data;
}

export async function deleteStaff(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete staff member');
    }
    return data;
}

export interface UpdateStaffPayload {
    fullName: string;
    contactNumber?: string;
    dateOfBirth?: string;
    role: string;
    department: string;
    designation: string;
    reportingToId?: number | null;
    accessLevel?: string;
    status?: string;
    photoUrl?: string;
}

export async function updateStaff(id: string | number, payload: UpdateStaffPayload) {
    const response = await fetch(`${API_BASE_URL}/admin/staff/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update staff member');
    }
    return data;
}



