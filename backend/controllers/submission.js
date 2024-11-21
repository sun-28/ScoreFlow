const Submission = require("../models/Submission");
const Test = require("../models/Test");
const codeQueue = require("../util/runQueue");

const submit = async (req, res) => {
  const { code, language, testCases, socketId, testId, studentId, questionId } =
    req.body;

  if (
    !code ||
    !language ||
    !testCases ||
    !testId ||
    !studentId ||
    !questionId
  ) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const submission = new Submission({
      who: studentId,
      when: new Date(),
      verdict: "queued",
      language,
    });

    await submission.save();

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).send({ error: "Test not found" });
    }

    if (!test.submissions.has(studentId)) {
      test.submissions.set(studentId, new Map());
    }

    const studentSubmissions = test.submissions.get(studentId);

    if (!studentSubmissions.has(questionId)) {
      studentSubmissions.set(questionId, {
        submissions: [],
        isAccepted: false,
      });
    }

    const questionSubmissions = studentSubmissions.get(questionId);

    questionSubmissions.submissions.push(submission._id);

    studentSubmissions.set(questionId, questionSubmissions);
    test.submissions.set(studentId, studentSubmissions);

    await test.save();

    const job = await codeQueue.add({
      code,
      language,
      testCases,
      socketId,
      testId,
      submissionId: submission._id,
      studentId,
      questionId,
    });

    return res.status(200).send({ jobId: job.id, status: "queued" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { submit };
