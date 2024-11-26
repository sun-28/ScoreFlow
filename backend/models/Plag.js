const mongoose = require('mongoose');


const PlagSchema = new mongoose.Schema({
  enroll: {
    type: String,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  codeFile: {
    type: String, 
    required: true,
  },
  language : {
     type:String  
  }
});

const PlagModel = mongoose.model('Plag', PlagSchema);
module.exports = PlagModel;
