import { useState } from "react";
import { saveToken } from "../utilities/auth";

export default function Login({ onLogin, onSwitchToSignup, isDark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "Login failed. Please try again."
        );
      }

      if (!data.token) {
        throw new Error("Login failed. Token not received from server.");
      }

      saveToken(data.token);

      setSuccess(data.message || "Login successful! Redirecting...");

      setTimeout(() => {
        onLogin(data.user);
      }, 800);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top,#0f172a,#020617,#000)] text-white"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
          isDark
            ? "border-white/10 bg-white/5"
            : "border-slate-300 bg-white/80"
        }`}
      >
        <h2 className="text-2xl font-bold">Login</h2>

        <p
          className={`mt-2 text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Access your productivity dashboard
        </p>

        {error && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "border-red-400/20 bg-red-500/10 text-red-300"
                : "border-red-300 bg-red-50 text-red-600"
            }`}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              isDark
                ? "border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              isDark
                ? "border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3 font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-cyan-300 text-black/70"
                : "bg-cyan-400 text-black hover:bg-cyan-300"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-cyan-400 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}