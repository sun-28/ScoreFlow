const Bull = require("bull");
const { exec } = require("child_process");
const fs = require("fs");
const util = require("util");
const path = require("path");
const socketIo = require("socket.io");
const crypto = require("crypto");
const Submission = require("../models/Submission");
const Question = require("../models/Question");
const Test = require("../models/Test");

const execPromise = util.promisify(exec);

const codeQueue = new Bull("codeQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

const io = socketIo(3001, {
  cors: {
    origin: "*",
  },
});

const MEMORY_LIMIT = "256mb";

const imageSelector = (lang) => {
  switch (lang) {
    case "c":
    case "cpp":
      return "gcc:latest";
    case "java":
      return "openjdk:latest";
    case "python":
      return "python:latest";
    default:
      return "gcc:latest";
  }
};

codeQueue.process(async (job) => {
  io.to(job.data.socketId).emit("job-started", { status: "started" });

  const { code, language, socketId, testId, submissionId, enroll, questionId } =
    job.data;

  const question = await Question.findById(questionId);

  const sampleTestCases = question.sampleTestCases;
  const hiddenTestCases = question.hiddenTestCases;

  const codeFile = crypto.randomUUID();
  const tempCodeFile = path.join(__dirname, `tempCode/${codeFile}.${language}`);

  fs.writeFileSync(tempCodeFile, code);

  const dockerImage = imageSelector(language);

  let verdict = "accepted";
  const results = [];

  try {
    for (let i = 0; i < sampleTestCases.length; i++) {
      const { input, output } = sampleTestCases[i];

      const testFile = crypto.randomUUID();
      const tempInputFile = path.join(
        __dirname,
        `tempInput/${testFile}${i}.txt`
      );

      fs.writeFileSync(tempInputFile, input);

      const dockerCommand = `docker run --rm --memory=${MEMORY_LIMIT} -v ${tempCodeFile}:/app/Main.${language} -v ${tempInputFile}:/app/input.txt ${dockerImage}`;

      try {
        const { stdout, stderr } = await execPromise(dockerCommand);

        if (stderr) throw new Error(stderr);

        const actualOutput = stdout.trim();
        const passed = actualOutput === output.trim();

        results.push({
          testCase: i + 1,
          passed,
          verdict: passed ? "accepted" : "wrong answer",
        });

        if (!passed) verdict = "failed";

        io.to(socketId).emit("test-case-result", {
          testCase: i + 1,
          passed,
          verdict: passed ? "accepted" : "wrong answer",
        });
      } catch (error) {
        let errorMessage =
          error.killed || error.code === 137
            ? "Time Limit Exceeded"
            : error.stdout;
        if (errorMessage.includes("out of memory"))
          errorMessage = "Memory Limit Exceeded";

        results.push({
          testCase: i + 1,
          passed: false,
          verdict: errorMessage.includes("Memory Limit Exceeded")
            ? "memory limit exceeded"
            : "compilation error",
        });

        verdict = "failed";

        io.to(socketId).emit("test-case-result", {
          testCase: i + 1,
          passed: false,
          verdict: errorMessage.includes("Memory Limit Exceeded")
            ? "memory limit exceeded"
            : "compilation error",
        });
      } finally {
        fs.unlinkSync(tempInputFile);
      }
    }

    for (let i = 0; i < hiddenTestCases.length; i++) {
      const { input, output } = hiddenTestCases[i];

      const testFile = crypto.randomUUID();
      const tempInputFile = path.join(
        __dirname,
        `tempInput/${testFile}${i}.txt`
      );

      fs.writeFileSync(tempInputFile, input);

      const dockerCommand = `docker run --rm --memory=${MEMORY_LIMIT} -v ${tempCodeFile}:/app/Main.${language} -v ${tempInputFile}:/app/input.txt ${dockerImage}`;

      try {
        const { stdout, stderr } = await execPromise(dockerCommand);

        if (stderr) throw new Error(stderr);

        const actualOutput = stdout.trim();
        const passed = actualOutput === output.trim();

        results.push({
          testCase: i + 1,
          passed,
          verdict: passed ? "accepted" : "wrong answer",
        });

        if (!passed) verdict = "failed";
      } catch (error) {
        let errorMessage =
          error.killed || error.code === 137
            ? "Time Limit Exceeded"
            : error.stdout;
        if (errorMessage.includes("out of memory"))
          errorMessage = "Memory Limit Exceeded";

        results.push({
          testCase: i + 1,
          passed: false,
          verdict: errorMessage.includes("Memory Limit Exceeded")
            ? "memory limit exceeded"
            : "compilation error",
        });

        verdict = "failed";
      } finally {
        fs.unlinkSync(tempInputFile);
      }
    }

    io.to(socketId).emit("job-completed", { status: "completed" });
  } catch (error) {
    verdict = "error";
    io.to(socketId).emit("job-failed", { error: error.message });
  } finally {
    try {
      fs.unlinkSync(tempCodeFile);
    } catch (unlinkError) {
      console.error(`Error removing temp code file: ${unlinkError.message}`);
    }
  }

  console.log("Verdict:", verdict);
  console.log("Results:", results);

  await Submission.findByIdAndUpdate(submissionId, { verdict, results });

  const test = await Test.findById(testId);

  if (!test.submissions.has(enroll)) {
    test.submissions.set(enroll, new Map());
  }

  const studentSubmissions = test.submissions.get(enroll);

  if (!studentSubmissions.has(questionId)) {
    studentSubmissions.set(questionId, {
      submissions: [],
      isAccepted: false,
    });
  }

  const questionSubmissions = studentSubmissions.get(questionId);

  questionSubmissions.submissions.push(submissionId);

  if (verdict === "accepted") {
    questionSubmissions.isAccepted = true;
  }

  studentSubmissions.set(questionId, questionSubmissions);
  test.submissions.set(enroll, studentSubmissions);

  await test.save();
});

codeQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

codeQueue.on("failed", (job, error) => {
  console.log(`Job ${job.id} failed with error:`, error.message);
});

module.exports = codeQueue;
