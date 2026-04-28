const express = require("express");
const router = express.Router();
const { getDashboard, getSubjectAnalytics, getGoalPrediction, getSuggestions } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/dashboard", getDashboard);
router.get("/subjects", getSubjectAnalytics);
router.get("/goal", getGoalPrediction);
router.get("/suggestions", getSuggestions);

module.exports = router;
