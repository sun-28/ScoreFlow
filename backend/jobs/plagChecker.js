const TestModel = require('../models/Test'); 
const PlagModel = require('../models/Plag'); 
const { compareFiles } = require('./compareFiles'); 
const dotenv = require("dotenv");
dotenv.config(); 
const plagCheck = async (req,res) => {
  try {
    const testRecords = await PlagModel.find({ testId : testid });
    let arr = [];
    

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
            const plagiarismScore = compareFiles(file1, file2);

          
            if (plagiarismScore > 75) {
                arr.push({
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


    const test = await TestModel.findById(testid);

    if(test){
    test.plagiarismRecords.push(...arr);
    await test.save(); 
    }

    console.log(`Plagiarism check completed for test ${testid}`);
    console.log(`Detected ${arr.length} plagiarism entries.`);

    await PlagModel.deleteMany({ testId: testid });
    console.log(`All plagiarism records for test ${testId} have been deleted.`);

  
    console.log(`Plagiarism Check Completed for test ${testid}`);
    
  } catch (error) {
    console.error("Error during plagiarism check:", error);
  }
};


module.exports = { plagCheck };
