import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function DailyInsights({ refreshKey, isDark }) {
  const [insights, setInsights] = useState("Loading daily AI insights...");

  useEffect(() => {
    const fetchDailyInsights = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/ai-insights/daily`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch daily insights");
        }

        setInsights(data.insights || "No daily AI insights available.");
      } catch (error) {
        console.error("Daily insights error:", error);
        setInsights("Failed to load daily AI insights.");
      }
    };

    fetchDailyInsights();
  }, [refreshKey]);

  return (
    <div
      className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Daily AI Insights</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            isDark
              ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              : "border border-cyan-500/20 bg-cyan-100 text-cyan-700"
          }`}
        >
          Today
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