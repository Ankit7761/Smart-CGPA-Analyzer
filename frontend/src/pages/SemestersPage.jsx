import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const SGPABadge = ({ sgpa }) => {
  const [color, bg, border] =
    sgpa >= 8.5 ? ["#06d6a0", "rgba(6,214,160,0.1)",   "rgba(6,214,160,0.25)"]   :
    sgpa >= 7   ? ["#7c6aff", "rgba(124,106,255,0.1)", "rgba(124,106,255,0.25)"] :
    sgpa >= 5   ? ["#ffd166", "rgba(255,209,102,0.1)", "rgba(255,209,102,0.25)"] :
                  ["#ff6b6b", "rgba(255,107,107,0.1)", "rgba(255,107,107,0.25)"];
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-lg font-mono-num"
      style={{ color, background: bg, border: `1px solid ${border}` }}>
      {sgpa} SGPA
    </span>
  );
};

const SemestersPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // ✅ FIX 1: use "sgpa" not "cgpa"
  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    sgpa: ""
  });
  const [saving, setSaving] = useState(false);

  const fetchSemesters = async () => {
    try {
      const { data } = await API.get("/semesters");
      setSemesters(data);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSemesters(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    // ✅ FIX 2: validate "sgpa" not "cgpa"
    if (!form.name || !form.sgpa) {
      toast.error("Fill in all fields");
      return;
    }

    setSaving(true);
    try {
      // ✅ FIX 3: send "sgpa" to API not "cgpa"
      await API.post("/semesters", {
        name: form.name,
        year: form.year,
        sgpa: parseFloat(form.sgpa)
      });
      toast.success("Semester added");
      setForm({ name: "", year: new Date().getFullYear(), sgpa: "" });
      setShowForm(false);
      fetchSemesters();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete semester and all its subjects?")) return;
    try {
      await API.delete(`/semesters/${id}`);
      toast.success("Semester deleted");
      setSemesters(prev => prev.filter(s => s._id !== id));
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-3xl font-bold text-white">Semesters</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {semesters.length} semester{semesters.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${showForm ? "" : "btn-primary text-white"}`}
            style={showForm ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" } : {}}>
            {showForm ? "Cancel" : "+ New Semester"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-6 fade-up"
            style={{ border: "1px solid rgba(124,106,255,0.2)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>New Semester</h3>

            {/* ✅ FIX 4: All 3 inputs properly in their own grid columns — SGPA moved out of Year div */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Semester Name</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Semester 3"
                  className="dark-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Year</label>
                <input type="number" value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  placeholder="2024"
                  className="dark-input w-full px-4 py-3 rounded-xl text-sm font-mono-num" />
              </div>

              {/* ✅ FIX 5: SGPA field now its own clean column */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>SGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={form.sgpa}
                  onChange={e => setForm({ ...form, sgpa: e.target.value })}
                  placeholder="e.g. 8.5"
                  className="dark-input w-full px-4 py-3 rounded-xl text-sm font-mono-num"
                />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50">
              {saving ? "Saving..." : "Add Semester"}
            </button>
          </form>
        )}

        {/* Semester List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
          </div>
        ) : semesters.length === 0 ? (
          <div className="text-center py-20 fade-up">
            <div className="text-5xl mb-4 opacity-30">📚</div>
            <p className="text-lg font-semibold text-white mb-1">No semesters yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Add your first semester to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {semesters.map((sem, i) => (
              <div key={sem._id}
                className="glass rounded-2xl p-5 glass-hover fade-up transition-all duration-200 group"
                style={{ animationDelay: `${i * 0.04}s`, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono-num font-bold text-sm shrink-0"
                      style={{ background: "rgba(124,106,255,0.1)", border: "1px solid rgba(124,106,255,0.2)", color: "#7c6aff" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-white">{sem.name}</p>
                        <SGPABadge sgpa={sem.sgpa} />
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {sem.year} &middot; {sem.totalCredits} credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/semesters/${sem._id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      style={{ color: "#7c6aff", background: "rgba(124,106,255,0.1)", border: "1px solid rgba(124,106,255,0.2)" }}>
                      View →
                    </Link>
                    <button onClick={() => handleDelete(sem._id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.15)" }}>
                      Delete
                    </button>
                  </div>
                </div>

                {/* SGPA mini-bar */}
                <div className="mt-3">
                  <div className="w-full rounded-full h-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-1 rounded-full transition-all duration-700"
                      style={{
                        width: `${(sem.sgpa / 10) * 100}%`,
                        background: sem.sgpa >= 8.5 ? "#06d6a0" :
                                   sem.sgpa >= 7   ? "#7c6aff" :
                                   sem.sgpa >= 5   ? "#ffd166" :
                                                     "#ff6b6b"
                      }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SemestersPage;
