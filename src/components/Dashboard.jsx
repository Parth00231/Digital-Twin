import Chart from "./Chart";

export default function Dashboard({ stats, weeklyData, weeklySummary, streakData, isDark }) {
  const codingHours = Number(stats?.codingHours || 0);
  const studyHours = Number(stats?.studyHours || 0);
  const learningVideoHours = Number(stats?.learningVideoHours || 0);
  const planningThinkingHours = Number(stats?.planningThinkingHours || 0);
  const collegeHours = Number(stats?.collegeHours || 0);
  const sleepingHours = Number(stats?.sleepingHours || 0);
  const breakHours = Number(stats?.breakHours || 0);
  const entertainmentHours = Number(stats?.entertainmentHours || 0);
  const unproductiveHours = Number(stats?.unproductiveHours || 0);
  const deepWorkHours = Number(stats?.deepWorkHours || 0);

  const productiveHours =
    codingHours +
    studyHours +
    learningVideoHours +
    planningThinkingHours;

  const neutralHours =
    collegeHours + sleepingHours + breakHours;

  const distractingHours =
    entertainmentHours + unproductiveHours;

  const totalHours =
    productiveHours + neutralHours + distractingHours;

  const productivityScore =
    productiveHours + distractingHours > 0
      ? ((productiveHours / (productiveHours + distractingHours)) * 100).toFixed(2)
      : "0.00";

  const deepWorkScore =
    productiveHours > 0
      ? ((deepWorkHours / productiveHours) * 100).toFixed(2)
      : "0.00";

  const updatedTimeData = [
    { name: "Productive", value: productiveHours },
    { name: "Neutral", value: neutralHours },
    { name: "Distracting", value: distractingHours },

  ];

  const fullDayNames = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Logged Hours"
          value={totalHours}
          subtitle="All tracked hours today"
          isDark={isDark}
        />

        <StatCard
          title="Productive Hours"
          value={productiveHours}
          subtitle={`Coding ${codingHours}h • Study ${studyHours}h • Learning ${learningVideoHours}h • Planning ${planningThinkingHours}h`}
          isDark={isDark}
        />

        <StatCard
          title="Neutral Hours"
          value={neutralHours}
          subtitle={`College ${collegeHours}h • Sleep ${sleepingHours}h • Break ${breakHours}h`}
          isDark={isDark}
        />

        <StatCard
          title="Distracting Hours"
          value={distractingHours}
          subtitle={`Entertainment ${entertainmentHours}h • Unproductive ${unproductiveHours}h`}
          isDark={isDark}
        />

        <StatCard
          title="Deep Work Hours"
          value={deepWorkHours}
          subtitle="High-focus work logged"
          isDark={isDark}
        />

        <StatCard
          title="Productivity Score"
          value={productivityScore}
          subtitle="Productive vs distracting time"
          score
          isDark={isDark}
        />

        <StatCard
          title="Deep Work Score"
          value={deepWorkScore}
          subtitle="Deep work out of productive time"
          score
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Chart
          type="pie"
          title="Time Distribution"
          data={updatedTimeData}
          isDark={isDark}
        />

        <Chart
          type="bar"
          title="Daily Productivity Pattern"
          data={weeklyData}
          isDark={isDark}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Avg Productivity"
          value={weeklySummary?.avgScore ?? 0}
          subtitle="Last 7 days"
          score
          isDark={isDark}
        />
        <StatCard
          title="Avg Deep Work"
          value={weeklySummary?.avgDeepWork ?? 0}
          subtitle="Focus quality"
          score
          isDark={isDark}
        />
        <StatCard
          title="Best Day"
          value={fullDayNames[weeklySummary?.bestDay] || "-"}
          subtitle="Highest performance"
          isDark={isDark}
          unit=""
        />

        <StatCard
          title="Worst Day"
          value={fullDayNames[weeklySummary?.worstDay] || "-"}
          subtitle="Needs improvement"
          isDark={isDark}
          unit=""
        />
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
  {/* Current Streak - Big Card */}
  <div
    className={`xl:col-span-2 rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
      isDark
        ? "border-amber-400/30 bg-amber-500/10"
        : "border-amber-300 bg-amber-50"
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm ${isDark ? "text-amber-200" : "text-amber-700"}`}>
          Current Streak
        </p>

        <h2 className="mt-3 text-4xl font-bold text-amber-400 sm:text-5xl">
          🔥 {streakData?.currentStreak ?? 0} Days
        </h2>

        <p className="mt-3 text-base font-medium text-cyan-400">
          {streakData?.currentStreak >= 7
            ? "Amazing consistency. Keep it going."
            : streakData?.currentStreak >= 3
            ? "You’re building a solid habit."
            : "Great start. Stay consistent."}
        </p>

        <p
          className={`mt-2 max-w-xl text-sm leading-6 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Consecutive active days with logged productivity data.
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isDark ? "bg-white/10 text-white" : "bg-white text-slate-800"
        }`}
      >
        Active
      </span>
    </div>
  </div>

  {/* Right side cards */}
  <div className="grid grid-cols-1 gap-4">
    <div
      className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark
          ? "border-violet-400/20 bg-violet-500/10"
          : "border-violet-300 bg-violet-50"
      }`}
    >
      <p className={`text-sm ${isDark ? "text-violet-200" : "text-violet-700"}`}>
        Longest Streak
      </p>

      <h3 className="mt-3 text-3xl font-bold text-violet-400">
        🏆 {streakData?.longestStreak ?? 0} Days
      </h3>

      <p className="mt-2 text-sm text-cyan-400">
        Your best consistency so far
      </p>
    </div>

    <div
      className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        streakData?.todayLogged
          ? isDark
            ? "border-green-400/20 bg-green-500/10"
            : "border-green-300 bg-green-50"
          : isDark
          ? "border-red-400/20 bg-red-500/10"
          : "border-red-300 bg-red-50"
      }`}
    >
      <p
        className={`text-sm ${
          streakData?.todayLogged
            ? isDark
              ? "text-green-200"
              : "text-green-700"
            : isDark
            ? "text-red-200"
            : "text-red-700"
        }`}
      >
        Today Logged
      </p>

      <h3
        className={`mt-3 text-3xl font-bold ${
          streakData?.todayLogged ? "text-green-400" : "text-red-400"
        }`}
      >
        {streakData?.todayLogged ? "✅ Yes" : "❌ No"}
      </h3>

      <p className="mt-2 text-sm text-cyan-400">
        {streakData?.todayLogged
          ? "Today's entry has been submitted"
          : "You have not logged today yet"}
      </p>
    </div>
  </div>
