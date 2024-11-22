const mongoose = require("mongoose");
const Users = require("./User");
const { Schema } = mongoose;

const studentSchema = Users.discriminator(
  "Student",
  new Schema({
    enroll: {
      type: String,
      required: true,
    },
    globalRanking: {
      type: Number,
      required: true,
    },
    batchRanking: {
      type: Number,
      required: true,
    },
    questionSolved: {
      type: Number,
      required: true,
    },
  })
);

module.exports = mongoose.model("Students", studentSchema);
