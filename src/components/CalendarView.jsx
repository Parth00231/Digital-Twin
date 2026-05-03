import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarView({ isDark }) {
  const [calendarData, setCalendarData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/calendar-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch calendar data");
        }

        setCalendarData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Calendar fetch error:", error);
        setError(error.message || "Failed to load calendar data");
        setCalendarData([]);
      }
    };

    fetchCalendarData();
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthName = today.toLocaleString("en-US", { month: "long" });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const dataMap = useMemo(() => {
    const map = {};
    (Array.isArray(calendarData) ? calendarData : []).forEach((item) => {
      if (item?.date) {
        map[item.date] = item;
      }
    });
    return map;
  }, [calendarData]);

  const getCellStyle = (score) => {
    if (score >= 80) {
      return isDark
        ? "border-green-400/30 bg-green-500/10"
        : "border-green-300 bg-green-50";
    }
    if (score >= 60) {
      return isDark
        ? "border-yellow-400/30 bg-yellow-500/10"
        : "border-yellow-300 bg-yellow-50";
    }
    if (score > 0) {
      return isDark
        ? "border-red-400/30 bg-red-500/10"
        : "border-red-300 bg-red-50";
    }
    return isDark
      ? "border-white/10 bg-white/5"
      : "border-slate-200 bg-slate-50";
  };

  const cells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="min-h-[88px] rounded-2xl border border-transparent"
      />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const entry = dataMap[dateKey];

    cells.push(
      <div
        key={day}
        className={`min-h-[88px] rounded-2xl border p-2 transition ${getCellStyle(
          entry?.score || 0
        )}`}
      >
        <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          {day}
        </p>

        {entry ? (
          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-medium text-cyan-500">
              P: {entry.score}%
            </p>
            <p className="text-[11px] font-medium text-violet-500">
              D: {entry.deepWork}%
            </p>
          </div>
        ) : (
          <p className={`mt-3 text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            No data
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
      isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
    }`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Monthly Progress Calendar</h3>
        <span className={`rounded-full px-3 py-1 text-xs ${
          isDark
            ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            : "border border-cyan-500/20 bg-cyan-100 text-cyan-700"
        }`}>
          {monthName} {currentYear}
        </span>
      </div>

      {error ? (
        <div className={`rounded-2xl border p-4 text-sm ${
          isDark
            ? "border-red-400/20 bg-red-500/10 text-red-300"
            : "border-red-300 bg-red-50 text-red-700"
        }`}>
          {error}
        </div>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className={isDark ? "text-slate-400" : "text-slate-500"}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{cells}</div>
        </>
      )}
    </div>
  );
}