const mongoose = require("mongoose");
const Question = require("./Question");
const { Schema } = mongoose;
const AutoIncrement=require('mongoose-sequence')(mongoose)

const testSchema = new Schema({
testId:{
type:Number,
unique:true
},
   title:{
    type:String,
    require:true
   },
   batch:{
    type:String,
    require:true
   },
   course:{
    type:String,
    require:true
   },
   gradYear:{
    type:Number,
    require:true
   },
   semester:{
    type:Number,
    require:true
   },
   note:{
    type:String,
    default:"",
   },
   questions:[{
   ques:{
   type:Schema.Types.ObjectId,
   ref:"Question",
   require:true,
   },
}]
  });
Test.plugin(AutoIncrement,{inc_field:'testId'})
module.exports = mongoose.model("Test", testSchema);