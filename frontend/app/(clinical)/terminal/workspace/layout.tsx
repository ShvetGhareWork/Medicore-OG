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
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center text-slate-400 p-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <span className="text-xs md:text-sm font-medium text-center">Verifying terminal credentials...</span>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden">
        <InactivityLogout />
        {children}
      </div>
  );
}