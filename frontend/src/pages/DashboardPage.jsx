import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import API from "../api/axios";
import useAuth from "../hooks/useAuth";

const DashboardPage = () => {
  const { user, updateTarget } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetInput, setTargetInput] = useState(user?.targetCGPA || "");
  const [savingTarget, setSavingTarget] = useState(false);

  useEffect(() => {
    API.get("/analytics/dashboard")
      .then(r => setData(r.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleTargetSave = async () => {
    if (!targetInput || targetInput < 0 || targetInput > 10) {
      toast.error("CGPA must be 0–10");
      return;
    }
    setSavingTarget(true);
    try {
      await updateTarget(parseFloat(targetInput));
      toast.success("Target updated");
    } catch { toast.error("Failed to update"); }
    finally { setSavingTarget(false); }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading dashboard...</p>
        </div>
      </div>
    </>
  );

  const cgpaColor = !data?.cgpa ? "#5a5a7a"
    : data.cgpa >= 8.5 ? "#06d6a0"
    : data.cgpa >= 7   ? "#7c6aff"
    : data.cgpa >= 5   ? "#ffd166"
    : "#ff6b6b";

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8 fade-up">
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Good to see you,</p>
          <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
        </div>

        {/* CGPA Hero */}
        <div className="glass rounded-3xl p-8 mb-6 fade-up fade-up-1 relative overflow-hidden"
          style={{ border: "1px solid rgba(124,106,255,0.15)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: `radial-gradient(circle, ${cgpaColor}, transparent)`, transform: "translate(30%, -30%)" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Cumulative GPA</p>
              <div className="flex items-end gap-3">
                <span className="font-mono-num font-bold" style={{ fontSize: "5rem", lineHeight: 1, color: cgpaColor }}>
                  {data?.cgpa || "—"}
                </span>
                <span className="text-xl mb-3" style={{ color: "var(--text-muted)" }}>/10</span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                Across <strong className="text-white">{data?.totalSemesters || 0}</strong> semester{data?.totalSemesters !== 1 ? "s" : ""} &middot; <strong className="text-white">{data?.totalCredits || 0}</strong> credits earned
              </p>
            </div>

            {/* Set target */}
            <div className="glass rounded-2xl p-5 min-w-[220px]" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Target CGPA</p>
              <div className="flex gap-2">
                <input type="number" value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  min="0" max="10" step="0.1" placeholder="e.g. 8.5"
                  className="dark-input flex-1 px-3 py-2.5 rounded-xl text-sm font-mono-num font-bold" />
                <button onClick={handleTargetSave} disabled={savingTarget}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50">
                  {savingTarget ? "..." : "Set"}
                </button>
              </div>
              {user?.targetCGPA && (
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  Current goal: <span className="font-mono-num font-bold" style={{ color: "#ffd166" }}>{user.targetCGPA}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Current CGPA"   value={data?.cgpa || "—"}             icon="◈" accent="#7c6aff" delay={0} sub="Cumulative"   />
          <StatCard label="Semesters Done" value={data?.totalSemesters || 0}      icon="◫" accent="#06d6a0" delay={1} sub="Completed"    />
          <StatCard label="Credits Earned" value={data?.totalCredits || 0}        icon="⬡" accent="#ffd166" delay={2} sub="Total"        />
          <StatCard label="Target CGPA"    value={user?.targetCGPA || "Not set"}  icon="◬" accent="#ff6b6b" delay={3} sub="Your goal"    />
        </div>

        {/* Best / Worst */}
        {data?.bestSemester && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 fade-up fade-up-2">
            <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(6,214,160,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: "#06d6a0", boxShadow: "0 0 6px #06d6a0" }} />
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#06d6a0" }}>Best Semester</p>
              </div>
              <p className="text-lg font-bold text-white">{data.bestSemester.name}</p>
              <p className="font-mono-num text-3xl font-bold mt-1" style={{ color: "#06d6a0" }}>{data.bestSemester.sgpa}</p>
            </div>
            <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(255,107,107,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: "#ff6b6b", boxShadow: "0 0 6px #ff6b6b" }} />
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff6b6b" }}>Needs Improvement</p>
              </div>
              <p className="text-lg font-bold text-white">{data.worstSemester.name}</p>
              <p className="font-mono-num text-3xl font-bold mt-1" style={{ color: "#ff6b6b" }}>{data.worstSemester.sgpa}</p>
            </div>
          </div>
        )}

        {/* Quick Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 fade-up fade-up-3">
          {[
            { to: "/calculator", icon: "◈", label: "Calculator",    desc: "SGPA & CGPA instantly",      accent: "#7c6aff" },
            { to: "/semesters",  icon: "◫", label: "Semesters",     desc: "Manage your semesters",      accent: "#06d6a0" },
            { to: "/analytics",  icon: "◬", label: "Analytics",     desc: "Charts & grade breakdown",   accent: "#ffd166" },
            { to: "/analytics",  icon: "⬡", label: "Goal Predictor",desc: "Know what SGPA you need",    accent: "#ff6b6b" },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className="glass rounded-2xl p-5 glass-hover group transition-all duration-200"
              style={{ textDecoration: "none" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg transition-all"
                style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}30`, color: item.accent }}>
                {item.icon}
              </div>
              <p className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
};

export default DashboardPage;
