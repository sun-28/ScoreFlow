const mongoose = require("mongoose");

const submissionEntrySchema = new mongoose.Schema({
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submissions" }],
  isAccepted: { type: Boolean, default: false },
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
});

module.exports = mongoose.model("Tests", testSchema);
