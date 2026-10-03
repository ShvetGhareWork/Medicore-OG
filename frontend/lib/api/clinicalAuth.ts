const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface BadgeLoginRequest {
    staffId: string;
    badgeToken: string;
}

export interface BadgeLoginResponse {
    jwt?: string;
    token?: string;
    id?: number;
    userId?: number;
    fullName?: string;
    email?: string;
    username?: string;
    staffId?: string;
    roles?: string[];
    mfaRequired?: boolean;
}

export async function badgeLogin(payload: BadgeLoginRequest): Promise<BadgeLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/badge-login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Authentication failed. Invalid Staff ID or Badge Token.');
    }

    return data;
}