</div>
    </section>
  );
}

function getScoreStyles(score, isDark) {
  const num = parseFloat(score);

  if (num < 40) {
    return {
      text: "text-red-400",
      border: isDark ? "border-red-400/40" : "border-red-300",
      glow: isDark
        ? "shadow-[0_0_25px_rgba(248,113,113,0.18)]"
        : "shadow-[0_0_18px_rgba(248,113,113,0.12)]",
    };
  }

  if (num < 70) {
    return {
      text: "text-yellow-400",
      border: isDark ? "border-yellow-400/40" : "border-yellow-300",
      glow: isDark
        ? "shadow-[0_0_25px_rgba(250,204,21,0.18)]"
        : "shadow-[0_0_18px_rgba(250,204,21,0.12)]",
    };
  }

  return {
    text: "text-green-400",
    border: isDark ? "border-green-400/40" : "border-green-300",
    glow: isDark
      ? "shadow-[0_0_25px_rgba(74,222,128,0.18)]"
      : "shadow-[0_0_18px_rgba(74,222,128,0.12)]",
  };
}

function formatValue(value, score, unit = "hrs") {
  if (value === undefined || value === null || value === "") return "--";
  if (score) return `${value}%`;
  if (unit === "") return value;
  return `${value} ${unit}`;
}

function StatCard({ title, value, subtitle, score = false, isDark, unit = "hrs"}) {
  const styles = score
    ? getScoreStyles(value, isDark)
    : {
        text: isDark ? "text-white" : "text-slate-900",
        border: isDark ? "border-white/10" : "border-slate-300",
        glow: "shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
      };

  return (
    <div
      className={`group rounded-3xl border p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
        isDark
          ? "bg-white/5 hover:border-cyan-400/30 hover:bg-white/10"
          : "bg-white/80 hover:border-cyan-500/30 hover:bg-white"
      } ${styles.border} ${styles.glow}`}
    >
      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {title}
      </p>

      <h2 className={`mt-3 text-3xl font-bold ${styles.text}`}>
        {formatValue(value, score, unit)}
      </h2>

      <p className="mt-2 text-sm text-cyan-500">{subtitle}</p>
    </div>
  );
}