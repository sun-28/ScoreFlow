const { submit } = require("../controllers/submission");
const requireRole = require("../middlewares/requiredRole");

const router = require("express").Router();

router.post("/submit",requireRole(["student"]), submit);

module.exports = router;
