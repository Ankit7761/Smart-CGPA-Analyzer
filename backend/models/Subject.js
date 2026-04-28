const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    creditHours: {
      type: Number,
      required: [true, "Credit hours are required"],
      min: 1,
      max: 6,
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
      enum: ["O", "A+", "A", "B+", "B", "C", "F"],
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
