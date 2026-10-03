import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

type TokenClaims = { roles?: string[] | string; role?: string; exp?: number; sub?: string };

const accessRules: Record<string, string[]> = {
  "/dashboard": ["ADMIN", "ADMINISTRATIVE"],
  "/admissions": ["ADMIN", "ADMINISTRATIVE"],
  "/terminal": ["DOCTOR", "NURSE", "PATHOLOGIST", "LAB_TECHNICIAN", "INSURANCE_COORDINATOR", "ADMIN", "ADMINISTRATIVE"],
  "/clinical/dashboard": ["DOCTOR", "NURSE", "PATHOLOGIST", "LAB_TECHNICIAN", "INSURANCE_COORDINATOR", "ADMIN", "ADMINISTRATIVE"],
  "/portal": ["PATIENT"],
};

function parseJwtPayload(rawToken: string): TokenClaims | null {
  try {
    let token = rawToken.trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr);
  } catch {
    try {
      return jwtDecode<TokenClaims>(rawToken);
    } catch {
      return null;
    }
  }
}

function rolesFromToken(claims: TokenClaims): string[] {
  const roles = claims.roles ?? claims.role ?? [];
  return (Array.isArray(roles) ? roles : [roles])
    .map((role) => String(role).replace(/^ROLE_/, "").trim().toUpperCase())
    .filter(Boolean);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matchedPath = Object.keys(accessRules).find((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!matchedPath) return NextResponse.next();

  const isClinicalRoute = matchedPath === "/clinical/dashboard" || matchedPath === "/terminal";
  const isAdminRoute = matchedPath === "/dashboard" || matchedPath === "/admissions";
  const loginUrl = isClinicalRoute ? "/clinical/login" : isAdminRoute ? "/admin/login" : "/login";

  const rawToken = request.cookies.get("jwt_token")?.value;
  if (!rawToken) {
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  const claims = parseJwtPayload(rawToken);
  if (!claims) {
    return NextResponse.redirect(new URL(`${loginUrl}?error=invalid-session`, request.url));
  }

  if (claims.exp !== undefined && claims.exp * 1000 <= Date.now()) {
    return NextResponse.redirect(new URL(`${loginUrl}?error=session-expired`, request.url));
  }

  const roles = rolesFromToken(claims);
  if (!accessRules[matchedPath].some((role) => roles.includes(role))) {
    return NextResponse.redirect(new URL(`${loginUrl}?error=unauthorized`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admissions/:path*", "/terminal/:path*", "/portal/:path*", "/clinical/dashboard/:path*"],
};

