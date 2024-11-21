const mongoose = require("mongoose");
const Users = require("./Users");
const { Schema } = mongoose;

const studentSchema = Users.discriminator(
  "Student",
  new Schema({
    displayName: {
      type: String,
      required: true,
    },
    enroll: {
      type: String,
      required: true,
    },
    semester:{
      type: Number,
      required: true
    },
    batch:{
      type: String,
      required : true
    }
  })
);

module.exports = mongoose.model("Students", studentSchema);
