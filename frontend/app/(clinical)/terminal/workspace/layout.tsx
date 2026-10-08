"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import InactivityLogout from "@/components/clinical/InactivityLogout";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/terminal");
      return;
    }
    const hasRole = user.roles?.some((r: string) =>
      ["DOCTOR", "NURSE", "ADMIN", "ADMINISTRATIVE"].includes(r.toUpperCase())
    );
    if (!hasRole) {
      router.push("/terminal");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying terminal credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      <InactivityLogout />
      {children}
    </div>
  );
}
