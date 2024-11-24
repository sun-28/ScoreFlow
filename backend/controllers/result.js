const Test = require('../models/Test')



const getAllTests = async (req,res)=>{
    try {

        const allTests = await Test.find({}).select(
            "_id testName subject batches semester duration numberOfQuestions"
        );

        if(!allTests){
            return res.status(404).send("Tests Not found");
        }else{
            res.status(200).json(allTests);
        } 
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


const getTestById = async (req,res) =>{
    try { 

        const {testid} = req.params;

        const test = await Test.findById(testid).select(
            "-submissions -plagarismRecords"
        );

        if(!test){
            return res.status(404).send("Test not found");
        }

        res.status(200).json(test);

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getPlagedRecords = async (req,res) =>{
    try { 

        const {testid} = req.params;

        const records = await Test.findById(testid).select(
            "plagarismRecords"
        );

        if(!records){
            return res.status(200).send("records not found");
        }

        res.status(200).json(records);

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getStudentSubmissions = async (req, res) => {
  try {
    const { testId, enroll, questionId } = req.params;

    const test = await Test.findById(testId)
      .populate({
        path: "submissions",
        populate: {
          path: "submissions.submissions", 
          model: "Submissions",
        },
      })
      .exec();

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const studentSubmissions = test.submissions.get(enroll);
    
    if (!studentSubmissions) {
      return res
        .status(404)
        .json({ error: "No submissions found for this student" });
    }

    let response = [];

    if (questionId) {
      const questionSubmissions = studentSubmissions.get(questionId);
      if (!questionSubmissions) {
        return res
          .status(404)
          .json({ error: "No submissions found for this question" });
      }

      response = {
        questionId,
        isAccepted: questionSubmissions.isAccepted,
        numberOfTestCasesPassed: questionSubmissions.numberOfTestCasesPassed,
        submissions: questionSubmissions.submissions,
      };
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while retrieving submissions",
    });
  }
};


const saveMarks = async (req, res) => {
    try {
        const { testId, students } = req.body;

        if (!testId || !students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({
            error: "testId and students (non-empty array) are required",
        });
        }
        
        const test = await Test.findById(testId);
        
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        students.forEach((student) => {
        const { enroll, totalMarks, questionWiseMarks } = student;
        
        if (!enroll || totalMarks === undefined || !Array.isArray(questionWiseMarks)) {
            throw new Error(
                `Invalid data for student: ${JSON.stringify(student)}`
            );
        }

        const isValidQuestionMarks = questionWiseMarks.every(
            (qwm) => qwm.questionId && qwm.marks !== undefined
        );

        if (!isValidQuestionMarks) {
            throw new Error(
                `Invalid question-wise marks for student: ${JSON.stringify(student)}`
            );
        }
        
        const existingMarksIndex = test.marks.findIndex((mark) => mark.enroll === enroll);
        
        if (existingMarksIndex !== -1) {
            test.marks[existingMarksIndex].questionWiseMarks = questionWiseMarks;
            test.marks[existingMarksIndex].totalMarks = totalMarks;
        } else {
            test.marks.push({
            enroll,
            questionWiseMarks,
            totalMarks,
            });
        }
        });

        await test.save();
        
        res.status(200).json({ message: "Marks saved successfully for all students" });
    } catch (error) {
            console.error(error);
            res.status(500).json({
            error: `An error occurred while saving marks: ${error.message}`,
            });
        }
    };

module.exports= {
    getAllTests,
    getPlagedRecords,
    getTestById,
    getStudentSubmissions,
    saveMarks
}
