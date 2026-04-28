const GRADE_POINTS = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
};

const calculateSGPA = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  const totalCredits = subjects.reduce((sum, s) => sum + s.creditHours, 0);
  const totalGradePoints = subjects.reduce(
    (sum, s) => sum + s.gradePoint * s.creditHours,
    0
  );
  return totalCredits === 0
    ? 0
    : parseFloat((totalGradePoints / totalCredits).toFixed(2));
};

const calculateCGPA = (semesters) => {
  if (!semesters || semesters.length === 0) return 0;
  const totalCredits = semesters.reduce((sum, s) => sum + s.totalCredits, 0);
  const totalGradePoints = semesters.reduce(
    (sum, s) => sum + s.totalGradePoints,
    0
  );
  return totalCredits === 0
    ? 0
    : parseFloat((totalGradePoints / totalCredits).toFixed(2));
};

const getGradePoint = (grade) => GRADE_POINTS[grade] ?? 0;

module.exports = { calculateSGPA, calculateCGPA, getGradePoint, GRADE_POINTS };
