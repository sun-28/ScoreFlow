const mongoose = require("mongoose");
const Users = require("./Users");
const { Schema } = mongoose;

const studentSchema = Users.discriminator(
  "Student",
  new Schema({
    enroll: {
     type:String, 
     required:true
    },
    globalRanking:{
       type : Number,
       required:true
    },
    batchRanking:{
        type:Number,
        required:true
    },
    questionSolved:{
        type:Number,
        required:true
    },
   
   
  }),
);

module.exports = mongoose.model("Student",studentSchema);