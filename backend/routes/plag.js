const express = require("express");
const router = express.Router();
const requireRole = require("../middlewares/requiredRole");
const {plagCheck} = require('../controllers/plag')

router.get(":/id",plagCheck);


module.exports = router;