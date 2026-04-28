import { useState } from "react";
import Navbar from "../components/Navbar";
import GradeBadge from "../components/GradeBadge";
import { semesterData } from "../data/semesterData";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "F"];
const GRADE_POINTS = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, F: 0 };

const emptySubject = () => ({ id: Date.now() + Math.random(), name: "", credits: "", grade: "A" });

const SGPABar = ({ value }) => {
  const pct = Math.min((value / 10) * 100, 100);
  const color = value >= 8.5 ? "#06d6a0" : value >= 7 ? "#7c6aff" : value >= 5 ? "#ffd166" : "#ff6b6b";
  return (
    <div className="mt-2">
      <div className="w-full rounded-full h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 10px ${color}55` }} />
      </div>
    </div>
  );
};

/* ──────────── SGPA CALCULATOR ──────────── */
const SGPACalculator = () => {
const [subjects, setSubjects] = useState([emptySubject()]);
const [selectedSemester, setSelectedSemester] = useState("");

const handleSemesterChange = (sem) => {
  setSelectedSemester(sem);

  if (semesterData[sem]) {
    const formatted = semesterData[sem].map((sub) => ({
      id: Date.now() + Math.random(),
      name: sub.name,
      credits: sub.credits,
      grade: "A",
    }));

    setSubjects(formatted);
  }
};
  const [result, setResult] = useState(null);

  const addRow = () => setSubjects([...subjects, emptySubject()]);
  const removeRow = (id) => setSubjects(subjects.filter(s => s.id !== id));
  const updateRow = (id, field, value) =>
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));

  const calculate = () => {
    const valid = subjects.filter(s => s.name && s.credits && s.grade);
    if (valid.length === 0) { return; }
    const totalCredits = valid.reduce((sum, s) => sum + parseInt(s.credits), 0);
    const totalPoints  = valid.reduce((sum, s) => sum + GRADE_POINTS[s.grade] * parseInt(s.credits), 0);
    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setResult({ sgpa: parseFloat(sgpa), totalCredits, totalPoints, count: valid.length });
  };

  const reset = () => { setSubjects([emptySubject()]); setResult(null); };
      return (
  <div className="space-y-4">

    {/* ✅ YEH NAYA CODE ADD KARNA HAI (DELETE NAHI) */}
    <div className="mb-4">
      <select
        value={selectedSemester}
        onChange={(e) => handleSemesterChange(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white w-full"
      >
        <option value="">Select Semester</option>
        {[1,2,3,4,5,6,7,8].map((sem) => (
          <option key={sem} value={sem}>
            Semester {sem}
          </option>
        ))}
      </select>
    </div>

    {/* 👇 YE PURANA CODE SAME RAHEGA */}
    {/* Subject Rows */}
      {/* Subject Rows */}
      <div className="space-y-2">
        {subjects.map((sub, i) => (
          <div key={sub.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Subject</label>}
              <input type="text" value={sub.name} onChange={e => updateRow(sub.id, "name", e.target.value)}
                placeholder={`Subject ${i + 1}`}
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-medium" />
            </div>
            <div className="col-span-3">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Credits</label>}
              <input type="number" value={sub.credits} onChange={e => updateRow(sub.id, "credits", e.target.value)}
                placeholder="0" min="1" max="6"
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-mono-num text-center" />
            </div>
            <div className="col-span-3">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Grade</label>}
              <select value={sub.grade} onChange={e => updateRow(sub.id, "grade", e.target.value)}
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-medium">
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="col-span-1 flex items-end pb-0.5">
              {i === 0 && <div className="h-[26px]" />}
              {subjects.length > 1 && (
                <button onClick={() => removeRow(sub.id)}
                  className="w-full h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.08)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}>
                  −
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Row */}
      <button onClick={addRow}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ background: "rgba(124,106,255,0.06)", border: "1px dashed rgba(124,106,255,0.25)", color: "#7c6aff" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(124,106,255,0.12)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(124,106,255,0.06)"}>
        + Add Subject
      </button>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>
          Reset
        </button>
        <button onClick={calculate} className="flex-1 py-3 rounded-xl text-sm font-bold text-white btn-primary">
          Calculate SGPA
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-2xl p-5 fade-up" style={{ background: "rgba(124,106,255,0.08)", border: "1px solid rgba(124,106,255,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>SGPA Result</span>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(124,106,255,0.15)", color: "#9f8fff" }}>{result.count} subjects</span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-mono-num font-bold" style={{ fontSize: "3rem", lineHeight: 1, color: result.sgpa >= 8 ? "#06d6a0" : result.sgpa >= 6 ? "#7c6aff" : "#ffd166" }}>
              {result.sgpa}
            </span>
            <span className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>/ 10.00</span>
          </div>
          <SGPABar value={result.sgpa} />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
              <p className="font-mono-num font-bold text-lg text-white">{result.totalCredits}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Credits</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
              <p className="font-mono-num font-bold text-lg" style={{ color: "#06d6a0" }}>{result.totalPoints}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Points</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────── CGPA CALCULATOR ──────────── */
const CGPACalculator = () => {
  const [semesters, setSemesters] = useState([{ id: 1, name: "Semester 1", sgpa: "", credits: "" }]);
  const [result, setResult] = useState(null);

  const addSem = () => setSemesters([...semesters, { id: Date.now(), name: `Semester ${semesters.length + 1}`, sgpa: "", credits: "" }]);
  const removeSem = (id) => setSemesters(semesters.filter(s => s.id !== id));
  const updateSem = (id, field, value) =>
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));

  const calculate = () => {
    const valid = semesters.filter(s => s.sgpa && s.credits && parseFloat(s.sgpa) >= 0 && parseFloat(s.sgpa) <= 10);
    if (valid.length === 0) return;
    const totalCredits = valid.reduce((sum, s) => sum + parseFloat(s.credits), 0);
    const totalPoints  = valid.reduce((sum, s) => sum + parseFloat(s.sgpa) * parseFloat(s.credits), 0);
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setResult({ cgpa: parseFloat(cgpa), totalCredits, count: valid.length });
  };

  const reset = () => { setSemesters([{ id: 1, name: "Semester 1", sgpa: "", credits: "" }]); setResult(null); };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {semesters.map((sem, i) => (
          <div key={sem.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Semester</label>}
              <input type="text" value={sem.name} onChange={e => updateSem(sem.id, "name", e.target.value)}
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-medium" />
            </div>
            <div className="col-span-3">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>SGPA</label>}
              <input type="number" value={sem.sgpa} onChange={e => updateSem(sem.id, "sgpa", e.target.value)}
                placeholder="0.00" min="0" max="10" step="0.01"
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-mono-num text-center" />
            </div>
            <div className="col-span-3">
              {i === 0 && <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Credits</label>}
              <input type="number" value={sem.credits} onChange={e => updateSem(sem.id, "credits", e.target.value)}
                placeholder="0" min="1"
                className="dark-input w-full px-3 py-2.5 rounded-xl text-sm font-mono-num text-center" />
            </div>
            <div className="col-span-1 flex items-end pb-0.5">
              {i === 0 && <div className="h-[26px]" />}
              {semesters.length > 1 && (
                <button onClick={() => removeSem(sem.id)}
                  className="w-full h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.08)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}>
                  −
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addSem}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ background: "rgba(6,214,160,0.06)", border: "1px dashed rgba(6,214,160,0.25)", color: "#06d6a0" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(6,214,160,0.12)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(6,214,160,0.06)"}>
        + Add Semester
      </button>

      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>
          Reset
        </button>
        <button onClick={calculate} className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #06d6a0, #059c75)", boxShadow: "0 0 20px rgba(6,214,160,0.3)" }}>
          Calculate CGPA
        </button>
      </div>

      {result && (
        <div className="rounded-2xl p-5 fade-up" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>CGPA Result</span>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(6,214,160,0.15)", color: "#06d6a0" }}>{result.count} semesters</span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-mono-num font-bold" style={{ fontSize: "3rem", lineHeight: 1, color: "#06d6a0" }}>
              {result.cgpa}
            </span>
            <span className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>/ 10.00</span>
          </div>
          <SGPABar value={result.cgpa} />
          <div className="mt-4 rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
            <p className="font-mono-num font-bold text-lg text-white">{result.totalCredits}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Total Credits</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────── GRADE TABLE ──────────── */
const GradeTable = () => (
  <div className="space-y-2">
    {GRADES.map(g => (
      <div key={g} className="flex items-center justify-between py-2.5 px-4 rounded-xl transition-all"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <GradeBadge grade={g} />
        <div className="text-right">
          <span className="font-mono-num font-bold text-white text-lg">{GRADE_POINTS[g]}</span>
          <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>pts</span>
        </div>
        <div className="w-24">
          <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-1.5 rounded-full"
              style={{ width: `${(GRADE_POINTS[g] / 10) * 100}%`, background: g === "F" ? "#ff6b6b" : g === "C" ? "#ffa832" : g === "B" ? "#ffd166" : "#06d6a0" }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ──────────── MAIN PAGE ──────────── */
const CalculatorPage = () => {
  const [tab, setTab] = useState("sgpa");

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="text-3xl font-bold text-white">Calculator</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Compute SGPA & CGPA instantly — no login required</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calculator */}
          <div className="lg:col-span-2 space-y-4 fade-up fade-up-1">
            {/* Tab switch */}
            <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { id: "sgpa", label: "SGPA Calculator", desc: "From subjects" },
                { id: "cgpa", label: "CGPA Calculator", desc: "From semesters" },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
                  style={tab === t.id
                    ? { background: "rgba(124,106,255,0.2)", color: "#9f8fff", border: "1px solid rgba(124,106,255,0.3)" }
                    : { color: "var(--text-muted)", border: "1px solid transparent" }}>
                  {t.label}
                  <span className="block text-xs font-normal opacity-60">{t.desc}</span>
                </button>
              ))}
            </div>

            {/* Calculator panel */}
            <div className="glass rounded-2xl p-6">
              {tab === "sgpa" ? <SGPACalculator /> : <CGPACalculator />}
            </div>
          </div>

          {/* Right: Grade Scale + Tips */}
          <div className="space-y-4 fade-up fade-up-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Grade Scale</h3>
              <GradeTable />
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>How it works</h3>
              <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <div className="rounded-lg p-3" style={{ background: "rgba(124,106,255,0.08)", border: "1px solid rgba(124,106,255,0.12)" }}>
                  <p className="font-bold text-white mb-1">SGPA Formula</p>
                  <p className="font-mono-num" style={{ color: "#9f8fff" }}>Σ(Grade Point × Credits) / Σ Credits</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.12)" }}>
                  <p className="font-bold text-white mb-1">CGPA Formula</p>
                  <p className="font-mono-num" style={{ color: "#06d6a0" }}>Σ(SGPA × Credits) / Σ Credits</p>
                </div>
                <p>Credits act as weights — higher credit subjects impact your GPA more.</p>
                <p>The calculator uses a <strong className="text-white">10-point grading scale</strong> standard to most Indian universities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalculatorPage;
