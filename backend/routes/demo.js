const express = require("express");
const {getDetails,submit} = require("../controllers/demo");
const router = express.Router();


router.get("/getDetails/:quesid",getDetails);
router.post("/submit", submit);
router.post("/run",submit);

module.exports = router;
