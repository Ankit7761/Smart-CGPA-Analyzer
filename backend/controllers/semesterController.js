const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const getSemesters = async (req, res) => {
  const semesters = await Semester.find({ user: req.user._id }).sort({ year: 1, createdAt: 1 });
  res.json(semesters);
};

const createSemester = async (req, res) => {
  const { name, year, cgpa, sgpa, totalCredits } = req.body;
  if (!name || !year || sgpa === undefined) {
    res.status(400);
    throw new Error("Please provide semester name, year and SGPA");
  }
  const semester = await Semester.create({
    user: req.user._id,
    name,
    year,
    cgpa: cgpa || 0,
    sgpa: parseFloat(sgpa),
    totalCredits: parseInt(totalCredits) || 0,
  });
  res.status(201).json(semester);
};

const getSemesterById = async (req, res) => {
  const semester = await Semester.findById(req.params.id);
  if (!semester) { res.status(404); throw new Error("Semester not found"); }
  if (semester.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  const subjects = await Subject.find({ semester: semester._id });
  res.json({ semester, subjects });
};

const updateSemester = async (req, res) => {
  const semester = await Semester.findById(req.params.id);
  if (!semester) { res.status(404); throw new Error("Semester not found"); }
  if (semester.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  const { name, year, cgpa, sgpa, totalCredits } = req.body;
  const updated = await Semester.findByIdAndUpdate(
    req.params.id,
    {
      ...(name && { name }),
      ...(year && { year }),
      ...(cgpa !== undefined && { cgpa }),
      ...(sgpa !== undefined && { sgpa: parseFloat(sgpa) }),
      ...(totalCredits !== undefined && { totalCredits: parseInt(totalCredits) }),
    },
    { new: true, runValidators: true }
  );
  res.json(updated);
};

const deleteSemester = async (req, res) => {
  const semester = await Semester.findById(req.params.id);
  if (!semester) { res.status(404); throw new Error("Semester not found"); }
  if (semester.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  await Subject.deleteMany({ semester: semester._id });
  await semester.deleteOne();
  res.json({ message: "Semester and all subjects deleted" });
};

module.exports = { getSemesters, createSemester, getSemesterById, updateSemester, deleteSemester };
