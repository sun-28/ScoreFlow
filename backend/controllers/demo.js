const Question = require("../models/Question");

const getDetails = (req, res) => {
    const { quesid } = req.params;
    const question = Question.findById(quesid);
    if (!question) {
        return res.status(404).send({ error: "Question not found" });
    }
    res.status(200).send({ question });
}

const codeQueue = require("../util/runQueue");

const submit = async (type, req, res) => {
  const { code, language, socketId, questionId } = req.body;
  const d = "demo";
  if (!code || !language || !questionId) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  try {

    const job = await codeQueue.add({
      type,
      code,
      language,
      socketId,
      questionId,
      enroll:d,
      testId:d,
     submissionId:d
    });
    return res.status(200).send({ jobId: job.id, status: "queued" });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};


module.exports = { submit, getDetails };