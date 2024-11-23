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



// incomplete 

const getQuestionSubmissions =  async (req,res) =>{
    try { 

        const {testid,questionid} = req.params;

        res.status(200).json(records);

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}



module.exports= {
    getAllTests,
    getPlagedRecords,
    getTestById,
    getQuestionSubmissions
}
