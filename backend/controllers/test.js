const Test = require("../models/Test");
const Question = require("../models/Question");

const createTest = async (req, res) => {
  const {
    subject,
    startTime,
    duration,
    numberOfQuestions,
    questions,
    allowedLanguages,
    semester,
    batches,
  } = req.body;

  const createdBy = req.user._id;
  try {
    const questionDocuments = await Question.find({ _id: { $in: questions } });

    if (questionDocuments.length !== questions.length) {
      return res
        .status(400)
        .json({ error: "Some questions are invalid or don't exist" });
    }

    const test = new Test({
      subject,
      startTime,
      duration,
      numberOfQuestions,
      questions,
      allowedLanguages,
      semester,
      batches,
      createdBy,
    });

    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTests = async (req, res) => {
  const { semester, batch } = req.params;
  try {
    const currentTime = new Date();
    const tests = await Test.find({ semester, batches: batch }).populate({
      path: "createdBy",
      select: "displayName",
    });
    if (!tests.length) {
      return res
        .status(404)
        .json({ message: "No tests found for this semester and batch." });
    }

    const upcomingTests = tests.filter((test) => {
      const endTime = new Date(test.startTime);
      endTime.setMinutes(endTime.getMinutes() + test.duration);
      return endTime > currentTime;
    });

    const pastTests = tests.filter((test) => {
      const endTime = new Date(test.startTime);
      endTime.setMinutes(endTime.getMinutes() + test.duration);
      return endTime <= currentTime;
    });

    res.json({ upcomingTests, pastTests });
  } catch (err) {
    res.status(500).send(err.message)
    console.log(err)
  }
};

const getTestById = async (req, res) => {
  const { testid } = req.params;
  try {
    const test = await Test.findById(testid).populate({ path: "questions" });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    if (test.startTime > new Date()) {
      return res.status(400).json({ message: "Test has not started yet" });
    }
    const endTime = new Date(test.startTime);
    endTime.setMinutes(endTime.getMinutes() + test.duration);

    if (endTime < new Date()) {
      return res.status(400).json({ message: "Test has ended" });
    }

    res.json(test);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTimeRemaining = async (req, res) => {
  const { tid } = req.params;
  try {
    const test = await Test.findById(tid);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    const endTime = new Date(test.startTime);
    endTime.setMinutes(endTime.getMinutes() + test.duration);
    const currentTime = new Date();
    const timeRemaining = endTime - currentTime;
    res.json({ timeRemaining });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateTest = async (req, res) => {
  const { id } = req.params;
  const { updates } = req.body; // `updates` contains all the fields to update

  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ message: "Updates object is required" });
  }

  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    for (const [fieldName, data] of Object.entries(updates)) {
      if (fieldName === "submissions") {
        for (const [studentId, submissionData] of Object.entries(data)) {
          if (!test.submissions.has(studentId)) {
            test.submissions.set(studentId, new Map());
          }
          for (const [questionId, submissionEntry] of Object.entries(submissionData)) {
            test.submissions.get(studentId).set(questionId, submissionEntry);
          }
        }
      } else if (fieldName === "marks") {
        for (const [studentId, marks] of Object.entries(data)) {
          test.marks.set(studentId, marks);
        }
      } else if (fieldName === "plagiarismRecords") {
        test.plagiarismRecords.push(...data);
      } else {
        return res.status(400).json({ message: `Field '${fieldName}' is not editable` });
      }
    }

    await test.save();

    res.json({ message: "Test updated successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};




module.exports = {
  createTest,
  getTests,
  getTestById,
  getTimeRemaining,
  updateTest,
};
