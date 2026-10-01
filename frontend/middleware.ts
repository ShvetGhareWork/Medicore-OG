import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

type TokenClaims = { roles?: string[] | string; role?: string; exp?: number };

const accessRules: Record<string, string[]> = {
  "/dashboard": ["ADMIN", "ADMINISTRATIVE"],
  "/admissions": ["ADMIN", "ADMINISTRATIVE"],
  "/terminal": ["DOCTOR", "NURSE", "PATHOLOGIST", "LAB_TECHNICIAN"],
  "/portal": ["PATIENT"],
};

function rolesFromToken(token: string): string[] {
  const claims = jwtDecode<TokenClaims>(token);
  const roles = claims.roles ?? claims.role ?? [];
  return (Array.isArray(roles) ? roles : [roles]).map((role) => role.replace(/^ROLE_/, "").toUpperCase());
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matchedPath = Object.keys(accessRules).find((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!matchedPath) return NextResponse.next();

  const isAdminRoute = matchedPath === "/dashboard" || matchedPath === "/admissions";
  const loginUrl = isAdminRoute ? "/admin/login" : "/login";

  const token = request.cookies.get("jwt_token")?.value;
  if (!token) return NextResponse.redirect(new URL(loginUrl, request.url));

  try {
    const claims = jwtDecode<TokenClaims>(token);
    if (claims.exp !== undefined && claims.exp * 1000 <= Date.now()) {
      return NextResponse.redirect(new URL(`${loginUrl}?error=session-expired`, request.url));
    }
    const roles = rolesFromToken(token);
    if (!accessRules[matchedPath].some((role) => roles.includes(role))) {
      return NextResponse.redirect(new URL(`${loginUrl}?error=unauthorized`, request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(`${loginUrl}?error=invalid-session`, request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admissions/:path*", "/terminal/:path*", "/portal/:path*"],
};
