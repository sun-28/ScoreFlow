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
    const question = new Question({
      title,
      problemStatement,
      outputStatement,
      inputStatement,
      sampleTestCases,
      hiddenTestCases,
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

module.exports = {
  createQuestion,
  updateQuestion,
  getQuestions
};
