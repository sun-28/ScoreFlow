const e = require("express");
const Submission = require("../models/Submission");
const Test = require("../models/Test");
const codeQueue = require("../util/runQueue");

const submit = async (req, res) => {
  const { code, language, socketId, testId, questionId } = req.body;

  if (!code || !language || !testId || !questionId) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const submission = new Submission({
      // who: studentId,
      when: new Date(),
      verdict: "queued",
      language,
    });

    await submission.save();

    const job = await codeQueue.add({
      code,
      language,
      socketId,
      testId,
      submissionId: submission._id,
      enroll: "1234",
      questionId,
    });

    return res.status(200).send({ jobId: job.id, status: "queued" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { submit };
