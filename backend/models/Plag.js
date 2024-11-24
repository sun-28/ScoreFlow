const mongoose = require('mongoose');


const PlagSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  enroll: {
    type: String,
    required: true,
  },
  codeFile: {
    type: String, 
    required: true,
  },
});

const PlagModel = mongoose.model('Plag', PlagSchema);

module.exports = PlagModel;
