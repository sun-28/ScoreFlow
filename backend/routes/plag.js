const express = require("express");
const { execSync } = require("child_process");
const router = express.Router();
const TestModel = require("../models/Test");
const SubmissionModel = require("../models/Submission");

const getLanguage = (filePath) => {
  const extension = filePath.split(".").pop();
  switch (extension) {
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "py":
      return "python3";
    default:
      throw new Error("Unsupported language");
  }
};

router.post("/plagiarism-check", async (req, res) => {
  const { testId } = req.body;

  if (!testId) {
    return res.status(400).json({ error: "testId is required" });
  }

  try {
    const test = await TestModel.findById(testId).populate("submissions");

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const groupedByQuestion = {};

    for (const [enroll, submissionMap] of test.submissions) {
      for (const [questionId, submissionEntry] of submissionMap) {
        const lastSubmissionIndex = submissionEntry.submissions.length - 1;
        const lastSubmissionId =
          submissionEntry.submissions[lastSubmissionIndex];

        groupedByQuestion[questionId] = groupedByQuestion[questionId] || [];
        groupedByQuestion[questionId].push({
          enroll,
          submissionId: lastSubmissionId,
        });
      }
    }

    const plagiarismResults = {};

    for (const questionId in groupedByQuestion) {
      const submissions = groupedByQuestion[questionId];

      for (let i = 0; i < submissions.length; i++) {
        for (let j = i + 1; j < submissions.length; j++) {
          const sub1 = submissions[i];
          const sub2 = submissions[j];

          const submission1 = await SubmissionModel.findById(sub1.submissionId);
          const submission2 = await SubmissionModel.findById(sub2.submissionId);

          if (!submission1 || !submission2) continue;

          const file1 = submission1.path;
          const file2 = submission2.path;

          const language = getLanguage(file1);

          const result = execSync(
            `java -jar /home/thrust/Desktop/scoreFlow/backend/util/jplag.jar -l ${language} ${file1} ${file2} -r /home/thrust/Desktop/scoreFlow/backend/util/jplag-report`
          );

          const match = result.toString().match(/Plagiarism:\\s+(\\d+)%/);
          const plagiarismScore = match ? parseInt(match[1], 10) : 0;

          if (plagiarismScore > 30) {
            plagiarismResults[sub1.enroll] =
              plagiarismResults[sub1.enroll] || [];
            plagiarismResults[sub1.enroll].push({
              matchWith: sub2.enroll,
              plagiarismScore,
            });

            plagiarismResults[sub2.enroll] =
              plagiarismResults[sub2.enroll] || [];
            plagiarismResults[sub2.enroll].push({
              matchWith: sub1.enroll,
              plagiarismScore,
            });
          }
        }
      }
    }

    res.status(200).json({ testId, plagiarismResults });
  } catch (error) {
    console.error("Error during plagiarism check:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
