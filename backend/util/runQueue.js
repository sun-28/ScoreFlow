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

const findError = (stderr) => {
  if (stderr.killed || stderr.code === 137) return "Time Limit Exceeded";
  const err = stderr.stdout || stderr.message;
  if (err.includes("out of memory")) return "Memory Limit Exceeded";
  if (err.includes("Compilation error") || err.includes("error:"))
    return "Compilation Error";
  if (err.includes("Segmentation fault"))
    return "Runtime Error: Segmentation fault";
  if (
    err.includes("Index out of bounds") ||
    err.includes("ArrayIndexOutOfBoundsException")
  )
    return "Runtime Error: Out of Bounds";
  return "Runtime Error";
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
  const numberOfTestCasesPassed = 0;

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
        passed && numberOfTestCasesPassed++;

        const testCaseResult = {
          testCase: i + 1,
          passed,
          expectedOutput: output,
          actualOutput,
          verdict: passed ? "Accepted" : "Wrong Answer",
        };

        if (!passed) verdict = "failed";

        io.to(socketId).emit("sample-testcase-result", testCaseResult);
      } catch (error) {
        errorMessage = findError(error);

        const testCaseResult = {
          testCase: i + 1,
          passed: false,
          verdict: errorMessage,
        };

        verdict = "failed";

        io.to(socketId).emit("sample-testcase-result", testCaseResult);
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
        passed && numberOfTestCasesPassed++;

        const testCaseResult = {
          testCase: i + 1,
          passed,
          verdict: passed ? "Accepted" : "Wrong Answer",
        };

        io.to(socketId).emit("hidden-testcase-result", testCaseResult);

        if (!passed) verdict = "failed";
      } catch (error) {
        errorMessage = findError(error);

        const testCaseResult = {
          testCase: i + 1,
          passed: false,
          verdict: errorMessage,
        };

        io.to(socketId).emit("hidden-testcase-result", testCaseResult);

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

  await Submission.findByIdAndUpdate(submissionId, { verdict });

  const test = await Test.findById(testId);

  if (!test.submissions.has(enroll)) {
    test.submissions.set(enroll, new Map());
  }

  const studentSubmissions = test.submissions.get(enroll);

  if (!studentSubmissions.has(questionId)) {
    studentSubmissions.set(questionId, {
      submissions: [],
      isAccepted: false,
      numberOfTestCasesPassed: 0,
    });
  }

  const questionSubmissions = studentSubmissions.get(questionId);
  questionSubmissions.submissions.push(submissionId);

  if (questionSubmissions.numberOfTestCasesPassed < numberOfTestCasesPassed) {
    questionSubmissions.numberOfTestCasesPassed = numberOfTestCasesPassed;
  }

  if (verdict === "accepted") {
    questionSubmissions.isAccepted = true;
  }

  studentSubmissions.set(questionId, questionSubmissions);
  test.submissions.set(enroll, studentSubmissions);

  // if accepted and this is currently a test then please do save this in the a new db with code file with testid,qid,code , enroll
  // do not delete the files please
  // after test is over start a chrone job with request with the test id. :)

  // delete after the job is done using test id the test records and also unlinksync the file with the names

  console.log(test.submissions.get(enroll).get(questionId));
  test.markModified("submissions");

  await test.save();
});

codeQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

codeQueue.on("failed", (job, error) => {
  console.log(`Job ${job.id} failed with error:`, error.message);
});

module.exports = codeQueue;
