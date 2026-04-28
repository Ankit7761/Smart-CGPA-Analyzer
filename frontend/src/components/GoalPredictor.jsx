import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const GoalPredictor = () => {
  const [remaining, setRemaining] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/analytics/goal?remainingSemesters=${remaining}`);
      setResult(data);
    } catch { toast.error("Failed to fetch prediction"); }
    finally { setLoading(false); }
  };

  const getColor = () => {
    if (!result) return "#7c6aff";
    if (result.requiredSGPA <= 0) return "#06d6a0";
    if (!result.achievable) return "#ff6b6b";
    if (result.requiredSGPA <= 7) return "#06d6a0";
    if (result.requiredSGPA <= 9) return "#ffd166";
    return "#ff6b6b";
  };

  const color = getColor();

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Remaining Semesters
          </label>
          <input type="number" value={remaining}
            onChange={(e) => setRemaining(Math.max(1, parseInt(e.target.value) || 1))}
            min="1" max="20"
            className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium font-mono-num" />
        </div>
        <button onClick={handlePredict} disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 whitespace-nowrap">
          {loading ? "..." : "Predict"}
        </button>
      </div>

      {result && (
        <div className="rounded-xl p-5 fade-up" style={{ background: `${color}0d`, border: `1px solid ${color}30` }}>
          <p className="text-sm font-semibold mb-4 leading-relaxed" style={{ color }}>{result.message}</p>
          {result.requiredSGPA !== undefined && result.requiredSGPA > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Current CGPA", value: result.currentCGPA, c: "#7c6aff" },
                { label: "Target CGPA",  value: result.targetCGPA,  c: "#ffd166" },
                { label: "Need / Sem",   value: result.requiredSGPA, c: color },
              ].map((item) => (
                <div key={item.label} className="text-center rounded-lg py-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="font-mono-num text-xl font-bold" style={{ color: item.c }}>{item.value}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalPredictor;
