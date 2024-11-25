const { getStudentProfilebyId } = require("../controllers/user");
const requireRole = require("../middlewares/requiredRole");
const router = require("express").Router();

router.get("/profile/:id", requireRole(["student"]), getStudentProfilebyId);

module.exports = router;