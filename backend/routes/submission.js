const { submit, runSampleTestCases } = require("../controllers/submission");
const requireRole = require("../middlewares/requiredRole");

const router = require("express").Router();

router.post("/submit", requireRole(["student"]), submit);
router.post(
  "/runSampleTestCases",
  requireRole(["student"]),
  runSampleTestCases
);

module.exports = router;
