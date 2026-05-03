import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const token = window.location.pathname.split("/verify/")[1];
  const hasVerified = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const res = await fetch(
          `${API_URL}/api/auth/verify/${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("failed");
          setMessage(data.message || "Invalid or expired verification link.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("failed");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-xl">
        {status === "success" ? (
          <h1 className="text-3xl font-bold text-emerald-400">
            Verification Successful ✅
          </h1>
        ) : status === "failed" ? (
          <h1 className="text-3xl font-bold text-red-400">
            Verification Failed ❌
          </h1>
        ) : (
          <h1 className="text-3xl font-bold">Verifying...</h1>
        )}

        <p className="mt-4 text-slate-300">{message}</p>

        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}