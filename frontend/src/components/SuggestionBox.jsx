const ICONS  = ["💡", "📈", "⚠️", "🎯", "✅", "📚"];
const COLORS = ["rgba(124,106,255,0.08)", "rgba(6,214,160,0.08)", "rgba(255,209,102,0.08)", "rgba(124,106,255,0.08)", "rgba(6,214,160,0.08)", "rgba(255,107,107,0.08)"];
const BORDERS = ["rgba(124,106,255,0.15)", "rgba(6,214,160,0.15)", "rgba(255,209,102,0.15)", "rgba(124,106,255,0.15)", "rgba(6,214,160,0.15)", "rgba(255,107,107,0.15)"];

const SuggestionBox = ({ suggestions = [] }) => {
  if (suggestions.length === 0) {
    return <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>Add more data to unlock insights.</p>;
  }
  return (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl p-4"
          style={{ background: COLORS[i % COLORS.length], border: `1px solid ${BORDERS[i % BORDERS.length]}` }}>
          <span className="text-lg leading-none mt-0.5 shrink-0">{ICONS[i % ICONS.length]}</span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{s}</p>
        </div>
      ))}
    </div>
  );
};

export default SuggestionBox;
