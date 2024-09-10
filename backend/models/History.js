const mongoose = require("mongoose");
const Users = require("./Users");
const Student = require("./Student");
const { Schema } = mongoose;

const HistorySchema = new Schema({
   enroll:{
    type:String,
    require:true
   },
   testHistory:{
    type:Map,
    of:new Schema({   //value
    score:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        requre:true
    },

    }),
   },

   
  });

module.exports = mongoose.model("Student");