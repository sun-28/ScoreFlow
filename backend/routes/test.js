const express = require("express");
const { createTest, getTests } = require("../controllers/test");

const router = express.Router();

router.post("/create", createTest);
router.get("/:semester/:batch", getTests);

module.exports = router;
