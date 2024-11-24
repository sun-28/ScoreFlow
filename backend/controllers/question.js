const Question = require("../models/Question");

const createQuestion = async (req, res) => {
  const {
    title,
    problemStatement,
    outputStatement,
    inputStatement,
    sampleTestCases,
    hiddenTestCases,
    marks,
    note,
  } = req.body;

  try {

    const numberOfTestCases = sampleTestCases.length + hiddenTestCases.length;

    const question = new Question({
      title,
      problemStatement,
      outputStatement,
      inputStatement,
      sampleTestCases,
      hiddenTestCases,
      numberOfTestCases,
      marks,
      note,
    });

    await question.save();
    res
      .status(201)
      .json({ message: "Question created successfully", question });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully", question });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}, "_id title");

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found" });
    }
    res.json({ message: "Questions retrieved successfully", questions });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTestQuestionById = async (req, res) => {
  const { testid, questionid } = req.params;
  try {
    const test = await Test.findById(testid);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const currentTime = new Date();
    const startTime = new Date(test.startTime);
    const endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + test.duration);

    if (currentTime < startTime) {
      return res
        .status(400)
        .json({ message: "Test has not started yet." });
    }

    const question = test.questions.find((q) => q._id.toString() === questionid);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);

  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createQuestion,
  updateQuestion,
  getQuestions,
  getTestQuestionById,
};
