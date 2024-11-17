const express = require("express");
const { createTest, getTests } = require("../controllers/test");

const router = express.Router();

router.post("/", createTest);
router.get("/:semester/:batch", getTests);

module.exports = router;
