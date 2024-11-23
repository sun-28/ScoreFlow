
const Agenda = require('agenda');
const mongoose = require('mongoose');
const { execSync } = require('child_process');
const TestModel = require('../models/Test'); 
const PlagModel = require('../models/Plag'); 
const dotenv = require("dotenv");
dotenv.config();

const URI = process.env.MONGO_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

/* const agenda = new Agenda({ db: { address: `${URI}` } });
 */

const agenda = new Agenda({
  db: {
    address: `${URI}agenda`,
    collection: "agendaJobs",
    options: {
      useUnifiedTopology: true,
    },
  },
});

agenda.define("check plagiarism for test", async (job) => {
  const { testId } = job.attrs.data;
  console.log(`Checking plagiarism for test ID: ${testId}`);

  const getLanguage = (filePath) => {
    const extension = filePath.split(".").pop();
    switch (extension) {
      case "java":
        return "java";
      case "cpp":
      case "c":
        return "c/c++";
      case "py":
        return "python3";
      default:
        throw new Error("Unsupported language");
    }
  };

  try {
    const testRecords = await TestModel.find({ testId });
    const language = "";
   
    const groupedByQuestion = testRecords.reduce((acc, record) => {
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

            if (language === "") {
              language = getLanguage(file1);
            }

            const result = execSync(
              `java -jar jplag.jar -l ${language} -s ${file1} ${file2} -r /path/to/result`
            );

            const match = result.toString().match(/Plagiarism:\s+(\d+)%/);
            const plagiarismScore = match ? parseInt(match[1], 10) : 0;

            if (plagiarismScore > 75) {
              
              const test = await TestModel.findById(testId); 
            
              if (test) {
                
                test.plagiarismRecords.push({
                  questionId,
                  student1: records[i].enroll,
                  student2: records[j].enroll,
                  plagiarismScore,
                });
            

                await test.save();
              } else {
                console.error(`Test with ID ${testId} not found.`);
              }
              console.log(
                `Plagiarism detected! Test: ${testId}, Question: ${questionId}, Students: ${records[i].enroll}, ${records[j].enroll}`
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error during plagiarism check:", error);
  }
});

(async () => {
  await agenda.start();
  console.log("Agenda started");
})();

async function onTestEnd(testId) {
  try {
    console.log(`Scheduling plagiarism check for test ID: ${testId}`);
    await agenda.now("check plagiarism for test", { testId });
  } catch (error) {
    console.error("Error scheduling plagiarism job:", error);
  }
}

onTestEnd("test123");
