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

module.exports = {
  createTest,
  getTests,
  getTestById,
  getTimeRemaining,
};
