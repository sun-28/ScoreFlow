const express = require("express");
const router = express.Router();
const { createQuestion, updateQuestion } = require("../controllers/question");

router.post("/create", createQuestion);
router.put("/update/:id", updateQuestion);

module.exports = router;
