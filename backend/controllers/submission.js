const Submission = require("../models/Submission");
const codeQueue = require("../util/runQueue");

const submit = async (req, res) => {
  const { code, language, socketId, testId, questionId } = req.body;
  const studentId = req.user._id;
  if (!code || !language || !testId || !questionId || !studentId) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  try {
    const submission = new Submission({
      who: studentId,
      when: new Date(),
      verdict: "queued",
      language,
      code,
    });

    await submission.save();

    const job = await codeQueue.add({
      type: "submit",
      code,
      language,
      socketId,
      testId,
      questionId,
      submissionId: submission._id,
      enroll: req.user.enroll,
    });
    return res.status(200).send({ jobId: job.id, status: "queued" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

const runSampleTestCases = async (req,res) => {
  const { code, language, socketId, testId, questionId } = req.body;
  const studentId = req.user._id;
  if (!code || !language || !testId || !questionId || !studentId) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  try {
    const job = await codeQueue.add({
      type: "run",
      code,
      language,
      socketId,
      testId,
      questionId,
    });
    return res.status(200).send({ jobId: job.id, status: "queued" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { submit, runSampleTestCases };
