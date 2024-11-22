const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema({
  who: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    // require: true,
  },
  when: {
    type: Date,
    require: true,
  },
  verdict: {
    type: String,
    require: true,
  },
  language: {
    type: String,
    require,
  },
  code: {
    type: String,
    require: true,
  },
  numberOfTestCasesPassed: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("Submissions", submissionSchema);
