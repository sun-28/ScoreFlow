const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongoURI = process.env.MONGO_URI;
const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("Connection Sucessful!!!");
};

module.exports = connectToMongo;
