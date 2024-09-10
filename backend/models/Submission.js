const mongoose = require("mongoose");
const Question = require("./Question");
const { Schema } = mongoose;
const AutoIncrement=require('mongoose-sequence')(mongoose)

const submissionSchema = new Schema({
submissionId:{
type:Number,
unique:true
},
who:{
    type:Schema.Types.ObjectId,
    ref:"Student",
    require:true, 
},
when:{
    type:Date,
    require:true
},

verdict:{
    type:String,
    require:true
},
language:{
    type:String,
    require
},
time:{
    type:Number,
    require:true
},
memory:{
    type:Number,
    require:true
}
  });
Test.plugin(AutoIncrement,{inc_field:'submissionId'})
module.exports = mongoose.model("Submission",submissionSchema);