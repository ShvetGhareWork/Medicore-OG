"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_LIMIT_MS = 3 * 60 * 1000;

export function useInactivityLogout(limitMs = INACTIVITY_LIMIT_MS) {
  const router = useRouter();
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const logout = () => {
      document.cookie = "jwt_token=; Max-Age=0; path=/";
      localStorage.removeItem("token");
      router.replace("/login?reason=inactivity");
    };
    const reset = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, limitMs);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, reset));
    reset();
    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [limitMs, router]);
}

export default function InactivityLogout() {
  useInactivityLogout();
  return null;
}
