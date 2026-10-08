"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function PatientRootRedirect({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const router = useRouter();
  const { patientId } = use(params);

  useEffect(() => {
    router.replace(`/terminal/workspace/patient/${patientId}/overview`);
  }, [router, patientId]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
