const codeQueue = require("../util/runQueue");

const submit = async (req, res) => {
  const { code, language, testCases,socketId } = req.body;

  if (!code || !language || !testCases) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  const job = await codeQueue.add({
    code,
    language,
    testCases,
    socketId,
  });

  return res.status(200).send({ jobId: job.id, status: "queued" });
};

module.exports = { submit };
