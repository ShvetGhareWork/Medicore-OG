import { Suspense } from "react";
import LoginPage from "../../pages/loginpage/LoginPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
