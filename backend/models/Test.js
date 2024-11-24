const mongoose = require("mongoose");

// Submission entry schema
const submissionEntrySchema = new mongoose.Schema({
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submissions" }],
});

// Plagiarism entry schema
const plagiarismEntrySchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
  student1: { type: String, required: true },
  student2: { type: String, required: true },
  plagiarismScore: { type: Number, required: true },
});

// Question-wise markds schema
const questionWiseMarkSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
});

// Marks schemo for storing student marks
const marksSchema = new mongoose.Schema({
  enroll: { type: String, required: true },
  questionWiseMarks: [questionWiseMarkSchema],
  totalMarks: { type: Number, default: 0 },
});

// Main test schema
const testSchema = new mongoose.Schema({
  testName: { type: String },
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
    required: true,
  },
  submissions: {
    type: Map,
    of: {
      type: Map,
      of: submissionEntrySchema,
    },
    default: {},
  },
  plagiarismRecords: [plagiarismEntrySchema],
  marks: [marksSchema],
});

module.exports = mongoose.model("Tests", testSchema);
