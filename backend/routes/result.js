const express = require("express");
const { getQuestionSubmissions,getPlagedRecords, getAllTests, getTestById} = require("../controllers/result");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.get("/", requireRole(["teacher,student"]), getAllTests);
router.get("/:testid", requireRole(["student,teacher"]),getTestById);
router.get("/:testid/:questionid", requireRole(["student,teacher"]),getQuestionSubmissions);
router.get("/:testid", requireRole(["teacher"]),getPlagedRecords);



module.exports = router;
