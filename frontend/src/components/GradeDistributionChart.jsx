import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const GRADE_COLORS = { O: "#06d6a0", "A+": "#2ee8b8", A: "#63b3ed", "B+": "#9f8fff", B: "#ffd166", C: "#ffa832", F: "#ff6b6b" };

const GradeDistributionChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>No subject data yet</div>;
  }

  const chartData = Object.entries(data).map(([grade, count]) => ({ name: grade, value: count }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p className="font-bold text-white">Grade {payload[0].name}</p>
          <p style={{ color: GRADE_COLORS[payload[0].name] }}>{payload[0].value} subject(s)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || "#5a5a7a"}
              stroke="rgba(10,10,20,0.5)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={7}
          formatter={(value) => <span style={{ fontSize: "11px", color: "#9090b0" }}>Grade {value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GradeDistributionChart;
