import { useState } from "react";

export default function Signup({ onSignup, onSwitchToLogin, isDark }) {
  const [name, setName] = useState("");
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

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Signup failed");
      }

      setSuccess(
        data.message ||
          "Signup successful! Please check your email and verify your account before login."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        onSignup(email);
      }, 2500);
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
        <h2 className="text-2xl font-bold">Create Account</h2>

        <p
          className={`mt-2 text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Sign up and verify your email to start tracking your productivity.
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
            type="text"
            placeholder="Name"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
              isDark
                ? "border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            minLength={6}
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-cyan-400 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}