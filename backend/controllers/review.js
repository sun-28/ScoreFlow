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
    const enrollKeys = Object.keys(adjustedMarks);

    console.log("Enrollments to update:", enrollKeys);

    const students = await Student.find({ enroll: { $in: enrollKeys } });

    const bulkOperations = students.map((student) => {
      const enroll = student.enroll;
      const marks = adjustedMarks[enroll];
      student.testScores.push({ test: testId, marks });
      return {
        updateOne: {
          filter: { _id: student._id },
          update: { $set: { testScores: student.testScores } },
        },
      };
    });
    if (bulkOperations.length > 0) {
      await Student.bulkWrite(bulkOperations);
    }
    await Test.findByIdAndUpdate(testId, {
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
    const { testid } = req.params;

    const records = await Test.findById(testid).select("plagarismRecords");

    if (!records) {
      return res.status(200).send("records not found");
    }

    res.status(200).json(records);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const { testId, enroll, questionId } = req.params;

    const test = await Test.findById(testId)
      .populate({
        path: "submissions",
        populate: {
          path: "submissions.submissions",
          model: "Submissions",
        },
      })
      .exec();

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const studentSubmissions = test.submissions.get(enroll);

    if (!studentSubmissions) {
      return res
        .status(404)
        .json({ error: "No submissions found for this student" });
    }

    let response = [];

    if (questionId) {
      const questionSubmissions = studentSubmissions.get(questionId);
      if (!questionSubmissions) {
        return res
          .status(404)
          .json({ error: "No submissions found for this question" });
      }

      response = {
        questionId,
        isAccepted: questionSubmissions.isAccepted,
        numberOfTestCasesPassed: questionSubmissions.numberOfTestCasesPassed,
        submissions: questionSubmissions.submissions,
      };
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while retrieving submissions",
    });
  }
};

const saveMarks = async (req, res) => {
  try {
    const { testId, students } = req.body;

    if (
      !testId ||
      !students ||
      !Array.isArray(students) ||
      students.length === 0
    ) {
      return res.status(400).json({
        error: "testId and students (non-empty array) are required",
      });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    students.forEach((student) => {
      const { enroll, totalMarks, questionWiseMarks } = student;

      if (
        !enroll ||
        totalMarks === undefined ||
        !Array.isArray(questionWiseMarks)
      ) {
        throw new Error(`Invalid data for student: ${JSON.stringify(student)}`);
      }

      const isValidQuestionMarks = questionWiseMarks.every(
        (qwm) => qwm.questionId && qwm.marks !== undefined
      );

      if (!isValidQuestionMarks) {
        throw new Error(
          `Invalid question-wise marks for student: ${JSON.stringify(student)}`
        );
      }

      const existingMarksIndex = test.marks.findIndex(
        (mark) => mark.enroll === enroll
      );

      if (existingMarksIndex !== -1) {
        test.marks[existingMarksIndex].questionWiseMarks = questionWiseMarks;
        test.marks[existingMarksIndex].totalMarks = totalMarks;
      } else {
        test.marks.push({
          enroll,
          questionWiseMarks,
          totalMarks,
        });
      }
    });

    await test.save();

    res
      .status(200)
      .json({ message: "Marks saved successfully for all students" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred while saving marks: ${error.message}`,
    });
  }
};

module.exports = {
  getUnReviewedTests,
  getDetailsByTestId,
  getPlagedRecords,
  getStudentSubmissions,
  saveMarks,
  completeReview,
};
