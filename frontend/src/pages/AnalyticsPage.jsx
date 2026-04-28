import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import SGPATrendChart from "../components/SGPATrendChart";
import GradeDistributionChart from "../components/GradeDistributionChart";
import GoalPredictor from "../components/GoalPredictor";
import SuggestionBox from "../components/SuggestionBox";
import ExportButton from "../components/ExportButton";
import GradeBadge from "../components/GradeBadge";
import API from "../api/axios";

const SectionCard = ({ title, children, action, className = "" }) => (
  <div className={`glass rounded-2xl ${className}`} style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
    {title && (
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{title}</h2>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/analytics/dashboard"),
      API.get("/analytics/subjects"),
      API.get("/analytics/suggestions"),
    ]).then(([dash, subs, sugg]) => {
      setDashboard(dash.data);
      setSubjectData(subs.data);
      setSuggestions(sugg.data.suggestions || []);
    }).catch(() => toast.error("Failed to load analytics"))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Crunching your data...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Deep dive into your academic performance</p>
          </div>
          <ExportButton targetId="analytics-export" />
        </div>

        <div id="analytics-export" className="space-y-6">

          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 fade-up fade-up-1">
            {[
              { label: "CGPA",      value: dashboard?.cgpa ?? "—",                  color: "#7c6aff" },
              { label: "Semesters", value: dashboard?.totalSemesters ?? 0,            color: "#06d6a0" },
              { label: "Credits",   value: dashboard?.totalCredits ?? 0,             color: "#ffd166" },
              { label: "Best SGPA", value: dashboard?.bestSemester?.sgpa ?? "—",     color: "#ff6b6b" },
            ].map(item => (
              <div key={item.label} className="glass rounded-2xl p-5 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-mono-num text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
                <p className="text-xs mt-1.5 font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up fade-up-2">
            <SectionCard title="SGPA Trend">
              <SGPATrendChart data={dashboard?.sgpaTrend} />
            </SectionCard>
            <SectionCard title="Grade Distribution">
              <GradeDistributionChart data={subjectData?.gradeDistribution} />
            </SectionCard>
          </div>

          {/* Subject Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up fade-up-3">
            <SectionCard title="Top Performers">
              {!subjectData?.topSubjects?.length ? (
                <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>No subject data yet</p>
              ) : (
                <div className="space-y-2">
                  {subjectData.topSubjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl transition-all"
                      style={{ background: "rgba(6,214,160,0.04)", border: "1px solid rgba(6,214,160,0.08)" }}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono-num text-xs font-bold w-5 text-center" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GradeBadge grade={s.grade} />
                        <span className="font-mono-num text-sm font-bold" style={{ color: "#06d6a0" }}>{s.gradePoint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Needs Improvement">
              {!subjectData?.weakSubjects?.length ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🏆</p>
                  <p className="text-sm font-semibold text-white">All subjects looking great!</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>No weak subjects found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subjectData.weakSubjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl"
                      style={{ background: "rgba(255,107,107,0.04)", border: "1px solid rgba(255,107,107,0.08)" }}>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.semester}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <GradeBadge grade={s.grade} />
                        <span className="font-mono-num text-sm font-bold" style={{ color: "#ff6b6b" }}>{s.gradePoint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Goal Predictor */}
          <SectionCard title="🎯 Goal Predictor" className="fade-up fade-up-4">
            <GoalPredictor />
          </SectionCard>

          {/* Smart Suggestions */}
          <SectionCard title="💡 Smart Suggestions" className="fade-up fade-up-4">
            <SuggestionBox suggestions={suggestions} />
          </SectionCard>

        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
