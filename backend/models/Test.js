const mongoose = require("mongoose");

const submissionEntrySchema = new mongoose.Schema({
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submissions" }],
  isAccepted: { type: Boolean, default: false },
  numberOfTestCasesPassed: { type: Number, default: 0 },
});


// plag ko store krne ke liye as an array objects 
const plagiarismEntrySchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
  student1: { type: String, required: true },
  student2: { type: String, required: true }, 
  plagiarismScore: { type: Number, required: true },
});

const testSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  numberOfQuestions: { type: Number, required: true },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
      required: true,
    },
  ],
  allowedLanguages: [{ type: String, required: true }],
  semester: { type: Number, required: true },
  batches: [{ type: String, required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" },
  submissions: {
    type: Map,
    of: {
      type: Map,
      of: submissionEntrySchema,
    },
    default: {},
  },
  plagiarismRecords: [plagiarismEntrySchema],
});

module.exports = mongoose.model("Tests", testSchema);
