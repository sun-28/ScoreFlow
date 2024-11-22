const express = require("express");
const { createTest, getTests } = require("../controllers/test");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.post("/create", requireRole(["teacher"]), createTest);
router.get("/:semester/:batch", requireRole(["teacher", "student"]), getTests);

module.exports = router;
