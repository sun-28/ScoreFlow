const express = require("express");
const {
  saveMarks,
  getStudentSubmissions,
  getPlagedRecords,
  getUnReviewedTests,
  getDetailsByTestId,
} = require("../controllers/review");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.get("/tests", requireRole(["teacher"]), getUnReviewedTests);
router.get("/test/:testid", requireRole(["student,teacher"]), getDetailsByTestId);


module.exports = router;
