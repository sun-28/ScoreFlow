const express = require("express");
const router = express.Router();
const {
  createQuestion,
  updateQuestion,
  getQuestions,
} = require("../controllers/question");

router.post("/create", createQuestion);
router.put("/update/:id", updateQuestion);
router.get("/get", getQuestions);

module.exports = router;
