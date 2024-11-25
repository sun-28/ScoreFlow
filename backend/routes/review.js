const express = require("express");
const {
  getUnReviewedTests,
  getDetailsByTestId,
  completeReview,
} = require("../controllers/review");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.get("/tests", requireRole(["teacher"]), getUnReviewedTests);
router.get("/test/:testid", requireRole(["teacher"]), getDetailsByTestId);
router.post("/complete", requireRole(["teacher"]), completeReview);


module.exports = router;
