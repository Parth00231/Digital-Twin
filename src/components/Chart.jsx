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
} from "recharts";

const COLORS = ["#22d3ee", "#a78bfa", "#f472b6", "#facc15"];

export default function Chart({ type, data, title }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#22d3ee" }}
                itemStyle={{ color: "#ffffff" }}
              />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />

              <Tooltip
                cursor={{ fill: "rgba(34, 211, 238, 0.08)" }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#22d3ee" }}
                itemStyle={{ color: "#ffffff" }}
              />

              <Bar
                dataKey="hours"
                fill="#22d3ee"
                radius={[10, 10, 0, 0]}
                activeBar={{
                  fill: "#67e8f9",
                  stroke: "#22d3ee",
                  strokeWidth: 1,
                }}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}