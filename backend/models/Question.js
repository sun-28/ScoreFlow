const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement=require('mongoose-sequence')(mongoose)

const questionSchema = new Schema({
questionId:{
type:Number,
unique:true
},
   title:{
    type:String,
    require:true
   },
   statement:{
    type:String,
    require:true
   },
   outputStatement:{
    type:String,
    require:true
   },
   inputStatement:{
    type:String,
    require:true
   },
   example:[new Schema({
    input:{
        type:String,
        require:true
    },
    output:{
        type:String,
        require:true
    },
    explanation:{
        typee:String
    }
   })],


   note:{
    type:String,
    default:"",
   }

/////////////////////////////////////////////////////////// testcases are left

  });
Question.plugin(AutoIncrement,{inc_field:'questionId'})
module.exports = mongoose.model("Question",questionSchema);