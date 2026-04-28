const express = require("express");
const router = express.Router();
const { getSemesters, createSemester, getSemesterById, updateSemester, deleteSemester } = require("../controllers/semesterController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(getSemesters).post(createSemester);
router.route("/:id").get(getSemesterById).put(updateSemester).delete(deleteSemester);

module.exports = router;
