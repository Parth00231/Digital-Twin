import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart,
} from "recharts";

export default function Simulation({ refreshKey, isDark }) {
  const [extraHours, setExtraHours] = useState(2);
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/simulate?extraHours=${extraHours}`)
      .then((res) => res.json())
      .then((data) => {
        setSimulationData(data);
      })
      .catch((error) => {
        console.error("Error fetching simulation data:", error);
      });
  }, [extraHours, refreshKey]);

  if (!simulationData) {
    return (
      <div
        className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
          isDark ? "border-white/10 bg-white/5 text-white" : "border-slate-300 bg-white/80 text-slate-900"
        }`}
      >
        Loading simulation...
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Future Simulation</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            isDark
              ? "border border-violet-400/20 bg-violet-400/10 text-violet-300"
              : "border border-violet-500/20 bg-violet-100 text-violet-700"
          }`}
        >
          What-if Analysis
        </span>
      </div>

      <div
        className={`rounded-2xl border p-4 ${
          isDark ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-slate-50"
        }`}
      >
        <label className={`mb-3 block text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          Extra productive hours per day:
          <span className="ml-2 font-semibold text-cyan-500">{extraHours} hrs</span>
        </label>

        <input
          type="range"
          min="0"
          max="5"
          value={extraHours}
          onChange={(e) => setExtraHours(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoBox label="Current Weekly Productive Hours" value={`${simulationData.currentWeeklyHours} hrs`} isDark={isDark} />
          <InfoBox label="Future Weekly Productive Hours" value={`${simulationData.simulatedWeeklyHours} hrs`} highlight isDark={isDark} />
          <InfoBox label="Projected Improvement" value={`+${simulationData.improvement}%`} highlight isDark={isDark} />
        </div>
      </div>

      <div
        className={`mt-6 h-[260px] w-full rounded-2xl border p-2 ${
          isDark ? "border-white/10 bg-slate-950/30" : "border-slate-200 bg-slate-50"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={simulationData.graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#cbd5e1"} />
            <XAxis dataKey="week" stroke={isDark ? "#94a3b8" : "#475569"} />
            <YAxis stroke={isDark ? "#94a3b8" : "#475569"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "16px",
                color: isDark ? "#fff" : "#0f172a",
              }}
            />
            <Area type="monotone" dataKey="future" fill="#22d3ee" stroke="none" fillOpacity={0.12} />
            <Line type="monotone" dataKey="current" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="future" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className={`mt-4 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        If you consistently add{" "}
        <span className="font-semibold text-cyan-500">{extraHours} extra productive hours/day</span>,
        your digital twin predicts a stronger weekly productivity trend.
      </p>
    </div>
  );
}

function InfoBox({ label, value, highlight = false, isDark }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? isDark
            ? "border-cyan-400/20 bg-cyan-400/10"
            : "border-cyan-500/20 bg-cyan-50"
          : isDark
          ? "border-white/10 bg-white/5"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}