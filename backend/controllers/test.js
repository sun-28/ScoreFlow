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
    createdBy,
  } = req.body;

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
    res.status(500).send(err.message).send("bhai body");
  }
};

const getTests = async (req, res) => {
  const { semester, batch } = req.params;

  try {
    const currentTime = new Date();
    const tests = await Test.find({ semester, batches: batch });

    if (!tests.length) {
      return res
        .status(404)
        .json({ message: "No tests found for this semester and batch." });
    }

    const upcomingTests = tests.filter((test) => test.startTime > currentTime);
    const pastTests = tests.filter((test) => test.startTime <= currentTime);

    res.json({ upcomingTests, pastTests });
  } catch (err) {
    res.status(500).send(err.message).send("first try");
  }
};

module.exports = {
  createTest,
  getTests,
};
