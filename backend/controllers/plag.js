const TestModel = require('../models/Test');
const SubmissionModel = require('../models/Submission');
const { compareFiles } = require('../jobs/compareFiles');
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const plagCheck = async (req, res) => {
  try {
    const testid = req.params.id;
    let submissionsData = [];
    let plagiarismRecords = [];

    // Fetch the test document
    const test = await TestModel.findById(testid).populate({
      path: 'submissions.submissions',
      populate: { path: 'submissions', model: 'Submission' },
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Iterate over submissions and prepare data
    for (const [enroll, innerMap] of Object.entries(test.submissions)) {
      for (const [questionId, submissionEntry] of Object.entries(innerMap)) {
        const submissions = submissionEntry.submissions;

        if (submissions && submissions.length > 0) {
          const lastSubmissionId = submissions[submissions.length - 1];
          const lastSubmission = await SubmissionModel.findById(lastSubmissionId);

          if (lastSubmission) {
            const codeFileName = `${enroll}_${questionId}_${testid}.txt`;
            const codeFilePath = path.join(__dirname, 'codeFiles', codeFileName);
            await fs.promises.writeFile(codeFilePath, lastSubmission.code, 'utf8');

            submissionsData.push({
              enroll,
              questionId,
              codeFile: codeFilePath,
            });
          }
        }
      }
    }

    // Group by questionId and compare files
    const groupedByQuestion = submissionsData.reduce((acc, record) => {
      acc[record.questionId] = acc[record.questionId] || [];
      acc[record.questionId].push(record);
      return acc;
    }, {});

    for (const questionId in groupedByQuestion) {
      const records = groupedByQuestion[questionId];

      for (let i = 0; i < records.length; i++) {
        for (let j = i + 1; j < records.length; j++) {
          if (records[i].enroll !== records[j].enroll) {
            const file1 = records[i].codeFile;
            const file2 = records[j].codeFile;
            const plagiarismScore = compareFiles(file1, file2);

            if (plagiarismScore > 75) {
              plagiarismRecords.push({
                questionId,
                student1: records[i].enroll,
                student2: records[j].enroll,
                plagiarismScore,
              });
              console.log(
                `Plagiarism detected! Test: ${testid}, Question: ${questionId}, Students: ${records[i].enroll}, ${records[j].enroll}`
              );
            }
          }
        }
      }
    }

    // Save plagiarism records to the test document
    test.plagiarismRecords = [...(test.plagiarismRecords || []), ...plagiarismRecords];
    await test.save();

    console.log(`Plagiarism check completed for test ${testid}`);
    res.status(200).json({ detectedPlagiarism: plagiarismRecords });

  } catch (error) {
    console.error("Error during plagiarism check:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { plagCheck };
