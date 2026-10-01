import { jwtDecode } from "jwt-decode";

export interface TokenClaims {
  sub?: string;
  userId?: string;
  roles?: string[] | string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function extractRoles(token: string): string[] {
  try {
    const claims = jwtDecode<TokenClaims>(token);
    const roles = claims.roles ?? claims.role ?? [];
    return (Array.isArray(roles) ? roles : [roles]).map((r) =>
      r.replace(/^ROLE_/, "").toUpperCase()
    );
  } catch {
    return [];
  }
}

export function getRedirectPathForRoles(roles: string[]): string {
  const normalized = roles.map((r) => r.replace(/^ROLE_/, "").toUpperCase());

  if (normalized.some((r) => r === "ADMIN" || r === "ADMINISTRATIVE")) {
    return "/dashboard";
  }
  if (
    normalized.some(
      (r) =>
        r === "DOCTOR" ||
        r === "NURSE" ||
        r === "PATHOLOGIST" ||
        r === "LAB_TECHNICIAN"
    )
  ) {
    return "/terminal";
  }
  if (normalized.some((r) => r === "PATIENT")) {
    return "/portal";
  }

  return "/dashboard";
}

export function storeAuthSession(token: string, userId?: string | number) {
  if (typeof window === "undefined") return;

  const roles = extractRoles(token);
  const isAdmin = roles.some((r) => r === "ADMIN" || r === "ADMINISTRATIVE");
  // Admin tokens last 4h (14400s), others 24h (86400s)
  const maxAge = isAdmin ? 14400 : 86400;

  document.cookie = `jwt_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  localStorage.setItem("token", token);
  if (userId) {
    localStorage.setItem("userId", String(userId));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  document.cookie = "jwt_token=; path=/; max-age=0; SameSite=Lax";
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}
