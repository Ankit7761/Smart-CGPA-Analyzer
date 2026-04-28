const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const User = require("../models/User");

// CGPA = sum(sgpa * credits) / sum(credits)
const computeCGPA = (semesters) => {
  const totalCredits = semesters.reduce((s, sem) => s + (sem.totalCredits || 0), 0);
  if (totalCredits === 0) {
    const avg = semesters.reduce((s, sem) => s + (sem.sgpa || 0), 0) / semesters.length;
    return parseFloat(avg.toFixed(2));
  }
  const weighted = semesters.reduce((s, sem) => s + (sem.sgpa || 0) * (sem.totalCredits || 0), 0);
  return parseFloat((weighted / totalCredits).toFixed(2));
};

const getDashboard = async (req, res) => {
  const semesters = await Semester.find({ user: req.user._id }).sort({ year: 1, createdAt: 1 });
  if (semesters.length === 0) {
    return res.json({ cgpa: 0, totalSemesters: 0, totalCredits: 0, sgpaTrend: [], semesterBreakdown: [], bestSemester: null, worstSemester: null });
  }
  const cgpa = computeCGPA(semesters);
  const totalCredits = semesters.reduce((sum, s) => sum + (s.totalCredits || 0), 0);
  const sgpaTrend = semesters.map((s) => ({ name: s.name, sgpa: s.sgpa, year: s.year }));
  const semesterBreakdown = await Promise.all(
    semesters.map(async (s) => {
      const subjects = await Subject.find({ semester: s._id });
      return {
        semesterId: s._id,
        name: s.name,
        year: s.year,
        sgpa: s.sgpa,
        totalCredits: s.totalCredits,
        subjects: subjects.map((sub) => ({ name: sub.name, grade: sub.grade, gradePoint: sub.gradePoint, creditHours: sub.creditHours })),
      };
    })
  );
  const sorted = [...semesters].sort((a, b) => b.sgpa - a.sgpa);
  const bestSemester = sorted[0];
  const worstSemester = sorted[sorted.length - 1];
  res.json({ cgpa, totalSemesters: semesters.length, totalCredits, sgpaTrend, semesterBreakdown, bestSemester: { name: bestSemester.name, sgpa: bestSemester.sgpa }, worstSemester: { name: worstSemester.name, sgpa: worstSemester.sgpa } });
};

const getSubjectAnalytics = async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id }).populate("semester", "name year");
  if (subjects.length === 0) {
    return res.json({ topSubjects: [], weakSubjects: [], gradeDistribution: {} });
  }
  const gradeDistribution = subjects.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});
  const sorted = [...subjects].sort((a, b) => b.gradePoint - a.gradePoint);
  const topSubjects = sorted.slice(0, 5).map((s) => ({ name: s.name, grade: s.grade, gradePoint: s.gradePoint, semester: s.semester?.name }));
  const weakSubjects = subjects.filter((s) => s.gradePoint <= 6).map((s) => ({ name: s.name, grade: s.grade, gradePoint: s.gradePoint, semester: s.semester?.name }));
  res.json({ topSubjects, weakSubjects, gradeDistribution });
};

const getGoalPrediction = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.targetCGPA) {
    return res.json({ achievable: null, message: "No target CGPA set. Update your profile with a target." });
  }
  const semesters = await Semester.find({ user: req.user._id });
  const { remainingSemesters } = req.query;
  const remaining = parseInt(remainingSemesters) || 1;
  if (semesters.length === 0) {
    return res.json({ targetCGPA: user.targetCGPA, currentCGPA: 0, remainingSemesters: remaining, requiredSGPA: user.targetCGPA, achievable: user.targetCGPA <= 10, message: user.targetCGPA <= 10 ? "You need to maintain " + user.targetCGPA + " SGPA every semester." : "Target CGPA exceeds maximum possible (10)." });
  }
  const currentCGPA = computeCGPA(semesters);
  const totalDone = semesters.length;
  const requiredSGPA = parseFloat(((user.targetCGPA * (totalDone + remaining) - currentCGPA * totalDone) / remaining).toFixed(2));
  const achievable = requiredSGPA >= 0 && requiredSGPA <= 10;
  let message;
  if (requiredSGPA <= 0) {
    message = "You have already surpassed your target CGPA of " + user.targetCGPA + "!";
  } else if (!achievable) {
    message = "Target not achievable. Required SGPA (" + requiredSGPA + ") exceeds 10. Consider adjusting your goal or adding more semesters.";
  } else {
    message = "You need " + requiredSGPA + " SGPA in each of the next " + remaining + " semester(s) to reach your target CGPA of " + user.targetCGPA + ".";
  }
  res.json({ targetCGPA: user.targetCGPA, currentCGPA, completedSemesters: totalDone, remainingSemesters: remaining, requiredSGPA, achievable, message });
};

const getSuggestions = async (req, res) => {
  const semesters = await Semester.find({ user: req.user._id }).sort({ createdAt: -1 });
  const subjects = await Subject.find({ user: req.user._id });
  const user = await User.findById(req.user._id);
  const suggestions = [];
  if (semesters.length === 0) {
    return res.json({ suggestions: ["Start by adding your first semester and subjects."] });
  }
  const cgpa = computeCGPA(semesters);
  if (semesters.length >= 2) {
    const [latest, previous] = semesters;
    if (latest.sgpa < previous.sgpa) {
      suggestions.push("Your SGPA dropped from " + previous.sgpa + " to " + latest.sgpa + ". Focus on improving grades in upcoming subjects.");
    } else if (latest.sgpa > previous.sgpa) {
      suggestions.push("Great improvement! Your SGPA rose from " + previous.sgpa + " to " + latest.sgpa + ". Keep it up.");
    }
  }
  const weakCount = subjects.filter((s) => s.gradePoint <= 5).length;
  if (weakCount > 0) {
    suggestions.push("You have " + weakCount + " subject(s) with C grade or below. Consider revisiting those topics.");
  }
  if (user.targetCGPA) {
    if (cgpa >= user.targetCGPA) {
      suggestions.push("You have reached your target CGPA of " + user.targetCGPA + ". Consider raising your goal!");
    } else {
      const gap = (user.targetCGPA - cgpa).toFixed(2);
      suggestions.push("You are " + gap + " points away from your target CGPA of " + user.targetCGPA + ".");
    }
  }
  const latestSemester = semesters[0];
  if (latestSemester && (latestSemester.totalCredits || 0) > 25) {
    suggestions.push("Your latest semester had " + latestSemester.totalCredits + " credits. A heavy load can impact performance, plan wisely.");
  }
  const perfectCount = subjects.filter((s) => s.grade === "O").length;
  if (perfectCount === subjects.length && subjects.length > 0) {
    suggestions.push("Outstanding! You have O grades in all subjects. Excellent academic performance.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Your performance looks steady. Keep adding semesters to get deeper insights.");
  }
  res.json({ cgpa, suggestions });
};

module.exports = { getDashboard, getSubjectAnalytics, getGoalPrediction, getSuggestions };