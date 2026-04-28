import toast from "react-hot-toast";
import API from "../api/axios";
import GradeBadge from "./GradeBadge";

const SubjectTable = ({ subjects, onDeleted }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this subject?")) return;
    try {
      await API.delete(`/subjects/${id}`);
      toast.success("Subject removed");
      onDeleted();
    } catch { toast.error("Failed to remove"); }
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="text-5xl mb-3 opacity-30">📝</div>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No subjects yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Add your first subject above</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["Subject", "Credits", "Grade", "Points", "Weighted", ""].map((h) => (
              <th key={h} className={`py-3 px-4 text-xs font-semibold uppercase tracking-widest ${h === "" ? "" : "text-left"}`}
                style={{ color: "var(--text-muted)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, i) => (
            <tr key={sub._id} className="group transition-all duration-150"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(124,106,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td className="py-3.5 px-4 font-semibold text-white">{sub.name}</td>
              <td className="py-3.5 px-4 font-mono-num text-center" style={{ color: "var(--text-secondary)" }}>{sub.creditHours}</td>
              <td className="py-3.5 px-4 text-center"><GradeBadge grade={sub.grade} /></td>
              <td className="py-3.5 px-4 font-mono-num text-center text-primary-400 font-bold">{sub.gradePoint}</td>
              <td className="py-3.5 px-4 font-mono-num text-center font-bold" style={{ color: "#06d6a0" }}>
                {(sub.gradePoint * sub.creditHours).toFixed(1)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <button onClick={() => handleDelete(sub._id)}
                  className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-lg"
                  style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.1)" }}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectTable;
