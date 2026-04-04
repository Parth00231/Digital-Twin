import Chart from "./Chart";

export default function Dashboard({ stats, timeData, weeklyData, isDark }) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tracked Hours"
          value={stats.totalHours}
          subtitle="+12% vs yesterday"
          isDark={isDark}
        />
        <StatCard
          title="Deep Work"
          value={stats.focusTime}
          subtitle="Coding + Study"
          isDark={isDark}
        />
        <StatCard
          title="Distraction Time"
          value={stats.distraction}
          subtitle="Mostly entertainment usage"
          isDark={isDark}
        />
        <StatCard
          title="Productivity Score"
          value={stats.productivityScore}
          subtitle="AI evaluated"
          score
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Chart
          type="pie"
          title="Time Distribution"
          data={timeData}
          isDark={isDark}
        />
        <Chart
          type="bar"
          title="Daily Productivity Pattern"
          data={weeklyData}
          isDark={isDark}
        />
      </div>
    </section>
  );
}

function getScoreStyles(score, isDark) {
  const num = parseInt(score);

  if (num < 50) {
    return {
      text: "text-red-400",
      border: isDark ? "border-red-400/40" : "border-red-300",
      glow: isDark
        ? "shadow-[0_0_25px_rgba(248,113,113,0.18)]"
        : "shadow-[0_0_18px_rgba(248,113,113,0.12)]",
    };
  }

  if (num < 75) {
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

function StatCard({ title, value, subtitle, score = false, isDark }) {
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
        {value || "--"}
      </h2>

      <p className="mt-2 text-sm text-cyan-500">{subtitle}</p>
    </div>
  );
}