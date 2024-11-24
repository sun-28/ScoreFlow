const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  enroll: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  semester: {
    type: Number,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  testScores: [
    {
      test: {
        type: Schema.Types.ObjectId,
        ref: "Tests",
      },
      score: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Students", studentSchema);
