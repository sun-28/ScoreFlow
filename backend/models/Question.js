const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  outputStatement: {
    type: String,
    required: true,
  },
  inputStatement: {
    type: String,
    required: true,
  },
  sampleTestCases: [
    new Schema({
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
      },
    }),
  ],
  hiddenTestCases: [
    new Schema({
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    }),
  ],
  marks: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Questions", questionSchema);
