const express = require("express");
const { saveMarks,getStudentSubmissions,getPlagedRecords ,getAllTests,getTestById,setMarks} = require("../controllers/result");
const requireRole = require("../middlewares/requiredRole");

const router = express.Router();

router.get("/", requireRole(["teacher,student"]), getAllTests);
router.get("/:testid", requireRole(["student,teacher"]),getTestById);
router.get("/:testid/:enroll/:questionid", requireRole(["student,teacher"]),getStudentSubmissions);
router.get("/:testid", requireRole(["teacher"]),getPlagedRecords);
router.get("/saveMarks",requireRole(["teacher"]),saveMarks)  // post marks and update ka bhi same

module.exports = router;