import { jwtDecode } from "jwt-decode";

export interface TokenClaims {
  sub?: string;
  userId?: string;
  roles?: string[] | string;
  role?: string;
  fullName?: string;
  name?: string;
  email?: string;
  staffId?: string;
  exp?: number;
  iat?: number;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  staffId: string;
  roles: string[];
  initials: string;
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

export function getUserProfile(tokenInput?: string): UserProfile {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.fullName || parsed.username)) {
          const name = parsed.fullName || parsed.username || "Administrator";
          const nameParts = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "").trim().split(" ");
          const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();

          return {
            username: parsed.username || "",
            fullName: name,
            email: parsed.email || "",
            staffId: parsed.staffId || "",
            roles: parsed.roles || ["ADMIN"],
            initials: initials || "AD",
          };
        }
      }
    } catch {
      // Ignore JSON parse error, fall back to token decoding
    }
  }

  let token = tokenInput;
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("token") || undefined;
  }

  if (!token) {
    return {
      username: "admin",
      fullName: "Administrator",
      email: "admin@medicore.org",
      staffId: "",
      roles: ["ADMIN"],
      initials: "AD",
    };
  }

  try {
    const claims = jwtDecode<TokenClaims>(token);
    const username = claims.sub || "admin";
    const fullName = claims.fullName || claims.name || username;
    const email = claims.email || "";
    const staffId = claims.staffId || "";
    const roles = extractRoles(token);

    const nameParts = fullName
      .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, "")
      .trim()
      .split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : fullName.slice(0, 2).toUpperCase();

    return {
      username,
      fullName,
      email,
      staffId,
      roles,
      initials: initials || "AD",
    };
  } catch {
    return {
      username: "admin",
      fullName: "Administrator",
      email: "admin@medicore.org",
      staffId: "",
      roles: ["ADMIN"],
      initials: "AD",
    };
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

export function storeAuthSession(
  token: string,
  userId?: string | number,
  userProfile?: Partial<UserProfile>
) {
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

  if (userProfile) {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  document.cookie = "jwt_token=; path=/; max-age=0; SameSite=Lax";
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userProfile");
}
