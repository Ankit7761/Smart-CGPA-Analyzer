import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "F"];
const GRADE_POINTS = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, F: 0 };

const AddSubjectModal = ({ semesterId, onClose, onAdded }) => {
  const [form, setForm] = useState({ name: "", creditHours: "", grade: "A" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.creditHours || !form.grade) { toast.error("Fill in all fields"); return; }
    if (form.creditHours < 1 || form.creditHours > 6) { toast.error("Credits: 1–6"); return; }
    setSaving(true);
    try {
      await API.post(`/subjects/${semesterId}`, { ...form, creditHours: parseInt(form.creditHours) });
      toast.success("Subject added");
      onAdded(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  const gp = GRADE_POINTS[form.grade];
  const weighted = form.creditHours ? (gp * parseInt(form.creditHours)).toFixed(1) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass rounded-2xl w-full max-w-md p-6 fade-up" style={{ border: "1px solid rgba(124,106,255,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Add Subject</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Fill in subject details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Subject Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Data Structures"
              className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Credits</label>
              <input type="number" name="creditHours" value={form.creditHours} onChange={handleChange}
                placeholder="1–6" min="1" max="6"
                className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Grade</label>
              <select name="grade" value={form.grade} onChange={handleChange}
                className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium">
                {GRADES.map((g) => <option key={g} value={g}>{g} — {GRADE_POINTS[g]} pts</option>)}
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "rgba(124,106,255,0.08)", border: "1px solid rgba(124,106,255,0.15)" }}>
            <div className="text-center">
              <p className="font-mono-num text-2xl font-bold text-primary-400">{gp}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Grade Point</p>
            </div>
            <div className="text-gray-600 text-lg">×</div>
            <div className="text-center">
              <p className="font-mono-num text-2xl font-bold text-white">{form.creditHours || "?"}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Credits</p>
            </div>
            <div className="text-gray-600 text-lg">=</div>
            <div className="text-center">
              <p className="font-mono-num text-2xl font-bold text-accent-green">{weighted}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Weighted</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50">
              {saving ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
