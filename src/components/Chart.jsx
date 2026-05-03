import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = ["#22d3ee", "#c4b5fd", "#fb7185"];
const BAR_COLORS = {
  score: "#22d3ee",
  deepWork: "#c4b5fd",
};

function CustomTooltip({ active, payload, label, isDark, type }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm shadow-xl ${
        isDark
          ? "border-white/10 bg-slate-950/95 text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      {type === "pie" ? (
        <div className="space-y-1">
          <p className="font-semibold text-cyan-500">{payload[0].name}</p>
          <p>
            Hours: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p>
            Share:{" "}
            <span className="font-semibold">
              {payload[0].payload.percent ?? 0}%
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="font-semibold text-cyan-500">{label}</p>
          {payload.map((entry, index) => (
            <p key={index}>
              {entry.name}: <span className="font-semibold">{entry.value}%</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Chart({ type, data = [], title, isDark }) {
  const pieData =
    type === "pie"
      ? data.map((item) => {
          const total = data.reduce((sum, curr) => sum + curr.value, 0);
          return {
            ...item,
            percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
          };
        })
      : data;

  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((item) =>
      type === "pie"
        ? Number(item.value) > 0
        : Number(item.score) > 0 || Number(item.deepWork) > 0
    );

  return (
    <div
      className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
      }`}
    >
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <div className="h-[280px] w-full">
        {!hasData ? (
          <div
            className={`flex h-full items-center justify-center rounded-2xl border text-sm ${
              isDark
                ? "border-white/10 bg-slate-950/20 text-slate-400"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {type === "pie"
              ? "No time distribution data yet."
              : "No weekly productivity data yet."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={4}
                  stroke="none"
                  activeOuterRadius={98}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={<CustomTooltip isDark={isDark} type="pie" />}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "13px",
                    paddingTop: "8px",
                  }}
                />
              </PieChart>
            ) : (
              <BarChart data={data} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#1e293b" : "#cbd5e1"}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke={isDark ? "#94a3b8" : "#475569"}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? "#94a3b8" : "#475569"}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />

                <Tooltip
                  cursor={{
                    fill: isDark
                      ? "rgba(34, 211, 238, 0.08)"
                      : "rgba(34, 211, 238, 0.10)",
                    radius: 12,
                  }}
                  content={<CustomTooltip isDark={isDark} type="bar" />}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "13px",
                    paddingTop: "8px",
                  }}
                />

                <Bar
                  dataKey="score"
                  name="Productivity Score"
                  fill={BAR_COLORS.score}
                  radius={[10, 10, 0, 0]}
                />

                <Bar
                  dataKey="deepWork"
                  name="Deep Work Score"
                  fill={BAR_COLORS.deepWork}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}