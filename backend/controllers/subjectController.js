const Subject = require("../models/Subject");
const Semester = require("../models/Semester");
const { calculateSGPA, getGradePoint } = require("../utils/cgpaCalculator");

const recalculateSemesterSGPA = async (semesterId) => {
  const subjects = await Subject.find({ semester: semesterId });
  const totalCredits = subjects.reduce((sum, s) => sum + s.creditHours, 0);
  const totalGradePoints = subjects.reduce(
    (sum, s) => sum + s.gradePoint * s.creditHours,
    0
  );
  const sgpa = calculateSGPA(subjects);
  await Semester.findByIdAndUpdate(semesterId, { sgpa, totalCredits, totalGradePoints });
};

const getSubjects = async (req, res) => {
  const semester = await Semester.findById(req.params.semesterId);
  if (!semester || semester.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized or semester not found");
  }
  const subjects = await Subject.find({ semester: req.params.semesterId });
  res.json(subjects);
};

const addSubject = async (req, res) => {
  const { name, creditHours, grade } = req.body;
  if (!name || !creditHours || !grade) {
    res.status(400);
    throw new Error("Please provide name, creditHours, and grade");
  }
  const semester = await Semester.findById(req.params.semesterId);
  if (!semester || semester.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized or semester not found");
  }
  const gradePoint = getGradePoint(grade);
  const subject = await Subject.create({
    user: req.user._id,
    semester: req.params.semesterId,
    name,
    creditHours,
    grade,
    gradePoint,
  });
  await recalculateSemesterSGPA(req.params.semesterId);
  res.status(201).json(subject);
};

const updateSubject = async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }
  if (subject.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  const { name, creditHours, grade } = req.body;
  const gradePoint = grade ? getGradePoint(grade) : subject.gradePoint;
  const updated = await Subject.findByIdAndUpdate(
    req.params.id,
    { name, creditHours, grade, gradePoint },
    { new: true, runValidators: true }
  );
  await recalculateSemesterSGPA(subject.semester);
  res.json(updated);
};

const deleteSubject = async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }
  if (subject.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  const semesterId = subject.semester;
  await subject.deleteOne();
  await recalculateSemesterSGPA(semesterId);
  res.json({ message: "Subject deleted" });
};

module.exports = { getSubjects, addSubject, updateSubject, deleteSubject };
