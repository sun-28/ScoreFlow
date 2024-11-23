const express = require("express");
const router = express.Router();
const requireRole = require("../middlewares/requiredRole");
const {
  createQuestion,
  updateQuestion,
  getQuestions,
} = require("../controllers/question");

router.post("/create", requireRole(["teacher"]), createQuestion);
router.put("/update/:id",requireRole(["teacher"]) ,updateQuestion);
router.get("/get",requireRole(["teacher"]),getQuestions);

module.exports = router;
