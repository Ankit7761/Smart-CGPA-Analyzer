const CLASS_MAP = { O: "grade-O", "A+": "grade-Ap", A: "grade-A", "B+": "grade-Bp", B: "grade-B", C: "grade-C", F: "grade-F" };

const GradeBadge = ({ grade }) => (
  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg font-mono ${CLASS_MAP[grade] || "grade-C"}`}>
    {grade}
  </span>
);

export default GradeBadge;
