import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(124,106,255,0.3)", backdropFilter: "blur(12px)" }}>
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="font-mono-num font-bold" style={{ color: "#7c6aff" }}>SGPA: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const SGPATrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-muted)" }}>No semester data yet</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7c6aff" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#7c6aff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#5a5a7a" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "#5a5a7a" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={8} stroke="rgba(124,106,255,0.2)" strokeDasharray="4 4" />
        <Area type="monotone" dataKey="sgpa" stroke="#7c6aff" strokeWidth={2.5}
          fill="url(#sgpaGrad)" dot={{ fill: "#7c6aff", strokeWidth: 2, r: 4, stroke: "#0f0f1e" }}
          activeDot={{ r: 6, fill: "#9f8fff", stroke: "#0f0f1e", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SGPATrendChart;
