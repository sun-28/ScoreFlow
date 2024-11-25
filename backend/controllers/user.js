const Student = require("../models/Student");

const getStudentProfilebyId = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate({ path: "testScores", populate: { path: "test", select: "subject" } });
    if (!student) {
      res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getStudentProfilebyId,
};
