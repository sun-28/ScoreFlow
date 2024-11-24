const Question = require("../models/Question");
const Student = require("../models/Student");
const Submission = require("../models/Submission");
const Test = require("../models/Test");

const getUnReviewedTests = async (req, res) => {
  try {
    const tests = await Test.find({
      startTime: { $lt: new Date() },
      isReviewed: false,
      createdBy: req.user._id,
    }).select("subject startTime");
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const calcMarks = async (test) => {
  const submissions = test.submissions;
  const marks = new Map();
  for (const [enroll, studentSubmissions] of submissions) {
    let totalMarks = 0;
    for (const [questionId, questionSubmission] of studentSubmissions) {
      const question = test.questions.find(
        (q) => q._id.toString() === questionId
      );
      const questionMarks = question.marks;
      const numberOfTestCases = question.numberOfTestCases;
      const numberOfTestCasesPassed =
        questionSubmission.numberOfTestCasesPassed;
      const questionMarksObtained =
        (numberOfTestCasesPassed / numberOfTestCases) * questionMarks;
      totalMarks += questionMarksObtained;
    }
    marks.set(enroll, totalMarks);
  }
  test.marks = marks;
  test.markModified("marks");
  await test.save();
  return marks;
};

const getDetailsByTestId = async (req, res) => {
  try {
    const { testid } = req.params;
    const test = await Test.findById(testid)
      .select("subject submissions questions")
      .populate("questions");

    if (!test) {
      return res.status(404).send("Test not found");
    }
    const marks = await calcMarks(test);
    const result = [];
    const submissions = test.submissions;
    for (const [enroll, studentSubmissions] of submissions) {
      const student = await Student.findOne({ enroll }).select("displayName");
      const studentName = student.displayName;
      const studentMarks = marks.get(enroll) || 0;
      const studentResult = {
        enroll,
        studentName,
        totalMarks: studentMarks,
        questions: [],
      };
      for (const [questionId, questionSubmission] of studentSubmissions) {
        const question = await Question.findById(questionId).select(
          "title numberOfTestCases"
        );
        const questionName = question.title;
        const numberOfTestCases = question.numberOfTestCases;
        const { code } = await Submission.findById(
          questionSubmission.submissions[
            questionSubmission.submissions.length - 1
          ]
        ).select("code");
        const questionResult = {
          questionName,
          numberOfTestCases,
          numberOfTestCasesPassed: questionSubmission.numberOfTestCasesPassed,
          code,
        };
        studentResult.questions.push(questionResult);
      }
      result.push(studentResult);
    }
    const maxMarks = test.questions.reduce((acc, q) => acc + q.marks, 0);
    res.status(200).json({ result, maxMarks });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const completeReview = async (req, res) => {
  try {
    const { testId, adjustedMarks } = req.body;
    if (!testId || !adjustedMarks) {
      return res.status(400).json({
        error: "testId and adjustedMarks are required",
      });
    }
    const test = await Test.findByIdAndUpdate(testId, {
      marks: adjustedMarks,
      isReviewed: true,
    });
    res.status(200).json({ message: "Test review completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred while completing test review: ${error.message}`,
    });
  }
};

const getPlagedRecords = async (req, res) => {
  try {
    const { testId, adjustedMarks } = req.body;
    if (!testId || !adjustedMarks) {
      return res.status(400).json({
        error: "testId and adjustedMarks are required",
      });
    }
    const test = await Test.findByIdAndUpdate(testId, {
      marks: adjustedMarks,
      isReviewed: true,
    });
    res.status(200).json({ message: "Test review completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred while completing test review: ${error.message}`,
    });
  }
};


module.exports = {
  getUnReviewedTests,
  getDetailsByTestId,
  getPlagedRecords,
  completeReview
};
