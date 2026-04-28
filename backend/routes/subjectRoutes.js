const express = require("express");
const router = express.Router();
const { getSubjects, addSubject, updateSubject, deleteSubject } = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/:semesterId").get(getSubjects).post(addSubject);
router.route("/:id").put(updateSubject).delete(deleteSubject);

module.exports = router;
