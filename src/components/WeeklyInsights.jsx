import { useEffect, useState } from "react";

export default function WeeklyInsights({ refreshKey, isDark }) {
  const [insights, setInsights] = useState("Loading weekly AI insights...");

  useEffect(() => {
    const fetchWeeklyInsights = async () => {
      try {
        const token = localStorage.getItem("token");

        const API_URL = import.meta.env.VITE_API_URL;

        const res = await fetch(`${API_URL}/api/ai-insights/weekly`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch weekly insights");
        }

        setInsights(data.insights || "No weekly AI insights available.");
      } catch (error) {
        console.error("Weekly insights error:", error);
        setInsights("Failed to load weekly AI insights.");
      }
    };

    fetchWeeklyInsights();
  }, [refreshKey]);

  return (
    <div
      className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Weekly AI Insights</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            isDark
              ? "border border-violet-400/20 bg-violet-400/10 text-violet-300"
              : "border border-violet-500/20 bg-violet-100 text-violet-700"
          }`}
        >
          This Week
        </span>
      </div>

      <div
        className={`rounded-2xl border p-4 text-sm leading-7 whitespace-pre-line ${
          isDark
            ? "border-white/10 bg-slate-950/40 text-slate-200"
            : "border-slate-200 bg-slate-50 text-slate-800"
        }`}
      >
        {insights}
      </div>
    </div>
  );
}