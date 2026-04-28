const mongoose = require("mongoose");
const semesterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Semester name is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    // SGPA for this specific semester
    sgpa: {
      type: Number,
      required: [true, "SGPA is required"],
      min: 0,
      max: 10,
    },
    // Total credit hours in this semester
    totalCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Semester", semesterSchema);