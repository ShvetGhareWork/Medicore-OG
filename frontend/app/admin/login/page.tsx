import { Suspense } from "react";
import AdminLoginPage from "@/pages/adminloginpage/AdminLoginPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
