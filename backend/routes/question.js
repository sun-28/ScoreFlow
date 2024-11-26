const express = require("express");
const router = express.Router();
const requireRole = require("../middlewares/requiredRole");
const {
  createQuestion,
  updateQuestion,
  getQuestions,
  getQuestion,
  getAllQuestions,
} = require("../controllers/question");

router.get("/all",requireRole(["teacher"]),getAllQuestions);
router.post("/create", requireRole(["teacher"]), createQuestion);
router.put("/update/:id",requireRole(["teacher"]) ,updateQuestion);
router.get("/get",requireRole(["teacher"]),getQuestions);
router.get("/:id",requireRole(["student","teacher"]),getQuestion);



module.exports = router;
