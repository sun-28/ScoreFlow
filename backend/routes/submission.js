const { submit } = require("../controllers/submission");

const router = require("express").Router();

router.post("/submit", submit);

module.exports = router;
