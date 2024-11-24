const express = require("express");
const { createTest, getTests, getTestById, getTimeRemaining} = require("../controllers/test");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.post("/create", requireRole(["teacher"]), createTest);
router.get("/sem/:semester/batch/:batch", requireRole(["teacher", "student"]), getTests);
router.get("/:testid", requireRole(["student"]),getTestById);
router.get("/remainingTime/:tid", requireRole(["teacher","student"]),getTimeRemaining);

module.exports = router;
