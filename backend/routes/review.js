const express = require("express");
const {
  saveMarks,
  getStudentSubmissions,
  getPlagedRecords,
  getTestById,
  setMarks,
  getUnReviewedTests,
} = require("../controllers/review");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.get("/tests", requireRole(["teacher"]), getUnReviewedTests);
router.get("/:testid", requireRole(["student,teacher"]), getTestById);
router.get(
  "/:testid/:enroll/:questionid",
  requireRole(["student,teacher"]),
  getStudentSubmissions
);
router.get("/:testid", requireRole(["teacher"]), getPlagedRecords);
router.get("/saveMarks", requireRole(["teacher"]), saveMarks);

module.exports = router;
