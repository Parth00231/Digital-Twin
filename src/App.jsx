import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Insights from "./components/Insights";
import Simulation from "./components/Simulation";
import InputForm from "./components/InputForm";

export default function App() {
  const [stats, setStats] = useState({});
  const [timeData, setTimeData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("https://digital-twin-backend-e187.onrender.com/api/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setTimeData(data.timeData);
      setWeeklyData(data.weeklyData);
    } catch (error) {
      console.error("Fetch dashboard failed:", error);
    }
  };

  const handleDataUpdate = async () => {
    await fetchDashboard();
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top,#0f172a,#020617,#000)] text-white"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 space-y-8">
        <header
          className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors duration-300 ${
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-300 bg-white/80"
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  isDark
                    ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    : "border border-cyan-500/20 bg-cyan-100 text-cyan-700"
                }`}
              >
                AI Productivity Twin
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                Digital Twin of Your Productivity
              </h1>

              <p
                className={`mt-3 max-w-2xl text-sm md:text-base ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Analyze daily habits, generate AI insights, and simulate future
                productivity improvements.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`rounded-2xl px-4 py-3 ${
                  isDark
                    ? "border border-emerald-400/20 bg-emerald-400/10"
                    : "border border-emerald-500/20 bg-emerald-100"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Current Score
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-500">
                  {stats.productivityScore || "--"}
                </p>
              </div>

              <button
                onClick={() => setIsDark(!isDark)}
                className={`rounded-2xl px-4 py-3 font-semibold transition ${
                  isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </header>

        <InputForm onDataUpdate={handleDataUpdate} isDark={isDark} />

        <Dashboard
          stats={stats}
          timeData={timeData}
          weeklyData={weeklyData}
          isDark={isDark}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Insights refreshKey={refreshKey} isDark={isDark} />
          <Simulation refreshKey={refreshKey} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}