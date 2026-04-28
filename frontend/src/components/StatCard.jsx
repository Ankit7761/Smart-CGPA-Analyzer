const StatCard = ({ label, value, sub, accent = "#7c6aff", icon, delay = 0 }) => (
  <div
    className={`glass rounded-2xl p-5 glass-hover fade-up fade-up-${delay + 1}`}
    style={{ transition: "all 0.25s ease" }}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <div className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
    </div>
    <p className="font-mono-num text-3xl font-bold mb-1" style={{ color: accent }}>{value}</p>
    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
    {sub && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>}
  </div>
);

export default StatCard;
