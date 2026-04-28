import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import SubjectTable from "../components/SubjectTable";
import AddSubjectModal from "../components/AddSubjectModal";
import API from "../api/axios";

const SGPAMeter = ({ sgpa }) => {
  const pct = Math.min((sgpa / 10) * 100, 100);
  const color = sgpa >= 8.5 ? "#06d6a0" : sgpa >= 7 ? "#7c6aff" : sgpa >= 5 ? "#ffd166" : "#ff6b6b";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
        <span>0.0</span><span>10.0</span>
      </div>
      <div className="w-full rounded-full h-3 relative" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-3 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 12px ${color}55` }} />
      </div>
    </div>
  );
};

const SemesterDetailPage = () => {
  const { id } = useParams();
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await API.get(`/semesters/${id}`);
      setSemester(data.semester);
      setSubjects(data.subjects);
    } catch { toast.error("Failed to load semester"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    </>
  );

  if (!semester) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Semester not found.</p>
      </div>
    </>
  );

  const totalWeighted = subjects.reduce((sum, s) => sum + s.gradePoint * s.creditHours, 0);
  const sgpaColor = semester.sgpa >= 8.5 ? "#06d6a0" : semester.sgpa >= 7 ? "#7c6aff" : semester.sgpa >= 5 ? "#ffd166" : "#ff6b6b";

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6 fade-up" style={{ color: "var(--text-muted)" }}>
          <Link to="/semesters" className="hover:text-primary-400 transition-colors">Semesters</Link>
          <span>/</span>
          <span className="text-white font-medium">{semester.name}</span>
        </div>

        {/* Header Card */}
        <div className="glass rounded-3xl p-7 mb-6 fade-up fade-up-1 relative overflow-hidden"
          style={{ border: `1px solid ${sgpaColor}25` }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${sgpaColor}, transparent)`, transform: "translate(30%,-30%)" }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6 relative">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{semester.name}</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{semester.year} academic year</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>SGPA</p>
              <p className="font-mono-num font-bold" style={{ fontSize: "4rem", lineHeight: 1, color: sgpaColor }}>{semester.sgpa}</p>
            </div>
          </div>

          <SGPAMeter sgpa={semester.sgpa} />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { label: "Subjects",     value: subjects.length,          color: "#7c6aff" },
              { label: "Credits",      value: semester.totalCredits,    color: "#06d6a0" },
              { label: "Grade Points", value: totalWeighted.toFixed(1), color: "#ffd166" },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="font-mono-num font-bold text-2xl" style={{ color: item.color }}>{item.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Table Card */}
        <div className="glass rounded-2xl fade-up fade-up-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 className="font-bold text-white">Subjects</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subjects.length} subject{subjects.length !== 1 ? "s" : ""} this semester</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="text-xs font-bold px-4 py-2 rounded-xl text-white btn-primary">
              + Add Subject
            </button>
          </div>
          <SubjectTable subjects={subjects} onDeleted={fetchData} />
        </div>

      </div>

      {showModal && (
        <AddSubjectModal semesterId={id} onClose={() => setShowModal(false)} onAdded={fetchData} />
      )}
    </>
  );
};

export default SemesterDetailPage;
